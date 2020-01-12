import {Component, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Projet} from '../../model/model.projet';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Reunion} from '../../model/model.reunion';
import {Employer} from '../../model/model.employer';
import {ReunionService} from '../services/reunion.service';
import {EtatProjetService} from '../services/etatProjet.service';
import {AuthenticationService} from '../services/authentification.service';

@Component({
  selector: 'app-reunion',
  templateUrl: './reunion.component.html',
  styleUrls: ['./reunion.component.css']
})
export class ReunionComponent implements OnInit {

  displayedColumns: string[] = ['dateReunion','employer','commentaire','option1','option2','option3'];
  public dataSource: MatTableDataSource<Reunion>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  filtredData : Array<Reunion>;

  currentReunion : Reunion;



  modalRef: BsModalRef;

  reunions : Array<Reunion>;

  employees : Array<Employer>;

  service : string;

  userInSession :string;

  clients : Array<String>;

  fournisseurs : Array<String>;

  selectedAvec : any;

  nested3ModalRef :any;

  nested2ModalRef :any;

  authorized : boolean;

  constructor(private authService:AuthenticationService,private reunionService:ReunionService ,private etatProjetService : EtatProjetService,private router : Router,private modalService: BsModalService, viewContainerRef:ViewContainerRef) {
    this.getAllReunions();
    this.getAllEmployees();
    this.getAllClients();
    this.getAllFournisseurs();
    this.service = this.authService.getServName();

    this.userInSession = this.authService.getLastName();


    this.authorized = true;

    this.authService.getRoles().forEach(authority => {
      if (authority == 'READ_ALL_PROJECTS') {
        this.authorized = true;

      }});

  }

  ngOnInit() {

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getAllReunions(){
    this.reunionService.getAllReunions().subscribe(
      (data: Array<Reunion>)=>{
        this.reunions = data;
        this.dataSource =  new MatTableDataSource(this.reunions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("this.reunions " + JSON.stringify(this.reunions));
      },error => {
        console.log("error "+ error);
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
        console.log("error "+ error);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteRenunion(element: any) {

    console.log("element " + JSON.stringify(element));
    element.statut = 'Annuler';
    this.reunionService.deleteReunion(element.id).subscribe(
      (data: Array<Reunion>)=>{
        this.getAllReunions();
        this.nested2ModalRef.hide();
      },error => {
        console.log("error "+ error);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }

  showModalDetelete(element :any ,template :any){
    this.currentReunion = element;
    this.nested2ModalRef = this.modalService.show(template,Object.assign({}, {class: 'modal-sm'}));
  }

  showModalUpdateStatut(element :any ,template :any){
    this.currentReunion = element;
    this.nested3ModalRef =  this.modalService.show(template,Object.assign({}, {class: 'modal-sm'}));
  }

  annulation(template : any){
    this.nested3ModalRef.hide();
    this.nested2ModalRef.hide();
  }

  updateStatut(element:any){

    element.statut="Terminer";
    this.reunionService.updateReunion(element.id,element).subscribe(
      (data: Array<Reunion>)=>{
        this.getAllReunions();
        this.nested3ModalRef.hide();
      },error => {

        console.log("error "+ error);
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
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }

  getAllFournisseurs(){
    this.reunionService.getAllFournisseurs().subscribe(
      (data: Array<String>)=>{
        this.fournisseurs = data;
      },error => {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }



  selectReunion(element : any,template: TemplateRef<any>){
    console.log("current select " + JSON.stringify( element));
    this.currentReunion = element;

    if(element.client!=null){
      this.selectedAvec ='client';
    }
    if(element.fournisseur!=null){
      this.selectedAvec ='fournisseur3';
    }
    if(element.collaborateur!=null){
      this.selectedAvec ='collaborateur';
    }

    this.filtredData = this.dataSource.filteredData;

    this.modalRef = this.modalService.show(template,  Object.assign({}, {class: 'modal-sm'}));


  }

  showReunion(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template,Object.assign({}, {class: 'modal-sm'}));
  }

  updateRenunion( ){

    console.log("updatedReunion " + JSON.stringify(this.currentReunion));
      this.reunionService.updateReunion(this.currentReunion.id,this.currentReunion).subscribe(
        (data: Reunion)=>{
          console.log("reunion")
         // this.getAllReunions();
          this.modalRef.hide();
        },error => {
          console.log("error "+ error);
          this.authService.logout();
          this.router.navigateByUrl('/login');
          console.log("error "  +JSON.stringify(error));
        }
      )
  }

  creerReunion(data){
    console.log("data "+ JSON.stringify(data));

    let r = new Reunion();
    r.dateReunion = data.dateReunion2;
    r.collaborateur = data.collaborateur;
    r.dateCreation = new Date();
    r.commentaire = data.commentaire;
    r.statut = "Plannifier";
    r.fournisseur = data.fournisseur;
    r.client = data.client;

    this.reunionService.addReunion(r).subscribe(
      (data: Array<Reunion>)=>{
        this.getAllReunions();
      },error => {
        console.log("error "+ error);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
    this.modalRef.hide();

  }

  changeSeletedTo(type:String){

    switch(type){
      case 'Fournisseur':if(this.currentReunion.fournisseur!=null){
        this.currentReunion.client=null;this.currentReunion.collaborateur=null;
      }  break;
      case 'Client':if(this.currentReunion.client!=null){
        this.currentReunion.fournisseur=null;
        this.currentReunion.collaborateur=null;
      }break;

     case 'Collaborateur':if(this.currentReunion.collaborateur!=null){
       this.currentReunion.fournisseur=null;
       this.currentReunion.client=null
     }break;
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
