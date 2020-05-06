import {
  ChangeDetectorRef, Component, HostListener, OnInit, TemplateRef, ViewChild,
  ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import {ContratService} from "../services/contrat.service";
import {User} from "../../model/model.user";
import {Contrat} from "../../model/model.contrat";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../services/authentification.service";
import {CurrencyPipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {PagerService} from "../services/pager.service";
import * as moment from "moment";
import {Commentaire} from "../../model/model.commentaire";
import {Echeance} from "../../model/model.echeance";
import {CommandeFournisseur} from "../../model/model.commandeFournisseur";
import {StatiticsContrat} from "../../model/model.statisticsContrat";
import {CommentaireEcheance} from "../../model/model.commentaireEcheance";
import {FactureEcheance} from "../../model/model.factureEcheance";

@Component({
  selector: 'app-contrat',
  templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContratComponent implements OnInit {


  pageContrat: any;
  currentPage: number = 1;
  pages: any;
  totalElement: number;

  progress: { percentage: number } = {percentage: 0};

  currentContrat: Contrat;
  returnedError: any;

  selectedFiles: FileList;

  keys: Array<string>;
  contrats: Array<Contrat>;

  viewUpload: boolean = false;

  newContentComment: string;
  newDatePlannifier: Date;
  newEmployerId: any;

  mode: number;

  modalRef: BsModalRef;

  nestedModalRef: BsModalRef;


  actionModal: string;

  displayedColumns: string[] = ['option', 'numMarche','nomPartenaire', 'description','pilote', 'sousTraiter',  'periodeFacturationLabel','montantContrat', 'montantFactureAn', 'montantRestFactureAn'];
  public dataSource: MatTableDataSource<Contrat>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  filtredData: Array<Contrat>;

  numMarches : Array<string>= new Array<string>();
  clients : Array<string>= new Array<string>();
  pilotes : Array<string> =new Array<string>();

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];


  suivant: boolean;

  index: any;

  modalOption: NgbModalOptions = {};




  currentFilter: string;

  roleReadAllProjects: boolean;

  roleReadMyProjects: boolean;

  roleReadAllRecouvrement: boolean;

  roleReadMyRecouvrement: boolean;

  roleReadAllStock: boolean;

  userNameAuthenticated: string;

  sigleUserAuthenticated: string;

  service: string;

  userInSession: string;


  RIGHT_ARROW = 39;
  LEFT_ARROW = 37;

  roleReadProjectRs: boolean;
  roleReadProjectSi: boolean;
  motifAction: string;

  nested2ModalRef : BsModalRef;

  userAuthenticated:any;

  authorized : boolean;


  roleBuReseauSecurite:any;
  roleBuSystem:any;
  roleBuChefProjet:any;
  roleBuVolume:any;
  roleBuCommercial:any;

  selectedClient:any = null;
  selectedNumMarche:any=null;
  selectedPilote:any=null;
  selectedSousTraiter:any=null;

  statistics : StatiticsContrat;


  roleReadAllContrats : boolean;
  roleReadMyContrats:boolean;



  initFilter(){
    this.selectedClient = null;
    this.selectedNumMarche=null;
    this.selectedPilote=null;
    this.selectedSousTraiter=null;
    this.dataSource.filter = null;
    this.currentFilter="";
    this.getAllContratByFiltre();
  }

  constructor(private activatedRoute:ActivatedRoute ,private authService: AuthenticationService, private currency: CurrencyPipe, private spinner: NgxSpinnerService, private pagerService: PagerService, private contratService: ContratService, private router: Router, private modalService: BsModalService, viewContainerRef: ViewContainerRef, private ref: ChangeDetectorRef) {


  }


  sortAll(){

  }

  ngOnInit() {
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
        if(this.roleReadMyContrats){
          this.getAllContratByFiltre();
        }else{
          this.getAllContrats(true);
        }

      }

    }
  }

 lastUpdate : any;
  getAllContrats(activeSpinner :boolean ) {
    if(activeSpinner) {
      this.spinner.show();
    }


    this.contratService.getAllContrats().subscribe(
      data => {
        this.spinner.hide();
        this.pageContrat = data;


        if (this.pageContrat != null) {
          this.contrats = new Array<Contrat>();
          this.pageContrat.forEach(contrat => {
            let p = new Contrat();
            this.lastUpdate=contrat.lastUpdate;
            p.numContrat =contrat.numContrat;
            p.pilote=contrat.pilote;
            p.nomPartenaire = contrat.nomPartenaire;

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
           p.contratSigne= contrat.contratSigne;
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
            p.echeances=contrat.echeances;
            p.commandesFournisseurs = contrat.commandesFournisseurs;
            p.factureEcheances=contrat.factureEcheances;

            for(var i=0;i<p.echeances.length;i++){
              if(p.echeances[i].commentaire==null){
                p.echeances[i].commentaire = new CommentaireEcheance();
                p.echeances[i].commentaire.id=0;
              }
              if(p.echeances[i].factures!=null){
               var t= p.echeances[i].factures.substring(1,p.echeances[i].factures.length-1);
                p.echeances[i].factures2=t.split(",");
              }
            }

            p.pieces=contrat.pieces;

            if(p.numMarche!=null && p.numMarche!="" && this.numMarches.indexOf(p.numMarche) === -1 ){
              this.numMarches.push(p.numMarche);
            }
            if(p.pilote!=null && p.pilote!="" && this.pilotes.indexOf(p.pilote) === -1 ){
              this.pilotes.push(p.pilote);
            }
            if(p.nomPartenaire!=null && p.nomPartenaire!="" && this.clients.indexOf(p.nomPartenaire) === -1 ){
              this.clients.push(p.nomPartenaire);
            }



            if (contrat.commentaires != null && contrat.commentaires.length > 0) {
              p.commentaires = contrat.commentaires;
            }

            this.contrats.push(p);


          });
        }

        this.sortAllArrays();




        this.ref.detectChanges()
        //console.log("loading contrat");
        this.dataSource = new MatTableDataSource(this.contrats);
        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return (data.nomPartenaire != null ? data.nomPartenaire : "").toLowerCase().includes(filter) ||
            (data.numContrat !=null ? data.numContrat : "").toString().toLowerCase().includes(filter) ||
            (data.pilote != null ? data.pilote : "").toLowerCase().includes(filter) ||
            (data.statut != null ? data.statut : "").toLowerCase().includes(filter) ||
            (data.occurenceFacturation != null ? data.occurenceFacturation : "").toLowerCase().includes(filter) ||
            (data.codeProjet != null ? data.codeProjet : "").toLowerCase().includes(filter) ||
            (data.nomSousTraitant != null ? data.nomSousTraitant : "").toLowerCase().includes(filter) ||
            (data.numMarche != null ? data.numMarche.toString() : "").toString().toLowerCase()
            === filter;
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;




        if (this.currentFilter != null)
          this.applyFilter(this.currentFilter);
        this.getStatistics();



      }, err => {
        // alert("erreur " + err);
        this.spinner.hide();
        this.authService.logout();
        this.router.navigateByUrl('/login');
        //console.log("error " + JSON.stringify(err));
      }
    )

    //this.getStatistics();

  }


  sortAllArrays(){

    this.clients.sort();
    this.contrats.sort();
    this.pilotes.sort();

  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.currentFilter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }



    this.getStatistics();


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

      if (this.currentContrat.commentaires == null) {
        this.currentContrat.commentaires = new Array<Commentaire>();
      }

      this.currentContrat.commentaires.push(newCommentaire);

      this.currentContrat.commentaires.sort((a, b) => {
        return <any> new Date(b.date) - <any> new Date(a.date);
      });




      //console.log(" this.currentProjet.commentaires " + this.currentContrat.commentaires);

      this.currentContrat.updated = true;
      this.setPage(1);
      this.newContentComment = null;
      //this.newEmployerId = null;
      this.newDatePlannifier = null;


    }



  }

  goToPrecedent(id,template){

    if(!this.errorUpdate){

    var index = this.getIndexFromFiltrerdList(id);

    //console.log("index found " + index);
    if(index-1 >=0) {
      var precedIndex = index - 1;

      this.index = precedIndex;
      if (this.currentContrat.updated) {
        //this.showDialog();
        //this.showAnnulationModificationModal(template);
        this.onEditContrat(null);
        //this.suivant = false;
        if (precedIndex != null && precedIndex >= 0 && precedIndex < this.filtredData.length) {
          this.currentContrat = this.filtredData[precedIndex];
          this.setPage(1);
          this.mode = 1;
        }
      }

      if (!this.currentContrat.updated && precedIndex != null && precedIndex >= 0 && precedIndex < this.filtredData.length) {
        this.currentContrat = this.filtredData[precedIndex];
        this.setPage(1);
        this.mode = 1;
      }
    }
    }


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

    this.currentContrat.commentaires = this.currentContrat.commentaires.filter(item => item !== commentaire);
    this.currentContrat.updated = true;
    this.setPage(1);
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




  selectContrat(contrat : Contrat,template: TemplateRef<any>){
    this.currentContrat = contrat;
    //console.log("ooccurence " + this.currentContrat.occurenceFacturationLabel);
    //console.log("ooccurence Facturation " + this.currentContrat.occurenceFacturation);
    this.setPage(1);

    this.setPage(1);

    ////console.log("this.currentProjet suivre" + this.currentContrat.suivre);
    this.mode = 1;

    this.filtredData = this.dataSource.filteredData;

    var index = this.getIndexFromFiltrerdList(this.currentContrat.numContrat);
    this.index = index;

    // this.modalRef = this.modalService.show(template,  { class: 'modal-lg'}); { windowClass : "myCustomModalClass"}
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalRef = this.modalService.show(template,this.modalOption );
  }

  setPage(page: number) {

    //console.log("this.currentProjet.commentaires " + this.currentContrat.commentaires);

    if(this.currentContrat.commentaires == null ||  this.currentContrat.commentaires.length==0) {
      //console.log("null");
      this.pager = null;
      this.pagedItems = null;
      return;
    }else{

      this.pager = this.pagerService.getPager(this.currentContrat.commentaires.length, page);

      if (page < 1 || page > this.pager.totalPages  ) {
        return;
      }



      this.pagedItems = this.currentContrat.commentaires.slice(this.pager.startIndex, this.pager.endIndex + 1);

    }


    //console.log("page " +  page );
    //console.log("this.pager.totalPages " + this.pager.totalPages);

    // get pager object from service
    this.pager = this.pagerService.getPager(this.currentContrat.commentaires.length, page);

    // get current page of items

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

        this.getAllContrats(false);
        this.spinner.hide();
        //console.log("data "+ data);
      },
      err=>{
        //console.log("error "+ JSON.stringify(err));
        this.getAllContrats(false);
        this.spinner.hide();
      }
    )
  }

  exportContrats($event){
    $event.stopPropagation();
    $event.preventDefault();

    //console.log("filtre "+ this.dataSource.filter);
    var result= this.contratService.exportContrat(this.filtredData);

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
        email = email +"Commentaires : %0A"+ moment(lastCommentaire1.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire1.user.sigle == null ? "": lastCommentaire1.user.sigle)+" : " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire1.content.split("<br>").join("%0A"))+"%0A";
      }
      let lastCommentaire2 = new Commentaire();
      lastCommentaire2= contrat.commentaires[1];
      if(lastCommentaire2)
        email = email + moment(lastCommentaire2.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire2.user.sigle == null ? "": lastCommentaire2.user.sigle)+" : " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire2.content.split("<br>").join("%0A"))+"%0A";
      let lastCommentaire3 = new Commentaire();
      lastCommentaire3= contrat.commentaires[2];
      if(lastCommentaire3)
        email = email + moment(lastCommentaire3.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire3.user.sigle == null ? "": lastCommentaire3.user.sigle)+" : "  +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire3.content.split("<br>").join("%0A"))+"%0A";
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


  goToSuivant(id,template){

    if(!this.errorUpdate){
  //console.log("goToSuivant");
    this.ref.detectChanges();

    var index = this.getIndexFromFiltrerdList(id);


    var suivantIndex = index + 1;
    //console.log("index suivantIndex " + suivantIndex);

    if(this.currentContrat.updated){
      //this.showDialog();
      //this.showAnnulationModificationModal(template);
      this.onEditContrat(null);

      if(suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.filtredData.length){
        //console.log("here");
        this.index = suivantIndex;
        this.currentContrat = this.filtredData[suivantIndex];
        this.setPage(1);
        this.mode=1;
      }

      //this.suivant = true;
    }

    if(!this.currentContrat.updated && suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.filtredData.length){
      //console.log("here");
      this.index = suivantIndex;
      this.currentContrat = this.filtredData[suivantIndex];
      this.setPage(1);
      this.mode=1;
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

  errorUpdate:boolean;
  onEditContrat(template: TemplateRef<any>) {

    ////console.log("this.currentProjet "  + JSON.stringify(this.currentProjet));

    ////console.log("new projet to send " + JSON.stringify(this.currentProjet));


    if(this.newContentComment != null ){
      //console.log("here newContentComment");
      this.addComment();
    }

    let userUpdate = new User();
    userUpdate.username = this.authService.getUserName();
    //this.currentContrat.updatedBy = userUpdate;

    this.contratService.addCommentaires(this.currentContrat.numContrat,this.currentContrat.commentaires).subscribe((data: Contrat) => {
      this.currentContrat.updated = false;
      //this.mode = 2;
      this.errorUpdate=false;

    }, err => {
      this.currentContrat.updated = true;
     this.errorUpdate=true;


    });

  }





  /*onEditContrat(template: TemplateRef<any>) {

    ////console.log("this.currentProjet "  + JSON.stringify(this.currentProjet));

    ////console.log("new projet to send " + JSON.stringify(this.currentProjet));


    if(this.newContentComment != null ){
      //console.log("here newContentComment");
      this.addComment();
    }

    let userUpdate = new User();
    userUpdate.username = this.userAuthenticated;
    //this.currentContrat.updatedBy = userUpdate;


    this.contratService.updateContrat(this.currentContrat).subscribe((data: Contrat) => {
      this.currentContrat.updated = false;
      //this.mode = 2;
      this.currentContrat.updated = false;

    }, err => {
      this.currentContrat.updated = true;
      //console.log(JSON.stringify(err));
      this.returnedError = err.error.message;
      this.authService.logout();
      this.router.navigateByUrl('/login');
      //console.log("error "  +JSON.stringify(err));

    });

  }*/


  getAllContratByFiltre(){

    this.spinner.show();

    this.contratService.contratsFilter(this.selectedNumMarche,this.selectedClient,this.selectedPilote,this.selectedSousTraiter).subscribe(
      data=>{
        this.pageContrat = data;
        this.spinner.hide();

        if (this.pageContrat != null) {

          this.contrats = new Array<Contrat>();
          this.pageContrat.forEach(contrat => {
            let p = new Contrat();
            p.numContrat =contrat.numContrat;
            p.pilote=contrat.pilote;
            p.nomPartenaire = contrat.nomPartenaire;
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
            p.contratSigne= contrat.contratSigne;
            p.codeProjet=contrat.codeProjet;
            p.numMarche=contrat.numMarche;
            p.pilote=contrat.pilote;
            p.montantContrat=contrat.montantContrat;
            p.periodeFacturation=contrat.periodeFacturation;
            switch (contrat.occurenceFacturationLabel){
              case"LE 01":p.occurenceFacturationLabel ="Début de période (Le 01)";break;
              case"LE 31":p.occurenceFacturationLabel ="Fin de période (Le 31)";break;
              default :p.occurenceFacturationLabel="Période non défini!";
            }
            p.periodeFacturationLabel=contrat.periodeFacturationLabel;
            p.montantValueSi=contrat.montantValueSi;
            p.montantValueRs=contrat.montantValueRs;
            p.montantValueSw=contrat.montantValueSw;
            p.montantVolume=contrat.montantVolume;
            p.montantCablage=contrat.montantCablage;
            p.montantAssitanceAn=contrat.montantAssitanceAn;
            p.echeances=contrat.echeances;
            p.commandesFournisseurs = contrat.commandesFournisseurs;
            p.factureEcheances=contrat.factureEcheances;

            for(var i=0;i<p.echeances.length;i++){
              if(p.echeances[i].commentaire==null){
                p.echeances[i].commentaire = new CommentaireEcheance();
                p.echeances[i].commentaire.id=0;
              }
              if(p.echeances[i].factures!=null){
                var t= p.echeances[i].factures.substring(1,p.echeances[i].factures.length-1);
                p.echeances[i].factures2=t.split(",");
              }
            }
            p.pieces=contrat.pieces;


            if (contrat.commentaires != null && contrat.commentaires.length > 0) {
              p.commentaires = contrat.commentaires;
            }

            this.contrats.push(p);


          });
        }

        this.sortAllArrays();

        this.ref.detectChanges()
        //console.log("loading my contrat");
        this.dataSource = new MatTableDataSource(this.contrats);
        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return (data.nomPartenaire != null ? data.nomPartenaire : "").toLowerCase().includes(filter) ||
            (data.numContrat !=null ? data.numContrat : "").toString().toLowerCase().includes(filter) ||
            (data.pilote != null ? data.pilote : "").toLowerCase().includes(filter) ||
            (data.statut != null ? data.statut : "").toLowerCase().includes(filter) ||
            (data.occurenceFacturation != null ? data.occurenceFacturation : "").toLowerCase().includes(filter) ||
            (data.codeProjet != null ? data.codeProjet : "").toLowerCase().includes(filter) ||
            (data.nomSousTraitant != null ? data.nomSousTraitant : "").toLowerCase().includes(filter) ||
            (data.numMarche != null ? data.numMarche.toString() : "").toString().toLowerCase()
            === filter;
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


        if (this.currentFilter != null)
          this.applyFilter(this.currentFilter);
        this.getStatistics();




      },err=>{
        this.authService.logout();
        this.router.navigateByUrl('/login');
        this.spinner.hide();
        //console.log("error "  +JSON.stringify(err));
      });
  }

  getStatistics(){
    var totalMontant = 0;
    var totalMontantFacture = 0;
    var totalMontantAfacture =0;

    var totalMontantProvisonFactureInfAn=0;
    var totalMontantProvisionAFactureInfAn=0;

    this.filtredData = this.dataSource.filteredData;


    this.filtredData.forEach(element=>{
      //console.log("element " + JSON.stringify(element));
      totalMontant = totalMontant + element.montantContrat;
      totalMontantFacture = totalMontantFacture + element.montantFactureAn;
      totalMontantAfacture = totalMontantAfacture + element.montantRestFactureAn;
      totalMontantProvisonFactureInfAn = totalMontantProvisonFactureInfAn + element.montantProvisionFactureInfAnneeEnCours;
      totalMontantProvisionAFactureInfAn = totalMontantProvisionAFactureInfAn + element.montantProvisionAFactureInfAnneeEnCours;

    });



    this.statistics = new StatiticsContrat();
    this.statistics.totalMontantAnnuel = totalMontant;
    this.statistics.totalMontantFactureAn=totalMontantFacture;
    this.statistics.totalMontantAFactureAn=totalMontantAfacture;
    this.statistics.totalMontantProvisionFactureAn=totalMontantProvisonFactureInfAn;
    this.statistics.totalMontantProvisionAFactureAn=totalMontantProvisionAFactureInfAn;

  }

  activeUpload(){
    //this.viewUpload = true;
    this.spinner.show();
   this.contratService.refreshContrats().subscribe(
     data=>{

       //console.log("data "+ data);
       this.refreshContrats();
       this.ref.detectChanges();
       this.spinner.hide();
     },
     err=>{
       //console.log("error "+ JSON.stringify(err));
       this.refreshContrats();
       this.spinner.hide();


     }
   )
  }

  @HostListener('matSortChange', ['$event'])
  sortChange(e) {
    // save cookie with table sort data here
    this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort);
    // //console.log("this.before [0] " + this.filtredData[0].codeProjet);
    // //console.log("sorting table");
    //this.filtredData = this.dataSource.filteredData;

    // //console.log("this.filtredData[0] " + this.filtredData[0].codeProjet);*/

  }

  onErrorUpdate(errorUpdateEcheanceCommentaireService){
    this.errorUpdate=errorUpdateEcheanceCommentaireService;
  }

  exportEtatContrat($event) {
    $event.stopPropagation();
    $event.preventDefault();

    //console.log("filtre "+ this.dataSource.filter);
    var result= this.contratService.exportContrat(this.filtredData);

    var d = new Date();

    //console.log("day " + d.getDay());
    var fileName = "EtatContrat-"+moment(new Date()).format("DD-MM-YYYY")+"-"+d.getHours()+"-"+d.getMinutes()+".xlsx";

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


  onAddNewEcheance(echeance : Echeance){

    let c = new Contrat();
    c.numContrat = this.currentContrat.numContrat;
    echeance.contrat= c;

    if(this.currentContrat.echeances==null){
      this.currentContrat.echeances = new Array<Echeance>();
    }

    let commentaire = new CommentaireEcheance();
    commentaire.id=0;
    echeance.commentaire=commentaire;

    this.currentContrat.echeances.push(echeance);

    this.currentContrat.echeances = [].concat(this.currentContrat.echeances);

    this.currentContrat.echeances.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.du).valueOf() - new Date(a.du).valueOf();

    });

    this.ref.detectChanges();

  }

  findIndexToUpdate(newItem) {
    return newItem.id === this;
  }


  onEditFactureEcheance(factureEcheance : FactureEcheance){

    this.currentContrat.factureEcheances = this.currentContrat.factureEcheances.filter(item => item.id !== factureEcheance.id);

    this.currentContrat.factureEcheances.push(factureEcheance);

    this.currentContrat.factureEcheances = [].concat(this.currentContrat.factureEcheances);

    this.currentContrat.factureEcheances.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      if(b.echeance!=null && a.echeance!=null){
        return new Date(b.echeance.du).valueOf() - new Date(a.echeance.du).valueOf();
      }else{
        return new Date(b.facture.dateEnregistrement).valueOf() - new Date(a.facture.dateEnregistrement).valueOf();
      }



    });

    this.ref.detectChanges();

  }

  onDeleteEcheance(echeance :Echeance){
    this.currentContrat.echeances = this.currentContrat.echeances.filter(item => item !== echeance);
    this.currentContrat.echeances = [].concat(this.currentContrat.echeances);
    this.ref.detectChanges();
  }




}
