import {
  ChangeDetectionStrategy, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Piece} from "../../model/model.piece";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {ContratService} from "../services/contrat.service";

@Component({
  selector: 'app-view-pieces',
  templateUrl: './view-pieces.component.html',
  styleUrls: ['./view-pieces.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewPiecesComponent implements OnInit,OnChanges {

  displayedColumnPieceContrat: string[] = ['name','type','option'];
  public dataSourcePieceContrat: MatTableDataSource<Piece>;
  @ViewChild('pieceContratTableSort', {static: true}) sortPieceContrat: MatSort;
  @ViewChild('pieceContratTablePaginator', {static: true}) paginatorPieceContrat: MatPaginator;
  @Input() piecesContrat : Array<Piece>;
  currentFilter:any;

  constructor(private contratService:ContratService) { }

  ngOnInit() {
    //console.log("PieceOnInit" + this.piecesContrat);
    this.dataSourcePieceContrat = new MatTableDataSource(this.piecesContrat);
    this.dataSourcePieceContrat.filterPredicate = function(data, filter: string): boolean {

      return (data.name != null ? data.name : "").toString().toLowerCase()

        === filter;
    };
    //  this.dataSourceEcheance.paginator = this.paginatorEcheance;

    this.dataSourcePieceContrat.paginator = this.paginatorPieceContrat;
    this.dataSourcePieceContrat.sort=this.sortPieceContrat;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePieceContrat.filter = filterValue;
    this.currentFilter = filterValue;

    if (this.dataSourcePieceContrat.paginator) {
      this.dataSourcePieceContrat.paginator.firstPage();
    }


  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log("PieceOnInit" + this.piecesContrat);
    this.dataSourcePieceContrat = new MatTableDataSource(this.piecesContrat);
    this.dataSourcePieceContrat.filterPredicate = function(data, filter: string): boolean {

      return (data.name != null ? data.name : "").toString().toLowerCase()

        === filter;
    };
    //  this.dataSourceEcheance.paginator = this.paginatorEcheance;

    this.dataSourcePieceContrat.paginator = this.paginatorPieceContrat;
    this.dataSourcePieceContrat.sort=this.sortPieceContrat;
  }

  @HostListener('matSortChange', ['$event'])
  sortChange(e) {
    // save cookie with table sort data here
    this.dataSourcePieceContrat.sortData(this.dataSourcePieceContrat.filteredData,this.dataSourcePieceContrat.sort);
    // //console.log("this.before [0] " + this.filtredData[0].codeProjet);
    // //console.log("sorting table");
    //this.filtredData = this.dataSource.filteredData;

    // //console.log("this.filtredData[0] " + this.filtredData[0].codeProjet);*/

  }


  getFile(url: string){
    window.open(url, "_blank");
  }

  getPiece($event,fullPath :string,fileName :string){
    $event.stopPropagation();
    $event.preventDefault();


    var result= this.contratService.exportPiece(fullPath);

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
    },err=>{
       alert("Ereur de téléchargement de la pièce ! Veuillez contacter votre administrateur ");
    });
  }


}
