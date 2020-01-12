import {Injectable} from "@angular/core";

import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {host} from "./host";
import {Observable} from 'rxjs';
import {Projet} from '../../model/model.projet';
import {ResponseContentType} from '@angular/http';
import {AuthenticationService} from './authentification.service';
import {Produit} from '../../model/model.produit';


@Injectable()
export class EtatStockService {

  private host = host;


  constructor(private  http:HttpClient,private authenticationService:AuthenticationService){}

  getAllProduits() {
    //return this.http.get(this.host+"/getProjets?username="+username, {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
    //return this.http.get(this.host+"/getProjects?idEtatProjet=1"+"&page="+page+"&size="+size);
    return this.http.get(this.host+"/getAllStock",{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getDistinctLot(){
    return this.http.get(this.host+"/getDistinctLot",{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }


  getAllStockByFiltre(nature:string, sousNature:string, domaine:string, sousDomaine:string, numLot:string, client:string, nomMagasin:string){
    return this.http.get(this.host+"/getAllStockByFiltre?nature="+nature+"&sousNature="+sousNature+"&domaine="+domaine+"&sousDomaine="+sousDomaine+"&numLot="+numLot+"&client="+client+"&nomMagasin="+nomMagasin,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  exportEtatProduit(produits : Array<Produit>) {
    return this.http.post(this.host + '/exportProduitsExcel', produits, {
        responseType: 'blob' as 'json',
        headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})
      },
    );
  }


  updateProduit(produit:Produit){
    return this.http.put(this.host+'/produits',produit,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }



  refreshProduits(){
    return this.http.get(this.host+'/refreshProduit',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }










}
