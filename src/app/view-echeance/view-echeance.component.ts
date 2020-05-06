import {
  ChangeDetectionStrategy, Component, DoCheck, EventEmitter, HostListener, Input, IterableDiffers, OnChanges, OnInit,
  Output,
  SimpleChanges, TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Echeance} from "../../model/model.echeance";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Router} from "@angular/router";
import {ContratService} from "../services/contrat.service";
import {AuthenticationService} from "../services/authentification.service";
import {CommentaireEcheance} from "../../model/model.commentaireEcheance";
import {FactureEcheance} from "../../model/model.factureEcheance";
import {BsModalRef, BsModalService} from "ngx-bootstrap";

@Component({
  selector: 'app-view-echeance',
  templateUrl: './view-echeance.component.html',
  styleUrls: ['./view-echeance.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewEcheanceComponent implements OnInit,OnChanges {


  displayedColumnsEcheance: string[] = ['du', 'au', 'montantPrevision','periodeFacturation','occurenceFacturation','factures','montantFacture','montantRestFacture','commentaire','option'];
  public dataSourceEcheance: MatTableDataSource<Echeance>;
  @ViewChild('echeanceTableSort', {static: true}) sortEcheance: MatSort;
  @ViewChild('echeanceTablePaginator', {static: true}) paginatorEcheance: MatPaginator;
  filtredDataEcheance: Array<Echeance>;

  @Input() echeances : Array<Echeance>;

  @Output() errorUpdate= new EventEmitter<boolean>();

  commentaireEcheances : Array<CommentaireEcheance>;

  selectedEcheance : Echeance;

  deleteEcheanceModalRef : BsModalRef;

  @Output() deleteEcheanceEmitter = new EventEmitter<Echeance>();

  roleEditEcheance:boolean;

  constructor(private authService: AuthenticationService,private modalService: BsModalService,private router:Router,private contratService : ContratService) {

  }

  ngOnInit() {

    this.authService.getRoles().forEach(authority => {

      if (authority == 'EDIT_ECHEANCE_CONTRAT') {
        this.roleEditEcheance= true;
      }
    });

    this.getAllCommentaitreEcheance();

    this.dataSourceEcheance = new MatTableDataSource(this.echeances);

    //  this.dataSourceEcheance.paginator = this.paginatorEcheance;

    this.dataSourceEcheance.paginator = this.paginatorEcheance;
    this.dataSourceEcheance.sort=this.sortEcheance;
    console.log("echeancesOnInit" + this.echeances);
  }



  ngOnChanges(changes: SimpleChanges) {

    console.log("onChanges echeances" );
    this.dataSourceEcheance = new MatTableDataSource(this.echeances);

    //  this.dataSourceEcheance.paginator = this.paginatorEcheance;

    this.dataSourceEcheance.paginator = this.paginatorEcheance;
    this.dataSourceEcheance.sort=this.sortEcheance;
    console.log("echeancesOnInit" + this.echeances);
  }

  @HostListener('matSortChange', ['$event'])
  sortChange(e) {
    // save cookie with table sort data here
    this.dataSourceEcheance.sortData(this.dataSourceEcheance.filteredData,this.dataSourceEcheance.sort);
    // console.log("this.before [0] " + this.filtredData[0].codeProjet);
    // console.log("sorting table");
    //this.filtredData = this.dataSource.filteredData;

    // console.log("this.filtredData[0] " + this.filtredData[0].codeProjet);*/

  }

  showEtatRecouvrement(value){
    console.log("value "+ value);
    this.router.navigate(['/etatRecouvrementNumDocument',value]);
  }



  onEditEcheance(echeance : Echeance) {


    this.contratService.updateEcheance(echeance).subscribe((data: Echeance) => {
    this.errorUpdate.emit(false);

    }, err => {

     this.errorUpdate.emit(true);

    });

  }

  getAllCommentaitreEcheance(){
    this.contratService.getAllCommentaireEcheance().subscribe(
      (data: Array<CommentaireEcheance>)=>{
        this.commentaireEcheances = data;
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }

  showDeleteFactureEcheanceModal(echeance : Echeance,deleteModal: TemplateRef<any>){
    console.log("echeance " + JSON.stringify(echeance));
    this.selectedEcheance= echeance;
    this.deleteEcheanceModalRef =  this.modalService.show(deleteModal, Object.assign({}, {class: 'modal-sm'}));
  }

  annulationDeleteEcheance(){
    this.deleteEcheanceModalRef.hide();
  }

  deleteEcheance(){
    this.contratService.deleteEcheance(this.selectedEcheance.id).subscribe(() => {

      this.deleteEcheanceEmitter.emit(this.selectedEcheance);
      this.deleteEcheanceModalRef.hide();

    }, err => {
      console.log("ereur", err);


    });
  }

}
