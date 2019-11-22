import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
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

  displayedColumns: string[] = ['datePlannification','employer','sujet','option'];
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

  constructor(private authService:AuthenticationService,private reunionService:ReunionService ,private etatProjetService : EtatProjetService,private router : Router,private modalService: BsModalService, viewContainerRef:ViewContainerRef) {
    this.getAllReunions();
    this.getAllEmployees();
    this.service = this.authService.getServName();

    this.userInSession = this.authService.getLastName();
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

  deleteRenunion(element: any, template: TemplateRef<any>) {

    console.log("element " + JSON.stringify(element));

    this.reunionService.deleteReunion(element.id).subscribe(
      (data: Array<Reunion>)=>{
        this.getAllReunions();
      },error => {
        console.log("error "+ error);
        this.authService.logout();
        this.router.navigateByUrl('/login');
        console.log("error "  +JSON.stringify(error));
      }
    )
  }

  selectReunion(element : any,template: TemplateRef<any>){
    console.log("current select " + JSON.stringify( element));
    this.currentReunion = element;

    this.filtredData = this.dataSource.filteredData;

    this.modalRef = this.modalService.show(template,  { class: 'modal-lg'});


  }

  showReunion(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  updateRenunion( ){
      this.reunionService.updateReunion(this.currentReunion.id,this.currentReunion).subscribe(
        (data: Array<Reunion>)=>{
          this.getAllReunions();
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
    r.datePlannification = data.datePlannification2;
    r.employer = new Employer();
    r.employer.id = data.collaborateur;
    r.dateCreation = new Date();
    r.sujet = data.sujet;

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
}
