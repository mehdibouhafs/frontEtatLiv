import {Injectable} from "@angular/core";

import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {host} from "./host";
import {Observable} from 'rxjs';
import {Projet} from '../../model/model.projet';
import {ResponseContentType} from '@angular/http';
import {AuthenticationService} from './authentification.service';


@Injectable()
export class EtatProjetService {

  private host = host;



  constructor(private  http:HttpClient,private authenticationService:AuthenticationService){}

  getProjets(cloture : boolean,bu1 : string,bu2 : string,statut:string,chefProjet:string,commercialOrChefProjet:string) {
    //return this.http.get(this.host+"/getProjets?username="+username, {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
    //return this.http.get(this.host+"/getProjects?idEtatProjet=1"+"&page="+page+"&size="+size);
    return this.http.get(this.host+"/getProjectsWithStatut?idEtatProjet=1&cloturer="+cloture+"&bu1="+bu1+"&bu2="+bu2+"&statut="+statut+"&chefProjet="+chefProjet+"&commercialOrChefProjet="+commercialOrChefProjet,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }



  uploadEtat(file:File, file_name:string){
    let formData:FormData = new FormData();
    formData.append('file', file);
    return this.http.post(this.host+"/post",formData,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  updateProjet(projet:Projet){
    return this.http.put(this.host+'/projets',projet,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  pushFileToStorage2(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', this.host+'/post', formdata, {
      //headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()}),
      reportProgress: true,
      responseType: 'text'
    },);

    return this.http.request(req);
  }

  getAllEmployees(){
    return this.http.get(this.host+'/getAllEmployees/',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getAllEmployeesByService(service :string){
    return this.http.get(this.host+'/getAllEmployeesByService?serviceName='+service,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getEmployeesByName(name :string){
    return this.http.get(this.host+'/getEmployeesByName?nameEmploye='+name,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getStatistics(){
    return this.http.get(this.host+'/getStatistics',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }


  exportEtatProjet(projets : Array<Projet>) {
    return this.http.post(this.host + '/exportExcel',projets, {responseType: 'blob' as 'json',headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})},
    );
  }

  getEtatProjet(){
    return this.http.get(this.host+'/getEtatProjet',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  /*exportProjets(projets:Array<Projet>){
    return this.http.post(this.host+'/exportProjets',projets);
  }*/

  refreshProjets(){
    return this.http.get(this.host+'/refreshProjets',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }








}
