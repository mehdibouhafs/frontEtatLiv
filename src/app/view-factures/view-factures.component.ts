import {
  ChangeDetectionStrategy, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {FactureEcheance} from "../../model/model.factureEcheance";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-view-factures',
  templateUrl: './view-factures.component.html',
  styleUrls: ['./view-factures.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewFacturesComponent implements OnInit,OnChanges {

  displayedColumnsFacturesEcheance: string[] = ['numFacture', 'dateEnregistrement','montantHT', 'montantRestant','montantTTC','debutPeriode','finPeriode','du','montant'];
  public dataSourceFacturesEcheance: MatTableDataSource<FactureEcheance>;
  @ViewChild('factureEcheanceTableSort', {static: true}) sortFactureEcheance: MatSort;
  @ViewChild('factureEcheanceTablePaginator', {static: true}) paginatorFactureEcheance: MatPaginator;
  filtredDataFactureEcheance: Array<FactureEcheance>;
  currentFilter:any;
  @Input() factureEcheances : Array<FactureEcheance>;

  constructor() { }

  ngOnInit() {

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
    // console.log("this.before [0] " + this.filtredData[0].codeProjet);
    // console.log("sorting table");
    //this.filtredData = this.dataSource.filteredData;

    // console.log("this.filtredData[0] " + this.filtredData[0].codeProjet);*/

  }


}
