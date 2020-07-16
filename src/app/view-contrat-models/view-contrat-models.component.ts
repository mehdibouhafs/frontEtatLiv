import {ChangeDetectorRef, Component, HostListener, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ContratModel} from "../../model/model.contratModel";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {ContratService} from "../services/contrat.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ShareBlockedKeyService} from "../services/shareBlockedKey.service";
import {ShareContratModelService} from "../services/shareContratModel.service";

@Component({
  selector: 'app-view-contrat-models',
  templateUrl: './view-contrat-models.component.html',
  styleUrls: ['./view-contrat-models.component.css']
})
export class ViewContratModelsComponent implements OnInit {

  displayedColumnContratModel: string[] = ['name','du','au','periodeFacturation','occurenceFacturation','montant','montantPrevisionel'];
  public dataSourceContratModel: MatTableDataSource<ContratModel>;
  @ViewChild('contratModelTableSort', {static: true}) sortContratModel: MatSort;
  @ViewChild('contratModelTablePaginator', {static: true}) paginatorContratModel: MatPaginator;
  @Input() numContrat : any;
  contratModels : Array<ContratModel>;
  currentFilter:any;

  lengthContratModel:number;
  pageSizeContratModel:number;
  pageSizeOptionsContratModel:number[] = [10, 15,25,30];
  currentPageContratModel : number;
  totalPagesContratModel:number;
  offsetContratModel:number;
  numberOfElementsContratModel:number;

  sortBy:any=null;

  sortType:any=null;


  subscription : any;


  constructor(private shareContratModel: ShareContratModelService,private shareBlockedkey : ShareBlockedKeyService,private ref: ChangeDetectorRef,private spinner: NgxSpinnerService, private contratService:ContratService) {

    this.subscription = this.shareContratModel.getContratModel()
      .subscribe((cm : ContratModel) =>{

        this.getContratModel(this.numContrat,1,10,this.sortBy,this.sortType);

      } )
  }


  ngOnInit() {
    this.currentPageContratModel=1;
    this.pageSizeContratModel=10;
    //this.getPieces(this.numContrat,this.currentPagePieces,this.pageSizePieces,this.sortBy,this.sortType);

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceContratModel.filter = filterValue;
    this.currentFilter = filterValue;



  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log("PieceOnInit" + this.piecesContrat);
    this.dataSourceContratModel=null;
    this.contratModels=null;
    this.getContratModel(this.numContrat,1,10,this.sortBy,this.sortType);
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
      this.getContratModel(this.numContrat, this.currentPageContratModel, this.pageSizeContratModel, this.sortBy, this.sortType);
    }

  }



  onPaginateChangeContratModel(event) {
    console.log("onPaginateChangePieces ");
    this.currentPageContratModel = event.pageIndex+1;
    this.pageSizeContratModel = event.pageSize;
    this.getContratModel(this.numContrat,this.currentPageContratModel,this.pageSizeContratModel,this.sortBy,this.sortType);


  }

  getContratModel(numContrat:number,page :number,size:number,sortBy:any,sortType:any){

    this.contratService.getContratModel(numContrat,page,size,sortBy,sortType).subscribe(
      (data : any)=>{

        this.contratModels = data.content;

        this.lengthContratModel = data.totalElements;
        this.currentPageContratModel = data.pageable.pageNumber+1;

        this.dataSourceContratModel = new MatTableDataSource(this.contratModels);
        this.ref.detectChanges();

      },err=>{

        console.log("error "  +JSON.stringify(err));
      });

  }

  blockedKey(){
    console.log("focus in blockedKey");
    this.shareBlockedkey.setBlockedKey(true);
  }

  deBlockedKey(){
    console.log("focus in deblockedKey");
    this.shareBlockedkey.setBlockedKey(false);
  }

}
