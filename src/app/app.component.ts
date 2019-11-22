import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './services/authentification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontEtat';
  routeToProjects: boolean;

  constructor(private authService : AuthenticationService,private router:Router){

  }

  ngOnInit() {

    if(this.authService.getToken()!=null){
      this.authService.getRoles().forEach(authority => {
        if (authority == 'READ_ALL_PROJECTS') {
          this.routeToProjects = true;

        }
        if (authority == 'READ_MY_PROJECTS') {
          console.log("hhho");
          this.routeToProjects = true;

        }

      });

      if(this.routeToProjects){
        this.router.navigateByUrl('/etatProjet');
      }else{
        this.router.navigateByUrl('/etatRecouvrement');
      }
    }else{
      this.router.navigateByUrl("/login");
    }


  }

}
