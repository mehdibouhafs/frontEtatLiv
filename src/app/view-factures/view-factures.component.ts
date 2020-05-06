import {
  ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges,
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
  @Input() factureEcheances : Array<FactureEcheance>;

  @Input() echeances : Array<Echeance>;

  @Input() numContrat : string;

  currentFacturationEcheance : FactureEcheance;

  editFactureEcheanceModalRef : BsModalRef;

  addEcheanceModalRef:BsModalRef;

  selectedEcheance : Echeance;

  updatedFactureEcheance : FactureEcheance;

  newEcheance : Echeance;


  @Output() addNewEcheanceEmitter = new EventEmitter<Echeance>();

  @Output() editFactureEcheanceEmitter = new EventEmitter<FactureEcheance>();

  roleEditEcheance:boolean;

  constructor(private authService: AuthenticationService,private contratService:ContratService,private modalService: BsModalService) { }

  ngOnInit() {

    this.authService.getRoles().forEach(authority => {

      if (authority == 'EDIT_ECHEANCE_CONTRAT') {
        this.roleEditEcheance= true;
      }
    });


    this.dataSourceFacturesEcheance = new MatTableDataSource(this.factureEcheances);

    this.dataSourceFacturesEcheance.filterPredicate = function(data, filter: string): boolean {


      return (data.facture.numFacture != null ? data.facture.numFacture : "").toString().toLowerCase()

        === filter;
    };
    //  this.dataSourceEcheance.paginator = this.paginatorEcheance;

    this.dataSourceFacturesEcheance.paginator = this.paginatorFactureEcheance;
    this.dataSourceFacturesEcheance.sort=this.sortFactureEcheance;
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
    this.dataSourceFacturesEcheance = new MatTableDataSource(this.factureEcheances);




    this.dataSourceFacturesEcheance.filterPredicate = function(data, filter: string): boolean {


      return (data.facture.numFacture != null ? data.facture.numFacture : "").toString().toLowerCase()

        === filter;
    };
    //  this.dataSourceEcheance.paginator = this.paginatorEcheance;

    this.dataSourceFacturesEcheance.paginator = this.paginatorFactureEcheance;
    this.dataSourceFacturesEcheance.sort=this.sortFactureEcheance;
  }

  @HostListener('matSortChange', ['$event'])
  sortChange(e) {
    // save cookie with table sort data here
    this.dataSourceFacturesEcheance.sortData(this.dataSourceFacturesEcheance.filteredData,this.dataSourceFacturesEcheance.sort);
    // ////console.log("this.before [0] " + this.filtredData[0].codeProjet);
    // //console.log("sorting table");
    //this.filtredData = this.dataSource.filteredData;

    // //console.log("this.filtredData[0] " + this.filtredData[0].codeProjet);*/

  }

  addNewEcheance(){

    this.contratService.editEcheance(this.numContrat,this.newEcheance).subscribe((data: Echeance) => {

      this.addNewEcheanceEmitter.emit(data);
      this.addEcheanceModalRef.hide();

    }, err => {
      console.log("ereur", err);
    });

  }

  editFactureEcheance(){


    this.contratService.editFactureEcheance(this.numContrat,this.updatedFactureEcheance).subscribe((data: FactureEcheance) => {

      this.editFactureEcheanceEmitter.emit(data);
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








}
