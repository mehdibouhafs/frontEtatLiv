import {
  ChangeDetectorRef, Component, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Produit} from '../../model/model.produit';
import {Statitics} from '../../model/model.statistics';
import {StatiticsStock} from '../../model/model.statisticsStock';
import {ActivatedRoute, Router} from '@angular/router';
import {EtatStockService} from '../services/etatStock.service';
import {PagerService} from '../services/pager.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CurrencyPipe} from '@angular/common';
import {AuthenticationService} from '../services/authentification.service';
import {Commentaire} from '../../model/model.commentaire';
import * as moment from 'moment';
import {User} from '../../model/model.user';
import {EtatProjetService} from "../services/etatProjet.service";

@Component({
  selector: 'app-etat-stock',
  templateUrl: './etat-stock.component.html',
  styleUrls: ['./etat-stock.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EtatStockComponent implements OnInit {

  pageProduit: any;
  currentPage: number = 1;
  pages: any;
  totalElement: number;

  progress: { percentage: number } = {percentage: 0};

  currentProduit: Produit;
  returnedError: any;

  selectedFiles: FileList;

  keys: Array<string>;
  produits: Array<Produit>;

  viewUpload: boolean = false;

  selectedClient: any;

  selectedClientTMP: any;

  commercials: Array<String>;

  selectedCommercial: any;


  chefProjets: Array<String>;

  selectedChefProjet: any;

  newContentComment: string;
  newDatePlannifier: Date;
  newEmployerId: any;

  mode: number;

  modalRef: BsModalRef;

  nestedModalRef: BsModalRef;


  actionModal: string;

  displayedColumns: string[] = ['option', 'itemCode', 'description', 'nature', 'sousNature', 'domaine', 'sousDomaine', 'numLot', 'client', 'nomMagasin', 'qte','pmp', 'montant','dateEntre'];
  public dataSource: MatTableDataSource<Produit>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  filtredData: Array<Produit>;


  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];


  suivant: boolean;

  index: any;


  statitics: StatiticsStock;

  modalOption: NgbModalOptions = {};


  projetCloture: boolean = false;



  selectedNature: string;

  selectedSousNature: string;

  selectedDomaine: string;
  selectedSousDomaine: string;
  selectedLot: string;
  selectedLotTMP: any;
  selectedMagasin: string;


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

  natures : Array<string>= new Array<string>();
  sousNatures : Array<string>= new Array<string>();
  domaines : Array<string>= new Array<string>();
  sousDomaines : Array<string> = new Array<string>();
  numsLots : Array<string> = new Array<string>();
  clients : Array<string> = new Array<string>();
  magasins : Array<string> = new Array<string>();
  lastUpdate: Date;
  nested2ModalRef : BsModalRef;

  clientsList: Array<string>;

  authorized : boolean;


  roleBuReseauSecurite:any;
  roleBuSystem:any;
  roleBuChefProjet:any;
  roleBuVolume:any;
  roleBuCommercial:any;

  codeProjet : string;
  nature : string;
  selectedNatureTMP: string;


  constructor(private activatedRoute:ActivatedRoute,private etatProjetService:EtatProjetService ,private authService: AuthenticationService, private currency: CurrencyPipe, private spinner: NgxSpinnerService, private pagerService: PagerService, private etatStockService: EtatStockService, private router: Router, private modalService: BsModalService, viewContainerRef: ViewContainerRef, private ref: ChangeDetectorRef) {





  }


  sortAll(){
    this.natures.sort();
    this.sousNatures.sort();
    this.domaines.sort();
    this.sousDomaines.sort();
    this.numsLots.sort();
    this.clients.sort();
    this.magasins.sort();
  }

  ngOnInit() {
    this.service = this.authService.getServName();

    this.userInSession = this.authService.getLastName();



    this.authService.getRoles().forEach(authority => {

      if(authority== 'BU_VALUE_SOFTWARE'){
        this.authorized = false;
      }

      if(authority== 'BU_COMMERCIAL'){
        this.roleBuCommercial = true;
        //this.service = 'Commercial';
        this.authorized = true;

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

      if (authority == 'READ_ALL_PROJECTS') {
        this.roleReadAllProjects = true;
        this.authorized = true;

      }
      if (authority == 'READ_MY_PROJECTS') {
        this.roleReadMyProjects = true;
        this.authorized = true;
        //console.log("heee");
        if (this.authService.getLastName() != null) {
          this.userNameAuthenticated = this.authService.getLastName();
          if (this.service == 'Commercial') {
            this.selectedCommercial = this.userNameAuthenticated;
          }
          if (this.service == 'Chef Projet') {
            this.selectedChefProjet = this.userNameAuthenticated;
          }
        } else {
          this.userNameAuthenticated = "undefined"; // for not pass for undefined
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
        this.authorized = true;

      }
      if (authority == 'READ_MY_RECOUVREMENT') {
        this.roleReadMyRecouvrement = true;

        if (this.authService.getLastName() != null) {
          this.userNameAuthenticated = this.authService.getLastName();
        } else {
          this.userNameAuthenticated = "undefined";
        }

      }
    });

    this.sigleUserAuthenticated = this.authService.getSigle();

     this.codeProjet = this.activatedRoute.snapshot.params['codeProjet'];

     this.nature = this.activatedRoute.snapshot.params['nature'];

     if(this.nature!=null && this.codeProjet!=null){
      console.log("test filtre nature ok"+this.nature)
      this.selectedNature = this.nature;
      this.selectedNatureTMP = this.nature;
      this.selectedLot = this.codeProjet;
      this.selectedLotTMP = this.codeProjet;
      this.selectFiltre();
    }else{

      if(this.codeProjet!=null){

        this.selectedLot = this.codeProjet;
        this.selectedLotTMP = this.codeProjet;
        this.selectFiltre();
      }else{
        this.getAllProduits();
      }


    }







    this.getAllClients();
    this.getDistinctLot();
  }

  getDistinctLot(){
    this.etatStockService.getDistinctLot().subscribe(
      (data: Array<string>)=>{
        this.numsLots = data;
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        //console.log("error "  +JSON.stringify(error));
      }
    )
  }

  getAllClients(){
    this.etatProjetService.getDistinctClientProjet().subscribe(
      (data: Array<string>)=>{
        this.clients = data;
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        //console.log("error "  +JSON.stringify(error));
      }
    )
  }

  getAllProduits() {


    this.etatStockService.getAllProduits().subscribe(
      data => {
        this.pageProduit = data;


        if (this.pageProduit != null) {


          this.produits = new Array<Produit>();
          this.pageProduit.forEach(produit => {
            let p = new Produit();
            p.id = produit.id;

            switch(produit.codeMagasin){
              case '000': p.codeMagasin="com"; break;
              case 'APPRO': p.codeMagasin="appro"; break;
              case 'COMRAB': p.codeMagasin="com"; break;
              case 'DISPO': p.codeMagasin="dispo"; break;
              default: p.codeMagasin = produit.codeMagasin;
            }


            p.nomMagasin = produit.nomMagasin;
            //console.log("numLot"+p.nomMagasin);
            p.itemCode = produit.itemCode;
            p.itemName = produit.itemName;
            p.gerePar = produit.gerePar;
            p.nature = produit.nature;
            p.sousNature = produit.sousNature;
            p.domaine = produit.domaine;
            p.sousDomaine = produit.sousDomaine;
            p.marque = produit.marque;
            p.numLot = produit.numLot;

            p.client = produit.client;
            p.commercial = produit.commercial;
            p.chefProjet = produit.chefProjet;
            p.dateCmd = produit.dateCmd;
            p.bu = produit.bu;
            p.qte = produit.qte;
            p.qteRal = produit.qteRal;
            p.pmp = produit.pmp;
            p.montant = produit.montant;
            p.dateEntre = produit.dateEntre;
            p.commentaireArtcileProjet = produit.commentaireArtcileProjet;
            p.commentaireLot = produit.commentaireLot;
            p.commentaireReference = produit.commentaireReference;
            p.lastUpdate = produit.lastUpdate;


            if (produit.commentaires != null && produit.commentaires.length > 0) {
              p.commentaires = produit.commentaires;
            }

            this.addToArray(p.client,'client');this.addToArray(p.nature,'nature');
            this.addToArray(p.sousNature,'sousNature');this.addToArray(p.domaine,'domaine');
            this.addToArray(p.sousDomaine,'sousDomaine');this.addToArray(p.numLot,'numLot');
            this.addToArray(p.nomMagasin,'magasin');




            this.produits.push(p);


          });
        }


        this.lastUpdate = this.produits[0].lastUpdate;
        this.sortAllArrays();
        this.clientsList = this.clients;

        //console.log("clients " + this.clients);
        this.ref.detectChanges()

        this.dataSource = new MatTableDataSource(this.produits);
        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return (data.client != null ? data.client : "").toLowerCase().includes(filter) ||
            (data.chefProjet != null ? data.chefProjet : "").toLowerCase().includes(filter) ||
            (data.bu != null ? data.bu : "").toLowerCase().includes(filter) ||
            (data.commercial != null ? data.commercial : "").toLowerCase().includes(filter) ||
            (data.itemCode != null ? data.itemCode : "").toLowerCase().includes(filter) ||
            (data.itemName != null ? data.itemName : "").toLowerCase().includes(filter) ||
            (data.nature != null ? data.nature : "").toLowerCase().includes(filter) ||
            (data.sousNature != null ? data.sousNature : "").toLowerCase().includes(filter) ||
            (data.domaine != null ? data.domaine : "").toString().toLowerCase().includes(filter) ||
            (data.sousDomaine != null ? data.sousDomaine : "").toString().toLowerCase().includes(filter) ||
            (data.numLot != null ? data.numLot : "").toString().toLowerCase().includes(filter) ||
            (data.codeMagasin != null ? data.codeMagasin : "").toString().toLowerCase().includes(filter) ||
            (data.nomMagasin != null ? data.nomMagasin : "").toLowerCase()
            === filter;
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.currentFilter != null)
          this.applyFilter(this.currentFilter);
        this.getStatistics();



      }, err => {
        // alert("erreur " + err);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        //console.log("error " + JSON.stringify(err));
      }
    )

  }

  addToArray(value : string ,type:string){

    switch(type){
      case 'nature':
        if(this.natures.indexOf(value) === -1 && value!="") {
         this.natures.push(value);
        }
        break;
      case 'sousNature':
        if(this.sousNatures.indexOf(value) === -1 && value!="") {
          this.sousNatures.push(value);
        }
        break;
      case 'domaine':
        if(this.domaines.indexOf(value) === -1 && value!="" ) {
          this.domaines.push(value);
        }
        break;
      case 'sousDomaine':
        if(this.sousDomaines.indexOf(value) === -1&& value!="") {
          this.sousDomaines.push(value);
        }
        break;
      case 'client':
        if(this.clients.indexOf(value) === -1 && value!="") {
          this.clients.push(value);
        }
        break;
      case 'numLot':
        if(this.numsLots.indexOf(value) === -1 && value!="") {
          this.numsLots.push(value);
        }
        break;
      case 'magasin':
        if(this.magasins.indexOf(value) === -1 && value!="") {
          this.magasins.push(value);
        }
        break;
    }

  }

  sortAllArrays(){
    this.clients.sort();
    this.magasins.sort();
    this.numsLots.sort();
    this.natures.sort();
    this.sousNatures.sort();
    this.domaines.sort();
    this.sousDomaines.sort();


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

  getStatistics(){
    this.filtredData = this.dataSource.filteredData;
    let totalCom = 0;
    let totalDispo = 0;
    let totalAppro = 0;
    let totalStock=0;
    let totalObsoleteCom=0;
    let totalPreObsoleteCom =0;
    let totalRepCom =0;

    this.filtredData.forEach(element=>{
      if(element.codeMagasin == 'com'){
        totalCom = totalCom + element.montant;
      }

      if(element.codeMagasin == 'dispo'){
        totalDispo = totalDispo + element.montant;
      }


      if(element.codeMagasin == 'appro'){
        totalAppro = totalAppro + element.montant;
      }

      if(element.codeMagasin == 'OBSCOM'){
        totalObsoleteCom = totalObsoleteCom + element.montant;
      }

      if(element.codeMagasin == 'PROBSCOM'){
        totalPreObsoleteCom = totalPreObsoleteCom + element.montant;
      }

      if(element.codeMagasin == 'REPCOM'){
        totalRepCom = totalRepCom + element.montant;
      }

      totalStock = totalStock + element.montant;



    });



    this.statitics = new StatiticsStock();
    this.statitics.totalCom = totalCom;
    this.statitics.totalDispo  = totalDispo;
    this.statitics.totalAppro = totalAppro;
    this.statitics.totalStock = totalStock;
    this.statitics.totalObsoleteCom = totalObsoleteCom;
    this.statitics.totalPreObsoleteCom = totalPreObsoleteCom;
    this.statitics.totalRepCom = totalRepCom;
  }

  blockedKey1 : boolean;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    let template:any;

    if (event.keyCode === this.RIGHT_ARROW && !this.blockedKey1) {
      //console.log("right");
      this.goToSuivant(this.currentProduit.id,template);
    }

    if (event.keyCode === this.LEFT_ARROW && !this.blockedKey1) {
      this.goToPrecedent(this.currentProduit.id,template);
    }
  }

  blockedKey(){
    this.blockedKey1 = true;
  }

  deBlockedKey(){
    this.blockedKey1 = false;
  }

  initFilter(){
    this.selectedClient =  null;
    this.selectedNature =  "undefined";
    this.selectedSousNature =  "undefined";
    this.selectedDomaine =  "undefined";
    this.selectedSousDomaine =  "undefined";
    this.selectedLot =  null;
    this.selectedMagasin =  "undefined"

    this.dataSource.filter = null;
    this.currentFilter="";
    this.getAllProduits();
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

      if (this.currentProduit.commentaires == null) {
        this.currentProduit.commentaires = new Array<Commentaire>();
      }

      this.currentProduit.commentaires.push(newCommentaire);

      this.onEditProduit(null);

      this.currentProduit.commentaires.sort((a, b) => {
        return <any> new Date(b.date) - <any> new Date(a.date);
      });




      //console.log(" this.currentProjet.commentaires " + this.currentProduit.commentaires);

      this.currentProduit.updated = true;
      this.setPage(1);
      this.newContentComment = null;
      //this.newEmployerId = null;
      this.newDatePlannifier = null;


    }



  }

  goToPrecedent(id,template){

    var index = this.getIndexFromFiltrerdList(id);

    //console.log("index found " + index);
    if(index-1 >=0) {
      var precedIndex = index - 1;

      this.index = precedIndex;
      if (this.currentProduit.updated) {
        //this.showDialog();
        //this.showAnnulationModificationModal(template);
        this.onEditProduit(null);
        //this.suivant = false;
        if (precedIndex != null && precedIndex >= 0 && precedIndex < this.filtredData.length) {
          this.currentProduit = this.filtredData[precedIndex];
          this.setPage(1);
          this.mode = 1;
        }
      }

      if (!this.currentProduit.updated && precedIndex != null && precedIndex >= 0 && precedIndex < this.filtredData.length) {
        this.currentProduit = this.filtredData[precedIndex];
        this.setPage(1);
        this.mode = 1;
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

    this.currentProduit.commentaires = this.currentProduit.commentaires.filter(item => item !== commentaire);
    this.currentProduit.updated = true;
    this.setPage(1);

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
    this.currentProduit.updated = true;
    this.ref.detectChanges();
  }

  onSelectAllClient(){
    this.selectedClient = null;

    this.selectFiltre();
  }

  onSelectAllLots(){
    this.selectedLot = null;

    this.selectFiltre();
  }

  selectFiltre(){
    //console.log("filter ");
    if(this.selectedClient == null){
      this.selectedClientTMP = "undefined";
    }else{
      this.selectedClientTMP = this.selectedClient;
    }
    if(this.selectedLot == null){
      this.selectedLotTMP = "undefined";
    }else{
      this.selectedLotTMP = this.selectedLot;
    }

    if(this.selectedNature == null){
      this.selectedNatureTMP = "undefined";
    }else{
      this.selectedNatureTMP = this.selectedNature;
    }

    console.log("selectedNatureTMP "+this.selectedNatureTMP );
    this.etatStockService.getAllStockByFiltre(this.selectedNatureTMP,this.selectedSousNature,this.selectedDomaine,this.selectedSousDomaine,this.selectedLotTMP,this.selectedClientTMP,this.selectedMagasin).subscribe(
      data => {
        this.pageProduit = data;

        if (this.pageProduit != null) {
          this.produits = new Array<Produit>();
          this.pageProduit.forEach(produit => {
            let p = new Produit();
            p.id = produit.id;

            switch(produit.codeMagasin){
              case '000': p.codeMagasin="com"; break;
              case 'APPRO': p.codeMagasin="appro"; break;
              case 'COMRAB': p.codeMagasin="com"; break;
              case 'DISPO': p.codeMagasin="dispo"; break;
              default: p.codeMagasin = produit.codeMagasin;
            }

            p.nomMagasin = produit.nomMagasin;
            p.itemCode = produit.itemCode;
            p.itemName = produit.itemName;
            p.gerePar = produit.gerePar;
            p.nature = produit.nature;
            p.sousNature = produit.sousNature;
            p.domaine = produit.domaine;
            p.sousDomaine = produit.sousDomaine;
            p.marque = produit.marque;
            p.numLot = produit.numLot;
            p.client = produit.client;
            p.commercial = produit.commercial;
            p.chefProjet = produit.chefProjet;
            p.dateCmd = produit.dateCmd;
            p.bu = produit.bu;
            p.qte = produit.qte;
            p.qteRal = produit.qteRal;
            p.pmp = produit.pmp;
            p.montant = produit.montant;
            p.dateEntre = produit.dateEntre;
            p.commentaireArtcileProjet = produit.commentaireArtcileProjet;
            p.commentaireLot = produit.commentaireLot;
            p.commentaireReference = produit.commentaireReference;
            p.lastUpdate = produit.lastUpdate;


            if (produit.commentaires != null && produit.commentaires.length > 0) {
              p.commentaires = produit.commentaires;
            }

            if(this.codeProjet!=null) {
              this.addToArray(p.client, 'client');
              this.addToArray(p.nature, 'nature');
              this.addToArray(p.sousNature, 'sousNature');
              this.addToArray(p.domaine, 'domaine');
              this.addToArray(p.sousDomaine, 'sousDomaine');
              this.addToArray(p.numLot, 'numLot');
              this.addToArray(p.nomMagasin, 'magasin');
            }

            this.produits.push(p);


          });
        }
        //this.lastUpdate = this.produits[0].lastUpdate;
       // this.sortAllArrays();

        this.dataSource = new MatTableDataSource(this.produits);
        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return (data.client != null ? data.client : "").toLowerCase().includes(filter) ||
            (data.chefProjet != null ? data.chefProjet : "").toLowerCase().includes(filter) ||
            (data.bu != null ? data.bu : "").toLowerCase().includes(filter) ||
            (data.commercial != null ? data.commercial : "").toLowerCase().includes(filter) ||
            (data.itemCode != null ? data.itemCode : "").toLowerCase().includes(filter) ||
            (data.itemName != null ? data.itemName : "").toLowerCase().includes(filter) ||
            (data.nature != null ? data.nature : "").toLowerCase().includes(filter) ||
            (data.sousNature != null ? data.sousNature : "").toLowerCase().includes(filter) ||
            (data.domaine != null ? data.domaine : "").toString().toLowerCase().includes(filter) ||
            (data.sousDomaine != null ? data.sousDomaine : "").toString().toLowerCase().includes(filter) ||
            (data.numLot != null ? data.numLot : "").toString().toLowerCase().includes(filter) ||
            (data.codeMagasin != null ? data.codeMagasin : "").toString().toLowerCase().includes(filter) ||
            (data.nomMagasin != null ? data.nomMagasin : "").toLowerCase()
            === filter;
        };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.currentFilter != null)
          this.applyFilter(this.currentFilter);
        this.getStatistics();


      }, err => {
        // alert("erreur " + err);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        //console.log("error " + JSON.stringify(err));
      })

    this.sortAll();

  }

  selectProduit(produit : Produit,template: TemplateRef<any>){
    this.currentProduit = produit;
    this.setPage(1);

    ////console.log("this.currentProjet suivre" + this.currentProduit.suivre);
    this.mode = 1;

    this.filtredData = this.dataSource.filteredData;

    var index = this.getIndexFromFiltrerdList(this.currentProduit.id);
    this.index = index;

    ////console.log("this.filtredData  " + JSON.stringify(this.filtredData ));

    // //console.log("this.filtredData size  " + this.filtredData.length );
    //console.log("current Produit " + JSON.stringify(this.currentProduit));

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

  setPage(page: number) {

    //console.log("this.currentProjet.commentaires " + this.currentProduit.commentaires);

    if(this.currentProduit.commentaires == null ||  this.currentProduit.commentaires.length==0) {
      //console.log("null");
      this.pager = null;
      this.pagedItems = null;
      return;
    }else{

      this.pager = this.pagerService.getPager(this.currentProduit.commentaires.length, page);

      if (page < 1 || page > this.pager.totalPages  ) {
        return;
      }



      this.pagedItems = this.currentProduit.commentaires.slice(this.pager.startIndex, this.pager.endIndex + 1);

    }


    //console.log("page " +  page );
    //console.log("this.pager.totalPages " + this.pager.totalPages);

    // get pager object from service
    this.pager = this.pagerService.getPager(this.currentProduit.commentaires.length, page);

    // get current page of items

  }

  getIndexFromFiltrerdList(id){
    //console.log("this.filtredData.size " + this.filtredData.length);
    for(var i=0;i<this.filtredData.length;i++){
      //console.log("this.filtredData[i] " + this.filtredData[i].id);
      if(this.filtredData[i].id == id){
        return i;
        break;
      }
    }
  }

  refreshStock(){
    this.spinner.show();
    this.etatStockService.refreshProduits().subscribe(
      data=>{

        this.getAllProduits();
        this.spinner.hide();
        //console.log("data "+ data);
      },
      err=>{
        //console.log("error "+ JSON.stringify(err));
        this.getAllProduits();
        this.spinner.hide();
      }
    )
  }

  exportEtatStock($event){
    $event.stopPropagation();
    $event.preventDefault();

    //console.log("filtre "+ this.dataSource.filter);
    var result= this.etatStockService.exportEtatProduit(this.filtredData);

    var d = new Date();

    //console.log("day " + d.getDay());
    var fileName = "EtatStock-"+moment(new Date()).format("DD-MM-YYYY")+"-"+d.getHours()+"-"+d.getMinutes()+".xlsx";

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

  composeEmail(produit : Produit){

    //console.log("compose Email");

    var refProd = produit.itemCode;

    var nomProdut = produit.itemName;

    var mnt = produit.montant;

    var email="mailto:?subject="+"Stock : "+this.removeAnd(produit.client)+" / "+ this.removeAnd(refProd)+" / " + this.removeAnd(nomProdut)+ "&body= Bonjour,%0A"
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
        email = email +"Commentaires : %0A"+ moment(lastCommentaire1.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire1.user.sigle == null ? "": lastCommentaire1.user.sigle)+" : " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire1.content).split("<br>").join("%0A")+"%0A";
      }
      let lastCommentaire2 = new Commentaire();
      lastCommentaire2= produit.commentaires[1];
      if(lastCommentaire2)
        email = email + moment(lastCommentaire2.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire2.user.sigle == null ? "": lastCommentaire2.user.sigle)+" : " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire2.content).split("<br>").join("%0A")+"%0A";
      let lastCommentaire3 = new Commentaire();
      lastCommentaire3= produit.commentaires[2];
      if(lastCommentaire3)
        email = email + moment(lastCommentaire3.date).format('DD/MM/YYYY HH:MM')+" "+(lastCommentaire3.user.sigle == null ? "": lastCommentaire3.user.sigle)+" : "  +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire3.content).split("<br>").join("%0A")+"%0A";
    }
    //console.log("email " + email);

    /*Insert commentaire ssytem with motif*/


   // this.motifAction =null;


    window.location.href = email;




  }

  annulationModificationProduit(id,secondModal: TemplateRef<any>){
    this.nestedModalRef.hide();
    this.currentProduit.updated = false;
    if(this.suivant){
      //console.log("here");
      this.goToSuivant(id,secondModal);
    }else{
      this.goToPrecedent(id,secondModal);
    }



  }


  goToSuivant(id,template){


    var index = this.getIndexFromFiltrerdList(id);


    var suivantIndex = index + 1;
    //console.log("index suivantIndex " + suivantIndex);

    if(this.currentProduit.updated){
      //this.showDialog();
      //this.showAnnulationModificationModal(template);
      this.onEditProduit(null);

      if(suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.filtredData.length){
        //console.log("here");
        this.index = suivantIndex;
        this.currentProduit = this.filtredData[suivantIndex];
        this.setPage(1);
        this.mode=1;
      }

      //this.suivant = true;
    }

    if(!this.currentProduit.updated && suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.filtredData.length){
      //console.log("here");
      this.index = suivantIndex;
      this.currentProduit = this.filtredData[suivantIndex];
      this.setPage(1);
      this.mode=1;
    }


  }



  annulation(){
    this.nestedModalRef.hide();
  }



  removeAnd(str : string){
    return str.replace("&","et");
  }


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  checkCanceled(thirdModal: TemplateRef<any>){

    if(this.currentProduit.updated){
      this.onEditProduit(null);
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
  onEditProduit(template: TemplateRef<any>) {

    ////console.log("this.currentProjet "  + JSON.stringify(this.currentProjet));

    ////console.log("new projet to send " + JSON.stringify(this.currentProjet));


    if(this.newContentComment != null ){
      //console.log("here newContentComment");
      this.addComment();
    }

    let userUpdate = new User();
    userUpdate.username = this.authService.getUserName();
    this.currentProduit.updatedBy = userUpdate;


    this.etatStockService.updateProduit(this.currentProduit).subscribe((data: Produit) => {
      this.currentProduit.updated = false;
      //this.mode = 2;
      this.errorUpdate=false;
      //this.refreshProjets();
      //this.modalRef.hide();
    }, err => {

      this.currentProduit.updated = true;
      this.errorUpdate=true;


    });

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
}
