import {
  ChangeDetectorRef, Component, HostListener, OnInit, TemplateRef, ViewChild,
  ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../services/authentification.service";
import {CurrencyPipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {PagerService} from "../services/pager.service";
import {ContratService} from "../services/contrat.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Contrat} from "../../model/model.contrat";
import {StatiticsContrat} from "../../model/model.statisticsContrat";
import {MatPaginator, MatSort, MatTableDataSource, PageEvent} from "@angular/material";
import {CommandeFournisseur} from "../../model/model.commandeFournisseur";
import {FactureEcheance} from "../../model/model.factureEcheance";
import {Echeance} from "../../model/model.echeance";
import {Piece} from "../../model/model.piece";
import {Commentaire} from "../../model/model.commentaire";
import {NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import {User} from "../../model/model.user";
import {ShareBlockedKeyService} from "../services/shareBlockedKey.service";

@Component({
  selector: 'app-contrats',
  templateUrl: './contrats.component.html',
  styleUrls: ['./contrats.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContratsComponent implements OnInit {
  titre;

  displayedColumns: string[] = ['option', 'numMarche','nomPartenaire', 'description','pilote', 'sousTraiter',  'periodeFacturationLabel','montantContrat', 'montantFactureAn', 'montantRestFactureAn','bu','nbEcheancesNonFactureEnRetard'];
  public dataSource: MatTableDataSource<Contrat>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('pagination', {static: true}) paginator: MatPaginator;
  lastUpdate : any;
  pageContrat: any;
  contrats: Array<Contrat>;
  filtredData: Array<Contrat>;

  currentPage : number;

  currentContrat: Contrat;

  numMarches : Array<string>;
  clients : Array<string>;
  pilotes : Array<string> ;
  bus : Array<string>;

  selectedClient:any = null;
  selectedNumMarche:any=null;
  selectedPilote:any=null;
  selectedSousTraiter:any=null;
  selectedBu:any=null;
  selectedDateFinContrat:any=null;
  mc:any=null;

  statistics : StatiticsContrat;

  lengthContrats:number;
  pageSizeContrats:number;
  pageSizeOptionsContrats:number[] = [10, 15,25,30];
  currentPageContrats : number;
  totalPagesContrats:number;
  offsetContrats:number;
  numberOfElementsContrats:number;

  lengthCommentaire : number;
  totalPagesCommentaires:number;
  numberOfElementsCommentaire:number;
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  newContentComment: string;
  newDatePlannifier: Date;
  newEmployerId: any;

  mode: number;

  modalRef: BsModalRef;

  nestedModalRef: BsModalRef;

  suivant: boolean;

  index: any;

  modalOption: NgbModalOptions = {};

  currentFilter: string;

  userNameAuthenticated: string;

  sigleUserAuthenticated: string;

  service: string;

  userInSession: string;

  roleReadAllContrats : boolean;
  roleReadMyContrats:boolean;


  RIGHT_ARROW = 39;
  LEFT_ARROW = 37;


  nested2ModalRef : BsModalRef;


  authorized : boolean;

  currentAllEcheances : Array<Echeance>;

  sortBy:any=null;

  sortType:any=null;

  subscription :any;
  constructor(private shareBlockedkey : ShareBlockedKeyService,private activatedRoute:ActivatedRoute ,private authService: AuthenticationService, private currency: CurrencyPipe, private spinner: NgxSpinnerService, private pagerService: PagerService, private contratService: ContratService, private router: Router, private modalService: BsModalService, viewContainerRef: ViewContainerRef, private ref: ChangeDetectorRef) {

    this.subscription = this.shareBlockedkey.getBlockedKey()
      .subscribe((blockedKey : boolean) =>{
        console.log(" blockedKeyReceive "+ blockedKey);
       this.blockedKey1 =blockedKey;


      } )

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.currentPage=1;
    this.pageSizeContrats = 10;
    //this.getAllContrats();
    this.service = this.authService.getServName();
    this.authorized = false;
    this.userInSession = this.authService.getLastName();


    this.authService.getRoles().forEach(authority => {

      if (authority == 'READ_ALL_CONTRATS') {
        this.roleReadAllContrats = true;
        this.authorized = true;

      }
      if (authority == 'READ_MY_CONTRATS') {
        this.roleReadMyContrats = true;
        this.authorized = true;
        if (this.authService.getLastName() != null) {
          this.userNameAuthenticated = this.authService.getLastName();
          this.selectedPilote = this.userNameAuthenticated;
        } else {
          this.userNameAuthenticated = "undefined";
        }

      }
    });

    //console.log("this.authorize " + this.authorized);

    this.sigleUserAuthenticated = this.authService.getSigle();

    const codeProjet = this.activatedRoute.snapshot.params['codeProjet'];
    if(codeProjet!=null){


    }else{
      if(this.authorized){
        this.getContratByFilter();

      }

    }


    this.getStatistics();
    this.getAllClients();
    this.getAllMarches();
    this.getAllPilotes();
  }

  getAllContrats( ) {


    this.contratService.getAllContrat(this.currentPage,this.pageSizeContrats).subscribe(
      (data:any) => {

        this.addContrats(data);
        this.lengthContrats = data.totalElements;
        this.currentPageContrats = data.pageable.pageNumber;
        this.totalPagesContrats = data.totalPages;
        this.offsetContrats = data.pageable.offset;

        if (this.mc != null)
          this.applyFilter(this.mc);




      }, err => {
        // alert("erreur " + err);
        console.log("error " + JSON.stringify(err));
      }
    )

    //this.getStatistics();

  }

  onPaginateChangeContrats(event) {
    console.log("onPaginateChance ");
    this.currentPage = event.pageIndex+1;
    this.pageSizeContrats = event.pageSize;
    this.getContratByFilter();
  }

  addContrats(data : any){
    this.pageContrat = data.content;

    if (this.pageContrat != null) {
      this.contrats = new Array<Contrat>();
      this.pageContrat.forEach(contrat => {
        let p = new Contrat();
        this.lastUpdate=contrat.lastUpdate;
        p.numContrat =contrat.numContrat;
        p.pilote=contrat.pilote;
        p.nomPartenaire = contrat.nomPartenaire;
        p.nbEcheancesNonFactureEnRetard=contrat.nbEcheancesNonFactureEnRetard;
        p.bu=contrat.bu;
        p.reconductionTacite=contrat.reconductionTacite;

        switch (contrat.occurenceFacturationLabel){
          case"LE 01":p.occurenceFacturationLabel ="Début de période (Le 01)";break;
          case"LE 31":p.occurenceFacturationLabel ="Fin de période (Le 31)";break;
          default :p.occurenceFacturationLabel="Période non défini!";
        }


        p.periodeFacturationLabel=contrat.periodeFacturationLabel;
        p.sousTraiter = contrat.sousTraiter;
        p.montantAnnuel = contrat.montantAnnuel;
        p.occurenceFacturation = contrat.occurenceFacturation;
        p.montantFactureAn = contrat.montantFactureAn;
        if(contrat.montantContrat-contrat.montantFactureAn>0){
          p.montantRestFactureAn = contrat.montantContrat-contrat.montantFactureAn;
        }else{
          p.montantRestFactureAn = 0;
        }
        p.montantProvisionFactureInfAnneeEnCours = contrat.montantProvisionFactureInfAnneeEnCours;
        p.montantProvisionAFactureInfAnneeEnCours = contrat.montantProvisionAFactureInfAnneeEnCours;

        p.codePartenaire = contrat.codePartenaire;
        p.statut =contrat.statut;
        p.du = contrat.du;
        p.au = contrat.au;
        p.description = contrat.description;
        p.nomSousTraitant = contrat.nomSousTraitant;
        p.contratSigne= contrat.contratSigne == null ? false : contrat.contratSigne;
        p.codeProjet=contrat.codeProjet;
        p.numMarche=contrat.numMarche;
        p.pilote=contrat.pilote;
        p.montantContrat=contrat.montantContrat;
        p.periodeFacturation=contrat.periodeFacturation;
        p.montantValueSi=contrat.montantValueSi;
        p.montantValueRs=contrat.montantValueRs;
        p.montantValueSw=contrat.montantValueSw;
        p.montantVolume=contrat.montantVolume;
        p.montantCablage=contrat.montantCablage;
        p.montantAssitanceAn=contrat.montantAssitanceAn;

        if (contrat.commentaires != null && contrat.commentaires.length > 0) {
          p.commentaires = contrat.commentaires;
        }

        this.contrats.push(p);


      });
    }

    this.filtredData=this.contrats;

    this.dataSource = new MatTableDataSource(this.contrats);
    this.ref.detectChanges();

  }

  getStatistics(){

    var selectedDateFinContrat1=null;

    if(this.selectedDateFinContrat!=null){
      selectedDateFinContrat1= moment(this.selectedDateFinContrat).format("DD/MM/YYYY");
    }

    this.contratService.getStatisticsContrat(this.mc,this.selectedNumMarche,this.selectedClient,this.selectedPilote,this.selectedSousTraiter,this.selectedBu,selectedDateFinContrat1).subscribe(
      (data : StatiticsContrat)=>{

        this.statistics = data;

      },err=>{

        console.log("error "  +JSON.stringify(err));
      });
  }





  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.mc = filterValue.trim();
    //this.dataSource.filter = filterValue;
    this.getContratByFilter();
    this.getStatistics();


  }

  getContratByFilter(){

    var selectedDateFinContrat1=null;
    if(this.selectedDateFinContrat!=null){
      selectedDateFinContrat1= moment(this.selectedDateFinContrat).format("DD/MM/YYYY");
    }
    this.contratService.contratsFilter2(this.currentPage,this.pageSizeContrats,this.mc,
      this.selectedNumMarche,this.selectedClient,this.selectedPilote,this.selectedSousTraiter,this.selectedBu,selectedDateFinContrat1,this.sortBy,this.sortType).subscribe(
      (data:any)=>{

        this.addContrats(data);
        this.lengthContrats = data.totalElements;
        console.log("this.lengh " + this.lengthContrats);
        this.currentPage = data.pageable.pageNumber+1;
        this.currentPageContrats = data.pageable.pageNumber;
        this.totalPagesContrats = data.totalPages;
        this.offsetContrats = data.pageable.offset;


      },err=>{
        console.log("erreur " + err);
      });
  }

  getContratByFilter0(){
    this.dataSource =null;
    this.contrats=null;

    var selectedDateFinContrat1=null;

    if(this.selectedDateFinContrat!=null){
      selectedDateFinContrat1= moment(this.selectedDateFinContrat).format("DD/MM/YYYY");
    }

    this.contratService.contratsFilter2(1,this.pageSizeContrats,this.mc,
      this.selectedNumMarche,this.selectedClient,this.selectedPilote,this.selectedSousTraiter,this.selectedBu,selectedDateFinContrat1,this.sortBy,this.sortType).subscribe(
      (data:any)=>{

        this.addContrats(data);
        this.lengthContrats = data.totalElements;
        console.log("this.lengh " + this.lengthContrats);
        this.currentPage = data.pageable.pageNumber+1;
        this.currentPageContrats = data.pageable.pageNumber;
        this.totalPagesContrats = data.totalPages;
        this.offsetContrats = data.pageable.offset;


      },err=>{
        console.log("erreur " + err);
      });
  }


  getContratByFilterSelectFirstElement(selectFirst:boolean){
    this.contratService.contratsFilter2(this.currentPage,this.pageSizeContrats,this.mc,this.selectedNumMarche,this.selectedClient,this.selectedPilote,this.selectedSousTraiter,this.selectedBu,moment(this.selectedDateFinContrat).format("DD/MM/YYYY"),this.sortBy,this.sortType).subscribe(
      (data:any)=>{

        this.addContrats(data);
        this.lengthContrats = data.totalElements;
        console.log("this.lengh " + this.lengthContrats);
        this.currentPage = data.pageable.pageNumber+1;
        console.log("this.currentPage" + this.currentPage);
        this.currentPageContrats = data.pageable.pageNumber;
        this.totalPagesContrats = data.totalPages;
        this.offsetContrats = data.pageable.offset;
        this.numberOfElementsContrats = data.numberOfElements;
        if(selectFirst){
          this.currentContrat = this.filtredData[0];

          this.index =  this.offsetContrats;
        }else{
          this.currentContrat = this.filtredData[this.filtredData.length-1];
          this.index =  (this.offsetContrats+this.numberOfElementsContrats)-1;
        }
        this.buildTitleContrat();
        this.setPage(1);

        this.ref.detectChanges();

       // console.log("this.offsetContrats " + this.offsetContrats);

      },err=>{
        console.log("erreur " + err);
      });
  }

  getAllPilotes(){
    this.contratService.getPilotes().subscribe(
      (data : Array<string>)=>{
        this.pilotes = data;
      },err=>{
        console.log("erreur "+err);
      });
  }

  getAllBus(){
    this.contratService.getAllBus().subscribe(
      (data: Array<string>)=>{
        this.bus = data;
      },err=>{
        console.log("erreur "+err);
      });
  }

  getAllClients(){
    this.contratService.getAllClients().subscribe(
      (data: Array<string>)=>{
        this.clients = data;
      },err=>{
        console.log("erreur "+err);
      });
  }

  getAllMarches(){
    this.contratService.getAllNumMarches().subscribe(
      (data: Array<string>)=>{
        this.numMarches = data;
      },err=>{
        console.log("erreur "+err);
      });
  }

  initFilter(){
    this.selectedClient = null;
    this.selectedNumMarche=null;
    this.selectedPilote=null;
    this.selectedSousTraiter=null;
    this.dataSource.filter = null;
    this.selectedBu=null;
    this.selectedDateFinContrat=null;
    this.mc=null;
    this.getContratByFilter0();
  }


  selectContrat(contrat : Contrat,template: TemplateRef<any>){
    this.currentContrat = contrat;

    this.buildTitleContrat();

    this.setPage(1);
    var index = this.getIndexFromFiltrerdList(this.currentContrat.numContrat);
    console.log("this.offsetContrats " +this.offsetContrats);
    this.index = index+this.offsetContrats;
    console.log("this.index " +this.index);

    // this.modalRef = this.modalService.show(template,  { class: 'modal-lg'}); { windowClass : "myCustomModalClass"}
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalRef = this.modalService.show(template,this.modalOption );
    this.ref.detectChanges();

    //this.loadAllEcheance(this.currentContrat.numContrat);

  }

  errorUpdate:boolean;
  onEditContrat(template: TemplateRef<any>) {


  }

  setPage(page: number) {

    console.log("page " + page);

    if(page>0){
      this.contratService.getCommentairesContrat(this.currentContrat.numContrat,page,5).subscribe(
        (data : any)=>{
          this.currentContrat.commentaires = data.content;
          this.lengthCommentaire= data.totalElements;
          this.totalPagesCommentaires = data.totalPages;
          this.currentContrat.commentaires = data.content;
          this.numberOfElementsCommentaire=data.numberOfElements;

          if(this.lengthCommentaire==0) {
            console.log("null pager ");
            this.pager = null;
            this.pagedItems = null;
            return;
          }else{
            console.log("lengthCommentaire " + this.lengthCommentaire );
            this.pager = this.pagerService.getPager(this.lengthCommentaire, page,5);

            if (page < 1 || page > this.pager.totalPages  ) {
              return;
            }
            this.pagedItems = this.currentContrat.commentaires;

          }


        },err=>{

          console.log("error "  +JSON.stringify(err));
        })
    }









  }


  addComment(){

    if(this.newContentComment.length != 0) {
      let newCommentaire = new Commentaire();

      newCommentaire.date = new Date();
      // newCommentaire.user.username = "test";
      newCommentaire.content = this.newContentComment.split("\n").join("<br>");
      newCommentaire.user = new User();
      newCommentaire.user.username = this.authService.getUserName();
      //console.log("this.authService.getSigle "+ this.authService.getSigle());
      newCommentaire.user.sigle = this.authService.getSigle();



      if (this.newEmployerId != null ) {
        //console.log("this.newEmployerId" + this.newEmployerId)
        newCommentaire.employer = this.newEmployerId;

      }


      let userUpdate = new User();
      userUpdate.username = this.authService.getUserName();
      //this.currentContrat.updatedBy = userUpdate;

      this.contratService.addCommentaire(this.currentContrat.numContrat,newCommentaire).subscribe((data: Contrat) => {
        this.currentContrat.updated = false;
        this.setPage(1);
        //this.mode = 2;
        this.errorUpdate=false;

      }, err => {
        this.currentContrat.updated = true;
        this.errorUpdate=true;

      });

      this.currentContrat.updated = true;

      this.newContentComment = null;
      //this.newEmployerId = null;
      this.newDatePlannifier = null;


    }
  }


  @HostListener('matSortChange', ['$event'])
  sortChange(e) {
    // save cookie with table sort data here
    console.log("sort " + JSON.stringify(e));
    if(e.direction==""){
      this.sortBy=null;
      this.sortType=null;
    }else{
      this.sortBy=e.active;
      this.sortType=e.direction;
    }

    this.getContratByFilter();





  }


  goToPrecedent(id,template){

    if(!this.errorUpdate){

      var index = this.getIndexFromFiltrerdList(id);

      console.log("index " + index);

      var previousIndex = index-1;

      console.log("previousIndex " + previousIndex);
      //console.log("index found " + index);
      if(previousIndex >=0) {
        var precedIndex = (index +this.offsetContrats)-1;
        console.log("precedIndex " + precedIndex);

        if (this.currentContrat.updated) {
          //this.showDialog();
          //this.showAnnulationModificationModal(template);
          this.onEditContrat(null);
        }
        //this.suivant = false;
        if (precedIndex != null && precedIndex >= 0 && precedIndex < this.lengthContrats) {
          this.index = precedIndex;
          this.currentContrat = this.filtredData[previousIndex];
          this.buildTitleContrat();
          this.setPage(1);
          this.mode = 1;
        }
      } else{
        console.log("curenapget pag ego to predcede "+this.currentPage);

        this.currentPage = this.currentPage-1;
        if(this.currentPage>0){
          this.getContratByFilterSelectFirstElement(false);
          // this.setPage(1);

          console.log("new index " + this.index);
        }


      }
    }
  }





  goToSuivant(id,template){

    if(!this.errorUpdate){

      var index = this.getIndexFromFiltrerdList(id);
      var nextIndex = index+1;
      console.log("index principal " + index);
      var suivantIndex = index+(this.offsetContrats) + 1;
      console.log("suivant index " + suivantIndex);

      if(this.currentContrat.updated){
        //this.showDialog();
        //this.showAnnulationModificationModal(template);
        this.onEditContrat(null);

      }
      var nextPage = this.currentPage+1;
      if(suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.lengthContrats){
        console.log("index+1 " + nextIndex);
        console.log("index " + this.pageSizeContrats );
        if(nextIndex>=this.pageSizeContrats && nextPage<=this.totalPagesContrats){
          console.log("here current page "+this.currentPage);
          this.currentPage = nextPage;
          this.getContratByFilterSelectFirstElement(true);
          //
          this.index = suivantIndex;
        }else{
          console.log("his");
          this.index = suivantIndex;
          this.currentContrat = this.filtredData[nextIndex];
          this.buildTitleContrat();
          //this.setPage(1);
          this.mode=1;
        }
        this.setPage(1);

      }

    }


  }





  annulation(){
    this.nestedModalRef.hide();
  }



  removeAnd(str : string){
    if(str!=null){

      str.replace("&","et");
    }
    return str;
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  checkCanceled(thirdModal: TemplateRef<any>){

    if(this.currentContrat.updated){
      this.onEditContrat(null);
      this.modalRef.hide();
    }else{
      this.modalRef.hide();
    }

    /*if(this.currentProjet.updated){
      this.showAnnulationCancelModal(thirdModal);
    }else{
      this.modalRef.hide();
    }*/
  }

  getIndexFromFiltrerdList(id){
    //console.log("this.filtredData.size " + this.filtredData.length);
    for(var i=0;i<this.filtredData.length;i++){
      //console.log("this.filtredData[i] " + this.filtredData[i].numContrat);
      if(this.filtredData[i].numContrat == id){
        return i;
        break;
      }
    }
  }

  refreshContrats(){
    this.spinner.show();
    this.contratService.refreshContrats().subscribe(
      data=>{

        this.getAllContrats();
        this.spinner.hide();
        //console.log("data "+ data);
      },
      err=>{
        //console.log("error "+ JSON.stringify(err));
        this.getAllContrats();
        this.spinner.hide();
      }
    )
  }

  exportContrats($event){
    $event.stopPropagation();
    $event.preventDefault();

    //console.log("filtre "+ this.dataSource.filter);
    var result= this.contratService.exportContrats(this.mc,
      this.selectedNumMarche,this.selectedClient,this.selectedPilote,this.selectedSousTraiter);

    var d = new Date();

    //console.log("day " + d.getDay());
    var fileName = "Contrats-"+moment(new Date()).format("DD-MM-YYYY")+"-"+d.getHours()+"-"+d.getMinutes()+".xlsx";

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

  composeEmail(contrat : Contrat){

    //console.log("compose Email");
    var email="mailto:?subject="+this.removeAnd(contrat.nomPartenaire)+""+(contrat.numMarche  == null ? "":"/"+this.removeAnd(contrat.numMarche.toString()))+""+(contrat.numContrat  == null ? "":"/"+this.removeAnd(contrat.numContrat.toString()) )+ "&body= Bonjour,%0A"
      +"Ce message concerne le contrat cité en objet et dont le détail est ci-après :%0A"
      + "Marché: "+(contrat.numMarche  == null ? "": contrat.numMarche ) +"%0A"+
      "Description: "+ (contrat.description  == null ? "": contrat.description ) +"%0A"+
      "Code Projet: "+ (contrat.codeProjet  == null ? "": contrat.codeProjet ) +"%0A"+
      "Pilote: "+ (contrat.pilote  == null ? "": contrat.pilote ) +"%0A"+
      "Montant Contrat: "+ (contrat.montantContrat  == null ? "": contrat.montantContrat +" DH")  +"%0A"+
      "Occurence de facturation: "+ (contrat.occurenceFacturationLabel  == null ? "": contrat.occurenceFacturationLabel )+"%0A";


    if(contrat.commentaires!=null){

      let lastCommentaire1 = new Commentaire();
      lastCommentaire1= contrat.commentaires[0];
      if(lastCommentaire1){
        email = email+ "%0A";
        email = email + "Je vous prie de consulter les commentaires en bas et d’agir en conséquence."+"%0A";
        email = email + "%0A";
        email = email +"Commentaires : %0A"+ moment(lastCommentaire1.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire1.user.sigle == null ? "": lastCommentaire1.user.sigle)+" : " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire1.content).split("<br>").join("%0A")+"%0A";
      }
      let lastCommentaire2 = new Commentaire();
      lastCommentaire2= contrat.commentaires[1];
      if(lastCommentaire2)
        email = email + moment(lastCommentaire2.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire2.user.sigle == null ? "": lastCommentaire2.user.sigle)+" : " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire2.content).split("<br>").join("%0A")+"%0A";
      let lastCommentaire3 = new Commentaire();
      lastCommentaire3= contrat.commentaires[2];
      if(lastCommentaire3)
        email = email + moment(lastCommentaire3.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire3.user.sigle == null ? "": lastCommentaire3.user.sigle)+" : "  +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire3.content).split("<br>").join("%0A")+"%0A";
    }
    ////console.log("email " + email);

    /*Insert commentaire ssytem with motif*/


    // this.motifAction =null;


    window.location.href = email;




  }

  annulationModificationContrat(id,secondModal: TemplateRef<any>){
    this.nestedModalRef.hide();
    this.currentContrat.updated = false;
    if(this.suivant){
      //console.log("here");
      this.goToSuivant(id,secondModal);
    }else{
      this.goToPrecedent(id,secondModal);
    }
  }


  blockedKey1 : boolean;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    let template:any;

    if (event.keyCode === this.RIGHT_ARROW && !this.blockedKey1) {
      //console.log("right");
      this.goToSuivant(this.currentContrat.numContrat,template);
    }

    if (event.keyCode === this.LEFT_ARROW && !this.blockedKey1) {
      this.goToPrecedent(this.currentContrat.numContrat,template);
    }
  }

  blockedKey(){
    this.blockedKey1 = true;
  }

  deBlockedKey(){
    this.blockedKey1 = false;
  }




  showAnnulationCancelModal(thirdModal: TemplateRef<any>) {
    this.nested2ModalRef =  this.modalService.show(thirdModal, Object.assign({}, {class: 'modal-sm'}));
  }

  annulation2(){
    this.nested2ModalRef.hide();
  }

  ignore2(){
    this.nested2ModalRef.hide();
    this.modalRef.hide();
  }

  deleteCommentaire(commentaire : any){
    //console.log("delete comment");

    this.contratService.deleteCommentaire(commentaire.id).subscribe(data => {
      this.currentContrat.updated = false;
      this.setPage(1);
      //this.mode = 2;
      this.errorUpdate=false;

    }, err => {
      this.currentContrat.updated = true;
      this.errorUpdate=true;

    });
    this.errorUpdate=false;
  }

  checkIFMorethanFifthMinuteAgo(commentaie : Commentaire){

    if(commentaie.user.sigle == 'SYSTEM'){
      return true;
    }

    let dateCom = moment(commentaie.date).add(15, 'minutes');


    return moment().isAfter(dateCom);
  }

  updated(event){
    //console.log("updated");
    this.currentContrat.updated = true;
    this.ref.detectChanges();
  }

  loadAllEcheance(numContrat : any){

    this.contratService.getAllEcheancesForContrat(numContrat).subscribe(
      (data: Array<Echeance>) => {
        this.currentAllEcheances = data;
      }, err => {
        console.log("error " + JSON.stringify(err));
      }
    )
  }

  buildTitleContrat(){
    var array = new Array();

    if(this.currentContrat.numContrat!=null ){
      array.push(this.currentContrat.numContrat);
    }
    if(this.currentContrat.description!=null && this.currentContrat.description!=""){
      array.push(this.currentContrat.description);
    }
    if(this.currentContrat.nomPartenaire!=null && this.currentContrat.nomPartenaire!=""){
      array.push(this.currentContrat.nomPartenaire);
    }
    if(this.currentContrat.numMarche!=null && this.currentContrat.numMarche!=""){
      array.push(this.currentContrat.numMarche);
    }
    if(this.currentContrat.codeProjet!=null && this.currentContrat.codeProjet!=""){
      array.push(this.currentContrat.codeProjet);
    }

    this.titre = array.join("/");
  }

  goToEcheances() {
    var url = '/PDC360/#/echeances';


      window.open(url, "_blank");

  }











}

