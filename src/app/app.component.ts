import {Component, HostListener, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthenticationService} from './services/authentification.service';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {Location} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{
  title = 'M-Gouv';
  routeToProjects: boolean;
  route: string;

  constructor(private authService : AuthenticationService,private router:Router,location: Location){




    console.log("search route");
      router.events.subscribe((val) => {


      if(location.path() != ''){
        this.route = location.path();
      } else {

        this.route = '/dashboard';
      }



    });
  }

  @HostListener("window:onbeforeunload",["$event"])
  clearLocalStorage(event){
    this.authService.logout();
  }

  ngOnInit() {
/*
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

*/
  }

}
