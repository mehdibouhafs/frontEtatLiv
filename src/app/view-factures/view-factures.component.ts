import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {FactureEcheance} from "../../model/model.factureEcheance";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {ContratService} from "../services/contrat.service";
import {Echeance} from "../../model/model.echeance";
import {Contrat} from "../../model/model.contrat";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import * as moment from 'moment';
import {AuthenticationService} from "../services/authentification.service";
import {ShareEcheanceService} from "../services/shareEcheance.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-view-factures',
  templateUrl: './view-factures.component.html',
  styleUrls: ['./view-factures.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewFacturesComponent implements OnInit,OnChanges {

  displayedColumnsFacturesEcheance: string[] = ['numFacture', 'dateEnregistrement','montantHT', 'montantTTC','montantRestant','debutPeriode','finPeriode','du','montant','option'];
  public dataSourceFacturesEcheance: MatTableDataSource<FactureEcheance>;
  @ViewChild('factureEcheanceTableSort', {static: true}) sortFactureEcheance: MatSort;
  @ViewChild('factureEcheanceTablePaginator', {static: true}) paginatorFactureEcheance: MatPaginator;
  filtredDataFactureEcheance: Array<FactureEcheance>;
  currentFilter:any;
  factureEcheances : Array<FactureEcheance>;

   allEcheances : Array<Echeance>;

  @Input() numContrat : any;


  currentFacturationEcheance : FactureEcheance;

  editFactureEcheanceModalRef : BsModalRef;

  addEcheanceModalRef:BsModalRef;

  selectedEcheance : Echeance;

  updatedFactureEcheance : FactureEcheance;

  newEcheance : Echeance;

  @Output() addNewEcheanceEmitter = new EventEmitter<Echeance>();

  @Output() editFactureEcheanceEmitter = new EventEmitter<FactureEcheance>();

  roleEditEcheance:boolean;


  lengthFactureEcheances:number;
  pageSizeFactureEcheances:number;
  pageSizeOptionsFactureEcheances:number[] = [5,10, 15,25,30];
  currentPageFactureEcheances : number;
  totalPagesFactureEcheances:number;
  offsetFactureEcheances:number;
  numberOfElementsFactureEcheances:number;

  sortBy:any=null;

  sortType:any=null;

  subscription :any;

  constructor(private ref: ChangeDetectorRef,private spinner: NgxSpinnerService,private shareEcheance : ShareEcheanceService,private authService: AuthenticationService,private contratService:ContratService,private modalService: BsModalService) {

    this.subscription = this.shareEcheance.getFactureEcheance()
      .subscribe((factureEcheance : FactureEcheance) =>{
        console.log("loadd facture Echeance ");
        this.loadAllEcheance(this.numContrat);
        this.getFactureEcheance(this.numContrat,1,5,this.sortBy,this.sortType);


      } )
  }

  ngOnInit() {


    this.currentPageFactureEcheances=1;
    this.pageSizeFactureEcheances=5;

    //this.getFactureEcheance(this.numContrat,this.currentPageFactureEcheances,this.pageSizeFactureEcheances,this.sortBy,this.sortType);

    this.loadAllEcheance(this.numContrat);

    this.authService.getRoles().forEach(authority => {

      if (authority == 'EDIT_ECHEANCE_CONTRAT') {
        this.roleEditEcheance= true;
      }
    });


  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceFacturesEcheance.filter = filterValue;
    this.currentFilter = filterValue;

    if (this.dataSourceFacturesEcheance.paginator) {
      this.dataSourceFacturesEcheance.paginator.firstPage();
    }


  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("on change facture");
    this.currentPageFactureEcheances=1;
    this.pageSizeFactureEcheances=5;
    this.dataSourceFacturesEcheance=null;
    this.factureEcheances=null;
    this.getFactureEcheance(this.numContrat,this.currentPageFactureEcheances,5,this.sortBy,this.sortType);
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
    this.getFactureEcheance(this.numContrat,this.currentPageFactureEcheances,this.pageSizeFactureEcheances,this.sortBy,this.sortType);


  }

  addNewEcheance(){

    this.contratService.editEcheance(this.numContrat,this.newEcheance).subscribe((data: Echeance) => {

      this.shareEcheance.setEcheance(this.newEcheance);

      this.loadAllEcheance(this.numContrat);

      this.getFactureEcheance(this.numContrat,1,5,this.sortBy,this.sortType);

      this.addEcheanceModalRef.hide();

    }, err => {
      console.log("ereur", err);
    });

  }

  editFactureEcheance(){
    console.log("edit Page echeance: "+this.currentPageFactureEcheances);


    this.contratService.editFactureEcheance(this.numContrat,this.updatedFactureEcheance).subscribe((data: FactureEcheance) => {

      this.shareEcheance.setEcheance(data.echeance);

      console.log("current Page echeance"+this.currentPageFactureEcheances);
      this.getFactureEcheance(this.numContrat,this.currentPageFactureEcheances,this.pageSizeFactureEcheances,this.sortBy,this.sortType);

      this.editFactureEcheanceModalRef.hide();

    }, err => {
      console.log("ereur", err);


    });




  }


  showEditFactureEcheanceModal(factureEcheance :FactureEcheance,editModal: TemplateRef<any>) {
    this.updatedFactureEcheance = new FactureEcheance();
    this.updatedFactureEcheance.id=factureEcheance.id;
    this.updatedFactureEcheance.facture=factureEcheance.facture;
    this.updatedFactureEcheance.contrat=factureEcheance.contrat;
    this.updatedFactureEcheance.echeance=null;

    console.log(JSON.stringify(factureEcheance.echeance));

    if(factureEcheance.echeance!=null){
      for(var i=0;i<this.allEcheances.length;i++){
        if(this.allEcheances[i].id=factureEcheance.echeance.id){
          console.log("found ");
          this.updatedFactureEcheance.echeance =this.allEcheances[i];
          break;
        }
      }
    }

    this.editFactureEcheanceModalRef =  this.modalService.show(editModal, Object.assign({}, {class: 'modal-sm'}));
  }

  closeEditFactureEcheanceModal(){
    this.editFactureEcheanceModalRef.hide();
  }


  showAddEcheanceModal(editModal: TemplateRef<any>) {
    this.newEcheance = new Echeance();
    this.addEcheanceModalRef =  this.modalService.show(editModal, Object.assign({}, {class: 'modal-sm'}));
  }

  closeAddEcheanceModal(){
    this.addEcheanceModalRef.hide();
  }


  nbMonth :number=0;

  onChangeDate(){
    this.nbMonth = moment(new Date(this.newEcheance.au)).diff(new Date(this.newEcheance.du), 'months', true);
  }

  onPaginateChangeFactureEcheances(event) {
    console.log("onPaginateChangeFactureEcheans ");
    this.currentPageFactureEcheances = event.pageIndex+1;
    this.pageSizeFactureEcheances = event.pageSize;
    this.getFactureEcheance(this.numContrat,this.currentPageFactureEcheances,this.pageSizeFactureEcheances,this.sortBy,this.sortType);


  }

  getFactureEcheance(numContrat:number,page :number,size:number,sortBy:any,sortType:any){

    this.contratService.getFactureEcheance(numContrat,page,size,sortBy,sortType).subscribe(
      (data : any)=>{
        this.factureEcheances = data.content;

        this.lengthFactureEcheances= data.totalElements;
        this.currentPageFactureEcheances = data.pageable.pageNumber+1;
        this.dataSourceFacturesEcheance = new MatTableDataSource(this.factureEcheances);

        this.dataSourceFacturesEcheance.paginator = this.paginatorFactureEcheance;
        this.ref.detectChanges();

      },err=>{

        console.log("error "  +JSON.stringify(err));
      });

  }



  findIndexToUpdate(newItem) {
    return newItem.id === this;
  }

  loadAllEcheance(numContrat : any){

    this.contratService.getAllEcheancesForContrat(numContrat).subscribe(
      (data: Array<Echeance>) => {
        this.allEcheances = data;
      }, err => {
        console.log("error " + JSON.stringify(err));
      }
    )

  }




}
