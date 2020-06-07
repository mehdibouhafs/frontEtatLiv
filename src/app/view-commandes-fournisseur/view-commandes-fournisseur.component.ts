import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CommandeFournisseur} from "../../model/model.commandeFournisseur";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {ContratService} from "../services/contrat.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-view-commandes-fournisseur',
  templateUrl: './view-commandes-fournisseur.component.html',
  styleUrls: ['./view-commandes-fournisseur.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewCommandesFournisseurComponent implements OnInit, OnChanges  {

  displayedColumnsCommandeFournisseur: string[] = ['numeroDocument','descriptionArticle','dateEnregistrement', 'fournisseur','totalCmd','montantRnf', 'montantFacture','remarque','du','au'];
  public dataSourceCommandeFournisseur: MatTableDataSource<CommandeFournisseur>;
  @ViewChild('commandesTableSort', {static: true}) sortCommandeFournisseur: MatSort;
  @ViewChild('commandesTablePaginator', {static: true}) paginatorCommandeFournisseur: MatPaginator;
  filtredDataCommandeFournisseur: Array<CommandeFournisseur>;

  @Input() numContrat : any;
  commandesFournisseurs : Array<CommandeFournisseur>;

  currentFilter;

  lengthCommandeFournisseurs:number;
  pageSizeCommandeFournisseurs:number;
  pageSizeOptionsCommandeFournisseurs:number[] = [5,10, 15,25,30];
  currentPageCommandeFournisseurs : number;
  totalPagesCommandeFournisseurs:number;
  offsetCommandeFournisseurs:number;
  numberOfElementsCommandeFournisseurs:number;

  sortBy:any=null;

  sortType:any=null;

  constructor(private ref: ChangeDetectorRef,private spinner: NgxSpinnerService,private contratService:ContratService) { }

  ngOnInit() {

    this.currentPageCommandeFournisseurs=1;
    this.pageSizeCommandeFournisseurs=5;
    /*this.getCommandeFournisseur(this.numContrat,null,this.currentPageCommandeFournisseurs,this.pageSizeCommandeFournisseurs
      ,this.sortBy,this.sortType);*/

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceCommandeFournisseur.filter = filterValue;
    this.currentFilter = filterValue;

    this.getCommandeFournisseur(this.numContrat, this.currentFilter,1,5,this.sortBy,this.sortType);



  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("change commande fournisseru");
    this.dataSourceCommandeFournisseur=null;
    this.commandesFournisseurs=null;
    this.getCommandeFournisseur(this.numContrat, null,1,5,this.sortBy,this.sortType);

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

    this.getCommandeFournisseur(this.numContrat, this.currentFilter,this.currentPageCommandeFournisseurs,this.pageSizeCommandeFournisseurs,this.sortBy,this.sortType);

  }

  onPaginateChangeCommandeFournisseurs(event) {
    console.log("onPaginateChangeCommandeFournisseurs ");
    this.currentPageCommandeFournisseurs= event.pageIndex+1;
    this.pageSizeCommandeFournisseurs = event.pageSize;
    this.getCommandeFournisseur(this.numContrat,this.currentFilter,this.currentPageCommandeFournisseurs,this.pageSizeCommandeFournisseurs,this.sortBy,this.sortType);


  }


  getCommandeFournisseur(numContrat:number,mc:string,page :number,size:number,sortBy:any,sortType:any){


    this.contratService.getCommandeFournisseurs(numContrat,mc,page,size,sortBy,sortType).subscribe(
      (data : any)=>{

        this.commandesFournisseurs = data.content;

        this.lengthCommandeFournisseurs = data.totalElements;
        this.totalPagesCommandeFournisseurs= data.totalPages;
        this.currentPageCommandeFournisseurs = data.pageable.pageNumber+1;

        this.dataSourceCommandeFournisseur = new MatTableDataSource(this.commandesFournisseurs);
        this.ref.detectChanges();

      },err=>{

        console.log("error "  +JSON.stringify(err));
      });

  }



}
