import {
  ChangeDetectorRef, Component, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef,
  ViewEncapsulation,
  Input
} from '@angular/core';
import {NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Produit} from '../../model/model.produit';
import {StaisticsBalance} from '../../model/model.statisticsBalance';
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
import { BalanceAgee } from 'src/model/model.balanceAgee';
import { BalanceAgeeService } from '../services/balanceAgee.service';
import { EtatRecouvrementService } from '../services/etatRecouvrement.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-balance-agee',
  templateUrl: './balance-agee.component.html',
  styleUrls: ['./balance-agee.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class BalanceAgeeComponent implements OnInit {
  pageProduit: any;
  currentPage: number = 1;
  pages: any;
  totalElement: number;

  progress: { percentage: number } = {percentage: 0};

  currentProduit: BalanceAgee;
  returnedError: any;

  selectedFiles: FileList;

  keys: Array<string>;
  produits: Array<BalanceAgee>;

  viewUpload: boolean = false;

  selectedClient: any;

  selectedClientTMP: any;

  selectedCR:any;
  
  selectedCRTMP:any;


  chefProjets: Array<String>;

  selectedChefProjet: any;

  newContentComment: string;
  newDatePlannifier: Date;
  newEmployerId: any;

  mode: number;

  modalRef: BsModalRef;

  nestedModalRef: BsModalRef;


  actionModal: string;

  displayedColumns: string[] = ['client', 'chargee_recouv','sup_douze_mois','douze_mois', 'six_mois', 'tois_mois','total'];
  public dataSource: MatTableDataSource<BalanceAgee>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  filtredData: Array<BalanceAgee>;


  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];


  suivant: boolean;

  index: any;
montantNat:any;
  statitics: StaisticsBalance;

  modalOption: NgbModalOptions = {};


  projetCloture: boolean = false;


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

  clients : Array<string> = new Array<string>();
  nested2ModalRef : BsModalRef;

  clientsList: Array<string>;

  authorized : boolean;


  public status:string[]=[
    'Non Traitée par CR',
    'Non Deposée',
    'Bloquée',
    'Validée par client',
    'En Cours de paiement',
    'Payée',
    'Litige',
     'Retenue Garantie',
     'Avoir à faire',
     'En cours de validation'
  
  ];

  roleBuReseauSecurite:any;
  roleBuSystem:any;
  roleBuChefProjet:any;
  roleBuVolume:any;
  roleBuCommercial:any;
  years: any;
  client: any;
  lot: any;
  selectedCommercial: string;
  chargesR: any;
  active: boolean=false;
  idB: any = null;
  rowcolor: string;
  updatedDate: Date;
  selectedAM : string;
  selectedAMTMP: string;

  public ages: string[] = [
    '3M',
    '6M',
    'A12M',
    'Sup. 12M'
];
  selectedAge: any;
  selectedAgeTMP: string;
  selectedStatutTMP: any;
  selectedStatut: any;
  commercial: string[];
  com: string[];

  constructor(public datepipe: DatePipe,private activatedRoute:ActivatedRoute,private etatRecouvrementService: EtatRecouvrementService,private balanceAgeeService:BalanceAgeeService ,private authService: AuthenticationService, private currency: CurrencyPipe, private spinner: NgxSpinnerService, private pagerService: PagerService, private router: Router, private modalService: BsModalService, viewContainerRef: ViewContainerRef, private ref: ChangeDetectorRef) {
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
    if(codeProjet!=null){

      this.selectFiltre();
    }else{

      this.getBalance();
    }





  }


  sortAll(){
    this.clients.sort();
  }

  ngOnInit() {
    
  }



  getAllCommericals(){
    this.com = [];
    this.etatRecouvrementService.getDistinctCommercialDocument().subscribe(
      (data: Array<string>)=>{
        this.commercial = data;

        this.commercial.forEach(commercial => {
          console.log("ACCOUNT MANAGER" +commercial)
          this.com.push(commercial);
        });
        console.log(JSON.stringify("TABLE AM" + this.com))
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }

  getBalance() {
    this.getAllCommericals();
this.dataSource = null;


    if (this.roleReadAllRecouvrement == true) {

    this.balanceAgeeService.getBalance().subscribe(
      data => {
        this.pageProduit = data;
        console.log("THIS BALANCE "+JSON.stringify(this.pageProduit))

        if (this.pageProduit != null) {

          this.produits = new Array<BalanceAgee>();
          this.pageProduit.forEach(produit => {
            let p = new BalanceAgee();
          this.pageProduit.client

          p.id_balance = produit.id_balance;

            p.client = produit.client;
            p.chargee_recouv = produit.chargee_recouv;
            p.tois_mois = produit.tois_mois;
            p.six_mois = produit.six_mois;
            p.douze_mois = produit.douze_mois;
            p.sup_douze_mois = produit.sup_douze_mois;
            p.total = produit.total;
            p.last_update = produit.last_update;
            this.updatedDate =p.last_update;
            



                  this.client = this.pageProduit
                 .map(item => ((!item.client)? "AUCUN CLIENT": item.client))
                 .filter((value, index, self) => self.indexOf(value) === index)

                 this.client = this.client.filter(item => item !== "AUCUN CLIENT");

                 this.chargesR = this.pageProduit
                 .map(item => ((!item.chargee_recouv)? "AUCUN CR": item.chargee_recouv))
                 .filter((value, index, self) => self.indexOf(value) === index)

                 this.chargesR = this.chargesR.filter(item => item !== "AUCUN CR");


            this.addToArray(p.client,'client');




            this.produits.push(p);


          });
        }


        this.sortAllArrays();
        this.clientsList = this.clients;

        this.ref.detectChanges()
        this.dataSource = new MatTableDataSource(this.produits);

        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return (data.chargee_recouv != null ? data.chargee_recouv : "").toLowerCase().includes(filter) ||
          (data.client != null ? data.client : "").toLowerCase().includes(filter)
            
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
    )}

    if (this.roleReadMyRecouvrement == true) {

      this.balanceAgeeService.getBalanceByFiltre(this.selectedClientTMP,this.userNameAuthenticated,this.selectedAge).subscribe(
        data => {
          this.pageProduit = data;

  
          console.log("THIS BALANCE "+JSON.stringify(this.pageProduit))
  
          if (this.pageProduit != null) {
  
            this.produits = new Array<BalanceAgee>();
            this.pageProduit.forEach(produit => {
              let p = new BalanceAgee();
            this.pageProduit.client
  
            p.id_balance = produit.id_balance;
  
              p.client = produit.client;
              p.chargee_recouv = produit.chargee_recouv;
              if(produit.tois_mois == null){
                p.tois_mois = 0;
              }
              else{
                p.tois_mois = produit.tois_mois;
  
              }
  
              if(produit.six_mois == null){
                p.six_mois= 0;
              }
              else{
              p.six_mois = produit.six_mois;
              }
  
              if(produit.douze_mois == null){
                p.douze_mois= 0;
              }
              else{
                p.douze_mois = produit.douze_mois;
  
              }
  
              if(produit.sup_douze_mois == null){
                p.sup_douze_mois = 0;
              }
              else{
                p.sup_douze_mois = produit.sup_douze_mois;
  
              }
              p.total = produit.total;
              p.last_update = produit.last_update;
              this.updatedDate =p.last_update;

              
  
  
  
                    this.client = this.pageProduit
                   .map(item => ((!item.client)? "AUCUN CLIENT": item.client))
                   .filter((value, index, self) => self.indexOf(value) === index)
  
                   this.client = this.client.filter(item => item !== "AUCUN CLIENT");
  
                   this.chargesR = this.pageProduit
                   .map(item => ((!item.chargee_recouv)? "AUCUN CR": item.chargee_recouv))
                   .filter((value, index, self) => self.indexOf(value) === index)
  
                   this.chargesR = this.chargesR.filter(item => item !== "AUCUN CR");
  
  
              this.addToArray(p.client,'client');
  
  
  
  
              this.produits.push(p);
  
  
            });
          }
  
  
          this.sortAllArrays();
          this.clientsList = this.clients;
  
          this.ref.detectChanges()
          this.dataSource = new MatTableDataSource(this.produits);
  
          this.dataSource.filterPredicate = function(data, filter: string): boolean {
  
  
            return (data.chargee_recouv != null ? data.chargee_recouv : "").toLowerCase().includes(filter) ||
            (data.client != null ? data.client : "").toLowerCase().includes(filter)
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
      )}
  

  }

  addToArray(value : string ,type:string){

    switch(type){

      case 'client':
        if(this.clients.indexOf(value) === -1 && value!="") {
          this.clients.push(value);
        }
        break;

    }

  }

  sortAllArrays(){
    this.clients.sort();
    this.com.sort();


  }


  applyFilter(filterValue: string) {

    console.log("FILTER TEXT")
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
    let totalTrois = 0;
    let totalSix = 0;
    let totalDouze = 0;
    let totalSupDouze=0;
    let totalBalance =0;

    this.filtredData.forEach(element=>{
 
        totalTrois = totalTrois + element.tois_mois;      
        totalSix = totalSix + element.six_mois;
        totalDouze = totalDouze + element.douze_mois;
        totalSupDouze = totalSupDouze + element.sup_douze_mois;
      
totalBalance = totalBalance + element.total;


    });



    this.statitics = new StaisticsBalance();
    this.statitics.totalTrois= totalTrois;
    this.statitics.totalSix  = totalSix;
    this.statitics.totalDouze = totalDouze;
    this.statitics.totalSupDouze = totalSupDouze;
    this.statitics.totalBalance = totalBalance;
  }

  blockedKey1 : boolean;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    let template:any;

    if (event.keyCode === this.RIGHT_ARROW && !this.blockedKey1) {
      console.log("right");
      this.goToSuivant(this.currentProduit.id_balance,template);
    }

    if (event.keyCode === this.LEFT_ARROW && !this.blockedKey1) {
      this.goToPrecedent(this.currentProduit.id_balance,template);
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
    this.selectedCommercial = null;
    this.selectedCR = null;
    this.selectedAge= null;
    this.dataSource.filter = null;
    this.currentFilter="";
    this.getAllCommericals();
    this.getBalance();
  }

  resetdata(){
    this.dataSource.filter = null;
    this.currentFilter="";
    this.getBalance();

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



  updated(event){
    console.log("updated");
    this.ref.detectChanges();
  }

  onSelectAllClient(){
    this.selectedClient = null;

    this.selectFiltre();
  }
  

  selectFiltreStatus(){
    console.log("filter ");
    if(this.selectedClient == null){
      this.selectedClientTMP = "undefined";
    }else{
      this.selectedClientTMP = this.selectedClient;
    }

    if(this.selectedCR == null){
      this.selectedCRTMP = "undefined";
    }else{
      this.selectedCRTMP = this.selectedCR;
    }

    if(this.selectedAge == null){
      this.selectedAgeTMP = "undefined";
    }else{
      this.selectedAgeTMP = this.selectedAge;
    }


  
    console.log("selectedStatutTMP "+this.selectedStatut);
    this.balanceAgeeService.getBalanceByStatus(this.selectedStatut).subscribe(
      data => {
        this.pageProduit = data;

        console.log("THIS BALANCE "+JSON.stringify(this.pageProduit))

        if (this.pageProduit != null) {

          this.produits = new Array<BalanceAgee>();
          this.pageProduit.forEach(produit => {
            let p = new BalanceAgee();
          this.pageProduit.client
          var array = produit.split(',');
          p.id_balance = array[1]+1;

            p.client = array[1];
            p.chargee_recouv = array[2]
    
              p.tois_mois = parseFloat(array[5]);

            p.six_mois = parseFloat(array[6]);
          
              p.douze_mois = parseFloat(array[7]);

        

    
              p.sup_douze_mois = parseFloat(array[8]);

            
            p.total = parseFloat(array[4]);
            


            this.addToArray(p.client,'client');




            this.produits.push(p);


          });
        }



        this.sortAllArrays();
        this.clientsList = this.clients;

        this.ref.detectChanges()
        this.dataSource = new MatTableDataSource(this.produits);

        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return (data.client != null ? data.client : "").toLowerCase()
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
        console.log("error " + JSON.stringify(err));
      }
    )



    this.sortAll();

  }



  selectFiltreAM(){
    console.log("filter ");
    if(this.selectedClient == null){
      this.selectedClientTMP = "undefined";
    }else{
      this.selectedClientTMP = this.selectedClient;
    }

    if(this.selectedCR == null){
      this.selectedCRTMP = "undefined";
    }else{
      this.selectedCRTMP = this.selectedCR;
    }

    if(this.selectedAM == null){
      this.selectedAMTMP = "undefined";
    }else{
      this.selectedAMTMP = this.selectedAM;
    }


  
    console.log("selectedStatutTMP "+this.selectedStatut);
    this.balanceAgeeService.getBalanceByAM(this.selectedClientTMP,this.selectedCRTMP,this.selectedAMTMP).subscribe(
      data => {
        this.pageProduit = data;

        console.log("THIS BALANCE "+JSON.stringify(this.pageProduit))

        if (this.pageProduit != null) {

          this.produits = new Array<BalanceAgee>();
          this.pageProduit.forEach(produit => {
            let p = new BalanceAgee();
          this.pageProduit.client

          p.id_balance = produit.id_balance;

            p.client = produit.client;
            p.chargee_recouv = produit.chargee_recouv;
            if(produit.tois_mois == null){
              p.tois_mois = 0;
            }
            else{
              p.tois_mois = produit.tois_mois;

            }

            if(produit.six_mois == null){
              p.six_mois= 0;
            }
            else{
            p.six_mois = produit.six_mois;
            }

            if(produit.douze_mois == null){
              p.douze_mois= 0;
            }
            else{
              p.douze_mois = produit.douze_mois;

            }

            if(produit.sup_douze_mois == null){
              p.sup_douze_mois = 0;
            }
            else{
              p.sup_douze_mois = produit.sup_douze_mois;

            }
            p.total = produit.total;
            


            this.addToArray(p.client,'client');




            this.produits.push(p);


          });
        }



        this.sortAllArrays();
        this.clientsList = this.clients;

        this.ref.detectChanges()
        this.dataSource = new MatTableDataSource(this.produits);

        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return (data.client != null ? data.client : "").toLowerCase()
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
        console.log("error " + JSON.stringify(err));
      }
    )



    this.sortAll();

  }





  selectFiltre(){
    console.log("filter ");
    if(this.selectedClient == null){
      this.selectedClientTMP = "undefined";
    }else{
      this.selectedClientTMP = this.selectedClient;
    }

    if(this.selectedCR == null){
      this.selectedCRTMP = "undefined";
    }else{
      this.selectedCRTMP = this.selectedCR;
    }

    if(this.selectedAge == null){
      this.selectedAgeTMP = "undefined";
    }else{
      this.selectedAgeTMP = this.selectedAge;
    }
  
    this.balanceAgeeService.getBalanceByFiltre(this.selectedClientTMP,this.selectedCRTMP,this.selectedAgeTMP).subscribe(
      data => {
        this.pageProduit = data;

        console.log("THIS BALANCE "+JSON.stringify(this.pageProduit))

        if (this.pageProduit != null) {

          this.produits = new Array<BalanceAgee>();
          this.pageProduit.forEach(produit => {
            let p = new BalanceAgee();
          this.pageProduit.client

          p.id_balance = produit.id_balance;

            p.client = produit.client;
            p.chargee_recouv = produit.chargee_recouv;
            if(produit.tois_mois == null){
              p.tois_mois = 0;
            }
            else{
              p.tois_mois = produit.tois_mois;

            }

            if(produit.six_mois == null){
              p.six_mois= 0;
            }
            else{
            p.six_mois = produit.six_mois;
            }

            if(produit.douze_mois == null){
              p.douze_mois= 0;
            }
            else{
              p.douze_mois = produit.douze_mois;

            }

            if(produit.sup_douze_mois == null){
              p.sup_douze_mois = 0;
            }
            else{
              p.sup_douze_mois = produit.sup_douze_mois;

            }
            p.total = produit.total;
            


            this.addToArray(p.client,'client');




            this.produits.push(p);


          });
        }



        this.sortAllArrays();
        this.clientsList = this.clients;

        this.ref.detectChanges()
        this.dataSource = new MatTableDataSource(this.produits);

        this.dataSource.filterPredicate = function(data, filter: string): boolean {


          return (data.client != null ? data.client : "").toLowerCase()
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
        console.log("error " + JSON.stringify(err));
      }
    )



    this.sortAll();

  }



  setPage(page: number) {

    this.montantNat = null;

    this.pagedItems = [];



      this.pager = null;
      this.pagedItems = null;
      return;




    }



    // get pager object from service

    // get current page of items

  

  getIndexFromFiltrerdList(id){
    console.log("this.filtredData.size " + this.filtredData.length);
    for(var i=0;i<this.filtredData.length;i++){
      console.log("this.filtredData[i] " + this.filtredData[i].id_balance);
      if(this.filtredData[i].id_balance == id){
        return i;
        break;
      }
    }
  }

  /*refreshStock(){
    this.spinner.show();
    this.balanceAgeeService.refreshProduits().subscribe(
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
  }*/

  exportBalance($event){
    $event.stopPropagation();
    $event.preventDefault();

    console.log("filtre "+ this.dataSource.filter);
    var result= this.balanceAgeeService.exportBalance(this.filtredData);

    var d = new Date();

    console.log("day " + d.getDay());
    var fileName = "Balance_Agée-"+moment(new Date()).format("DD-MM-YYYY")+"-"+d.getHours()+"-"+d.getMinutes()+".xlsx";

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




  goToSuivant(id,template){

this.montantNat = null;
    var index = this.getIndexFromFiltrerdList(id);


    var suivantIndex = index + 1;
    console.log("index suivantIndex " + suivantIndex);

      //this.showDialog();
      //this.showAnnulationModificationModal(template);


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

  checkValue(el: any){

    if(!isNaN(el)){
      return el;
    }

    if(isNaN(el)){ 
    return 0;
    }  }


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


testN(){

  this.rowcolor = "";
  this.idB= null;

}

test(id:any){
  this.idB = id;
  console.log("ACTIVE"+id)
}


}
