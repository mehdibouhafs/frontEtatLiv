import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, EventEmitter, HostListener, Input, IterableDiffers,
  OnChanges, OnDestroy,
  OnInit,
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
import {ShareEcheanceService} from "../services/shareEcheance.service";
import {NgxSpinnerService} from "ngx-spinner";
import * as moment from 'moment';

@Component({
  selector: 'app-view-echeance',
  templateUrl: './view-echeance.component.html',
  styleUrls: ['./view-echeance.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewEcheanceComponent implements OnInit,OnChanges,OnDestroy {


  displayedColumnsEcheance: string[] = ['du', 'au', 'montantPrevision','periodeFacturation','occurenceFacturation','factures','montantFacture','montantRestFacture','commentaire','option'];
  public dataSourceEcheance: MatTableDataSource<Echeance>;
  @ViewChild('echeanceTableSort', {static: true}) sortEcheance: MatSort;
  @ViewChild('echeanceTablePaginator', {static: true}) paginatorEcheance: MatPaginator;
  filtredDataEcheance: Array<Echeance>;

  @Input() numContrat : any;

  echeances : Array<Echeance> = new Array();

  @Output() errorUpdate= new EventEmitter<boolean>();

  commentaireEcheances : Array<CommentaireEcheance> = new Array();

  selectedEcheance : Echeance;

  deleteEcheanceModalRef : BsModalRef;

  @Output() deleteEcheanceEmitter = new EventEmitter<Echeance>();

  roleEditEcheance:boolean;

  lengthEcheances:number;
  pageSizeEcheances:number;
  pageSizeOptionsEcheances:number[] = [5,10, 15,25,30];
  currentPageEcheances : number;
  totalPagesEcheances:number;
  offsetEcheances:number;
  numberOfElementsEcheances:number;

  sortBy:any=null;

  sortType:any=null;

  subscription:any;

  addEcheanceModalRef:BsModalRef;

  addEcheanceByUserModalRef:BsModalRef;

  newEcheance : Echeance;

  constructor( private spinner: NgxSpinnerService,private ref: ChangeDetectorRef,private shareEcheance : ShareEcheanceService,private authService: AuthenticationService,private modalService: BsModalService,private router:Router,private contratService : ContratService) {

    this.subscription = this.shareEcheance.getEcheance()
      .subscribe((echeance : Echeance) =>{

        this.getEcheances(this.numContrat,this.currentPageEcheances,this.pageSizeEcheances,this.sortBy,this.sortType);

      } )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getEcheances(numContrat:number,page :number,size:number,sortBy:any,sortType:any){


    this.contratService.getEcheance(numContrat,page,size,sortBy,sortType).subscribe(
      (data : any)=>{

        this.echeances  = data.content;

        this.lengthEcheances = data.totalElements;
        this.currentPageEcheances = data.pageable.pageNumber+1;
        this.totalPagesEcheances = data.totalPages;
        this.offsetEcheances = data.pageable.offset;

        for(var i=0;i<this.echeances.length;i++){
          if(this.echeances[i].commentaire==null){
            this.echeances[i].commentaire = new CommentaireEcheance();
            this.echeances[i].commentaire.id=0;
          }
          if(this.echeances[i].factures!=null){
            var t= this.echeances[i].factures.substring(1,this.echeances[i].factures.length-1);
            this.echeances[i].factures2=t.split(",");
          }
        }

        this.dataSourceEcheance = new MatTableDataSource(this.echeances);

        this.ref.detectChanges();

      },err=>{

        console.log("error "  +JSON.stringify(err));
      });

  }

  getEcheancesByUserHideModal(numContrat:number,page :number,size:number,sortBy:any,sortType:any){


    this.contratService.getEcheance(numContrat,page,size,sortBy,sortType).subscribe(
      (data : any)=>{

        this.echeances  = data.content;

        this.lengthEcheances = data.totalElements;
        this.currentPageEcheances = data.pageable.pageNumber+1;
        this.totalPagesEcheances = data.totalPages;
        this.offsetEcheances = data.pageable.offset;

        for(var i=0;i<this.echeances.length;i++){
          if(this.echeances[i].commentaire==null){
            this.echeances[i].commentaire = new CommentaireEcheance();
            this.echeances[i].commentaire.id=0;
          }
          if(this.echeances[i].factures!=null){
            var t= this.echeances[i].factures.substring(1,this.echeances[i].factures.length-1);
            this.echeances[i].factures2=t.split(",");
          }
        }

        this.dataSourceEcheance = new MatTableDataSource(this.echeances);

        this.addEcheanceByUserModalRef.hide();
        this.ref.detectChanges();

      },err=>{

        console.log("error "  +JSON.stringify(err));
      });

  }


  getEcheancesHidmodal(numContrat:number,page :number,size:number,sortBy:any,sortType:any){


    this.contratService.getEcheance(numContrat,page,size,sortBy,sortType).subscribe(
      (data : any)=>{

        this.echeances  = data.content;

        this.lengthEcheances = data.totalElements;
        this.currentPageEcheances = data.pageable.pageNumber+1;
        this.totalPagesEcheances = data.totalPages;
        this.offsetEcheances = data.pageable.offset;

        for(var i=0;i<this.echeances.length;i++){
          if(this.echeances[i].commentaire==null){
            this.echeances[i].commentaire = new CommentaireEcheance();
            this.echeances[i].commentaire.id=0;
          }
          if(this.echeances[i].factures!=null){
            var t= this.echeances[i].factures.substring(1,this.echeances[i].factures.length-1);
            this.echeances[i].factures2=t.split(",");
          }
        }

        this.dataSourceEcheance = new MatTableDataSource(this.echeances);

        this.addEcheanceModalRef.hide();
        this.ref.detectChanges();

      },err=>{

        console.log("error "  +JSON.stringify(err));
      });

  }

  ngOnInit() {

    this.currentPageEcheances=1;

    this.pageSizeEcheances=5;

    console.log("echeance tab on initi" + JSON.stringify(this.numContrat));

    //this.getEcheances(this.numContrat,this.currentPageEcheances,this.pageSizeEcheances,this.sortBy,this.sortType);


    this.authService.getRoles().forEach(authority => {

      if (authority == 'EDIT_ECHEANCE_CONTRAT') {
        this.roleEditEcheance= true;
      }
    });

    this.getAllCommentaitreEcheance();

  }



  ngOnChanges(changes: SimpleChanges) {

    console.log("onChanges echeances" );
    this.echeances=null;
    this.dataSourceEcheance=null;
    this.getEcheances(this.numContrat,1,5,this.sortBy,this.sortType);

  }

  @HostListener('matSortChange', ['$event'])
  sortChange(e) {
    // save cookie with table sort data here
    if(e.direction==""){
      this.sortBy=null;
      this.sortType=null;
    }else{
      this.sortBy=e.active;
      this.sortType=e.direction;
    }
    this.getEcheances(this.numContrat,this.currentPageEcheances,this.pageSizeEcheances,this.sortBy,this.sortType);

  }

  showEtatRecouvrement(value){
    console.log("value "+ value);
    this.router.navigate(['/etatRecouvrementNumDocument',value]);
  }

  showAddEcheanceModal(editModal: TemplateRef<any>) {
    this.newEcheance = new Echeance();
    this.addEcheanceModalRef =  this.modalService.show(editModal, Object.assign({}, {class: 'modal-sm'}));
  }

  showAddEcheanceByUserModal(editModal: TemplateRef<any>) {
    this.newEcheance = new Echeance();
    this.addEcheanceByUserModalRef =  this.modalService.show(editModal, Object.assign({}, {class: 'modal-sm'}));
  }

  closeAddEcheanceByUserModal(){
    this.addEcheanceByUserModalRef.hide();
  }

  closeAddEcheanceModal(){
    this.addEcheanceModalRef.hide();
  }

  nbMonth :number=0;

  onChangeDate(){
    this.nbMonth = moment(new Date(this.newEcheance.au)).diff(new Date(this.newEcheance.du), 'months', true);
    if(this.nbMonth<1){
      this.newEcheance.periodeFacturation="UNKNOWN";
    }

  }

  addNewEcheanceByUser(){

    this.contratService.addEcheance(this.numContrat,this.newEcheance).subscribe((data: number) => {


        this.shareEcheance.setFactureEcheance(null);
        this.getEcheancesByUserHideModal(this.numContrat,this.currentPageEcheances,this.pageSizeEcheances,this.sortBy,this.sortType);


    }, err => {
      console.log("ereur", err);
    });

  }

  addNewEcheance(){

    this.contratService.editEcheance(this.numContrat,this.newEcheance).subscribe((data: number) => {

      if(data>0){
        this.shareEcheance.setFactureEcheance(null);
        this.getEcheancesHidmodal(this.numContrat,this.currentPageEcheances,this.pageSizeEcheances,this.sortBy,this.sortType);
      }else{
        console.log("error ");
      }


    }, err => {
      console.log("ereur", err);
    });

  }



  onEditEcheance(echeance : Echeance) {


    this.contratService.updateEcheance(echeance).subscribe((data: Echeance) => {


    }, err => {

     console.log("error "+err);

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


      this.shareEcheance.setFactureEcheance(null);
      this.getEcheances(this.numContrat,this.currentPageEcheances,this.pageSizeEcheances,this.sortBy,this.sortType);

    }, err => {
      console.log("ereur", err);


    });
  }

  onPaginateChangeEcheances(event) {
    console.log("onPaginateChangeEcheans ");
    this.currentPageEcheances = event.pageIndex+1;
    this.pageSizeEcheances = event.pageSize;
    this.getEcheances(this.numContrat,this.currentPageEcheances,this.pageSizeEcheances,this.sortBy,this.sortType);


  }



}
