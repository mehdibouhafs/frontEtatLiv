import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Piece} from "../../model/model.piece";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {ContratService} from "../services/contrat.service";
import {NgxSpinnerService} from "ngx-spinner";

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
  @Input() numContrat : any;
   piecesContrat : Array<Piece>;
  currentFilter:any;

  lengthPieces:number;
  pageSizePieces:number;
  pageSizeOptionsPieces:number[] = [5,10, 15,25,30];
  currentPagePieces : number;
  totalPagesPieces:number;
  offsetPieces:number;
  numberOfElementsPieces:number;

  sortBy:any=null;

  sortType:any=null;


  constructor(private ref: ChangeDetectorRef,private spinner: NgxSpinnerService, private contratService:ContratService) { }

  ngOnInit() {
    this.currentPagePieces=1;
    this.pageSizePieces=5;
    //this.getPieces(this.numContrat,this.currentPagePieces,this.pageSizePieces,this.sortBy,this.sortType);

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourcePieceContrat.filter = filterValue;
    this.currentFilter = filterValue;



  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log("PieceOnInit" + this.piecesContrat);
    this.dataSourcePieceContrat=null;
    this.piecesContrat=null;
    this.getPieces(this.numContrat,1,5,this.sortBy,this.sortType);
  }

  @HostListener('matSortChange', ['$event'])
  sortChange(e) {
    // save cookie with table sort data here

    if( e.active!="option") {
      if (e.direction == "") {
        this.sortBy = null;
        this.sortType = null;
      } else {
        this.sortBy = e.active;
        this.sortType = e.direction;
      }
      this.getPieces(this.numContrat, this.currentPagePieces, this.pageSizePieces, this.sortBy, this.sortType);
    }

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

  onPaginateChangePieces(event) {
    console.log("onPaginateChangePieces ");
    this.currentPagePieces = event.pageIndex+1;
    this.pageSizePieces = event.pageSize;
    this.getPieces(this.numContrat,this.currentPagePieces,this.pageSizePieces,this.sortBy,this.sortType);


  }

  getPieces(numContrat:number,page :number,size:number,sortBy:any,sortType:any){

    this.contratService.getPieces(numContrat,page,size,sortBy,sortType).subscribe(
      (data : any)=>{

        this.piecesContrat = data.content;

        this.lengthPieces = data.totalElements;
        this.currentPagePieces = data.pageable.pageNumber+1;

        this.dataSourcePieceContrat = new MatTableDataSource(this.piecesContrat);
        this.ref.detectChanges();

      },err=>{

        console.log("error "  +JSON.stringify(err));
      });

  }


}
