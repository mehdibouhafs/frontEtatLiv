import {
  ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Echeance} from "../../model/model.echeance";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {Router} from "@angular/router";
import {ContratService} from "../services/contrat.service";
import {AuthenticationService} from "../services/authentification.service";

@Component({
  selector: 'app-view-echeance',
  templateUrl: './view-echeance.component.html',
  styleUrls: ['./view-echeance.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewEcheanceComponent implements OnInit,OnChanges {


  displayedColumnsEcheance: string[] = ['du', 'au', 'montantPrevision','periodeFacturation','occurenceFacturation','factures','montantFacture','montantRestFacture','commentaire'];
  public dataSourceEcheance: MatTableDataSource<Echeance>;
  @ViewChild('echeanceTableSort', {static: true}) sortEcheance: MatSort;
  @ViewChild('echeanceTablePaginator', {static: true}) paginatorEcheance: MatPaginator;
  filtredDataEcheance: Array<Echeance>;

  @Input() echeances : Array<Echeance>;

  @Output() errorUpdate= new EventEmitter<boolean>();


  constructor(private router:Router,private contratService : ContratService,private authService: AuthenticationService) {

  }

  ngOnInit() {


    this.dataSourceEcheance = new MatTableDataSource(this.echeances);

    //  this.dataSourceEcheance.paginator = this.paginatorEcheance;

    this.dataSourceEcheance.paginator = this.paginatorEcheance;
    this.dataSourceEcheance.sort=this.sortEcheance;
    console.log("echeancesOnInit" + this.echeances);
  }

  ngOnChanges(changes: SimpleChanges) {
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

}
