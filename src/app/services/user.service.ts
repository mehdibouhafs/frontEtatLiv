import {Injectable} from "@angular/core";

import {HttpClient, HttpHeaders} from "@angular/common/http";
import {host} from "./host";
import {AuthenticationService} from './authentification.service';

@Injectable()
export class UserService {

  private host = host;

  constructor(private authenticationService:AuthenticationService,private  http:HttpClient){}

  searchUsers(tosearch:string) {
    return this.http.get(this.host+'/searchUser?tosearch='+tosearch, {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  searchUsersByService(tosearch:string) {
    return this.http.get(this.host+'/searchUserByService?idService='+this.authenticationService.getIdService()+'&tosearch='+tosearch, {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getUser(username:string) {
    return this.http.get(this.host+"/getUser?username="+username, {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getUsersByService(motCle:string, page:number, size:number) {
    return this.http.get(this.host+'/searchUserByService?idService='+this.authenticationService.getIdService()+'&tosearch='+motCle+'&page='+page+'&size='+size, {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

}
