import {Injectable} from "@angular/core"
import {HttpClient, HttpHandler, HttpHeaders} from "@angular/common/http";
import {headersToString} from "selenium-webdriver/http";
import {JwtHelper} from "angular2-jwt";
import {Router} from "@angular/router";
import {UserService} from "./user.service";
import {host} from "./host";
import * as SecureLS from "./../../../node_modules/secure-ls/dist/secure-ls.js";
import {Projet} from '../../model/model.projet';
import {Reunion} from '../../model/model.reunion';
import {AuthenticationService} from './authentification.service';

@Injectable()
export class ReunionService {


  private host = host;



  constructor(private  http: HttpClient,private authenticationService:AuthenticationService) {
  }

  addReunion(reunion:Reunion){
    return this.http.post(this.host+'/reunions',reunion,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  updateReunion(id:number, reunion:Reunion){
    return this.http.put(this.host+'/reunions/'+id,reunion,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  deleteReunion(idReunion : any){
    return this.http.delete(this.host+'/reunions/'+idReunion,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getAllReunions(){
    return this.http.get(this.host+'/reunions',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }
}
