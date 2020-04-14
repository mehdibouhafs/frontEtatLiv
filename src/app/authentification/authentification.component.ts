import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../services/authentification.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})


export class AuthentificationComponent implements OnInit {

  routeToProjects : boolean;
  mode = 2;
  constructor(private  router:Router,private authService:AuthenticationService) { }

  // tslint:disable-next-line:no-empty


  ngOnInit() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  onLogin(user){
    this.authService.login(user)
      .subscribe(resp=>{
          let jwtToken = resp.headers.get("authorization");
          this.authService.saveToken(jwtToken);

          this.authService.getRoles().forEach(authority => {

            if(authority=='BU_COMMERCIAL'){
              this.routeToProjects = true;
            }

            if(authority== 'BU_RESEAU_SECURITE'){
              this.routeToProjects = true;

            }

            if(authority== 'BU_CHEF_PROJET'){
              this.routeToProjects = true;

            }

            if(authority== 'BU_SYSTEM'){
              this.routeToProjects = true;

            }

            if (authority == 'READ_ALL_PROJECTS') {
              console.log("onlogin1");
              this.routeToProjects = true;

            }
            if (authority == 'READ_MY_PROJECTS') {
              console.log("onlogin");
              this.routeToProjects = true;

            }

          });

          if(this.routeToProjects){
            this.router.navigateByUrl('/etatProjet');
          }else{
            this.router.navigateByUrl('/etatRecouvrement');
          }

        },
        err=>{
              this.mode = 1;
          this.authService.logout();
          this.router.navigateByUrl('/login');
        }
      )
  }













}
