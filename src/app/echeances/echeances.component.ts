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
import {ShareBlockedKeyService} from "../services/shareBlockedKey.service";
import {ShareContratModelService} from "../services/shareContratModel.service";
import {SelectionModel} from "@angular/cdk/collections"

@Component({
  selector: 'app-echeances',
  templateUrl: './echeances.component.html',
  styleUrls: ['./echeances.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EcheancesComponent implements  OnInit,OnChanges,OnDestroy {

  displayedColumnsEcheance: string[] = ['select','contrat','du', 'au', 'montantPrevision','periodeFacturation','occurenceFacturation','factures','montantFacture','montantRestFacture','commentaire','option'];
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
  pageSizeOptionsEcheances:number[] = [10, 15,25,30];
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

  echeanceNotLinked : string;

  public selection = new SelectionModel<Echeance>(true, []);

  selectedDate : any;

  constructor(private shareContratModel: ShareContratModelService,private shareBlockedkey : ShareBlockedKeyService, private spinner: NgxSpinnerService,private ref: ChangeDetectorRef,private shareEcheance : ShareEcheanceService,private authService: AuthenticationService,private modalService: BsModalService,private router:Router,private contratService : ContratService) {

  }

  ngOnDestroy() {

  }

  getContratByFilter0(){
    this.loadEcheances();
  }


  getEcheancesNotLinked(date:string,page :number,size:number,sortBy:any,sortType:any){


    this.contratService.getEcheancesNotLinked(date,page,size,sortBy,sortType).subscribe(
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

        this.dataSourceEcheance.data.forEach(row => {
          this.selection.selected.forEach(echeance1 => {
            if(row.id==echeance1.id){
              this.selection.select(row);
            }
          })
        });

        if(this.deleteEcheanceModalRef){
          this.deleteEcheanceModalRef.hide();
        }

        this.ref.detectChanges();

      },err=>{

        console.log("error "  +JSON.stringify(err));
      });

  }


  ngOnInit() {

    console.log("ngOnInit");

    this.currentPageEcheances=1;

    this.pageSizeEcheances=10;

    this.loadEcheances()


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
    console.log("onChanges this.echeance not linked " + this.echeanceNotLinked );
    this.currentPageEcheances=1;

    this.pageSizeEcheances=10;
    this.echeanceNotLinked="true";
    this.loadEcheances();



  }

  @HostListener('matSortChange', ['$event'])
  sortChange(e) {
    // save cookie with table sort data here

    if( e.active!="option" && e.active!="periodeFacturation" && e.active!="occurenceFacturation" && e.active !="commentaire") {
      if (e.direction == "") {
        this.sortBy = null;
        this.sortType = null;
      } else {
        this.sortBy = e.active;
        this.sortType = e.direction;
      }
      this.loadEcheances();
    }

  }

  showEtatRecouvrement(value){
    console.log("value "+ value);
    this.router.navigate(['/etatRecouvrementNumDocument',value]);
  }

  showAddEcheanceModal(editModal: TemplateRef<any>) {
    this.newEcheance = new Echeance();
    /*this.newEcheance.du = moment("01/01/2019", "DD/MM/YYYY").toDate();
    this.newEcheance.au = moment("31/12/2020", "DD/MM/YYYY").toDate();
    this.newEcheance.periodeFacturation = "TRIMESTRIELLE";
    this.newEcheance.montant = 550000;*/
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
      this.currentPageEcheances=1;
      this.loadEcheances();




    }, err => {
      console.log("ereur", err);


    });
  }

  onPaginateChangeEcheances(event) {
    console.log("onPaginateChangeEcheans ");
    this.currentPageEcheances = event.pageIndex+1;
    this.pageSizeEcheances = event.pageSize;

    this.loadEcheances();

  }



  initFilter(){
    this.selectedDate=null;
  }

  loadEcheances(){

    var date=null;
    if(this.selectedDate!=null){
      date = moment(this.selectedDate).format("DD/MM/YYYY");
    }

    this.getEcheancesNotLinked(date,this.currentPageEcheances,this.pageSizeEcheances,this.sortBy,this.sortType);


  }

  filtrerEcheances(){
    this.currentPageEcheances=1;

    this.pageSizeEcheances=10;
    this.echeances=null;
    this.dataSourceEcheance=null;
    console.log("filtrerEcheances echeanceNotLinked " + this.echeanceNotLinked);
    //this.selection.clear();
    this.loadEcheances();
  }

  blockedKey(){
    console.log("focus in blockedKey");
    this.shareBlockedkey.setBlockedKey(true);
  }

  deBlockedKey(){
    console.log("focus in deblockedKey");
    this.shareBlockedkey.setBlockedKey(false);
  }

  composeEmail(){

    // console.log("selectedEcheance " +  JSON.stringify(this.selection));

    //console.log("compose Email");



    var email="mailto:?subject= Echéances selectionnées :"+ "&body= Bonjour,%0A"
      +"Ce message concerne les échéances séléctionées dont le détail est ci-après :"+"%0A"+"%0A"


    if(this.selection.selected!=null && this.selection.selected.length>0){
      email = email+ "Ci-dessous la liste des échéances séléctionnées : %0A";


      this.selection.selected.forEach(function(echeance){

        email= email + ("contrat : "+ echeance.contrat.numContrat +" ,Echéance : Du " + (echeance.du!=null ? moment(echeance.du).format('DD/MM/YYYY HH:MM') : "Undéfini") + (" Au "+echeance.au!=null ? moment(echeance.au).format('DD/MM/YYYY HH:MM') : "Undéfini") + " ,Périodicité : " + echeance.periodeFacturation + " ,Occurence de facturation : "+ echeance.occurenceFacturation + " ,Nom modèle : "+ (echeance.nomModele!=null ? echeance.nomModele : "" )+" ,Montant/Montant Prévisionnel : "+ (echeance.montant!=null ? echeance.montant+" DH" : (echeance.montantPrevision!=null ?echeance.montantPrevision+" DH":"Undéfini")) +"%0A");
      })

    }

    console.log("email " + email);

    window.location.href = email;



    //this.annulation3();
  }

  public checkExpiredEcheanceNotFacture( echeance : Echeance){

    if(echeance!=null){
      if( (echeance.factures== null || echeance.factures=="" || echeance.factures=="[]") && echeance.au!=null && moment(echeance.au) < moment() ){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }

  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceEcheance.data.length;
    return numSelected === numRows;
  }

  public masterToggle() {
    console.log("masterToggle");
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSourceEcheance.data.forEach(row => this.selection.select(row));
  }



  exportEcheancesNotLinked($event){
    $event.stopPropagation();
    $event.preventDefault();

    var date=null;
    if(this.selectedDate!=null){
     date = moment(this.selectedDate).format("DD/MM/YYYY");
    }

    //console.log("filtre "+ this.dataSource.filter);
    var result= this.contratService.exportEcheancesNotLinked(date);

    var d = new Date();

    //console.log("day " + d.getDay());
    var fileName = "Echeances-"+moment(new Date()).format("DD-MM-YYYY")+"-"+d.getHours()+"-"+d.getMinutes()+".xlsx";

    result.subscribe((response: any) => {
      let dataType = response.type;
      let binaryData = [];
      binaryData.push(response);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
      if (fileName)
        downloadLink.setAttribute('download', fileName);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
  }



}
