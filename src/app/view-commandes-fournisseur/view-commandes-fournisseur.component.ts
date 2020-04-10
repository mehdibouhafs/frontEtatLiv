import {
  ChangeDetectionStrategy, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CommandeFournisseur} from "../../model/model.commandeFournisseur";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-view-commandes-fournisseur',
  templateUrl: './view-commandes-fournisseur.component.html',
  styleUrls: ['./view-commandes-fournisseur.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewCommandesFournisseurComponent implements OnInit, OnChanges  {

  displayedColumnsCommandeFournisseur: string[] = ['numeroDocument','descriptionArticle','dateEnregistrement', 'fournisseur','totalCmd','montantRnf', 'montantFacture','remarque'];
  public dataSourceCommandeFournisseur: MatTableDataSource<CommandeFournisseur>;
  @ViewChild('commandesTableSort', {static: true}) sortCommandeFournisseur: MatSort;
  @ViewChild('commandesTablePaginator', {static: true}) paginatorCommandeFournisseur: MatPaginator;
  filtredDataCommandeFournisseur: Array<CommandeFournisseur>;

  @Input() commandesFournisseurs : Array<CommandeFournisseur>;

  currentFilter;

  constructor() { }

  ngOnInit() {

    this.dataSourceCommandeFournisseur = new MatTableDataSource(this.commandesFournisseurs);

    this.dataSourceCommandeFournisseur.filterPredicate = function(data, filter: string): boolean {


      return (data.fournisseur != null ? data.fournisseur : "").toLowerCase().includes(filter) ||
        (data.remarque != null ? data.remarque : "").toLowerCase().includes(filter) ||
        (data.descriptionArticle != null ? data.descriptionArticle : "").toLowerCase().includes(filter) ||
        (data.numeroDocument !=null ? data.numeroDocument : "").toString().toLowerCase()

        === filter;
    };

    this.dataSourceCommandeFournisseur.paginator = this.paginatorCommandeFournisseur;
    this.dataSourceCommandeFournisseur.sort = this.sortCommandeFournisseur;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceCommandeFournisseur.filter = filterValue;
    this.currentFilter = filterValue;

    if (this.dataSourceCommandeFournisseur.paginator) {
      this.dataSourceCommandeFournisseur.paginator.firstPage();
    }




  }

  ngOnChanges(changes: SimpleChanges) {

    this.dataSourceCommandeFournisseur = new MatTableDataSource(this.commandesFournisseurs);

    this.dataSourceCommandeFournisseur.filterPredicate = function(data, filter: string): boolean {


      return (data.fournisseur != null ? data.fournisseur : "").toLowerCase().includes(filter) ||
        (data.remarque != null ? data.remarque : "").toLowerCase().includes(filter) ||
        (data.descriptionArticle != null ? data.descriptionArticle : "").toLowerCase().includes(filter) ||
        (data.numeroDocument !=null ? data.numeroDocument : "").toString().toLowerCase()

        === filter;
    };

    this.dataSourceCommandeFournisseur.paginator = this.paginatorCommandeFournisseur;
    this.dataSourceCommandeFournisseur.sort = this.sortCommandeFournisseur;
  }

  @HostListener('matSortChange', ['$event'])
  sortChange(e) {
    // save cookie with table sort data here
    this.dataSourceCommandeFournisseur.sortData(this.dataSourceCommandeFournisseur.filteredData,this.dataSourceCommandeFournisseur.sort);
    // console.log("this.before [0] " + this.filtredData[0].codeProjet);
    // console.log("sorting table");
    //this.filtredData = this.dataSource.filteredData;

    // console.log("this.filtredData[0] " + this.filtredData[0].codeProjet);*/

  }



}
