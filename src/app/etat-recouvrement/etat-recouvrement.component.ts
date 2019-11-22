import {ChangeDetectorRef, Component, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Employer} from '../../model/model.employer';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {EtatRecouvrement} from '../../model/model.etatRecouvrement';
import {PagerService} from '../services/pager.service';
import {EtatRecouvrementService} from '../services/etatRecouvrement.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Document} from '../../model/model.document';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import * as moment from 'moment';
import {Commentaire} from '../../model/model.commentaire';
import {NgxSpinnerService} from 'ngx-spinner';
import {Statitics} from '../../model/model.statistics';
import {AuthenticationService} from '../services/authentification.service';
import {User} from '../../model/model.user';

@Component({
  selector: 'app-etat-recouvrement',
  templateUrl: './etat-recouvrement.component.html',
  styleUrls: ['./etat-recouvrement.component.css']
})
export class EtatRecouvrementComponent implements OnInit {

  statistics : Statitics;

  pageDocument :any;
  currentPage : number = 1;
  pages :any;
  totalElement :number;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  currentDocument : Document;
  returnedError : any;

  selectedFiles: FileList;

  keys : Array<string>;
  Documents : Array<Document>;

  viewUpload  : boolean =  false;

  employees : Array<Employer>;
  employeesRecouvrement : Array<Employer>;

  newContentComment : string;
  newDatePlannifier : Date;
  newEmployerId : any;

  mode : number;

  modalRef: BsModalRef;

  nestedModalRef : BsModalRef;

  nested2ModalRef : BsModalRef;

  displayedColumns: string[] = ['option','numPiece','typeDocument','agePiece','datePiece','client','codeProjet','projet','commercial', 'chefProjet','montantPiece','montantOuvert','age','chargerRecouvrement','ageDepot'];
  public dataSource: MatTableDataSource<Document>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  filtredData : Array<Document>;


  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  suivant : boolean;

  index : any;

  modalOption: NgbModalOptions = {};

  etatRecouvrement: EtatRecouvrement;

  documentCloture : boolean = false;

  selectedChargeRecouvrement : string = null;

  currentFilter : string;

  roleReadAllProjects :boolean;

  roleReadAllRecouvrement :boolean;

  roleReadMyRecouvrement : boolean;

  userNameAuthenticated : string;

  sigleUserAuthenticated : string;
  service : string;
  userInSession :string;

  roleReadMyProjects : boolean;

  RIGHT_ARROW = 39;
  LEFT_ARROW = 37;

  constructor(private authService:AuthenticationService,private spinner: NgxSpinnerService,private pagerService:PagerService,private etatRecouvrementService: EtatRecouvrementService, private router : Router,private modalService: BsModalService, viewContainerRef:ViewContainerRef,private ref: ChangeDetectorRef,
  private activatedRoute:ActivatedRoute) {
    this.service = this.authService.getServName();

    this.userInSession = this.authService.getLastName();

    this.authService.getRoles().forEach(authority => {
      if (authority == 'READ_ALL_PROJECTS') {
        this.roleReadAllProjects = true;

      }
      if (authority == 'READ_MY_PROJECTS') {
        this.roleReadMyProjects = true;
        if(this.authService.getLastName()!=null){
          this.userNameAuthenticated = this.authService.getLastName();
        }else{
          this.userNameAuthenticated ="undefined";
        }

      }

      if (authority == 'READ_ALL_RECOUVREMENTS') {
        this.roleReadAllRecouvrement = true;

      }
      if (authority == 'READ_MY_RECOUVREMENT') {
        this.roleReadMyRecouvrement = true;

        if(this.authService.getLastName()!=null){
          this.userNameAuthenticated = this.authService.getLastName();
        }else{
          this.userNameAuthenticated ="undefined";
        }


      }
    });

    this.sigleUserAuthenticated = this.authService.getSigle();


    const codeCommercial = this.activatedRoute.snapshot.params['codeCommercial'];
    console.log("codeCommercial " + codeCommercial);
    const codeProjet = this.activatedRoute.snapshot.params['codeProjet'];
    console.log("codeProjet " + codeProjet);

    this.selectedChargeRecouvrement = "none";

    const chefProjet = this.activatedRoute.snapshot.params['chefProjet'];
    console.log("chefProjet " + chefProjet);
    const codeClient = this.activatedRoute.snapshot.params['codeClient'];
    console.log("codeClient " + codeClient);
    if(codeCommercial!=null){
      console.log("filtredByCOmm " + codeCommercial);
      this.getDocumentsByCommercial(this.documentCloture,codeCommercial);
    }else{

      if(codeProjet!=null ){
        this.getDocumentsByCodeProjet(this.documentCloture,codeProjet);
      }else{
        if(codeClient!=null){
          this.getDocumentsByClient(this.documentCloture,codeClient);
        }else{
          if(chefProjet != null){
            this.getDocumentsByChefProjet(this.documentCloture,chefProjet);
          }else{
            if(this.roleReadMyProjects){
              console.log("all doc");
              this.getDocumentsByCommercialOrChefProjet(this.documentCloture,this.userNameAuthenticated);
            }else{
              if(this.roleReadAllRecouvrement){
                this.getAllDocument(false,null);
              }else{
                console.log("this.userNameAuthenticated " + this.userNameAuthenticated);
                this.getAllDocument(false,this.userNameAuthenticated);
              }
            }

          }
        }

      }


    }



    this.getAllEmployees();

    this.getAllEmployeesRecouvrement();

    this.getEtatRecouvrement();




  }


  setPage(page: number) {

    console.log("this.currentDocument.commentaires " + this.currentDocument.commentaires);

    if(this.currentDocument.commentaires == null ||  this.currentDocument.commentaires.length==0) {
      console.log("null");
      this.pager = null;
      this.pagedItems = null;
      return;
    }else{

      this.pager = this.pagerService.getPager(this.currentDocument.commentaires.length, page);

      if (page < 1 || page > this.pager.totalPages  ) {
        return;
      }



      this.pagedItems = this.currentDocument.commentaires.slice(this.pager.startIndex, this.pager.endIndex + 1);

    }


    console.log("page " +  page );
    console.log("this.pager.totalPages " + this.pager.totalPages);

    // get pager object from service
    this.pager = this.pagerService.getPager(this.currentDocument.commentaires.length, page);

    // get current page of items

  }



  getAllEmployees(){
    this.etatRecouvrementService.getAllEmployees().subscribe(
      (data: Array<Employer>)=>{
        this.employees = data;
      },error => {
        console.log("error "+ error);
      }
    )
  }


  insertIntoDocuments(pageDocument : any){
    this.Documents = new Array<Document>();
    pageDocument.forEach(document => {
      let p = new Document();
      p.codePiece= document.codePiece;
      p.numPiece = document.numPiece;
      p.typeDocument  = document.typeDocument;
      p.datePiece = document.datePiece;
      p.codeClient = document.codeClient;
      p.client = document.client;
      p.refClient = document.refClient;
      p.codeProjet = document.codeProjet;
      p.projet = document.projet;
      p.commercial = document.commercial;
      p.chefProjet = document.chefProjet;
      p.montantPiece =  document.montantPiece;
      p.montantOuvert = document.montantOuvert;
      p.chargerRecouvrement = document.chargerRecouvrement;
      p.anneePiece = document.anneePiece;
      p.agePiece = document.agePiece;
      p.age = document.age;
      p.montantPayer = document.montantPayer;
      p.conditionDePaiement = document.conditionDePaiement;
      p.caution = document.caution;
      p.numCaution = document.numCaution;
      p.typeCaution = document.typeCaution;
      p.montantCaution = document.montantCaution;
      p.dateLiberationCaution = document.dateLiberationCaution;
      p.details = document.details;
      p.creation = document.creation;
      p.lastUpdate = document.lastUpdate;
      p.statut = document.statut;
      p.motif = document.motif;
      p.montantGarantie = document.montantGarantie;
      p.montantProvision = document.montantProvision;
      p.dateFinGarantie = document.dateFinGarantie;
      p.datePrevuEncaissement = document.datePrevuEncaissement;
      p.dureeGarantie = document.dureeGarantie;
      p.action = document.action;
      p.responsable = document.responsable;
      p.dateDepot = document.dateDepot;
      p.motifChangementDate = document.motifChangementDate;
      p.datePvProvisoire = document.datePvProvisoire;
      p.datePrevuReceptionDefinitive = document.datePrevuReceptionDefinitive;
      p.codeCommercial = document.codeCommercial;
      p.dateEcheance = document.dateEcheance;
      p.infoChefProjetOrCommercial = document.infoChefProjetOrCommercial;
      p.infoClient = document.infoClient;
      p.infoProjet = document.infoProjet;

      if(p.agePiece!=null && p.typeDocument == "Facture"){
        if(document.agePiece>=0 && document.agePiece<=1){
          p.isLessThanOneMonth = true;
        }

        if(document.agePiece>1 && document.agePiece<=2){
          p.isLessThanTwoMonth = true;
        }

        if(document.agePiece>2 && document.agePiece<=3){
          p.isLessThanTreeMonth = true;
        }

        if(document.agePiece>3 && document.agePiece <=12){
          p.isMoreThanTreeMonthAndLessThanTweleveMonth = true;
        }

        if(document.agePiece>12 ){
          p.isMoreThanTwelveMonth = true;
        }

        if( moment(document.dateEcheance)  <=  moment()){
          p.isExpiredEcheance = true;
        }
      }
      if(p.agePiece!=null && p.typeDocument != "Facture"){
        p.isGris=true;
      }

      if(p.dateDepot!=null){
        p.ageDepot = moment(p.dateDepot).diff(moment(), 'months', true);

      }

      if(p.dateFinGarantie!=null){
        p.retenuGarantieIssue = moment(p.dateFinGarantie).diff(moment(), 'months', true);
      }


      if(document.commentaires != null && document.commentaires.length > 0){
        p.commentaires = document.commentaires;
      }


      p.cloture = document.cloture;




      this.Documents.push(p);
  });
  }


  getAllEmployeesRecouvrement(){
    this.etatRecouvrementService.getAllEmployeesByService("Recouvrement").subscribe(
      (data: Array<Employer>)=>{
        this.employeesRecouvrement = data;
      },error => {
        console.log("error "+ error);
      }
    )
  }



  getEtatRecouvrement(){
    this.etatRecouvrementService.getEtatRecouvrement().subscribe(
      (data:EtatRecouvrement)=>{
        this.etatRecouvrement = data;
      },
      err=>{

      }
    )
  }

  getAllDocument(cloture:boolean,chargeRecouvrement :string){

    if(chargeRecouvrement!=null){
      this.etatRecouvrementService.getDocumentsByChargeRecouvrement(cloture,chargeRecouvrement).subscribe(
        data=>{
          this.pageDocument = data;

          this.keys = new Array<string>();



          this.keys.push("codeDocument");
          if(this.pageDocument[0] !=null && this.pageDocument[0].detaills !=null ){
            this.pageDocument[0].details.forEach(element => {
              console.log(element.header.label);
              let a :string;
              a = element.header.label;
              this.keys.push(a);

            });
          }


          this.insertIntoDocuments(this.pageDocument);



          this.dataSource =  new MatTableDataSource(this.Documents);

          this.dataSource.filterPredicate = function(data, filter: string): boolean {

            return (data.client !=null ? data.client : "").toLowerCase().includes(filter) ||
              (data.numPiece !=null ? data.numPiece : "").toLowerCase().includes(filter) ||
              (data.age !=null ? data.age.toString() : "").toLowerCase().includes(filter) ||
              (data.commercial !=null ? data.commercial : "").toLowerCase().includes(filter) ||
              (data.typeDocument !=null ? data.typeDocument : "").toLowerCase().includes(filter) ||
              (data.chefProjet !=null ? data.chefProjet : "").toLowerCase().includes(filter) ||
              (data.projet !=null ? data.projet : "").toLowerCase().includes(filter) ||
              (data.codeProjet !=null ? data.codeProjet : "").toLowerCase().includes(filter) ||
              (data.chargerRecouvrement !=null ? data.chargerRecouvrement : "").toString().toLowerCase().includes(filter) ||
              (data.codeProjet !=null ? data.codeProjet : "").toLowerCase()
              === filter


          };
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if(this.currentFilter!=null){
            this.applyFilter(this.currentFilter);
          }else{
            this.getStatistics();
          }


          // this.getStatistics();


        },err=>{
          // alert("erreur " + err);
          console.log("error "  +err);
          this.authService.logout();
          this.router.navigateByUrl('/login');
          console.log("error "  +JSON.stringify(err));
        }
      )
    }else{
      this.etatRecouvrementService.getDocuments(cloture).subscribe(
        data=>{
          this.pageDocument = data;

          this.keys = new Array<string>();



          this.keys.push("codeDocument");
          if(this.pageDocument[0] !=null && this.pageDocument[0].detaills !=null ){
            this.pageDocument[0].details.forEach(element => {
              console.log(element.header.label);
              let a :string;
              a = element.header.label;
              this.keys.push(a);

            });
          }

          this.insertIntoDocuments(this.pageDocument);

          this.dataSource =  new MatTableDataSource(this.Documents);

          this.dataSource.filterPredicate = function(data, filter: string): boolean {

            return (data.client !=null ? data.client : "").toLowerCase().includes(filter) ||
              (data.numPiece !=null ? data.numPiece : "").toLowerCase().includes(filter) ||
              (data.age !=null ? data.age.toString() : "").toLowerCase().includes(filter) ||
              (data.commercial !=null ? data.commercial : "").toLowerCase().includes(filter) ||
              (data.typeDocument !=null ? data.typeDocument : "").toLowerCase().includes(filter) ||
              (data.chefProjet !=null ? data.chefProjet : "").toLowerCase().includes(filter) ||
              (data.projet !=null ? data.projet : "").toLowerCase().includes(filter) ||
              (data.codeProjet !=null ? data.codeProjet : "").toLowerCase().includes(filter) ||
              (data.chargerRecouvrement !=null ? data.chargerRecouvrement : "").toString().toLowerCase().includes(filter) ||
              (data.codeProjet !=null ? data.codeProjet : "").toLowerCase()
              === filter


          };
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if(this.currentFilter!=null){
            this.applyFilter(this.currentFilter);
          }else{
            this.getStatistics();
          }

          // this.getStatistics();


        },err=>{
          // alert("erreur " + err);
          console.log("error "  +err);
          this.authService.logout();
          this.router.navigateByUrl('/login');
          console.log("error "  +JSON.stringify(err));
        }
      )
    }




  }

  selectDocument(Document : Document,template: TemplateRef<any>){
    this.currentDocument = Document;
    this.setPage(1);

    this.mode = 1;

    this.filtredData = this.dataSource.filteredData;

    var index = this.getIndexFromFiltrerdList(this.currentDocument.numPiece);
    this.index = index;

    //console.log("this.filtredData  " + JSON.stringify(this.filtredData ));

    // console.log("this.filtredData size  " + this.filtredData.length );
    console.log("current Document " + JSON.stringify(this.currentDocument));

    /*if(this.currentDocument.firstCommentaire != null && this.currentDocument.secondCommentaire != null){
      this.isShowTextComment = false;
    }else{
      this.isShowTextComment = true;
    }*/

    // this.modalRef = this.modalService.show(template,  { class: 'modal-lg'}); { windowClass : "myCustomModalClass"}
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalRef = this.modalService.show(template,this.modalOption );
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.currentFilter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.etatRecouvrementService.getEmployeesByName(filterValue).subscribe(
      (data: Array<Employer>)=>{
        console.log("datalength " + data.length);
        if(data.length == 1){
          console.log("here");
          this.newEmployerId = data[0].sigle;
        }else{
          this.newEmployerId = null;
        }
      },error => {
        console.log("error "+ error);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )

    this.getStatistics();


  }

  /*applyFilter(filter ){
    this.globalFilter = filter;
    this.dataSource.filter = JSON.stringify(this.filteredValues);
  }*/
  /*
    customFilterPredicate() {
      const myFilterPredicate = (data: Document, filter: string): boolean => {
        var globalMatch = !this.globalFilter;

        if (this.globalFilter) {
          // search all text fields
          this.dataSource.filter = filter.trim().toLowerCase();
          //globalMatch = data.commercial.toString().trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1;
        }

        if (!globalMatch) {
          return;
        }

        let searchString = JSON.parse(filter);
        return data.chefDocument.toString().trim().indexOf(searchString.position) !== -1 &&
          data.commercial.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1;
      }
      return myFilterPredicate;
    }*/

  ngOnInit() {



    /* this.commercialFilter.valueChanges.subscribe((commercialFiltreValue) => {
       this.filteredValues['commercial'] = commercialFiltreValue;
       this.dataSource.filter = JSON.stringify(this.filteredValues);
     });

     this.chefDocumentFilter.valueChanges.subscribe((chefDocumentFiltreValue) => {
       this.filteredValues['chefDocument'] = chefDocumentFiltreValue;
       this.dataSource.filter = JSON.stringify(this.filteredValues);
     });

     this.dataSource.filterPredicate = this.customFilterPredicate();*/

    //this function waits for a message from alert service, it gets
    //triggered when we call this from any other component




  }



  doSearch(){
    console.log("this. "+ this.etatRecouvrement.id);
    this.etatRecouvrementService.getDocuments(this.documentCloture).subscribe(
      data=>{
        console.log("data Search " + JSON.stringify(data));
        this.pageDocument = data;
        this.pages = new Array(data["totalPages"]);
        this.totalElement = data["totalElements"];

      },err=>{
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(err));
      });
  }


  gotoPage(page:number){
    console.log("page goto "+ page);
    this.currentPage = page;
    this.doSearch();
  }



  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress.percentage = 0;

    this.currentFileUpload = this.selectedFiles.item(0);
    this.etatRecouvrementService.pushFileToStorage2(this.currentFileUpload).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.refreshDocuments();
        this.getStatistics();
        this.viewUpload = false;
        this.currentFileUpload = null;
      }
    });

    this.selectedFiles = undefined;
  }

  activeUpload(){
   // this.viewUpload = true;
    this.refreshAllDocumentsFromSAP();
  }

  cancelUpload(){
    this.viewUpload = false;
  }

  /*openModal() {
    const modalRef = this.modalService.open(ConsultDocumentComponent);
    modalRef.componentInstance.currentDocument = this.pageDocument[0];

    modalRef.result.then((updatedProject) => {
      if (updatedProject) {
        console.log("updatedProject" +  updatedProject);
      }
    });

  }*/

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  refreshDocuments(){
    if(this.userNameAuthenticated!=null && this.roleReadMyRecouvrement){

      this.getAllDocument(this.documentCloture,this.userNameAuthenticated);
    }else{
        if(this.roleReadAllRecouvrement){
          this.getAllDocument(this.documentCloture,null);
        }

    }

    this.getEtatRecouvrement();
  }


  getNameEmployer(id){
    for(var i=0;i<this.employees.length;i++){
      if(this.employees[i].id == id){
        return this.employees[i].name;

      }
    }
  }

  addComment(){

    if(this.newContentComment.length != 0) {
      let newCommentaire = new Commentaire();

      newCommentaire.date = new Date();
      newCommentaire.user = new User();
      newCommentaire.user.username = this.authService.getUserName();
      console.log("this.authService.getSigle "+ this.authService.getSigle());
      newCommentaire.user.sigle = this.authService.getSigle();
      newCommentaire.content = this.newContentComment;

      if (this.newEmployerId != null ) {
        console.log("this.newEmployerId" + this.newEmployerId)
        newCommentaire.employer = this.newEmployerId;

      }

      if (this.currentDocument.commentaires == null) {
        this.currentDocument.commentaires = new Array<Commentaire>();
      }

      this.currentDocument.commentaires.push(newCommentaire);

      this.currentDocument.commentaires.sort((a, b) => {
        return <any> new Date(b.date) - <any> new Date(a.date);
      });

      console.log(" this.currentDocument.commentaires " + this.currentDocument.commentaires);

      this.currentDocument.updated = true;
      this.setPage(1);
      this.newContentComment = null;
      //this.newEmployerId = null;
      this.newDatePlannifier = null;


    }



  }

  onEditDocument(template: TemplateRef<any>) {

    console.log("this.currentDocument "  + JSON.stringify(this.currentDocument));

    console.log("new Document to send " + JSON.stringify(this.currentDocument));


    if(this.newContentComment != null ){
      console.log("here newContentComment");
      this.addComment();
    }


    this.etatRecouvrementService.updateDocument(this.currentDocument).subscribe((data: Document) => {
      this.currentDocument.updated = false;
      //this.mode = 2;
      this.currentDocument.updated = false;
      //this.refreshDocuments();
      //this.modalRef.hide();
    }, err => {
      this.currentDocument.updated = true;
      console.log(JSON.stringify(err));
      this.returnedError = err.error.message;
      this.authService.logout();
      this.router.navigateByUrl('/login');
      console.log("error "  +JSON.stringify(err));
    });

  }

  getIndexFromFiltrerdList(codeDocument){
    console.log("this.filtredData.size " + this.filtredData.length);
    for(var i=0;i<this.filtredData.length;i++){
      console.log("this.filtredData[i] " + this.filtredData[i].numPiece);
      if(this.filtredData[i].numPiece == codeDocument){
        return i;
        break;
      }
    }
  }

  goToPrecedent(codeDocument,template){

    var index = this.getIndexFromFiltrerdList(codeDocument);

    console.log("index found " + index);
    if(index-1 >=0) {
      var precedIndex = index - 1;

      this.index = precedIndex;
      if (this.currentDocument.updated) {
        //this.showDialog();
        //this.showAnnulationModificationModal(template);
        this.onEditDocument(null);
        //this.suivant = false;
        if (precedIndex != null && precedIndex >= 0 && precedIndex < this.filtredData.length) {
          this.currentDocument = this.filtredData[precedIndex];
          this.setPage(1);
          this.mode = 1;
        }
      }

      if (!this.currentDocument.updated && precedIndex != null && precedIndex >= 0 && precedIndex < this.filtredData.length) {
        this.currentDocument = this.filtredData[precedIndex];
        this.setPage(1);
        this.mode = 1;
      }
    }


  }

  goToSuivant(codeDocument,template){


    var index = this.getIndexFromFiltrerdList(codeDocument);


    var suivantIndex = index + 1;
    console.log("index suivantIndex " + suivantIndex);

    if(this.currentDocument.updated){
      //this.showDialog();
      //this.showAnnulationModificationModal(template);
      this.onEditDocument(null);

      if(suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.filtredData.length){
        console.log("here");
        this.index = suivantIndex;
        this.currentDocument = this.filtredData[suivantIndex];
        this.setPage(1);
        this.mode=1;
      }

      //this.suivant = true;
    }

    if(!this.currentDocument.updated && suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.filtredData.length){
      console.log("here");
      this.index = suivantIndex;
      this.currentDocument = this.filtredData[suivantIndex];
      this.setPage(1);
      this.mode=1;
    }


  }

  deleteCommentaire(commentaire : any){
    console.log("delete comment");

    this.currentDocument.commentaires = this.currentDocument.commentaires.filter(item => item !== commentaire);
    this.currentDocument.updated = true;
    this.setPage(1);

  }

  switchMode(){
    this.mode = 1;
  }


  updated(event){
    console.log("updated");
    this.currentDocument.updated = true;
    this.ref.detectChanges();
  }





  showAnnulationModificationModal(secondModal: TemplateRef<any>) {
    this.nestedModalRef =  this.modalService.show(secondModal, Object.assign({}, {class: 'modal-sm'}));
  }

  annulationModificationDocument(codeDocument,secondModal: TemplateRef<any>){
    this.nestedModalRef.hide();
    this.currentDocument.updated = false;
    if(this.suivant){
      console.log("here");
      this.goToSuivant(codeDocument,secondModal);
    }else{
      this.goToPrecedent(codeDocument,secondModal);
    }



  }

  annulation(){
    this.nestedModalRef.hide();
  }

  showAnnulationCancelModal(thirdModal: TemplateRef<any>) {
    this.nested2ModalRef =  this.modalService.show(thirdModal, Object.assign({}, {class: 'modal-sm'}));
  }

  checkCanceled(thirdModal: TemplateRef<any>){

    if(this.currentDocument.updated){
      this.onEditDocument(null);
      this.modalRef.hide();
    }else{
      this.modalRef.hide();
    }

    /*if(this.currentDocument.updated){
      this.showAnnulationCancelModal(thirdModal);
    }else{
      this.modalRef.hide();
    }*/
  }

  annulation2(){
    this.nested2ModalRef.hide();
  }

  ignore2(){
    this.nested2ModalRef.hide();
    this.modalRef.hide();
  }

  addMonths(date, months) {
    date.setMonth(date.getMonth() + months);
    return date;
  }




  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert( 'Please disable your Pop-up blocker and try again.');
    }
  }


  composeEmail(currentDocument : Document) {

    console.log("compose Email");

    var numPiece = currentDocument.numPiece;

    var nomProjet = currentDocument.projet;


    var email = "mailto:?subject=" + currentDocument.client + " / " + numPiece + " / " + this.removeAnd(nomProjet) + "&body= Bonjour,%0A" + "Type document: " + currentDocument.typeDocument + "%0A" +
      "Chef projet: " + (currentDocument.chefProjet  == null ? "": currentDocument.chefProjet ) + "%0A" +
      "Commercial: " + (currentDocument.commercial  == null ? "": currentDocument.commercial )  + "%0A" +
      "Ref client: " +   (currentDocument.refClient  == null ? "": currentDocument.refClient )  + "%0A" +

      "Montant Pi%C3%A9ce: " +  (currentDocument.montantPiece  == null ? "": currentDocument.montantPiece+" DH" )  + "%0A" +
      "Montant ouvert: " +   (currentDocument.montantOuvert  == null ? "": currentDocument.montantOuvert +" DH" )  + " DH" + "%0A" +
      "Charg%C3%A9 recouvrement: " +  (currentDocument.chargerRecouvrement  == null ? "": currentDocument.chargerRecouvrement )  + "%0A" +

      "Age Pi%C3%A9ce:" +   (currentDocument.agePiece  == null ? "": currentDocument.agePiece ) + "%0A" +
      "Montant pay%C3%A9: " +  (currentDocument.montantPayer  == null ? "": currentDocument.montantPayer + " DH" )  + "%0A" +
      "Condition de paiement: " +  (currentDocument.conditionDePaiement  == null ? "": currentDocument.conditionDePaiement )  + "%0A";
    if (this.currentDocument.caution != null) {
      email = email + "Caution: " +   (currentDocument.caution  == null ? "": currentDocument.caution )  + "%0A" +
        "N°caution: " +   (currentDocument.numCaution  == null ? "": currentDocument.numCaution )  + "%0A" +
        "Type caution: " +  (currentDocument.typeCaution  == null ? "": currentDocument.typeCaution )  + "%0A" +
        "Montant caution: " +  (currentDocument.montantCaution  == null ? "": currentDocument.montantCaution + " DH" )   + "%0A" +
        "Date lib%C3%A9ration caution: " +  (currentDocument.dateLiberationCaution  == null ? "": moment(currentDocument.dateLiberationCaution).format('DD/MM/YYYY') )   + "%0A";
    }


      if(currentDocument.commentaires!=null){

        let lastCommentaire1 = new Commentaire();
        lastCommentaire1= currentDocument.commentaires[0];
        if(lastCommentaire1)
          email = email +"Commentaires : %0A"+ moment(lastCommentaire1.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire1.user.sigle == null ? " : ": lastCommentaire1.user.sigle)+" " +(lastCommentaire1.employer == null ? "": +"  @"+lastCommentaire1.employer) + " "+lastCommentaire1.content+"%0A";
        let lastCommentaire2 = new Commentaire();
        lastCommentaire2= currentDocument.commentaires[1];
        if(lastCommentaire2)
          email = email + moment(lastCommentaire2.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire2.user.sigle == null ? " : ": lastCommentaire2.user.sigle)+" " +(lastCommentaire1.employer == null ? "": +"  @"+lastCommentaire1.employer) + " "+lastCommentaire2.content+"%0A";
        let lastCommentaire3 = new Commentaire();
        lastCommentaire3= currentDocument.commentaires[2];
        if(lastCommentaire3)
          email = email + moment(lastCommentaire3.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire3.user.sigle == null ? " : ": lastCommentaire3.user.sigle)+" " +(lastCommentaire1.employer == null ? "": +"  @"+lastCommentaire1.employer) + " "+lastCommentaire3.content+"%0A";
      }
    window.location.href = email;


  }

  removeAnd(str : string){
    return str.replace("&","et");
  }


  getDocumentCloture(){
    this.documentCloture = true;
    this.getAllDocument(true,this.selectedChargeRecouvrement);
  }

  getDocumentOuvert(){
    this.documentCloture = false;
    this.getAllDocument(false,this.selectedChargeRecouvrement);
  }

  getDocumentsByCommercialOrChefProjet(cloturer:boolean,commercialOrChefProjet : string){
    this.etatRecouvrementService.getDocumentsByCommercialOrChefProjet (cloturer,commercialOrChefProjet).subscribe(
      data=>{
        this.pageDocument = data;

        this.keys = new Array<string>();
        this.keys.push("codeDocument");
        if(this.pageDocument[0] !=null && this.pageDocument[0].detaills !=null ){
          this.pageDocument[0].details.forEach(element => {
            console.log(element.header.label);
            let a :string;
            a = element.header.label;
            this.keys.push(a);

          });
        }



        this.insertIntoDocuments(this.pageDocument);

        this.dataSource =  new MatTableDataSource(this.Documents);

        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return data.client.toLowerCase().includes(filter) ||
            data.numPiece.toLowerCase().includes(filter) ||
            data.age.toString().toLowerCase().includes(filter) ||
            data.chefProjet.toLowerCase().includes(filter) ||
            data.commercial.toLowerCase().includes(filter) ||
            data.chargerRecouvrement.toLowerCase()
            === filter ;
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if(this.currentFilter!=null){
          this.applyFilter(this.currentFilter);
        }else{
          this.getStatistics();
        }


      },err=>{
        // alert("erreur " + err);
        console.log("error "  +err);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(err));
      }
    )
  }

  getDocumentsByCommercial(cloturer:boolean,codeCommercial : string){
    this.etatRecouvrementService.getDocumentsByCommercial(cloturer,codeCommercial).subscribe(
      data=>{
        this.pageDocument = data;

        this.keys = new Array<string>();
        this.keys.push("codeDocument");
        if(this.pageDocument[0] !=null && this.pageDocument[0].detaills !=null ){
          this.pageDocument[0].details.forEach(element => {
            console.log(element.header.label);
            let a :string;
            a = element.header.label;
            this.keys.push(a);

          });
        }



        this.insertIntoDocuments(this.pageDocument);

        this.dataSource =  new MatTableDataSource(this.Documents);

        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return data.client.toLowerCase().includes(filter) ||
            data.numPiece.toLowerCase().includes(filter) ||
            data.age.toString().toLowerCase().includes(filter) ||
            data.chefProjet.toLowerCase().includes(filter) ||
            data.commercial.toLowerCase().includes(filter) ||
            data.chargerRecouvrement.toLowerCase()
            === filter ;
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if(this.currentFilter!=null){
          this.applyFilter(this.currentFilter);
        }else{
          this.getStatistics();
        }


      },err=>{
        // alert("erreur " + err);
        console.log("error "  +err);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(err));
      }
    )
  }

  getDocumentsByCodeProjet(cloturer:boolean,codeProjet : string){
    this.etatRecouvrementService.getDocumentsByCodeProjet(cloturer,codeProjet).subscribe(
      data=>{
        this.pageDocument = data;

        this.keys = new Array<string>();
        this.keys.push("codeDocument");
        if(this.pageDocument[0] !=null && this.pageDocument[0].detaills !=null ){
          this.pageDocument[0].details.forEach(element => {
            console.log(element.header.label);
            let a :string;
            a = element.header.label;
            this.keys.push(a);

          });
        }

        this.insertIntoDocuments(this.pageDocument);

        this.dataSource =  new MatTableDataSource(this.Documents);

        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return data.client.toLowerCase().includes(filter) ||
            data.numPiece.toLowerCase().includes(filter) ||
            data.age.toString().toLowerCase().includes(filter) ||
            data.chefProjet.toLowerCase().includes(filter) ||
            data.commercial.toLowerCase().includes(filter) ||
            data.chargerRecouvrement.toLowerCase()
            === filter ;
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if(this.currentFilter!=null){
          this.applyFilter(this.currentFilter);
        }else{
          this.getStatistics();
        }


      },err=>{
        // alert("erreur " + err);
        console.log("error "  +err);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(err));
      }
    )
  }

  getDocumentsByChefProjet(cloturer:boolean,codeChefProjet : string){
    this.etatRecouvrementService.getDocumentsByChefProjet(cloturer,codeChefProjet).subscribe(
      data=>{
        this.pageDocument = data;

        this.keys = new Array<string>();
        this.keys.push("codeDocument");
        if(this.pageDocument[0] !=null && this.pageDocument[0].detaills !=null ){
          this.pageDocument[0].details.forEach(element => {
            console.log(element.header.label);
            let a :string;
            a = element.header.label;
            this.keys.push(a);

          });
        }

        this.insertIntoDocuments(this.pageDocument);

        this.dataSource =  new MatTableDataSource(this.Documents);

        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return data.client.toLowerCase().includes(filter) ||
            data.numPiece.toLowerCase().includes(filter) ||
            data.age.toString().toLowerCase().includes(filter) ||
            data.chefProjet.toLowerCase().includes(filter) ||
            data.commercial.toLowerCase().includes(filter) ||
            data.chargerRecouvrement.toLowerCase()
            === filter ;
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if(this.currentFilter!=null){
          this.applyFilter(this.currentFilter);
        }else{
          this.getStatistics();
        }


      },err=>{
        // alert("erreur " + err);
        console.log("error "  +err);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(err));
      }
    )
  }


  getDocumentsByClient(cloturer:boolean,codeClient : string){
    this.etatRecouvrementService.getDocumentsByClient(cloturer,codeClient).subscribe(
      data=>{
        this.pageDocument = data;

        this.keys = new Array<string>();
        this.keys.push("codeDocument");
        if(this.pageDocument[0] !=null && this.pageDocument[0].detaills !=null ){
          this.pageDocument[0].details.forEach(element => {
            console.log(element.header.label);
            let a :string;
            a = element.header.label;
            this.keys.push(a);

          });
        }
        this.insertIntoDocuments(this.pageDocument);

        this.dataSource =  new MatTableDataSource(this.Documents);

        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return data.client.toLowerCase().includes(filter) ||
            data.numPiece.toLowerCase().includes(filter) ||
            data.age.toString().toLowerCase().includes(filter) ||
            data.chefProjet.toLowerCase().includes(filter) ||
            data.commercial.toLowerCase().includes(filter) ||
            data.chargerRecouvrement.toLowerCase()
            === filter ;
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if(this.currentFilter!=null){
          this.applyFilter(this.currentFilter);
        }else{
          this.getStatistics();
        }
        // this.getStatistics();


      },err=>{
        // alert("erreur " + err);
        console.log("error "  +err);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(err));
      }
    )
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  refreshAllDocumentsFromSAP(){
    console.log("refreshDocs");
    this.spinner.show();
    this.etatRecouvrementService.refreshDocuments().subscribe(
      data=>{

        this.refreshDocuments();
        this.spinner.hide();
        console.log("data "+ data);
      },
      err=>{
        console.log("error "+ JSON.stringify(err));
        this.refreshDocuments();
        this.spinner.hide();
      }
    )
    //this.spinner.hide();
  }


  onSelectedChargeRecouv(){
    if(this.selectedChargeRecouvrement == "none"){
      this.getAllDocument(this.documentCloture,null);
    }else{
      this.getAllDocument(this.documentCloture,this.selectedChargeRecouvrement);
    }

}

  getStatistics() {
    this.filtredData = this.dataSource.filteredData;
    let totalLowerThan3month = 0;
    let totalLowerThan6month = 0;
    let totalAfter6month = 0;
    let totalAfter12month = 0;
    let total = 0;
    let totalFacture =0;
    let totalRetenuGarantie=0;
    let totalRetenuGarantieIssue=0;




    this.filtredData.forEach(element => {

      if(element.typeDocument == 'Facture'){
        totalFacture = totalFacture + element.montantOuvert;
      }



      if (element.age === '3M') {
        totalLowerThan3month = totalLowerThan3month + element.montantOuvert;
      }

      if (element.age === '6M') {
        totalLowerThan6month = totalLowerThan6month + element.montantOuvert;

      }


      if (element.age === 'A12M') {
        totalAfter6month = totalAfter6month + element.montantOuvert;
      }

      if (element.age == 'Sup. 12M') {
        totalAfter12month = totalAfter12month + element.montantOuvert;
      }

      if(element.retenuGarantieIssue!=null && element.retenuGarantieIssue>=0){
        totalRetenuGarantieIssue = totalRetenuGarantieIssue + element.montantOuvert;
      }

      if(element.statut=='Retenu Garantie'){
        totalRetenuGarantie = totalRetenuGarantie + element.montantOuvert;
      }

      total =  total + element.montantOuvert;

    });



    this.statistics = new Statitics();
    this.statistics.totalLowerThan3month = totalLowerThan3month
    this.statistics.totalLowerThan6month = totalLowerThan6month;
    this.statistics.totalAfter6month = totalAfter6month;
    this.statistics.totalAfter12month = totalAfter12month;
    this.statistics.total = total;
    this.statistics.totalRetenueGarantieIssue = totalRetenuGarantieIssue;
    this.statistics.totalFacture = totalFacture;
    this.statistics.totalRetenuGarantie=totalRetenuGarantie;
  }


  exportEtatDocument($event) {
    $event.stopPropagation();
    $event.preventDefault();

    console.log("filtre "+ this.dataSource.filter);
    var result= this.etatRecouvrementService.exportEtatDocument(this.filtredData);

    var d = new Date();

    console.log("day " + d.getDay());
    var fileName = "EtatRecouvrement-"+moment(new Date()).format("DD-MM-YYYY")+"-"+d.getHours()+"-"+d.getMinutes()+".xlsx";

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

  checkIFMorethanFifthMinuteAgo(dateComment){
    let dateCom = moment(dateComment).add(15, 'minutes');

    return moment().isAfter(dateCom);
  }


  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    let template:any;

    if (event.keyCode === this.RIGHT_ARROW) {
      console.log("right");
      this.goToSuivant(this.currentDocument.numPiece,template);
    }

    if (event.keyCode === this.LEFT_ARROW) {
      this.goToPrecedent(this.currentDocument.numPiece,template);
    }
  }







}
