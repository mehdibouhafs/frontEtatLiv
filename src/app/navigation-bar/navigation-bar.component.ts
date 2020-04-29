import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  roleBuReseauSecurite:boolean;
  roleBuSystem:boolean;
  roleBuChefProjet:boolean;
  roleBuVolume:boolean;
  roleBuCommercial:boolean;
  roleBuValueSoftware :boolean;

  roleReadAllProjects: boolean;

  roleReadMyProjects: boolean;

  roleReadAllRecouvrement :boolean;

  roleReadMyRecouvrement:boolean;

  roleReadProjectSi:boolean;

  roleReadProjectRs:boolean;

  roleReadMyContrats:boolean;

  roleReadAllContrats:boolean;

  @Input() projetNav :boolean;

  @Input() notifNav:boolean;

  @Input() contratNav:boolean;

  @Input() stockNav:boolean;

  @Input() stockPNav:boolean

  @Input() recouvNav:boolean;

  @Input() recouvBNav:boolean;

  @Input() reunionNav:boolean;

  authorized:boolean;

  service :string;

  userInSession;

  constructor(private authService:AuthenticationService,private router:Router) {
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

        this.authorized = true;

      }

      if(authority== 'BU_CHEF_PROJET'){
        this.roleBuChefProjet = true;

        this.authorized = true;

      }

      if(authority== 'BU_VALUE_SOFTWARE'){
        this.roleBuValueSoftware = true;
        this.authorized = true;

      }

      if(authority== 'BU_SYSTEM'){
        this.roleBuSystem = true;

        this.authorized = true;

      }

      if(authority== 'BU_VOLUME'){
        this.roleBuVolume = true;

        this.authorized = true;

      }


      if (authority == 'READ_ALL_PROJECTS') {
        this.roleReadAllProjects = true;
        this.authorized = true;

      }
      if (authority == 'READ_MY_PROJECTS') {
        this.roleReadMyProjects = true;
        this.authorized = true;


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
      }

      if (authority == 'READ_MY_CONTRATS') {
        this.roleReadMyContrats = true;
        this.authorized = true;

      }

      if (authority == 'READ_ALL_CONTRATS') {
        this.roleReadAllContrats = true;
        this.authorized = true;

      }


    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {

  }


}
