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
import {CurrencyPipe, DatePipe} from '@angular/common';
import {AuthenticationService} from '../services/authentification.service';
import {Commentaire} from '../../model/model.commentaire';
import * as moment from 'moment';
import {User} from '../../model/model.user';
import {EtatProjetService} from "../services/etatProjet.service";
import { StockProjet } from 'src/model/model.StockProjet';
import { CommentaireStock } from 'src/model/model.commentaireStock';

@Component({
  selector: 'app-etat-stock-projet',
  templateUrl: './etat-stock-projet.component.html',
  styleUrls: ['./etat-stock-projet.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EtatStockProjetComponent implements OnInit {

  pageProduit: any;
  currentPage: number = 1;
  pages: any;
  totalElement: number;

  progress: { percentage: number } = {percentage: 0};

  currentProduit: StockProjet;
  returnedError: any;

  selectedFiles: FileList;

  keys: Array<string>;
  produits: Array<StockProjet>;

  viewUpload: boolean = false;

  selectedClient: any;

  selectedClientTMP: any;

  selectedYear : any;

  selectedYearTMP : any;

  commercial: Array<String>;

  selectedCommercial: any;
  selectedCommercialTMP: any;


  chefProjets: Array<String>;

  selectedChefProjet: any;

  newContentComment: string;
  newDatePlannifier: Date;
  newEmployerId: any;

  mode: number;

  modalRef: BsModalRef;

  nestedModalRef: BsModalRef;


  actionModal: string;

  displayedColumns: string[] = ['option','type_magasin','client', 'num_lot', 'commercial','chef_projet', 'montant','annee'];
  public dataSource: MatTableDataSource<StockProjet>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  filtredData: Array<StockProjet>;


  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];


  suivant: boolean;

  index: any;
  Totalnatures : string[];
montantNat:any;
  statitics: StatiticsStock;

  modalOption: NgbModalOptions = {};


  projetCloture: boolean = false;



  selectedNature: string;

  selectedSousNature: string;

  selectedDomaine: string;
  selectedSousDomaine: string;
  selectedLot: string;
  selectedLotTMP: any;
  selectedMagasinTMP:any;
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

  type: any;

  stock = [
    {
      name: 'Déploiement'
    },
    {
      name: 'Déploiement Rabat'
    },
    {
      name: 'Stock commercial'
    },
    {
      name: 'Stock Disponible'
    },
    {
      name: 'Stock Approvisionnement'
    },
    {
      name: 'Réparation commerciale'
    },
    {
      name: 'Obsolète Stock Commercial'
    }
  ];

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
  years: any;
  client: any;
  lot: any;
  comments: any;
  commentsListe: any;
  selectedChefProjetTMP: any;
  selectedTypeTMP: any;
  selectedType: any;


  constructor(public datepipe: DatePipe,private activatedRoute:ActivatedRoute,private etatProjetService:EtatProjetService ,private authService: AuthenticationService, private currency: CurrencyPipe, private spinner: NgxSpinnerService, private pagerService: PagerService, private etatStockService: EtatStockService, private router: Router, private modalService: BsModalService, viewContainerRef: ViewContainerRef, private ref: ChangeDetectorRef) {
    this.service = this.authService.getServName();

    this.userInSession = this.authService.getLastName();



    this.authService.getRoles().forEach(authority => {

      if(authority== 'BU_COMMERCIAL'){
       this.roleBuCommercial = true;
        //this.service = 'Commercial';
        this.authorized = true;

      }

      if(authority== 'BU_REAU_SECURITE'){
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
        console.log("heee");
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

    const codeProjet = this.activatedRoute.snapshot.params['codeProjet'];
    const magasin = this.activatedRoute.snapshot.params['mag'];

if(codeProjet!=null && magasin!= null){
  this.selectedType = magasin;
  this.selectedTypeTMP= magasin;

  this.selectedLot = codeProjet;
  this.selectedLotTMP = codeProjet;
  this.selectFiltre();

}
else{

    if(codeProjet!=null){

      this.selectedLot = codeProjet;
      this.selectedLotTMP = codeProjet;
      this.selectFiltre();
    }else{

      this.getAllProduits();
    }}

    this.getAllClients();
    this.getDistinctLot();




  }


  sortAll(){
    this.commercial.sort();
    this.numsLots.sort();
    this.clients.sort();
    this.magasins.sort();
    this.chefProjets.sort();
  }

  ngOnInit() {
  }

  getDistinctLot(){
    this.etatStockService.getDistinctLot().subscribe(
      (data: Array<string>)=>{
        this.numsLots = data;
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
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
        console.log("error "  +JSON.stringify(error));
      }
    )
  }

  getAllProduits() {


    this.etatStockService.getAllProduitsProjet().subscribe(
      data => {
        this.pageProduit = data;

        if (this.pageProduit != null) {
          this.selectedYear =[];

          this.produits = new Array<StockProjet>();
          this.pageProduit.forEach(produit => {
            let p = new StockProjet();
          this.pageProduit.client
          console.log("DATE "+p.date_rec);

          p.id_stock = produit.id_stock;

            p.num_lot = produit.num_lot;
            p.client = produit.client;
            p.commercial = produit.commercial;
            if(produit.type_magasin == 'Déploiement'){
              p.montant = 0
            }
            else{
            p.montant = produit.montant;
          }
            p.annee = produit.annee;
            p.chef_projet = produit.chef_projet;
              p.commentaires = produit.commentaires;
              p.magasin = produit.magasin;
              p.date_rec = produit.date_rec;
              p.nom_lot = produit.nom_lot;
              p.type_magasin = produit.type_magasin;


                 this.years = this.pageProduit
                 .map(item => item.annee)
                 .filter((value, index, self) => self.indexOf(value) === index)

                  this.client = this.pageProduit
                 .map(item => ((!item.client)? "AUCUN CLIENT": item.client))
                 .filter((value, index, self) => self.indexOf(value) === index)
                this.lot = this.pageProduit
                 .map(item => item.num_lot)
                 .filter((value, index, self) => self.indexOf(value) === index)

                 this.commercial = this.pageProduit
                 .map(item => ((!item.commercial)? "AUCUN COMM": item.commercial))
                 .filter((value, index, self) => self.indexOf(value) === index)

                 this.type = this.pageProduit
                 .map(item => item.type_magasin)
                 .filter((value, index, self) => self.indexOf(value) === index)


                 this.chefProjets = this.pageProduit
                 .map(item => ((!item.chef_projet)? "AUCUN CDP": item.chef_projet))
                 .filter((value, index, self) => self.indexOf(value) === index)

                 this.chefProjets = this.chefProjets.filter(item => item !== "AUCUN CDP");

                 this.commercial = this.commercial.filter(item => item !== "AUCUN COMM");

                 this.client = this.client.filter(item => item !== "AUCUN CLIENT");



            this.addToArray(p.client,'client');this.addToArray(p.commercial,'commercial');
            this.addToArray(p.chef_projet,'chefProjet');this.addToArray(p.num_lot,'num_lot');




            this.produits.push(p);


          });
        }



        this.sortAllArrays();
        this.clientsList = this.clients;

        this.ref.detectChanges()
        this.dataSource = new MatTableDataSource(this.produits);

        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return (data.client != null ? data.client : "").toLowerCase().includes(filter) ||
            (data.chef_projet != null ? data.chef_projet : "").toLowerCase().includes(filter) ||
            (data.annee != null ? data.annee : "").toLowerCase().includes(filter) ||
            (data.commercial != null ? data.commercial : "").toLowerCase().includes(filter) ||
            (data.num_lot != null ? data.num_lot : "").toString().toLowerCase().includes(filter) 
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
        console.log("error " + JSON.stringify(err));
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
      case 'num_lot':
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
    this.commercial.sort();
    this.chefProjets.sort();
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
    let totalRepCom =0;

    this.filtredData.forEach(element=>{


      if(element.magasin == 'Stock commercial' || element.magasin == 'Rabat - stock commercial' ){
        totalCom = totalCom + element.montant;
      }

      if(element.magasin == 'Stock Disponible'){
        totalDispo = totalDispo + element.montant;
      }


      if(element.magasin == 'Stock Approvisionnement'){
        totalAppro = totalAppro + element.montant;
      }

      if(element.magasin == 'Obsolète Stock Commercial'){
        totalObsoleteCom = totalObsoleteCom + element.montant;
      }

      if(element.magasin == 'Réparation commerciale'){
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
    this.statitics.totalRepCom = totalRepCom;
  }

  blockedKey1 : boolean;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    let template:any;

    if (event.keyCode === this.RIGHT_ARROW && !this.blockedKey1) {
      console.log("right");
      this.goToSuivant(this.currentProduit.id_stock,template);
    }

    if (event.keyCode === this.LEFT_ARROW && !this.blockedKey1) {
      this.goToPrecedent(this.currentProduit.id_stock,template);
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
    this.selectedLot =  null;
    this.selectedMagasin =  null;
    this.selectedYear= null;
    this.selectedCommercial = null;

    this.dataSource.filter = null;
    this.currentFilter="";
    this.getAllProduits();
  }

  resetdata(){
    this.selectedYear= null;
    this.dataSource.filter = null;
    this.currentFilter="";
    this.getAllProduits();

  }

  addComment(projet: any,row: any){

    if(this.newContentComment.length != 0) {
      let newCommentaire = new CommentaireStock();

      newCommentaire.date = new Date();
      // newCommentaire.user.username = "test";
      newCommentaire.content = this.newContentComment;
      newCommentaire.user_username = new User();
      newCommentaire.user_username.username = this.authService.getUserName();
      newCommentaire.user_username.sigle = this.authService.getSigle();

      let s = new StockProjet();
      s.id_stock = row;

      newCommentaire.stock = s;


      if (this.newEmployerId != null ) {
        console.log("this.newEmployerId" + this.newEmployerId)
        newCommentaire.employer = this.newEmployerId;

      }

      if (this.currentProduit.commentaires == null) {
        this.currentProduit.commentaires = new Array<CommentaireStock>();
      }
      console.log("COOL  "+ JSON.stringify(newCommentaire));

      this.currentProduit.commentaires.push(newCommentaire);

      this.currentProduit.commentaires.sort((a, b) => {
        return <any> new Date(b.date) - <any> new Date(a.date);
      });

      this.etatStockService.saveCommentaireProjet(newCommentaire,projet,row,newCommentaire.user_username.username).subscribe(
        data => {


        }, err => {
          // alert("erreur " + err);
          this.authService.logout();
          this.router.navigateByUrl('/login');
          console.log("error " + JSON.stringify(err));
        }
      )


      console.log(" this.currentProjet.commentaires " + JSON.stringify(this.currentProduit.commentaires));



      this.setPage(1);

      this.newContentComment = null;
      //this.newEmployerId = null;
      this.newDatePlannifier = null;


    }



  }

  goToPrecedent(id,template){

    var index = this.getIndexFromFiltrerdList(id);

    console.log("index found " + index);
    if(index-1 >=0) {
      var precedIndex = index - 1;

      this.index = precedIndex;
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

  deleteCommentaire(commentaire : any,comment: any){
    console.log("delete comment"+JSON.stringify(commentaire));

    this.currentProduit.commentaires = this.currentProduit.commentaires.filter(item => item !== comment);


    this.etatStockService.deleteCommentaire(commentaire).subscribe(
      data=>{

      },
      err=>{

      }
    )

    this.setPage(1);

  }
  checkIFMorethanFifthMinuteAgo(commentaie : CommentaireStock){

    console.log("COMMENTAIRE "+JSON.stringify(commentaie.user_username))

    if(commentaie.user_username.sigle == 'SYSTEM'){
      return true;
    }


    let dateCom = moment(commentaie.date).add(15, 'minutes');

    return moment().isAfter(dateCom);
  }


  updated(event){
    console.log("updated");
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
    console.log("filter ");
    if(this.selectedClient == null){
      this.selectedClientTMP = "undefined";
    }else{
      this.selectedClientTMP = this.selectedClient;
    }

    if(this.selectedType == null){
      this.selectedTypeTMP = "undefined";
    }else{
      this.selectedTypeTMP = this.selectedType;
    }


    if(this.selectedCommercial == null){
      this.selectedCommercialTMP = "undefined";
    }else{
      this.selectedCommercialTMP = this.selectedCommercial;
    }

    if(this.selectedLot == null){
      this.selectedLotTMP = "undefined";
    }else{
      this.selectedLotTMP = this.selectedLot;
    }
    if(this.selectedCommercial == null){
      this.selectedCommercialTMP = "undefined";
    }else{
      this.selectedCommercialTMP = this.selectedCommercial;
    }

    if(this.selectedMagasin == null){
      this.selectedMagasinTMP = "undefined";
    }else{
      this.selectedMagasinTMP = this.selectedMagasin;
    }

    if(this.selectedYear == null || this.selectedYear==""){
      this.selectedYearTMP = "undefined";
    }else{
      this.selectedYearTMP = this.selectedYear;
    }

    if(this.selectedMagasin == null || this.selectedMagasin==""){
      this.selectedMagasinTMP = "undefined";
    }else{
      this.selectedMagasinTMP = this.selectedMagasin;
    }

    if(this.selectedChefProjet == null || this.selectedChefProjet==""){
      this.selectedChefProjetTMP = "undefined";
    }else{
      this.selectedChefProjetTMP = this.selectedChefProjet;
    }


    this.etatStockService.getAllStockProjetByFiltre(this.selectedYearTMP,this.selectedLotTMP,this.selectedClientTMP,this.selectedMagasinTMP,this.selectedCommercialTMP,this.selectedChefProjetTMP,this.selectedTypeTMP).subscribe(
      data => {
        this.pageProduit = data;
      console.log("HELLO FILTER"+this.selectedMagasinTMP+ " client "+this.selectedClient)
        if (this.pageProduit != null) {
          this.produits = new Array<StockProjet>();
          this.pageProduit.forEach(produit => {
            let p = new StockProjet();

            p.id_stock = produit.id_stock;
            p.num_lot = produit.num_lot;
            p.client = produit.client;
            p.commercial = produit.commercial;
            if(produit.type_magasin == 'Déploiement'){
              p.montant = 0
            }
            else{
            p.montant = produit.montant;
          }            p.annee = produit.annee;
            p.chef_projet = produit.chef_projet;
              p.commentaires = produit.commentaires;
              p.magasin = produit.magasin;
              p.date_rec = produit.date_rec;
              p.nom_lot = produit.nom_lot;
              p.type_magasin= produit.type_magasin;

            if(produit.commentaires != null && produit.commentaires.length>0){
              p.commentaires = produit.commentaires;
            }


            this.produits.push(p);


          });
        }
        //this.lastUpdate = this.produits[0].lastUpdate;
       // this.sortAllArrays();

        this.dataSource = new MatTableDataSource(this.produits);
        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return (data.client != null ? data.client : "").toLowerCase().includes(filter) ||
            (data.chef_projet != null ? data.chef_projet : "").toLowerCase().includes(filter) ||
            (data.annee != null ? data.annee : "").toLowerCase().includes(filter) ||
            (data.commercial != null ? data.commercial : "").toLowerCase().includes(filter) ||
            (data.magasin != null ? data.magasin : "").toLowerCase().includes(filter) ||
            (data.nom_lot != null ? data.nom_lot : "").toLowerCase().includes(filter) ||
            (data.num_lot != null ? data.num_lot : "").toString().toLowerCase().includes(filter)
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
        console.log("error " + JSON.stringify(err));
      })

    //this.sortAll();

  }

  selectProduit(produit : StockProjet,comm: CommentaireStock,row:any,template: TemplateRef<any>){
    this.currentProduit = produit;


    console.log("this.currentstock comm" + produit.id_stock);
    this.setPage(1);
    this.mode = 1;

    this.filtredData = this.dataSource.filteredData;

    var index = this.getIndexFromFiltrerdList(this.currentProduit.id_stock);
    this.index = index;

    //console.log("this.filtredData  " + JSON.stringify(this.filtredData ));

    // console.log("this.filtredData size  " + this.filtredData.length );
    console.log("current Produit " + JSON.stringify(this.currentProduit));

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

    this.montantNat = null;

    this.pagedItems = [];

    this.Totalnatures = [];

    this.etatStockService.getMontantByNature(this.currentProduit.num_lot,this.currentProduit.type_magasin).subscribe(
      data=>{


        this.montantNat = data;
        this.montantNat.forEach(nat => {
          this.Totalnatures.push(nat);
        }




        );


        console.log("NTAURE "+JSON.stringify(data))
      },
      err=>{
        console.log(err);
      }
    )

    console.log("this.currentProjet.commentaires " + this.currentProduit.commentaires);

    if(this.currentProduit.commentaires == null ||  this.currentProduit.commentaires.length==0) {
      console.log("null");

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


    console.log("page " +  page );
    console.log("this.pager.totalPages " + this.pager.totalPages);

    // get pager object from service
    this.pager = this.pagerService.getPager(this.currentProduit.commentaires.length, page);

    // get current page of items

  }

  getIndexFromFiltrerdList(id){
    console.log("this.filtredData.size " + this.filtredData.length);
    for(var i=0;i<this.filtredData.length;i++){
      console.log("this.filtredData[i] " + this.filtredData[i].id_stock);
      if(this.filtredData[i].id_stock == id){
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
        console.log("data "+ data);
      },
      err=>{
        console.log("error "+ JSON.stringify(err));
        this.getAllProduits();
        this.spinner.hide();
      }
    )
  }

  exportEtatStock($event){
    $event.stopPropagation();
    $event.preventDefault();

    console.log("filtre "+ this.dataSource.filter);
    var result= this.etatStockService.exportEtatStock(this.filtredData);

    var d = new Date();

    console.log("day " + d.getDay());
    var fileName = "Stock_Projet-"+moment(new Date()).format("DD-MM-YYYY")+"-"+d.getHours()+"-"+d.getMinutes()+".xlsx";

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

  composeEmail(produit : StockProjet){

    console.log("compose Email");
    

    var projet = produit.num_lot;
    var mnt = produit.montant;

    var email="mailto:?subject= Stock : "+this.removeAnd(produit.client)+" / "+ this.removeAnd(projet)+ "&body= Bonjour,%0A %0A"
      +"Je vous prie de lire les  commentaires en bas en relation avec le  stock du projet cité en objet : %0A %0A"
      +"Account Manager : "+(produit.commercial  == null ? "": produit.commercial ) +"%0A"+
      "Chef de projet: "+ (produit.chef_projet  == null ? "": produit.chef_projet ) +"%0A"+
      "Désignation du projet : "+produit.nom_lot  +"%0A"+
      "Date 1ère réception : "+ (produit.date_rec  == null ? "": this.datepipe.transform(produit.date_rec, 'dd-MM-yyyy') ) +"%0A"+
      "Magasin : "+produit.magasin  +"%0A"+
      "Prix de revient en dirhams : "+(produit.montant  == null ? "": produit.montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") +" DH")+"%0A"+" %0A"+" %0A";
      

      


    if(produit.commentaires!=null){

      let lastCommentaire1 = new CommentaireStock();
      lastCommentaire1= produit.commentaires[0];
      if(lastCommentaire1){
        email = email+ "%0A";
        email = email + "Je vous prie de consulter les commentaires en bas et d’agir en conséquence."+"%0A";
        email = email + "%0A";
        email = email +"Commentaires : %0A"+ moment(lastCommentaire1.date).format('DD/MM/YYYY HH:MM')+"  : "+(lastCommentaire1.user_username.sigle == null ? "": "  @"+lastCommentaire1.user_username.sigle) +" " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire1.content.split("<br>").join("%0A"))+"%0A";
      }
      let lastCommentaire2 = new CommentaireStock();
      lastCommentaire2= produit.commentaires[1];
      if(lastCommentaire2)
        email = email + moment(lastCommentaire2.date).format('DD/MM/YYYY HH:MM')+": " +(lastCommentaire1.user_username.sigle == null ? "": "  @"+lastCommentaire1.user_username.sigle) + " "+(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire2.content.split("<br>").join("%0A"))+"%0A";
      let lastCommentaire3 = new CommentaireStock();
      lastCommentaire3= produit.commentaires[2];
      if(lastCommentaire3)
        email = email + moment(lastCommentaire3.date).format('DD/MM/YYYY HH:MM')+" : " +(lastCommentaire1.user_username.sigle == null ? "": "  @"+lastCommentaire1.user_username.sigle) + " " +(lastCommentaire1.employer == null ? "": "  @"+lastCommentaire1.employer) + " "+encodeURIComponent(lastCommentaire3.content.split("<br>").join("%0A"))+"%0A";
    }
    console.log("email " + email);



   // this.motifAction =null;


    window.location.href = email;




  }



  annulationModificationProduit(id,secondModal: TemplateRef<any>){
    this.nestedModalRef.hide();
    if(this.suivant){
      console.log("here");
      this.goToSuivant(id,secondModal);
    }else{
      this.goToPrecedent(id,secondModal);
    }



  }


  goToSuivant(id,template){

this.montantNat = null;
    var index = this.getIndexFromFiltrerdList(id);


    var suivantIndex = index + 1;
    console.log("index suivantIndex " + suivantIndex);

      //this.showDialog();
      //this.showAnnulationModificationModal(template);
      this.onEditProduit(null);


      //this.suivant = true;


    if(suivantIndex != null && suivantIndex >= 0 && suivantIndex<this.filtredData.length){
      console.log("here");
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




      this.modalRef.hide();

  }

  errorUpdate:boolean;
  onEditProduit(template: TemplateRef<any>) {

    //console.log("this.currentProjet "  + JSON.stringify(this.currentProjet));

    //console.log("new projet to send " + JSON.stringify(this.currentProjet));


    if(this.newContentComment != null ){
      console.log("here newContentComment");

      this.addComment(this.currentProduit.num_lot,this.currentProduit.id_stock);
    }

    let userUpdate = new User();
    userUpdate.username = this.authService.getUserName();




  }

  @HostListener('matSortChange', ['$event'])
  sortChange(e) {
    // save cookie with table sort data here
    this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort);
    // console.log("this.before [0] " + this.filtredData[0].codeProjet);
    // console.log("sorting table");
    this.filtredData = this.dataSource.filteredData;

    // console.log("this.filtredData[0] " + this.filtredData[0].codeProjet);*/

  }

  ConvertString(value){
    return parseFloat(value)
    }
}
