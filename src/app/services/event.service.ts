import {Injectable} from "@angular/core"
import {HttpClient, HttpHandler, HttpHeaders} from "@angular/common/http";
import {host} from "./host";
import {AuthenticationService} from './authentification.service';
import {Event} from "../../model/model.event";

@Injectable()
export class EventService {


  private host = host;



  constructor(private  http: HttpClient,private authenticationService:AuthenticationService) {
  }

  updateStatutEvent(idEvent:number, event : Event){
    return this.http.put(this.host+'/events/'+idEvent,event,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }


  getAllEvents(username : string,lastConnectionDate : string){
    return this.http.get(this.host+'/events?username='+username+'&lastConnectionDate='+lastConnectionDate,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getAllEventsByService(username : string,lastConnectionDate : string,service : string){
    return this.http.get(this.host+'/events?username='+username+'&lastConnectionDate='+lastConnectionDate+'&service='+service,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }


}
