import {
  Component, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {AuthenticationService} from "../services/authentification.service";
import {CurrencyPipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {PagerService} from "../services/pager.service";
import {EtatProjetService} from "../services/etatProjet.service";
import {Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {EventService} from "../services/event.service";
import {Event} from "../../model/model.event";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import * as moment from 'moment';
import {Commentaire} from "../../model/model.commentaire";
import {Projet} from "../../model/model.projet";
import {User} from "../../model/model.user";
import {Employer} from "../../model/model.employer";
import {EtatRecouvrementService} from "../services/etatRecouvrement.service";
import {Document} from "../../model/model.document";
import {Produit} from "../../model/model.produit";
import {EtatStockService} from "../services/etatStock.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {


  eventsProjet : any  = new Array<Event>();

  eventsDocument : any =  new Array<Event>();

  eventsStock : any  =  new Array<Event>();

  roleReadAllProjects: boolean;

  roleReadMyProjects: boolean;

  roleReadAllRecouvrement :boolean;

  roleReadMyRecouvrement:boolean;

  userNameAuthenticated:string;

  sigleUserAuthenticated : string;

  service :string;

  userInSession : string;

  userNameAuthenticated2:any;

  mode : any;

  modalOption: NgbModalOptions = {};

  displayedColumnsEventsProjet: string[] = ['optionProjet','dateProjet','codeProjetProjet','actionsProjet','collaborateurProjet'];
  public dataSourceEventsProjet: MatTableDataSource<Event>;
  @ViewChild('firstTableSort', {static: true}) sortEventsProjet: MatSort;
  @ViewChild('firstTablePaginator', {static: true}) paginatorEventsProjet: MatPaginator;
  filtredDataEventsProjet : Array<Event>;
   currentFilterEventsProjet: any;
  currentProjet :any;
  modalRefProjet: BsModalRef;
  newContentCommentProjet : any;
  newEmployerIdProjet:any;
  motifActionProjet :any;
  currentEventProjet:any;

  pagerProjet: any = {};

  pagedItemsProjet :any;


  displayedColumnsEventsDocument: string[] = ['optionDocument','dateDocument','codePieceDocument','actionsDocument','collaborateurDocument'];
  public dataSourceEventsDocument: MatTableDataSource<Event>;
  @ViewChild('secondTableSort', {static: true}) sortEventsDocument: MatSort;
  @ViewChild('secondTablePaginator', {static: true}) paginatorEventsDocument: MatPaginator;
  filtredDataEventsDocument : Array<Event>;
  currentFilterEventsDocument: any;
  currentDocument :any;
  currentEventDocument:any;
  pagerDocument: any = {};


  displayedColumnsEventsProduit: string[] = ['optionProduit','dateProduit','idProduit','actionsProduit','collaborateurProduit'];
  public dataSourceEventsProduit: MatTableDataSource<Event>;
  @ViewChild('thirdTableSort', {static: true}) sortEventsProduit: MatSort;
  @ViewChild('thirdTablePaginator', {static: true}) paginatorEventsProduit: MatPaginator;
  filtredDataEventsProduit: Array<Event>;
  currentFilterEventsProduit: any;
  currentProduit :any;
  currentEventProduit:any;
  pagerProduit: any = {};


  roleBuReseauSecurite:any;
  roleBuSystem:any;
  roleBuChefProjet:any;
  roleBuVolume:any;

  authorized: any;


  constructor(private etatStockService:EtatStockService, private eventService : EventService, private authService:AuthenticationService,private currency :CurrencyPipe,private spinner: NgxSpinnerService,private pagerService:PagerService,private etatProjetService: EtatProjetService,private etatRecouvrementService:EtatRecouvrementService, private router : Router,private modalService: BsModalService, viewContainerRef:ViewContainerRef) {
    this.service = this.authService.getServName();

    this.userInSession = this.authService.getLastName();

    this.authService.getRoles().forEach(authority => {


      if(authority== 'BU_COMMERCIAL'){
        this.roleBuReseauSecurite = true;

        this.authorized = false;

      }

      if(authority== 'BU_RESEAU_SECURITE'){
        this.roleBuReseauSecurite = true;

        this.authorized = false;

      }

      if(authority== 'BU_CHEF_PROJET'){
        this.roleBuChefProjet = true;
        this.authorized = false;

      }

      if(authority== 'BU_SYSTEM'){
        this.roleBuSystem = true;

        this.authorized = false;

      }

      if(authority== 'BU_VOLUME'){
        this.roleBuVolume = true;
        this.authorized = false;

      }

      if (authority == 'READ_ALL_RECOUVREMENTS') {
        this.roleReadAllRecouvrement = true;
        if(!this.authorized)
          this.authorized = false;
      }
      if (authority == 'READ_MY_RECOUVREMENT') {
        this.roleReadMyRecouvrement = true;
        if(!this.authorized)
          this.authorized = false;
        if(this.authService.getLastName()!=null){
          this.userNameAuthenticated = this.authService.getLastName();
        }else{
          this.userNameAuthenticated ="undefined";
        }

      }


      if (authority == 'READ_ALL_PROJECTS') {
        this.roleReadAllProjects = true;
        this.authorized = true;

      }
      if (authority == 'READ_MY_PROJECTS') {
        this.roleReadMyProjects = true;
        this.authorized = true;
        console.log("heee");
        if(this.authService.getLastName()!=null){
          this.userNameAuthenticated = this.authService.getLastName();

        }else{
          this.userNameAuthenticated ="undefined"; // for not pass for undefined
        }

      }


    });

    this.sigleUserAuthenticated = this.authService.getSigle();

    this.userNameAuthenticated2 = this.authService.getUserName();


    if(this.roleReadAllProjects){
      this.getAllEvents(this.userNameAuthenticated2,null);

    }else{
      this.getAllEventsByService(this.userNameAuthenticated2,null,this.service);
    }



    this.getAllEmployeesByService("Intervenant");

    this.getAllEmployeesAvantVente();

    this.getAllChefProjets();

    this.getAllClients();

    this.getAllCommericals();
  }

  ngOnInit() {
  }



  updatedProjet(event){
    console.log("updated");
    this.currentProjet.updated = true;

  }

  updatedDocument(event){
    console.log("updated");
    this.currentDocument.updated = true;

  }
  updatedProduit(event){
    console.log("updated");
    this.currentProduit.updated = true;

  }

  setPageProjet(page: number) {

    console.log("this.currentProjet.commentaires " + this.currentProjet.commentaires);

    if(this.currentProjet.commentaires == null ||  this.currentProjet.commentaires.length==0) {
      console.log("null");
      this.pagerProjet = null;
      this.pagedItemsProjet = null;
      return;
    }else{

      this.pagerProjet = this.pagerService.getPager(this.currentProjet.commentaires.length, page);

      if (page < 1 || page > this.pagerProjet.totalPages  ) {
        return;
      }



      this.pagedItemsProjet = this.currentProjet.commentaires.slice(this.pagerProjet.startIndex, this.pagerProjet.endIndex + 1);

    }


    console.log("page " +  page );
    console.log("this.pager.totalPages " + this.pagerProjet.totalPages);

    // get pager object from service
    this.pagerProjet = this.pagerService.getPager(this.currentProjet.commentaires.length, page);

    // get current page of items

  }

  employees:Array<Employer>;
  getAllEmployeesByService(service:string){
    this.etatProjetService.getAllEmployeesByService(service).subscribe(
      (data: Array<Employer>)=>{
        this.employees = data;
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }

  employeesAvantVente:Array<Employer>;
  getAllEmployeesAvantVente(){
    this.etatProjetService.getAllEmployeesByService("AvantVente").subscribe(
      (data: Array<Employer>)=>{
        this.employeesAvantVente = data;
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }
  chefProjets:Array<String>;
  getAllChefProjets(){
    this.etatProjetService.getDistinctChefProjetProjet().subscribe(
      (data: Array<String>)=>{
        this.chefProjets = data;
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }
  commercials:Array<String>;
  getAllCommericals(){
    this.etatProjetService.getDistinctCommercialProjet().subscribe(
      (data: Array<String>)=>{
        this.commercials = data;
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }
  clients:Array<String>;
  getAllClients(){
    this.etatProjetService.getDistinctClientProjet().subscribe(
      (data: Array<String>)=>{
        this.clients = data;
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }

  getAllEvents(username:string,lastConnectionDate : string){

    var events :Array<Event>;
    this.eventService.getAllEvents(username,lastConnectionDate).subscribe(
      (data: Array<Event>)=>{
        events = data;
        console.log("events " + JSON.stringify( events));
        if(events.length>0){

          events.forEach(event => {
            if(event.projet) {
              this.eventsProjet.push(event);
            }

            if(event.document) {
              this.eventsDocument.push(event);
            }

            if(event.produit) {
              this.eventsStock.push(event);
            }

          console.log("eventsProjet "+ JSON.stringify( this.eventsProjet));

          this.refreshTables();


          })


        }
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )




  }


  getAllEventsByService(username:string,lastConnectionDate : string,service:string){

    var events :Array<Event>;
    this.eventService.getAllEventsByService(username,lastConnectionDate,service).subscribe(
      (data: Array<Event>)=>{
        events = data;
        console.log("events " + JSON.stringify( events));
        if(events.length>0){

          events.forEach(event => {
            if(event.projet) {
              this.eventsProjet.push(event);
            }

            if(event.document) {
              this.eventsDocument.push(event);
            }

            if(event.produit) {
              this.eventsStock.push(event);
            }

            console.log("eventsProjet "+ JSON.stringify( this.eventsProjet));

            this.refreshTables();


          })


        }
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )




  }

  refreshTables(){
    if(this.eventsProjet.length>=0){
      this.dataSourceEventsProjet =  new MatTableDataSource(this.eventsProjet);
      /*  this.dataSourceEventsProjet.filterPredicate = function(data, filter: string): boolean {


          return (data.actions !=null ? data.actions : "").toLowerCase().includes(filter) ||
            data.projet.codeProjet.toLowerCase().includes(filter)  ||
            (data.createdby.lastName !=null ? data.createdby.lastName : "").toLowerCase().includes(filter)
            === filter ;
        };*/
      this.dataSourceEventsProjet.paginator = this.paginatorEventsProjet;
      this.dataSourceEventsProjet.sort = this.sortEventsProjet;
      if(this.currentFilterEventsProjet!=null){
        console.log("(this.currentFilterEventsProjet!=null");
        this.applyFilterEventsProjet(this.currentFilterEventsProjet);
      }

    }


    if(this.eventsDocument.length>=0) {
      console.log("eventsDocument " + JSON.stringify(this.eventsDocument));
      this.dataSourceEventsDocument = new MatTableDataSource(this.eventsDocument);
      /*  this.dataSourceEventsProjet.filterPredicate = function(data, filter: string): boolean {


          return (data.actions !=null ? data.actions : "").toLowerCase().includes(filter) ||
            data.projet.codeProjet.toLowerCase().includes(filter)  ||
            (data.createdby.lastName !=null ? data.createdby.lastName : "").toLowerCase().includes(filter)
            === filter ;
        };*/
      this.dataSourceEventsDocument.paginator = this.paginatorEventsDocument;
      this.dataSourceEventsDocument.sort = this.sortEventsDocument;
      if (this.currentFilterEventsDocument != null){
        console.log("(this.currentFilterEventsDoculent!=null");
        this.applyFilterEventsDocument(this.currentFilterEventsDocument);
      }

    }

    if(this.eventsStock.length>=0) {
      console.log("eventsProduuit " + JSON.stringify(this.eventsStock));
      this.dataSourceEventsProduit = new MatTableDataSource(this.eventsStock);
      /*  this.dataSourceEventsProjet.filterPredicate = function(data, filter: string): boolean {


          return (data.actions !=null ? data.actions : "").toLowerCase().includes(filter) ||
            data.projet.codeProjet.toLowerCase().includes(filter)  ||
            (data.createdby.lastName !=null ? data.createdby.lastName : "").toLowerCase().includes(filter)
            === filter ;
        };*/
      this.dataSourceEventsProduit.paginator = this.paginatorEventsProduit;
      this.dataSourceEventsProduit.sort = this.sortEventsProduit;
      if (this.currentFilterEventsProduit != null){
        console.log("currentFilterEventsProduit");
        this.applyFilterEventsProduit(this.currentFilterEventsProduit);
      }

    }



  }



  showEtatStock(type,value){


    switch(type)
    {
      case 'codeProjet':console.log("codeProjet "+ value);

        let url = '/#/etatStockCodeProjet/'+value;

        window.open(url, "_blank");





    }

  }

  clotureProjet(projet : Projet){
    this.etatProjetService.clotureProjet(projet).subscribe((data: Projet) => {
      this.currentProjet.updated = false;
      this.currentProjet.cloture = data.cloture;
      //this.mode = 2;
      this.currentProjet.updated = false;
      //this.modalRef.hide();
    }, err => {
      this.currentProjet.updated = true;
      console.log(JSON.stringify(err));
      this.authService.logout();
      this.router.navigateByUrl('/login');
      console.log("error "  +JSON.stringify(err));

    });
  }

  declotureProjet(projet : Projet){

    this.etatProjetService.declotureProjet(projet).subscribe((data: Projet) => {
      this.currentProjet.updated = false;
      this.currentProjet.cloture = data.cloture;
      this.currentProjet.decloturedByUser = data.decloturedByUser;
      //this.mode = 2;
      this.currentProjet.updated = false;
      //this.modalRef.hide();
    }, err => {
      this.currentProjet.updated = true;
      console.log(JSON.stringify(err));;
      this.authService.logout();
      this.router.navigateByUrl('/login');
      console.log("error "  +JSON.stringify(err));

    });

  }


  applyFilterEventsProjet(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceEventsProjet.filter = filterValue;
    this.currentFilterEventsProjet = filterValue;

    if (this.dataSourceEventsProjet.paginator) {
      this.dataSourceEventsProjet.paginator.firstPage();
    }

  }

  applyFilterEventsDocument(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceEventsDocument.filter = filterValue;
    this.currentFilterEventsDocument = filterValue;

    if (this.dataSourceEventsDocument.paginator) {
      this.dataSourceEventsDocument.paginator.firstPage();
    }

  }


  currentModal : any;

  selectProjet(event : Event,template: TemplateRef<any>){
    this.currentModal="PROJET";
    this.currentProjet = event.projet;
    this.setPageProjet(1);
    this.mode = 1;

    this.filtredDataEventsProjet = this.dataSourceEventsProjet.filteredData;

    console.log("current Projet " + JSON.stringify(this.currentProjet));

    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalRefProjet = this.modalService.show(template,this.modalOption );

    var index = this.getIndexFromFiltrerdListProjet(this.currentProjet.codeProjet);
    this.indexProjet = index;
    this.updateEvent(event);


  }

  updateEvent(event: Event){


    this.eventService.updateStatutEvent(event.id,event).subscribe((data: Event) => {
      console.log("update event");
      this.eventsDocument = this.eventsDocument.filter(item => item !== event);
      this.eventsProjet = this.eventsProjet.filter(item => item !== event);
      this.eventsStock = this.eventsStock.filter(item => item !== event);

      this.refreshTables();

    }, err => {

      console.log(JSON.stringify(err));
      this.authService.logout();
      this.router.navigateByUrl('/login');


    });
  }

  composeEmailProjet(projet : Projet){

    console.log("compose Email");

    var codeProjet = projet.codeProjet;

    var nomProjet = projet.projet;

    var mntProjet = projet.montantCmd;

    var email="mailto:?subject="+this.removeAnd(projet.client)+" / "+ this.removeAnd(codeProjet)+" / " + this.removeAnd(nomProjet)+ "&body= Bonjour,%0A"
      +"Ce message concerne le projet cité en objet et dont le détail est ci-après :%0A"
      + "Commercial: "+(projet.commercial  == null ? "": projet.commercial ) +"%0A"+
      "Chef projet: "+ (projet.chefProjet  == null ? "": projet.chefProjet ) +"%0A"+
      "BU: "+ (projet.bu  == null ? "": projet.bu ) +"%0A"+
      "Date CMD: "+moment(projet.dateCmd).format('DD/MM/YYYY')  +"%0A"+
      "AGE: "+ (projet.age  == null ? "": projet.age )+"%0A"+
      "Montant CMD: "+(projet.montantCmd  == null ? "": projet.montantCmd +" DH")+"%0A"+
      "LIV: "+(projet.livraison  == null ? "": projet.livraison +" DH") +"%0A"+
      "RAL: "+ (projet.restAlivrer  == null ? "": projet.restAlivrer +" DH")  +"%0A"+
      "LNF: "+ (projet.livrerNonFacture  == null ? "": projet.livrerNonFacture +" DH")  +"%0A"+
      "Montant factur%C3%A9: "+ (projet.livreFacturePayer  == null ? "": projet.livreFacturePayer +" DH")  +"%0A"+
      "Montant pay%C3%A9: "+(projet.montantPayer  == null ? "": projet.montantPayer +" DH")  +"%0A"+
      "Montant Stock: "+(projet.montantStock  == null ? "": projet.montantStock +" DH")  +"%0A"+
      "Taux facturation: "+ (projet.facturation == null ? "":(Math.round(projet.facturation * 100)/100).toFixed(2) +"%")+"%0A"+" %0A"+" %0A";


    if(projet.commentaires!=null){

      let lastCommentaire1 = new Commentaire();
      lastCommentaire1= projet.commentaires[0];
      if(lastCommentaire1){
        email = email+ "%0A";

        email = email +"Commentaires : %0A"+ moment(lastCommentaire1.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire1.user.sigle == null ? "": lastCommentaire1.user.sigle)+" : " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire1.content)+"%0A";
      }
      let lastCommentaire2 = new Commentaire();
      lastCommentaire2= projet.commentaires[1];
      if(lastCommentaire2)
        email = email + moment(lastCommentaire2.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire2.user.sigle == null ? "": lastCommentaire2.user.sigle)+" : " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire2.content)+"%0A";
      let lastCommentaire3 = new Commentaire();
      lastCommentaire3= projet.commentaires[2];
      if(lastCommentaire3)
        email = email + moment(lastCommentaire3.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire3.user.sigle == null ? "": lastCommentaire3.user.sigle)+" : "  +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire3.content)+"%0A";
    }
    console.log("email " + email);

    /*Insert commentaire ssytem with motif*/

    // this.addCommentSystem(this.motifAction);

    //this.motifAction =null;


    window.location.href = email;



    //this.annulation3();
  }

  checkCanceledProjet(thirdModal: TemplateRef<any>){

    if(this.currentProjet.updated){
      this.onEditProjet(null);
      this.modalRefProjet.hide();
    }else{
      this.modalRefProjet.hide();
    }


  }


  addCommentProjet(){

    if(this.newContentCommentProjet.length != 0) {
      let newCommentaire = new Commentaire();

      newCommentaire.date = new Date();
      // newCommentaire.user.username = "test";
      newCommentaire.content = this.newContentCommentProjet.split("\n").join("<br>");;
      newCommentaire.user = new User();
      newCommentaire.user.username = this.authService.getUserName();
      console.log("this.authService.getSigle "+ this.authService.getSigle());
      newCommentaire.user.sigle = this.authService.getSigle();



      if (this.newEmployerIdProjet != null ) {
        console.log("this.newEmployerId" + this.newEmployerIdProjet)
        newCommentaire.employer = this.newEmployerIdProjet;

      }

      if (this.currentProjet.commentaires == null) {
        this.currentProjet.commentaires = new Array<Commentaire>();
      }

      this.currentProjet.commentaires.push(newCommentaire);

      this.currentProjet.commentaires.sort((a, b) => {
        return <any> new Date(b.date) - <any> new Date(a.date);
      });




      console.log(" this.currentProjet.commentaires " + this.currentProjet.commentaires);

      this.currentProjet.updated = true;
      this.setPageProjet(1);
      this.newContentCommentProjet = null;
      //this.newEmployerId = null;
      //this.newDatePlannifier = null;


    }



  }

  addCommentSystemProjet(motif){

    if(motif.length != 0) {
      let newCommentaire = new Commentaire();

      newCommentaire.date = new Date();
      // newCommentaire.user.username = "test";
      newCommentaire.content = '[ESCALADE]: '+motif;
      newCommentaire.user = new User();
      newCommentaire.user.username = "system";

      newCommentaire.user.sigle = "SYSTEM";


      if (this.currentProjet.commentaires == null) {
        this.currentProjet.commentaires = new Array<Commentaire>();
      }

      this.currentProjet.commentaires.push(newCommentaire);

      this.currentProjet.commentaires.sort((a, b) => {
        return <any> new Date(b.date) - <any> new Date(a.date);
      });




      console.log(" this.currentProjet.commentaires " + this.currentProjet.commentaires);

      this.currentProjet.updated = true;

      this.motifActionProjet = null;

      let userUpdate = new User();
      userUpdate.username = this.authService.getUserName();
      this.currentProjet.updatedBy = userUpdate;


      this.etatProjetService.updateProjet(this.currentProjet).subscribe((data: Projet) => {

      }, err => {
        this.currentProjet.updated = true;
        console.log(JSON.stringify(err));
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(err));

      });


    }



  }

  onEditProjet(template: TemplateRef<any>) {

    //console.log("this.currentProjet "  + JSON.stringify(this.currentProjet));

    //console.log("new projet to send " + JSON.stringify(this.currentProjet));


    if(this.newContentCommentProjet != null ){
      console.log("here newContentComment");
      this.addCommentProjet();
    }

    let userUpdate = new User();
    userUpdate.username = this.authService.getUserName();
    this.currentProjet.updatedBy = userUpdate;

    this.etatProjetService.updateProjet(this.currentProjet).subscribe((data: Projet) => {
      this.currentProjet.updated = false;
      //this.mode = 2;
      this.currentProjet.updated = false;
      //this.refreshProjets();
      //this.modalRef.hide();
    }, err => {
      this.currentProjet.updated = true;
      console.log(JSON.stringify(err));

      this.authService.logout();
      this.router.navigateByUrl('/login');
      console.log("error "  +JSON.stringify(err));

    });

  }



  removeAnd(str : string){
    return str.replace("&","et");
  }


  deleteCommentaireProjet(commentaire : any){
    console.log("delete comment");

    this.currentProjet.commentaires = this.currentProjet.commentaires.filter(item => item !== commentaire);
    this.currentProjet.updated = true;


  }

  /***** document ********/
  motifRequired : boolean;

  currentDocmentClone : Document;

  modalRefDocument : any;

  newContentCommentDocument:any;

  newEmployerIdDocument:any;

  actionModalDocument:any;

  motifActionDocument:any;

  typdeBloquageRequired : boolean;

  motifChangementDeDateRequired:boolean;

  montantRetenuGarantieRequired:boolean;

  dateFinGarentieRequired:boolean;

  nested3ModalRefDocument:any;

  pagedItemsDocument:any;

  nested2ModalRefDocument :any;

  nestedModalRefDocument:any;

  selectDocument(event : Event,template: TemplateRef<any>){
    this.currentModal="DOCUMENT";
    this.motifRequired = false;

    this.currentDocument = event.document;
    this.setPageDocument(1);
    this.currentDocmentClone = new Document();

    this.currentDocmentClone.datePrevuEncaissement = this.currentDocument.datePrevuEncaissement;
    this.currentDocmentClone.dateDepot = this.currentDocument.dateDepot;
    this.currentDocmentClone.statut = this.currentDocmentClone.statut;

    this.mode = 1;
    this.filtredDataEventsDocument = this.dataSourceEventsDocument.filteredData;

    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalRefDocument = this.modalService.show(template,this.modalOption );

    var index = this.getIndexFromFiltrerdListDocument(this.currentDocument.codePiece);
    this.indexDocument = index;

    this.updateEvent(event);
  }

  applyFilterDocument(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceEventsDocument.filter = filterValue;
    this.currentFilterEventsDocument = filterValue;

    if (this.dataSourceEventsDocument.paginator) {
      this.dataSourceEventsDocument.paginator.firstPage();
    }


  }

  deleteCommentaireDocument(commentaire : any){
    console.log("delete comment");

    this.currentDocument.commentaires = this.currentDocument.commentaires.filter(item => item !== commentaire);
    this.currentDocument.updated = true;
    this.setPageDocument(1);

  }

  setPageDocument(page: number) {



    if(this.currentDocument.commentaires == null ||  this.currentDocument.commentaires.length==0) {
      console.log("null");
      this.pagerDocument = null;
      this.pagedItemsDocument = null;
      return;
    }else{

      this.pagerDocument = this.pagerService.getPager(this.currentDocument.commentaires.length, page);

      if (page < 1 || page > this.pagerDocument.totalPages  ) {
        return;
      }



      this.pagedItemsDocument= this.currentDocument.commentaires.slice(this.pagerDocument.startIndex, this.pagerDocument.endIndex + 1);

    }

    console.log("page " +  page );
    console.log("this.pager.totalPages " + this.pagerDocument.totalPages);

    // get pager object from service
    this.pagerDocument = this.pagerService.getPager(this.currentDocument.commentaires.length, page);

    // get current page of items

  }



  onEditDocument(template: TemplateRef<any>) {

    console.log("this.currentDocument "  + JSON.stringify(this.currentDocument));

    console.log("new Document to send " + JSON.stringify(this.currentDocument));


    if(this.newContentCommentDocument != null ){
      console.log("here newContentComment");
      this.addCommentDocument();
    }

    let userUpdate = new User();
    userUpdate.username = this.authService.getUserName();
    this.currentDocument.updatedBy = userUpdate;


    this.etatRecouvrementService.updateDocument(this.currentDocument).subscribe((data: Document) => {
      this.currentDocument.updated = false;
      //this.mode = 2;
      this.currentDocument.updated = false;

    }, err => {
      this.currentDocument.updated = true;
      console.log(JSON.stringify(err));
      this.authService.logout();
      this.router.navigateByUrl('/login');
      console.log("error "  +JSON.stringify(err));
    });

  }


  addCommentDocument(){

    if(this.newContentCommentDocument.length != 0) {
      let newCommentaire = new Commentaire();

      newCommentaire.date = new Date();
      newCommentaire.user = new User();
      newCommentaire.user.username = this.authService.getUserName();
      console.log("this.authService.getSigle "+ this.authService.getSigle());
      newCommentaire.user.sigle = this.authService.getSigle();
      newCommentaire.content = this.newContentCommentDocument.split("\n").join("<br>");

      if (this.newEmployerIdDocument != null ) {
        console.log("this.newEmployerId" + this.newEmployerIdDocument);
        newCommentaire.employer = this.newEmployerIdDocument;
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
      this.setPageDocument(1);
      this.newContentCommentDocument = null;
      //this.newEmployerId = null;


    }



  }

  addCommentSystemDocument(motif){

    if(motif.length != 0) {
      let newCommentaire = new Commentaire();

      newCommentaire.date = new Date();
      // newCommentaire.user.username = "test";
      newCommentaire.user = new User();

      if(this.actionModalDocument == 'escalader'){
        newCommentaire.content = '[ESCALADE]: '+motif;
        newCommentaire.user.username = "system";
        newCommentaire.user.sigle = "SYSTEM";
      }
      if(this.actionModalDocument == 'udateDatePrevuEncaissement'){
        newCommentaire.content = '[CHANGEMENT_DATE_ENC]: '+motif;
        newCommentaire.user.username = this.authService.getUserName();
        newCommentaire.user.sigle = this.sigleUserAuthenticated;
      }







      if (this.currentDocument.commentaires == null) {
        this.currentDocument.commentaires = new Array<Commentaire>();
      }

      this.currentDocument.commentaires.push(newCommentaire);

      this.currentDocument.commentaires.sort((a, b) => {
        return <any> new Date(b.date) - <any> new Date(a.date);
      });




      console.log(" this.currentProjet.commentaires " + this.currentDocument.commentaires);

      this.currentDocument.updated = true;

      this.motifActionDocument = null;
      //this.newEmployerId = null;


      this.etatRecouvrementService.updateDocument(this.currentDocument).subscribe((data: Document) => {

        //this.refreshDocuments();
        //this.modalRef.hide();
      }, err => {
        this.currentDocument.updated = true;
        console.log(JSON.stringify(err));
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(err));
      });

    }

    this.annulationDocument3();


  }


  updatedStatut(event){
    this.currentDocument.updated = true;
    if(this.currentDocument !=null){
      if(this.currentDocument.statut!=null && this.currentDocument.statut== 'Bloquée' && (this.currentDocument.motif == '' ||!this.currentDocument.motif)){
        this.motifRequired = true;

      }else{

        this.motifRequired = false;
      }

      if(this.currentDocument.statut!=null && this.currentDocument.statut== 'Bloquée' && (this.currentDocument.typeBloquage==null || this.currentDocument.typeBloquage=="")){
        console.log("type blo null"  );
        this.typdeBloquageRequired = true;
      }else{
        console.log("type blo not null"  );
        this.typdeBloquageRequired = false;
      }


      if(this.currentDocument.statut!=null && this.currentDocument.statut== 'Retenue Garantie' && this.currentDocument.montantGarantie==0){
        this.montantRetenuGarantieRequired = true;
      }else{
        this.montantRetenuGarantieRequired = false;
      }

    }
    if(this.currentDocument.statut ==null || ( this.currentDocument.statut!= 'Bloquée' && this.currentDocument.statut!= 'Retenue Garantie') ){
      this.motifRequired = false;
      this.montantRetenuGarantieRequired = false;
      this.typdeBloquageRequired=false;
    }

  }



  updatedMotif(event){
    /*if(this.motifRequired){
      if(this.currentDocument.motif !=null && this.currentDocument.motif != "" && this.currentDocument.motif.length>0){

        this.currentDocument.updated = true;
        this.motifRequired = false;

      }else{
        this.motifRequired = true;
      }
      this.ref.detectChanges();
    }
    if(this.currentDocument.statut == "Bloquée"){
      console.log("changed this is last " + this.currentDocmentClone.motif);
      if(this.currentDocmentClone.motif!=null && this.currentDocmentClone.motif.length>=0){
        console.log("motif avant nest pas vide");
        if(this.currentDocument.motif == null || this.currentDocument.motif.length==0){
          console.log(" Motif apres vide");
          this.motifRequired = true;
        }
      }
    }*/
    console.log("teste motif");
    if(this.currentDocument.motif!=null&&  this.currentDocument.motif != "" && this.currentDocument.motif.length>0){
      this.motifRequired = false;
    }
    if(this.currentDocument.statut == "Bloquée" && (this.currentDocument.motif== null || this.currentDocument.motif == "")){


      this.motifRequired = true;
    }

  }

  updatedTypeBloquage(event){
    /*if(this.motifRequired){
      if(this.currentDocument.motif !=null && this.currentDocument.motif != "" && this.currentDocument.motif.length>0){

        this.currentDocument.updated = true;
        this.motifRequired = false;

      }else{
        this.motifRequired = true;
      }
      this.ref.detectChanges();
    }
    if(this.currentDocument.statut == "Bloquée"){
      console.log("changed this is last " + this.currentDocmentClone.motif);
      if(this.currentDocmentClone.motif!=null && this.currentDocmentClone.motif.length>=0){
        console.log("motif avant nest pas vide");
        if(this.currentDocument.motif == null || this.currentDocument.motif.length==0){
          console.log(" Motif apres vide");
          this.motifRequired = true;
        }
      }
    }*/
    console.log("teste motif");
    if(this.currentDocument.typeBloquage!=null){
      this.typdeBloquageRequired = false;
    }
    if(this.currentDocument.statut == "Bloquée" && (this.currentDocument.typeBloquage== null || this.currentDocument.typeBloquage == "")){

      this.typdeBloquageRequired = true;
    }

  }

  updatedDateFinGarentie(event){


    if(this.currentDocument.dateFinGarantie !=null ){
      this.dateFinGarentieRequired = false;

    }

    if(this.currentDocument.montantGarantie !=null && this.currentDocument.montantGarantie>0){

      if(!this.currentDocument.dateFinGarantie){
        this.dateFinGarentieRequired = true;
      }

    }

  }

  updatedMontantRetenueGarantie(event){



    if(this.currentDocument.montantGarantie >0 ){
      this.montantRetenuGarantieRequired = false;
      if(!this.currentDocument.dateFinGarantie){
        this.dateFinGarentieRequired = true;
      }

    }

    if(this.currentDocument.montantGarantie==null || this.currentDocument.montantGarantie ==0){
      this.dateFinGarentieRequired = false;

    }



    if(this.currentDocument.statut =='Retenue Garantie' &&  this.currentDocument.montantGarantie ==0){


      this.montantRetenuGarantieRequired=true;

    }





  }

  updatedDatePrevuEncaissement(event,template){
    //console.log("updated last val "+  this.currentDocmentClone.datePrevuEncaissement);

    if(this.currentDocument.typeDocument == 'Facture' &&
      this.currentDocmentClone.datePrevuEncaissement!= this.currentDocument.datePrevuEncaissement ){
      if(this.currentDocument.datePrevuEncaissement){

        this.actionModalDocument=="udateDatePrevuEncaissement";
        this.showMotifModalDocument(false,template);

      }else{
        this.currentDocument.datePrevuEncaissement = this.currentDocmentClone.datePrevuEncaissement;
      }
    }

  }

  showMotifModalDocument( escalader :boolean, fourthModal: TemplateRef<any>) {
    this.motifActionDocument = "";
    if(escalader){
      this.actionModalDocument = "escalader";
    }else{
      this.actionModalDocument = 'udateDatePrevuEncaissement';
    }

    this.nested3ModalRefDocument =  this.modalService.show(fourthModal, Object.assign({}, {class: 'modal-sm'}));
  }

  updatedMotifChangementDateRecep(event){
    console.log("changed updatedMotifChangementDateRecep");
    if(this.motifChangementDeDateRequired){
      if(this.currentDocument.motifChangementDate !=null && this.currentDocument.motifChangementDate != "" && this.currentDocument.motifChangementDate.length>0){

        this.motifChangementDeDateRequired = false;

      }else{
        this.motifChangementDeDateRequired = true;
      }


    }

    if(this.currentDocument.typeDocument == 'Facture' && this.currentDocument.dateDepot &&
      this.currentDocument.dateDepot!= this.currentDocument.datePiece ) {
      console.log("changed this is last " + this.currentDocmentClone.motifChangementDate);
      if (this.currentDocument.motifChangementDate != null && this.currentDocument.motifChangementDate.length >= 0) {
        this.motifChangementDeDateRequired = false;

      }

      if (this.currentDocument.motifChangementDate == null || this.currentDocument.motifChangementDate.length == 0) {
        console.log(" MotifChangementDate courrant a ete envoyé");
        this.motifChangementDeDateRequired = true;
      }
    }



  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  annulationDocument3(){
    if(this.actionModalDocument=="udateDatePrevuEncaissement"){
      console.log("anciencce date prevu enc "+ this.currentDocmentClone.datePrevuEncaissement);
      this.currentDocument.datePrevuEncaissement = this.currentDocmentClone.datePrevuEncaissement;
    }


    this.nested3ModalRefDocument.hide();
  }

  composeEmailDocument(currentDocument : Document) {

    console.log("compose Email");

    var numPiece = currentDocument.numPiece;

    var nomProjet = currentDocument.projet;

    var indic = "" ;

    switch(this.currentDocument.typeDocument){
      case "Facture": indic=' la facture '; break;
      case "Décaissement": indic=' le décaissement '; break;
      case "Encaissement": indic=' l\'encaissement '; break;
      case "Avoir": indic=' l\'avoir  '; break;
      default : indic= " "+this.currentDocument.typeDocument + " "; break;
    }


    var email = "mailto:?subject=" + currentDocument.client + " / " + numPiece  + (nomProjet   == null ? "" :" / "+this.removeAnd(nomProjet)  )+ "&body= Bonjour,"+"%0A"+
      "Ce message concerne"+indic+"cité en objet."+"%0A"+"Je vous prie de lire les commentaires en bas et de prendre les actions nécessaires."+"%0A"+
      "Détail de la pièce :"+ "%0A"+
      "Type document: " + currentDocument.typeDocument + "%0A" +

      "Chef projet: " + (currentDocument.chefProjet  == null ? "": currentDocument.chefProjet ) + "%0A" +
      "Commercial: " + (currentDocument.commercial  == null ? "": currentDocument.commercial )  + "%0A" +
      "Ref client: " +   (currentDocument.refClient  == null ? "": currentDocument.refClient )  + "%0A" +

      "Montant Pi%C3%A9ce: " +  (currentDocument.montantPiece  == null ? "": currentDocument.montantPiece+" DH" )  + "%0A" +
      "Montant ouvert: " +   (currentDocument.montantOuvert  == null ? "": currentDocument.montantOuvert +" DH" )  + "%0A" +
      "Charg%C3%A9 recouvrement: " +  (currentDocument.chargerRecouvrement  == null ? "": currentDocument.chargerRecouvrement )  + "%0A" +

      "Age Pi%C3%A9ce:" +   (currentDocument.agePiece  == null ? "": currentDocument.agePiece ) + "%0A" +
      "Montant pay%C3%A9: " +  (currentDocument.montantPayer  == null ? "": currentDocument.montantPayer + " DH" )  + "%0A" +
      "Condition de paiement: " +  (currentDocument.conditionDePaiement  == null ? "": currentDocument.conditionDePaiement )  + "%0A"+
      "Statut: " +  (currentDocument.statut  == null || currentDocument.statut== 'undefined' ? "": currentDocument.statut ) ;
    if(this.currentDocument.statut != null &&  this.currentDocument.statut=="Bloquée"){
      email = email + "%0A"+ "Motif: " +  (currentDocument.motif  == null ? "": currentDocument.motif )  + "%0A";
    }

    if (this.currentDocument.caution != null && this.currentDocument.caution == true ) {
      email = email + "Caution: " +   (currentDocument.caution  == null ? "": currentDocument.caution == true ? "Oui": "-" )  + "%0A" +
        "N°caution: " +   (currentDocument.numCaution  == null ? "": currentDocument.numCaution )  + "%0A" +
        "Type caution: " +  (currentDocument.typeCaution  == null ? "": currentDocument.typeCaution )  + "%0A" +
        "Montant caution: " +  (currentDocument.montantCaution  == null ? "": currentDocument.montantCaution + " DH" )   + "%0A" +
        "Date lib%C3%A9ration caution: " +  (currentDocument.dateLiberationCaution  == null ? "": moment(currentDocument.dateLiberationCaution).format('DD/MM/YYYY') )   + "%0A" + "%0A" + "%0A";
    }

    //console.log("email "+ email);


    if(currentDocument.commentaires!=null){

      let lastCommentaire1 = new Commentaire();
      lastCommentaire1= currentDocument.commentaires[0];
      if(lastCommentaire1){
        email = email+ "%0A";

        email = email + "%0A";
        email = email +"Commentaires : %0A"+(lastCommentaire1.date==null ?"": moment(lastCommentaire1.date).format('DD/MM/YYYY HH:MM'))+" "+(lastCommentaire1.user.sigle == null ? " : ": lastCommentaire1.user.sigle)+" " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+ (lastCommentaire1.content  == null ? "": encodeURIComponent(lastCommentaire1.content)  ) +"%0A";

      }
      let lastCommentaire2 = new Commentaire();
      lastCommentaire2= currentDocument.commentaires[1];
      if(lastCommentaire2)
        email = email + (lastCommentaire2.date==null ?"": moment(lastCommentaire2.date).format('DD/MM/YYYY HH:MM'))+" "+(lastCommentaire2.user.sigle == null ? " : ": lastCommentaire2.user.sigle)+" " +(lastCommentaire2.employer == null ? "": "  @"+lastCommentaire2.employer) + " "+ (lastCommentaire2.content  == null ? "": encodeURIComponent(lastCommentaire2.content)  ) +"%0A";
      let lastCommentaire3 = new Commentaire();
      lastCommentaire3= currentDocument.commentaires[2];
      if(lastCommentaire3)
        email = email + (lastCommentaire3.date==null ?"": moment(lastCommentaire3.date).format('DD/MM/YYYY HH:MM'))+" "+(lastCommentaire3.user.sigle == null ? " : ": lastCommentaire3.user.sigle)+" " +(lastCommentaire3.employer == null ? "": "  @"+lastCommentaire3.employer) + " "+ (lastCommentaire3.content  == null ? "": encodeURIComponent(lastCommentaire3.content) ) +"%0A";
    }


    // this.addCommentSystem(this.motifAction);

    // this.motifAction =null;

    //this.annulation3();

    window.location.href = email;

  }


  updatedDateDepot(event,template){
    console.log("changed");
    if(this.currentDocument !=null && this.currentDocument.typeDocument=='Facture') {
      if ( this.currentDocument.dateDepot && moment(this.currentDocument.datePiece) != moment(this.currentDocument.dateDepot)) {
        console.log("la " + this.currentDocument.motifChangementDate);
        //console.log("this.currentDocument.motifChangementDate "+ this.currentDocument.motifChangementDate);
        // console.log("this.currentDocument.motifChangementDate.length "+this.currentDocument.motifChangementDate.length);
        if (!this.currentDocument.motifChangementDate ) {
          this.motifChangementDeDateRequired = true;
        }
      } else {
        if(!this.currentDocument.dateDepot && this.currentDocument.typeDocument=='Facture'){
          console.log("ici");
          this.currentDocument.dateDepot = this.currentDocument.datePiece;
          this.motifChangementDeDateRequired = false;
        }
        this.motifChangementDeDateRequired = false;
      }

    }

  }







  showAnnulationModificationModal(secondModal: TemplateRef<any>) {
    this.nestedModalRefDocument =  this.modalService.show(secondModal, Object.assign({}, {class: 'modal-sm'}));
  }

  annulationModificationDocument(codeDocument,secondModal: TemplateRef<any>){
    this.nestedModalRefDocument.hide();
    this.currentDocument.updated = false;

  }

  annulationDocument(){
    this.nestedModalRefDocument.hide();
  }

  showAnnulationCancelModal(thirdModal: TemplateRef<any>) {
    this.nested2ModalRefDocument =  this.modalService.show(thirdModal, Object.assign({}, {class: 'modal-sm'}));
  }

  checkCanceledDocument(thirdModal: TemplateRef<any>){

    if(this.currentDocument.updated &&  !this.typdeBloquageRequired && !this.motifRequired &&  !this.motifChangementDeDateRequired &&  !this.montantRetenuGarantieRequired && !this.dateFinGarentieRequired){
      this.onEditDocument(null);
      this.modalRefDocument.hide();
    }else{
      this.motifRequired=false;
      this.dateFinGarentieRequired=false;
      this.montantRetenuGarantieRequired = false;
      this.motifChangementDeDateRequired= false;
      this.typdeBloquageRequired=false;

      this.modalRefDocument.hide();
    }

    /*if(this.currentDocument.updated){
      this.showAnnulationCancelModal(thirdModal);
    }else{
      this.modalRef.hide();
    }*/
  }

  annulationDocument2(){
    this.nested2ModalRefDocument.hide();
  }

  checkingCurrentStatut(statut:String){
    if(this.currentDocument.statut != statut){
      return true;
    }else{
      return false;
    }
  }

  ignoreDocument2(){
    this.nested2ModalRefDocument.hide();
    this.modalRefDocument.hide();
  }

  /*********Porduit ********/

  newContentCommentProduit : any;

  modalRefProduit:any;

  newEmployerIdProduit:any;

  pagedItemsProduit:any;


  onEditProduit(template: TemplateRef<any>) {

    //console.log("this.currentProjet "  + JSON.stringify(this.currentProjet));

    //console.log("new projet to send " + JSON.stringify(this.currentProjet));


    if(this.newContentCommentProduit != null ){
      console.log("here newContentComment");
      this.addCommentProduit();
    }

    let userUpdate = new User();
    userUpdate.username = this.authService.getUserName();
    this.currentProduit.updatedBy = userUpdate;


    this.etatStockService.updateProduit(this.currentProduit).subscribe((data: Produit) => {
      this.currentProduit.updated = false;
      //this.mode = 2;
      this.currentProduit.updated = false;
      //this.refreshProjets();
      //this.modalRef.hide();
    }, err => {
      this.currentProduit.updated = true;
      console.log(JSON.stringify(err));
      this.authService.logout();
      this.router.navigateByUrl('/login');
      console.log("error "  +JSON.stringify(err));

    });

  }

  selectProduit(event : Event,template: TemplateRef<any>){
    this.currentModal="PRODUIT";
    this.currentProduit = event.produit;
    this.setPageProduit(1);

    //console.log("this.currentProjet suivre" + this.currentProduit.suivre);
    this.mode = 1;

    this.filtredDataEventsProduit = this.dataSourceEventsProduit.filteredData;


    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalRefProduit = this.modalService.show(template,this.modalOption );

    var index = this.getIndexFromFiltrerdListProduit(this.currentProduit.id);
    this.indexProduit = index;
    this.updateEvent(event);
  }

  addCommentProduit(){

    if(this.newContentCommentProduit.length != 0) {
      let newCommentaire = new Commentaire();

      newCommentaire.date = new Date();
      // newCommentaire.user.username = "test";
      newCommentaire.content = this.newContentCommentProduit.split("\n").join("<br>");;
      newCommentaire.user = new User();
      newCommentaire.user.username = this.authService.getUserName();
      console.log("this.authService.getSigle "+ this.authService.getSigle());
      newCommentaire.user.sigle = this.authService.getSigle();

      if (this.newEmployerIdProduit != null ) {

        newCommentaire.employer = this.newEmployerIdProduit;

      }

      if (this.currentProduit.commentaires == null) {
        this.currentProduit.commentaires = new Array<Commentaire>();
      }

      this.currentProduit.commentaires.push(newCommentaire);

      this.currentProduit.commentaires.sort((a, b) => {
        return <any> new Date(b.date) - <any> new Date(a.date);
      });

      console.log(" this.currentProjet.commentaires " + this.currentProduit.commentaires);

      this.currentProduit.updated = true;
      this.setPageProduit(1);
      this.newContentCommentProduit = null;



    }



  }

  applyFilterEventsProduit(filterValue: string) {


    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceEventsProduit.filter = filterValue;
    this.currentFilterEventsProduit = filterValue;

    if (this.dataSourceEventsProduit.paginator) {
      this.dataSourceEventsProduit.paginator.firstPage();
    }





  }

  checkIFMorethanFifthMinuteAgo(commentaie : Commentaire){

    if(commentaie.user.sigle == 'SYSTEM'){
      return true;
    }

    if(commentaie.content.includes("CHANGEMENT_DATE_ENC")){
      return true;
    }


    let dateCom = moment(commentaie.date).add(15, 'minutes');

    return moment().isAfter(dateCom);
  }

  composeEmailProduit(produit : Produit){

    console.log("compose Email");

    var refProd = produit.itemCode;

    var nomProdut = produit.itemName;

    var mnt = produit.montant;

    var email="mailto:?subject="+this.removeAnd(produit.client)+" / "+ this.removeAnd(refProd)+" / " + this.removeAnd(nomProdut)+ "&body= Bonjour,%0A"
      +"Ce message concerne le produit cité en objet pour le projet .. et dont le détail est ci-après :%0A"
      + "Commercial: "+(produit.commercial  == null ? "": produit.commercial ) +"%0A"+
      "Chef projet: "+ (produit.chefProjet  == null ? "": produit.chefProjet ) +"%0A"+
      "BU: "+ (produit.bu  == null ? "": produit.bu ) +"%0A"+
      "Date CMD: "+moment(produit.dateCmd).format('DD/MM/YYYY')  +"%0A"+
      "QTE: "+ (produit.qte  == null ? "": produit.qte )+"%0A"+
      "Montant : "+(produit.montant  == null ? "": produit.montant +" DH")+"%0A"+" %0A"+" %0A";




    if(produit.commentaires!=null){

      let lastCommentaire1 = new Commentaire();
      lastCommentaire1= produit.commentaires[0];
      if(lastCommentaire1){
        email = email+ "%0A";
        email = email + "Je vous prie de consulter les commentaires en bas et d’agir en conséquence."+"%0A";
        email = email + "%0A";
        email = email +"Commentaires : %0A"+ moment(lastCommentaire1.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire1.user.sigle == null ? "": lastCommentaire1.user.sigle)+" : " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire1.content)+"%0A";
      }
      let lastCommentaire2 = new Commentaire();
      lastCommentaire2= produit.commentaires[1];
      if(lastCommentaire2)
        email = email + moment(lastCommentaire2.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire2.user.sigle == null ? "": lastCommentaire2.user.sigle)+" : " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire2.content)+"%0A";
      let lastCommentaire3 = new Commentaire();
      lastCommentaire3= produit.commentaires[2];
      if(lastCommentaire3)
        email = email + moment(lastCommentaire3.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire3.user.sigle == null ? "": lastCommentaire3.user.sigle)+" : "  +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire3.content)+"%0A";
    }
    console.log("email " + email);

    /*Insert commentaire ssytem with motif*/


    // this.motifAction =null;


    window.location.href = email;




  }



  setPageProduit(page: number) {

    console.log("this.currentProjet.commentaires " + this.currentProduit.commentaires);

    if(this.currentProduit.commentaires == null ||  this.currentProduit.commentaires.length==0) {
      console.log("null");
      this.pagerProduit = null;
      this.pagedItemsProduit = null;
      return;
    }else{

      this.pagerProduit = this.pagerService.getPager(this.currentProduit.commentaires.length, page);

      if (page < 1 || page > this.pagerProduit.totalPages  ) {
        return;
      }



      this.pagedItemsProduit = this.currentProduit.commentaires.slice(this.pagerProduit.startIndex, this.pagerProduit.endIndex + 1);

    }


    console.log("page " +  page );
    console.log("this.pager.totalPages " + this.pagerProduit.totalPages);

    // get pager object from service
    this.pagerProduit = this.pagerService.getPager(this.currentProduit.commentaires.length, page);

    // get current page of items

  }

  deleteCommentaireProduit(commentaire : any){
    console.log("delete comment");

    this.currentProduit.commentaires = this.currentProduit.commentaires.filter(item => item !== commentaire);
    this.currentProduit.updated = true;
    this.setPageProduit(1);

  }

  checkCanceledProduit(thirdModal: TemplateRef<any>){

    if(this.currentProduit.updated){
      this.onEditProduit(null);
      this.modalRefProduit.hide();
    }else{
      this.modalRefProduit.hide();
    }

    /*if(this.currentProjet.updated){
      this.showAnnulationCancelModal(thirdModal);
    }else{
      this.modalRef.hide();
    }*/
  }

  indexProjet=0;

  goToPrecedentProjet(codeProjet) {

    var index = this.getIndexFromFiltrerdListProjet(codeProjet);



    console.log("index found " + index);
    if (index - 1 >= 0) {
      var precedIndex = index - 1;
  console.log("preced " + precedIndex);
      this.indexProjet = precedIndex;

        //this.suivant = false;
        if (precedIndex != null && precedIndex >= 0 && precedIndex < this.filtredDataEventsProjet.length) {
        console.log("preced projet "+   this.filtredDataEventsProjet[precedIndex].projet );
          this.currentProjet = this.filtredDataEventsProjet[precedIndex].projet;
          this.setPageProjet(1);
          console.log("here");
          this.mode = 1;
        }
    }
  }

  goToSuivantProjet(eventId){
     console.log("eventId " + eventId);
     console.log("this.filtredDataEventsProjet.length "+ this.filtredDataEventsProjet.length);
      var index = this.getIndexFromFiltrerdListProjet(eventId);
      console.log("index " + index);

      var suivantIndex = index + 1;
      console.log("index suivantIndex " + suivantIndex);

        if(suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.filtredDataEventsProjet.length){
          console.log("here");
          this.indexProjet = suivantIndex;
          this.currentProjet = this.filtredDataEventsProjet[suivantIndex].projet;
          this.setPageProjet(1);
          this.updateEvent(this.filtredDataEventsProjet[suivantIndex]);
         // this.ref.detectChanges();
        }



  }

  getIndexFromFiltrerdListProjet(id){
    for(var i=0;i<this.filtredDataEventsProjet.length;i++){
      console.log("this.filtredDataEventsProjet[i].projet.codeProjet " + this.filtredDataEventsProjet[i].projet.codeProjet);
      console.log("id " + id);
      if(this.filtredDataEventsProjet[i].projet.codeProjet == id){
        console.log("pos " + i);
        return i;
        break;
      }
    }
  }
  getIndexFromFiltrerdListDocument(id) {
    console.log("this.filtredData.size " + this.filtredDataEventsDocument.length);
    for (var i = 0; i < this.filtredDataEventsDocument.length; i++) {
      console.log("this.filtredData[i] " + this.filtredDataEventsDocument[i].id);
      if (this.filtredDataEventsDocument[i].document.codePiece == id) {
        return i;
        break;
      }
    }
  }

  getIndexFromFiltrerdListProduit(id) {
    console.log("this.filtredData.size " + this.filtredDataEventsProduit.length);
    for (var i = 0; i < this.filtredDataEventsProduit.length; i++) {
      if (this.filtredDataEventsProduit[i].produit.id == id) {
        return i;
        break;
      }
    }
  }

  goToPrecedentDocument(codePiece) {

    var index = this.getIndexFromFiltrerdListDocument(codePiece);

    console.log("index found " + index);
    if (index - 1 >= 0) {
      var precedIndex = index - 1;
      this.indexDocument = precedIndex;
      //this.suivant = false;
      if (precedIndex != null && precedIndex >= 0 && precedIndex < this.filtredDataEventsDocument.length) {

        this.currentDocument = this.filtredDataEventsDocument[precedIndex].document;
        this.setPageDocument(1);
        this.mode = 1;
      }
    }
  }

  indexDocument;
  goToSuivantDocument(eventId){
    var index = this.getIndexFromFiltrerdListDocument(eventId);
    console.log("index " + index);

    var suivantIndex = index + 1;
    console.log("index suivantIndex " + suivantIndex);

    if(suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.filtredDataEventsDocument.length){
      console.log("here");
      this.indexDocument = suivantIndex;
      //this.ref.detectChanges();
    }
    this.currentDocument = this.filtredDataEventsDocument[suivantIndex].document;
    this.setPageDocument(1);
    this.updateEvent(this.filtredDataEventsDocument[suivantIndex]);
    this.mode=1;
  }

  goToPrecedentProduit(id) {

    var index = this.getIndexFromFiltrerdListProduit(id);

    console.log("index found " + index);
    if (index - 1 >= 0) {
      var precedIndex = index - 1;
      this.indexProduit = precedIndex;
      //this.suivant = false;
      if (precedIndex != null && precedIndex >= 0 && precedIndex < this.filtredDataEventsProduit.length) {

        this.currentProduit = this.filtredDataEventsProduit[precedIndex].produit;
        this.setPageProduit(1);
        this.mode = 1;
      }
    }
  }

  indexProduit;
  goToSuivantProduit(eventId){
    var index = this.getIndexFromFiltrerdListProduit(eventId);
    console.log("index " + index);

    var suivantIndex = index + 1;
    console.log("index suivantIndex " + suivantIndex);

    if(suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.filtredDataEventsProduit.length){
      console.log("here");
      this.indexProduit = suivantIndex;
    //  this.ref.detectChanges();
    }

    this.currentProduit = this.filtredDataEventsProduit[suivantIndex].produit;
    this.setPageProduit(1);
    this.updateEvent(this.filtredDataEventsProduit[suivantIndex]);
    this.mode=1;
  }

  RIGHT_ARROW = 39;
  LEFT_ARROW = 37;
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    //event.preventDefault();

    let template:any;

    if (event.keyCode === this.RIGHT_ARROW ) {
      console.log("right");

      switch(this.currentModal){
        case "PROJET": this.goToSuivantProjet(this.currentProjet.codeProjet); break;
        case "PRODUIT": this.goToSuivantProduit(this.currentProduit.id);break;
        case "DOCUMENT": this.goToSuivantDocument(this.currentDocument.numPiece);break;
      }


    }

    if (event.keyCode === this.LEFT_ARROW) {

      switch(this.currentModal){
        case "PROJET": this.goToPrecedentProjet(this.currentProjet.codeProjet); break;
        case "PRODUIT": this.goToPrecedentProduit(this.currentProduit.id);break;
        case "DOCUMENT": this.goToPrecedentDocument(this.currentDocument.numPiece);break;
      }
    }
  }








}
