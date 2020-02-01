import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {EtatProjetService} from '../services/etatProjet.service';
import {EtatProjet} from '../../model/model.etatProjet';
import {Router} from '@angular/router';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Detail} from '../../model/model.detail';
import {Projet} from '../../model/model.projet';
import {Commentaire} from '../../model/model.commentaire';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Employer} from '../../model/model.employer';
import {Reunion} from '../../model/model.reunion';
import {PagerService} from '../services/pager.service';
import {FormControl} from '@angular/forms';
import {Statitics} from '../../model/model.statistics';
import {element} from 'protractor';
import * as moment from 'moment';
import {NgxSpinnerService} from 'ngx-spinner';
import {CurrencyPipe} from '@angular/common';
import {AuthenticationService} from '../services/authentification.service';
import {User} from '../../model/model.user';
import {host} from "../services/host";


@Component({
  selector: 'app-etat-projet',
  templateUrl: './etat-projet.component.html',
  styleUrls: ['./etat-projet.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EtatProjetComponent implements OnInit {

   pageProjet :any;
   currentPage : number = 1;
   pages :any;
   totalElement :number;
   currentFileUpload: File;
   progress: { percentage: number } = { percentage: 0 };

   currentProjet : Projet;
   returnedError : any;

  selectedFiles: FileList;

  keys : Array<string>;
  projets : Array<Projet>;

  viewUpload  : boolean =  false;



  employees : Array<Employer>;
  employeesAvantVente : Array<Employer>;

  clients : Array<String>;

  selectedClient :any;

  selectedClientTmp:any;

  commercials: Array<String>;

  selectedCommercial : any;

  chefProjets : Array<String>;

  selectedChefProjet : any;

  newContentComment : string;
  newDatePlannifier : Date;
  newEmployerId : any;

  mode : number;



  modalRef: BsModalRef;

  nestedModalRef : BsModalRef;

  nested2ModalRef : BsModalRef;

  nested3ModalRef : BsModalRef;

  nested4ModalRef : BsModalRef;

  actionModal : string;

  displayedColumns: string[] = ['option','client','bu','codeProjet','projet','age',  'commercial', 'chefProjet','montantCmd','restAlivrer','livrerNonFacture','livreFacturePayer','montantStock'];
  public dataSource: MatTableDataSource<Projet>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  filtredData : Array<Projet>;


  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  suivant : boolean;

  index : any;


  statitics: Statitics;

  modalOption: NgbModalOptions = {};

  etatProjet:EtatProjet;

  projetCloture : boolean = false;

  bu1 : string;

  bu2 : string;

  selectedBu : string;

  selectedStatut: string;

  selectedAffectation: string;

  currentFilter : string;
  /*commercialFilter = new FormControl();
  chefProjetFilter = new FormControl();
  globalFilter = '';
  filteredValues = {
    codeProjet: '', client: '', commercial: '',
    chefProjet: '',montantCmd:'',montantPayer:'',livrerNonFacture:'',age:''
  };*/
  roleReadAllProjects: boolean;

  roleReadMyProjects: boolean;

  roleReadAllRecouvrement :boolean;

  roleReadMyRecouvrement:boolean;

  userNameAuthenticated:string;

  sigleUserAuthenticated : string;

  service :string;

  userInSession : string;


  RIGHT_ARROW = 39;
  LEFT_ARROW = 37;
  blockedKey1 : boolean;

  roleReadProjectRs : boolean;
  roleReadProjectSi : boolean;
  motifAction : string;

  authorized : boolean = false;

  userAuthenticated:any;

  roleBuReseauSecurite;
  roleBuSystem;
  roleBuChefProjet;
  roleBuVolume;
  roleBuCommercial;

  constructor(private authService:AuthenticationService,private currency :CurrencyPipe,private spinner: NgxSpinnerService,private pagerService:PagerService,private etatProjetService: EtatProjetService, private router : Router,private modalService: BsModalService, viewContainerRef:ViewContainerRef,private ref: ChangeDetectorRef ) {

   this.service = this.authService.getServName();

   this.userAuthenticated = this.authService.getUserName();

    this.userInSession = this.authService.getLastName();

    this.authService.getRoles().forEach(authority => {
    console.log("authority " + authority);
      //this.authorized = false;
      if(authority== 'BU_COMMERCIAL'){
        this.roleBuCommercial = true;
        this.service = 'Commercial';
        this.authorized = true;

      }

      if(authority== 'BU_RESEAU_SECURITE'){
        this.roleBuReseauSecurite = true;
        this.bu1 = "VALUE_RS";
        this.selectedBu = "VALUE_RS";
        this.authorized = true;

      }

      if(authority== 'BU_CHEF_PROJET'){
        this.roleBuChefProjet = true;

        this.authorized = true;

      }

      if(authority== 'BU_SYSTEM'){
        this.roleBuSystem = true;
        this.bu1 = "VALUE_SI";
        this.selectedBu = "VALUE_SI";
        this.authorized = true;

      }

      if(authority== 'BU_VOLUME'){
        this.roleBuVolume = true;
        this.bu1 = "VOLUME";
        this.selectedBu = "VOLUME";
        this.authorized = true;

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
          if(this.service == 'Commercial'){
            this.selectedCommercial = this.userNameAuthenticated;
          }
          if(this.service == 'Chef Projet') {
            this.selectedChefProjet = this.userNameAuthenticated;
          }
        }else{
          this.userNameAuthenticated ="undefined"; // for not pass for undefined
        }

        }

      if (authority == 'READ_PROJECT_RS') {
        this.roleReadProjectRs = true;
        this.authorized = true;

      }

      if (authority == 'READ_PROJECT_SI') {

        this.roleReadProjectSi = true;
        this.authorized = true;

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

    this.getAllProjet(false,this.bu1);

    this.getAllEmployeesByService("Intervenant");

    this.getAllEmployeesAvantVente();

    this.getEtatProjet();

    this.getAllChefProjets();

   // this.getAllClients();

    this.getAllCommericals();
    console.log("this.authrozed" + this.authorized);



  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  setPage(page: number) {

      console.log("this.currentProjet.commentaires " + this.currentProjet.commentaires);

    if(this.currentProjet.commentaires == null ||  this.currentProjet.commentaires.length==0) {
      console.log("null");
      this.pager = null;
      this.pagedItems = null;
      return;
    }else{

      this.pager = this.pagerService.getPager(this.currentProjet.commentaires.length, page);

      if (page < 1 || page > this.pager.totalPages  ) {
        return;
      }



      this.pagedItems = this.currentProjet.commentaires.slice(this.pager.startIndex, this.pager.endIndex + 1);

    }


    console.log("page " +  page );
    console.log("this.pager.totalPages " + this.pager.totalPages);

    // get pager object from service
    this.pager = this.pagerService.getPager(this.currentProjet.commentaires.length, page);

    // get current page of items

  }

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

  getAllEmployees(){
    this.etatProjetService.getAllEmployees().subscribe(
      (data: Array<Employer>)=>{
        this.employees = data;
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }

  getStatistics(){
    this.filtredData = this.dataSource.filteredData;
    let totalRal = 0;
    let totalLnf = 0;
    let totalRalLnfBeforeSevenMonth = 0;

    this.filtredData.forEach(element=>{
      totalRal = totalRal + element.restAlivrer;
      totalLnf = totalLnf + element.livrerNonFacture;

      if( moment(element.dateCmd)  <=  moment(this.addMonths(new Date(), -7))){
        totalRalLnfBeforeSevenMonth = totalRalLnfBeforeSevenMonth + element.restAlivrer + element.livrerNonFacture;
      }



    });



    this.statitics = new Statitics();
    this.statitics.totalRal = totalRal;
    this.statitics.totalLnf  = totalLnf;
    this.statitics.totalLnfRalSevenMonth = totalRalLnfBeforeSevenMonth;
  }

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

  getAllChefProjets(){
    this.etatProjetService.getDistinctChefProjetProjet().subscribe(
      (data: Array<String>)=>{
        this.chefProjets = data;
        this.chefProjets.sort();
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }

  getAllCommericals(){
    this.etatProjetService.getDistinctCommercialProjet().subscribe(
      (data: Array<String>)=>{
        this.commercials = data;
        this.commercials.sort();
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }

  getAllClients(){
    this.etatProjetService.getDistinctClientProjet().subscribe(
      (data: Array<String>)=>{
        this.clients = data;
        this.clients.sort();
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }



 getEtatProjet(){
    this.etatProjetService.getEtatProjet().subscribe(
      (data:EtatProjet)=>{
      this.etatProjet = data;
      this.etatProjet.lastUpdate = data.lastUpdate;
      this.ref.detectChanges();
      },
      err=>{
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(err));
      }
    )
 }

 refreshAllProjetsFromSAP(){
   this.spinner.show();
   this.etatProjetService.refreshProjets().subscribe(
     data=>{

       console.log("data "+ data);
       this.refreshProjets();
       this.ref.detectChanges();
       this.spinner.hide();
     },
     err=>{
       console.log("error "+ JSON.stringify(err));

       this.refreshProjets();
       this.ref.detectChanges();
       this.spinner.hide();


     }
   )
   //this.spinner.hide();
 }


  getAllProjet(cloture:boolean,bu1 : string){

    if(this.selectedClient == null){
      this.selectedClientTmp = "undefined";
    }else{
      this.selectedClientTmp = this.selectedClient;
    }

    if(this.roleReadMyProjects && this.service == 'Commercial'){
      this.selectedCommercial = this.userNameAuthenticated;
    }

    if(this.roleReadMyProjects && this.service == 'Chef Projet'){
      this.selectedChefProjet = this.userNameAuthenticated;
    }

    if(this.roleReadProjectRs){
      this.bu1 = 'VALUE_RS';
    }
    if(this.roleReadProjectSi){
      this.bu1 = 'VALUE_SI';
    }

    if(this.bu1 === "VALUE_RS" || this.bu1==="VALUE_SI"){
      this.bu2 = "VALUE_SI / VALUE_RS";
    }else{
      this.bu2 = "undefined";
    }

    this.etatProjetService.getProjets(cloture,bu1,this.bu2,this.selectedStatut,this.selectedCommercial,this.selectedChefProjet,this.selectedClientTmp,this.selectedAffectation).subscribe(
      data=>{
        this.pageProjet = data;

        this.keys = new Array<string>();



        this.keys.push("codeProjet");

        if(this.pageProjet!=null) {


          if (this.pageProjet[0] != null && this.pageProjet[0].detaills != null) {
            this.pageProjet[0].details.forEach(element => {
              console.log(element.header.label);
              let a: string;
              a = element.header.label;
              this.keys.push(a);

            });
          }


          this.projets = new Array<Projet>();
          this.clients = new Array<String>();
          this.pageProjet.forEach(projet => {
            let p = new Projet();
            p.codeProjet = projet.codeProjet;

            p.client = projet.client;
            p.codeClient = projet.codeClient;

            if( p.client!=null &&this.clients.indexOf(p.client) === -1) {
              this.clients.push(p.client);
            }

            p.commercial = projet.commercial;
            p.codeCommercial = projet.codeCommercial;

            p.chefProjet = projet.chefProjet;


            p.age = projet.age;
            if (projet.age > 182) {
              p.isMoreThanSixMonth = true;
            }

            p.age = projet.age;
            p.projet = projet.projet;
            if (projet.bu != null) {
              p.bu = projet.bu;
            } else {
              p.bu = "";
            }
            p.montantCmd = projet.montantCmd;
            p.dateCmd = projet.dateCmd;
            p.statut = projet.statut;

            p.facturation = projet.facturation;
            p.lastUpdate = projet.lastUpdate;
            p.montantPayer = projet.montantPayer;
            p.risque = projet.risque;
            p.perimetreProjet = projet.perimetreProjet;
            p.avantVente = projet.avantVente;
            p.intervenantPrincipal = projet.intervenantPrincipal;
            p.suivre = projet.suivre;
            p.updatedBy = projet.updatedBy;
            p.infoClient = projet.infoClient;
            p.infoFournisseur = projet.infoFournisseur;
            p.infoProjet = projet.infoProjet;


            p.ralJrsPrestCalc = projet.ralJrsPrestCalc;
            p.prestationCommande = projet.prestationCommande;
            p.refCom = projet.refCom;
            p.restAlivrer = projet.restAlivrer;
            p.livreFacturePayer = projet.livreFacturePayer;
            p.livraison = projet.livraison;
            p.livrer = projet.livrer;
            p.livrerNonFacture = projet.livrerNonFacture;
            p.factEncours = projet.factEncours;
            p.cloture = projet.cloture;
            p.decloturedByUser = projet.decloturedByUser;
            p.priorite = projet.priorite;
            p.datePvReceptionDefinitive = projet.datePvReceptionDefinitive;
            p.datePvReceptionProvisoire = projet.datePvReceptionProvisoire;
            p.syntheseProjet = projet.syntheseProjet;


            if (projet.commentaires != null && projet.commentaires.length > 0) {
              p.commentaires = projet.commentaires;
            }

            p.action = projet.action;
            p.cloture = projet.cloture;
            p.condPaiement = projet.condPaiement;
            p.dateFinProjet = projet.dateFinProjet;
            p.garantie = projet.garantie;
            p.designProjet = projet.designProjet;
            p.creation = projet.creation;
            p.maintenance = projet.maintenance;
            p.preRequis = projet.preRequis;
            p.intervenant = projet.intervenant;
            p.codeCommercial = projet.codeCommercial;
            p.montantStock = projet.montantStock;
            p.decloturedByUser = projet.decloturedByUser;

            if(p.dateFinProjet!=null){

              if(moment(p.dateFinProjet)  <  moment()){
                p.retarder = '#retard';
              }

            }


            let details = new Array<Detail>();
            if (projet.details != null) {
              projet.details.forEach(detailParse => {
                details.push(new Detail(detailParse.header.label, detailParse.value));
              })
            }

            p.details = details;
            this.projets.push(p);


          });
        }

        this.clients.sort();



        this.dataSource =  new MatTableDataSource(this.projets);
        this.dataSource.filterPredicate = function(data, filter: string): boolean {


            return (data.client !=null ? data.client : "").toLowerCase().includes(filter) ||
              data.bu.toLowerCase().includes(filter) ||
              (data.chefProjet !=null ? data.chefProjet : "").toLowerCase().includes(filter) ||
              (data.bu !=null ? data.bu : "").toLowerCase().includes(filter) ||
              (data.commercial !=null ? data.commercial : "").toLowerCase().includes(filter) ||
              (data.intervenantPrincipal !=null ? data.intervenantPrincipal : "").toLowerCase().includes(filter) ||
              (data.intervenantSecondaire !=null ? data.intervenantSecondaire : "").toLowerCase().includes(filter) ||
              (data.projet !=null ? data.projet : "").toLowerCase().includes(filter) ||
            (data.codeProjet !=null ? data.codeProjet : "").toLowerCase().includes(filter) ||
            (data.age !=null ? data.age : "").toString().toLowerCase().includes(filter) ||
              (data.priorite !=null ? data.priorite : "").toString().toLowerCase().includes(filter) ||
              (data.retarder !=null ? data.retarder : "").toString().toLowerCase().includes(filter) ||
            (data.codeProjet !=null ? data.codeProjet : "").toLowerCase()
            === filter ;
        };
        this.dataSource.paginator = this.paginator;
        console.log("page size " + this.paginator.pageSize );
        this.dataSource.sort = this.sort;
       // this.dataSource.connect().subscribe(d => this.filtredData = d);
        if(this.currentFilter!=null)
        this.applyFilter(this.currentFilter);
        this.getStatistics();



      },err=>{
       // alert("erreur " + err);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(err));
      }
    )

  }


  selectProjet(projet : Projet,template: TemplateRef<any>){
    this.currentProjet = projet;
    this.setPage(1);



    console.log("this.currentProjet suivre" + this.currentProjet.suivre);
    this.mode = 1;

    this.filtredData = this.dataSource.filteredData;

    var index = this.getIndexFromFiltrerdList(this.currentProjet.codeProjet);
    this.index = index;







    //console.log("this.filtredData  " + JSON.stringify(this.filtredData ));

   // console.log("this.filtredData size  " + this.filtredData.length );
    console.log("current Projet " + JSON.stringify(this.currentProjet));

    /*if(this.currentProjet.firstCommentaire != null && this.currentProjet.secondCommentaire != null){
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

    this.etatProjetService.getEmployeesByName(filterValue).subscribe(
      (data: Array<Employer>)=>{
        console.log("datalength " + data.length);
        if(data.length == 1){
          console.log("here");
          this.newEmployerId = data[0].sigle;
        }else{
          this.newEmployerId = null;
        }
      },error => {
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
    const myFilterPredicate = (data: Projet, filter: string): boolean => {
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
      return data.chefProjet.toString().trim().indexOf(searchString.position) !== -1 &&
        data.commercial.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }*/

  ngOnInit() {

    this.selectedBu = "undefined";
    this.selectedStatut = "undefined";
    this.selectedCommercial = "undefined";
    this.selectedClient = null;
    this.selectedChefProjet = "undefined";


    this.selectedAffectation = "undefined";





   /* this.commercialFilter.valueChanges.subscribe((commercialFiltreValue) => {
      this.filteredValues['commercial'] = commercialFiltreValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.chefProjetFilter.valueChanges.subscribe((chefProjetFiltreValue) => {
      this.filteredValues['chefProjet'] = chefProjetFiltreValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.dataSource.filterPredicate = this.customFilterPredicate();*/

    //this function waits for a message from alert service, it gets
    //triggered when we call this from any other component




  }

  initFilter(){
    this.selectedBu = "undefined";
    this.selectedStatut = "undefined";
    this.selectedCommercial = "undefined";
    this.selectedClient = null;
    this.selectedChefProjet = "undefined";
    this.dataSource.filter = null;
    this.selectedAffectation="undefined";
    this.currentFilter="";
    //bu1
    this.getAllProjet(false,this.selectedBu);
  }





  doSearch(){
   console.log("this. "+ this.etatProjet.id);
    if(this.bu1 === "VALUE_RS" || this.bu1==="VALUE_SI"){
      this.bu2 = "VALUE_SI / VALUE_RS";
    }else{
      this.bu2 = "undefined";
    }

    if(this.selectedClient ==null){
      this.selectedClient= "undefined";
    }

    this.etatProjetService.getProjets(this.projetCloture,this.bu1,this.bu2,this.selectedStatut,this.selectedCommercial,this.selectedChefProjet,this.selectedClient,this.selectedAffectation).subscribe(
      data=>{
        console.log("data Search " + JSON.stringify(data));
        this.pageProjet = data;
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
    this.etatProjetService.pushFileToStorage2(this.currentFileUpload).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.refreshProjets();
        this.getStatistics();
        this.viewUpload = false;
        this.currentFileUpload = null;
      }
    });

    this.selectedFiles = undefined;
  }

  activeUpload(){
    //this.viewUpload = true;
    this.refreshAllProjetsFromSAP();
  }

  cancelUpload(){
    this.viewUpload = false;
  }

  /*openModal() {
    const modalRef = this.modalService.open(ConsultProjetComponent);
    modalRef.componentInstance.currentProjet = this.pageProjet[0];

    modalRef.result.then((updatedProject) => {
      if (updatedProject) {
        console.log("updatedProject" +  updatedProject);
      }
    });

  }*/

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  refreshProjets(){
    this.getAllProjet(this.projetCloture,this.bu1);
    this.getEtatProjet();
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
      // newCommentaire.user.username = "test";
      newCommentaire.content = this.newContentComment;
      newCommentaire.user = new User();
      newCommentaire.user.username = this.authService.getUserName();
      console.log("this.authService.getSigle "+ this.authService.getSigle());
      newCommentaire.user.sigle = this.authService.getSigle();



      if (this.newEmployerId != null ) {
        console.log("this.newEmployerId" + this.newEmployerId)
        newCommentaire.employer = this.newEmployerId;

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
      this.setPage(1);
      this.newContentComment = null;
      //this.newEmployerId = null;
      this.newDatePlannifier = null;


    }



  }

  addCommentSystem(motif){

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
      this.setPage(1);
      this.motifAction = null;
      //this.newEmployerId = null;
      this.newDatePlannifier = null;

      let userUpdate = new User();
      userUpdate.username = this.userAuthenticated;
      this.currentProjet.updatedBy = userUpdate;


      this.etatProjetService.updateProjet(this.currentProjet).subscribe((data: Projet) => {
        //this.currentProjet.updated = false;
        //this.mode = 2;
        //this.currentProjet.updated = false;
        //this.refreshProjets();
        //this.modalRef.hide();
      }, err => {
        this.currentProjet.updated = true;
        console.log(JSON.stringify(err));
        this.returnedError = err.error.message;
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(err));

      });


    }



  }

  onEditProjet(template: TemplateRef<any>) {

    //console.log("this.currentProjet "  + JSON.stringify(this.currentProjet));

    //console.log("new projet to send " + JSON.stringify(this.currentProjet));


    if(this.newContentComment != null ){
      console.log("here newContentComment");
      this.addComment();
    }

    let userUpdate = new User();
    userUpdate.username = this.userAuthenticated;
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
      this.returnedError = err.error.message;
      this.authService.logout();
      this.router.navigateByUrl('/login');
      console.log("error "  +JSON.stringify(err));

    });

  }

   getIndexFromFiltrerdList(codeProjet){
    console.log("this.filtredData.size " + this.filtredData.length);
    for(var i=0;i<this.filtredData.length;i++){
      console.log("this.filtredData[i] " + this.filtredData[i].codeProjet);
      if(this.filtredData[i].codeProjet == codeProjet){
        return i;
        break;
      }
    }
  }

  goToPrecedent(codeProjet,template){

    var index = this.getIndexFromFiltrerdList(codeProjet);

    console.log("page " + this.paginator.pageSize / index);

    console.log("index found " + index);
    if(index-1 >=0) {
      var precedIndex = index - 1;

      this.index = precedIndex;
      if (this.currentProjet.updated) {
        //this.showDialog();
        //this.showAnnulationModificationModal(template);
        this.onEditProjet(null);
        //this.suivant = false;
        if (precedIndex != null && precedIndex >= 0 && precedIndex < this.filtredData.length) {
          this.currentProjet = this.filtredData[precedIndex];
          this.setPage(1);
          this.mode = 1;
        }
      }

      if (!this.currentProjet.updated && precedIndex != null && precedIndex >= 0 && precedIndex < this.filtredData.length) {
        this.currentProjet = this.filtredData[precedIndex];
        this.setPage(1);
        this.mode = 1;
      }
    }


  }

  goToSuivant(codeProjet,template){


    var index = this.getIndexFromFiltrerdList(codeProjet);
    console.log("paginator size " + this.paginator.pageSize);
    console.log("index " + index);



    var suivantIndex = index + 1;
    console.log("index suivantIndex " + suivantIndex);

    if(this.currentProjet.updated){
      //this.showDialog();
      //this.showAnnulationModificationModal(template);
      this.onEditProjet(null);

      if(suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.filtredData.length){
        console.log("here");
        this.index = suivantIndex;
        console.log("page " +   Math.floor( this.index/this.paginator.pageSize));
        this.paginator.pageIndex = Math.floor( this.index/this.paginator.pageSize);
        console.log("this.paginator.pageIndex= " + this.paginator.pageIndex);

        this.ref.detectChanges();
      }
        this.currentProjet = this.filtredData[suivantIndex];
        this.setPage(1);
        this.mode=1;
           // console.log("index " + this.index);



      //this.suivant = true;
    }

    if(!this.currentProjet.updated && suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.filtredData.length){
      console.log("here");
      this.index = suivantIndex;
      console.log("page " +   Math.floor( this.index/this.paginator.pageSize));
      this.paginator.pageIndex = Math.floor( this.index/this.paginator.pageSize);
      this.ref.detectChanges();
      this.currentProjet = this.filtredData[suivantIndex];
      this.setPage(1);
      this.mode=1;


    }


  }

  deleteCommentaire(commentaire : any){
    console.log("delete comment");

    this.currentProjet.commentaires = this.currentProjet.commentaires.filter(item => item !== commentaire);
    this.currentProjet.updated = true;
    this.setPage(1);

  }

  switchMode(){
    this.mode = 1;
  }


 updated(event){
    console.log("updated");
    event.preventDefault();
    this.currentProjet.updated = true;
    this.ref.detectChanges();
 }





  showAnnulationModificationModal(secondModal: TemplateRef<any>) {
    this.nestedModalRef =  this.modalService.show(secondModal, Object.assign({}, {class: 'modal-sm'}));
  }

  annulationModificationProjet(codeProjet,secondModal: TemplateRef<any>){
     this.nestedModalRef.hide();
    this.currentProjet.updated = false;
     if(this.suivant){
       console.log("here");
       this.goToSuivant(codeProjet,secondModal);
     }else{
       this.goToPrecedent(codeProjet,secondModal);
     }



  }

  annulation(){
    this.nestedModalRef.hide();
  }

  showAnnulationCancelModal(thirdModal: TemplateRef<any>) {
    this.nested2ModalRef =  this.modalService.show(thirdModal, Object.assign({}, {class: 'modal-sm'}));
  }

  showMotifModal( escalader :boolean, fourthModal: TemplateRef<any>) {
    console.log("here3");
    if(escalader){
      this.actionModal = "escalader";
    }else{
      this.actionModal = "datefin";
    }
    this.nested3ModalRef =  this.modalService.show(fourthModal, Object.assign({}, {class: 'modal-sm'}));
  }

  checkCanceled(thirdModal: TemplateRef<any>){

    if(this.currentProjet.updated){
      this.onEditProjet(null);
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

  annulation2(){
    this.nested2ModalRef.hide();
  }

  annulation3(){
    this.nested3ModalRef.hide();
  }

  annulation4(){
    this.nested4ModalRef.hide();
  }

  ignore2(){
    this.nested2ModalRef.hide();
    this.modalRef.hide();
  }

  ignore3(){
    this.nested3ModalRef.hide();

  }

  ignore4(){
    this.nested4ModalRef.hide();

  }

  addMonths(date, months) {
    date.setMonth(date.getMonth() + months);
    return date;
  }


  exportEtatProjet($event) {
    $event.stopPropagation();
    $event.preventDefault();

    console.log("filtre "+ this.dataSource.filter);
    var result= this.etatProjetService.exportEtatProjet(this.filtredData);

    var d = new Date();

    console.log("day " + d.getDay());
    var fileName = "EtatProjet-"+moment(new Date()).format("DD-MM-YYYY")+"-"+d.getHours()+"-"+d.getMinutes()+".xlsx";

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

  composeEmail(projet : Projet){

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

        email = email +"Commentaires : %0A"+ moment(lastCommentaire1.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire1.user.sigle == null ? "": this.removeAnd(lastCommentaire1.user.sigle))+" : " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+this.removeAnd(lastCommentaire1.content)+"%0A";
      }
       let lastCommentaire2 = new Commentaire();
      lastCommentaire2= projet.commentaires[1];
      if(lastCommentaire2)
      email = email + moment(lastCommentaire2.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire2.user.sigle == null ? "": this.removeAnd(lastCommentaire2.user.sigle))+" : " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+this.removeAnd(lastCommentaire2.content)+"%0A";
      let lastCommentaire3 = new Commentaire();
      lastCommentaire3= projet.commentaires[2];
      if(lastCommentaire3)
      email = email + moment(lastCommentaire3.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire3.user.sigle == null ? "": this.removeAnd(lastCommentaire3.user.sigle))+" : "  +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+this.removeAnd(lastCommentaire3.content)+"%0A";
    }
    console.log("email " + email);

    /*Insert commentaire ssytem with motif*/

   // this.addCommentSystem(this.motifAction);

    //this.motifAction =null;


    window.location.href = email;



    //this.annulation3();
  }

   removeAnd(str : string){
    return str.replace("&","et");
  }


  getProjetCloture(){
    this.projetCloture = true;
    this.getAllProjet(true,this.bu1);
  }

  getProjetOuvert(){
    this.projetCloture = false;
    this.getAllProjet(false,this.bu1);
  }

  selectFiltre(){
    console.log("this.selectedBu " + this.selectedBu);

    this.selectedAffectation = "undefined";
    if(this.selectedChefProjet !="undefined" || this.selectedStatut !="undefined" ||this.selectedClient !="undefined"
      ||this.selectedCommercial !="undefined" ||this.selectedBu !="undefined"){
      this.selectedAffectation = "undefined";
    }

    if(this.selectedBu == "none"){
      console.log("none");
      this.bu1 = undefined;
      this.bu2 = undefined;
    }else {
      console.log("not none");
        this.bu2 = undefined;
        this.bu1 = this.selectedBu;
    }
    this.getAllProjet(this.projetCloture,this.bu1);



  }

  showEtatRecouvrement(type,value){


    switch(type)
    {
      case 'codeCommercial':console.log("codeCommercial "+ value); this.router.navigate(['/etatRecouvrementCodeCommercial',value]); break;

      case 'chefProjet':console.log("chefProjet "+ value);this.router.navigate(['/etatRecouvrementChefProjet',value]); break;

      case 'codeClient':console.log("codeClient "+ value);this.router.navigate(['/etatRecouvrementCodeClient',value]); break;

      case 'codeProjet':console.log("codeProjet "+ value);this.router.navigate(['/etatRecouvrementCodeProjet',value]); break;


    }

  }



  showEtatStock(type,value){



    switch(type)
    {
      case 'codeProjet':console.log("codeProjet "+ value);

     let url =  '/#/etatStockCodeProjet/'+value;

        window.open(url, "_blank");





    }

  }

  checkIFMorethanFifthMinuteAgo(commentaie : Commentaire){

    if(commentaie.user.sigle == 'SYSTEM'){
      return true;
    }

    let dateCom = moment(commentaie.date).add(15, 'minutes');


    return moment().isAfter(dateCom);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    //event.preventDefault();

    let template:any;

    if (event.keyCode === this.RIGHT_ARROW && !this.blockedKey1) {
      console.log("right");
      this.goToSuivant(this.currentProjet.codeProjet,template);
    }

    if (event.keyCode === this.LEFT_ARROW  && !this.blockedKey1) {
      this.goToPrecedent(this.currentProjet.codeProjet,template);
    }
  }

  blockedKey(){
    this.blockedKey1 = true;
  }

  deBlockedKey(){
    this.blockedKey1 = false;
  }

  onSelectAllClient(){
    this.selectedClient = null;
    this.selectFiltre();
  }

  searchByAffectation(affecation :string) {
    console.log("aff "+ affecation);
    if(affecation == 'true'){
      this.selectedAffectation = 'true';
    }

    if(affecation == 'false'){
      this.selectedAffectation = 'false';
    }
;
    if(affecation == 'undefined'){
      this.selectedAffectation = 'undefined';
    }

    this.getAllProjet(false,'undefined');


  }

  clotureProjet(projet : Projet){
    this.etatProjetService.clotureProjet(projet).subscribe((data: Projet) => {
      this.currentProjet.updated = false;
      this.currentProjet.cloture = data.cloture;
      this.currentProjet.restAlivrer = data.restAlivrer;
      this.currentProjet.facturation = data.facturation;
      this.currentProjet.livreFacturePayer=data.livreFacturePayer;
      this.currentProjet.livrerNonFacture = data.livrerNonFacture;
      //this.mode = 2;
      this.currentProjet.updated = false;
      this.refreshProjets();
      //this.modalRef.hide();
    }, err => {
      this.currentProjet.updated = true;
      console.log(JSON.stringify(err));
      this.returnedError = err.error.message;
      this.authService.logout();
      this.router.navigateByUrl('/login');
      console.log("error "  +JSON.stringify(err));

    });
  }

  declotureProjet(projet : Projet){

    this.etatProjetService.declotureProjet(projet).subscribe((data: Projet) => {
      this.currentProjet.updated = false;
      console.log("data.cloture " + data.cloture);

      this.currentProjet.cloture = data.cloture;
      console.log("this.currentProjet.cloture " + this.currentProjet.cloture);
      this.currentProjet.decloturedByUser = data.decloturedByUser;
      //this.mode = 2;
      this.currentProjet.updated = false;
      this.refreshProjets();
      //this.modalRef.hide();
    }, err => {
      this.currentProjet.updated = true;
      console.log(JSON.stringify(err));
      this.returnedError = err.error.message;
      this.authService.logout();
      this.router.navigateByUrl('/login');
      console.log("error "  +JSON.stringify(err));

    });

  }

  checkDateFinInCurrentMonth(dateFinProjet: Date){

    if (moment(dateFinProjet).isBefore(new Date()) || moment(dateFinProjet).isSame(new Date(), 'month')) {
      return true;
    }else{
      return false;
    }

  }


  @HostListener('matSortChange', ['$event'])
  sortChange(e) {
    // save cookie with table sort data here
    this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort);
   // console.log("this.before [0] " + this.filtredData[0].codeProjet);
   // console.log("sorting table");
    //this.filtredData = this.dataSource.filteredData;

   // console.log("this.filtredData[0] " + this.filtredData[0].codeProjet);*/

  }



}
