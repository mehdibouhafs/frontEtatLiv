import {Injectable} from "@angular/core";

import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {host} from "./host";
import {Observable} from 'rxjs';
import {Projet} from '../../model/model.projet';
import {ResponseContentType} from '@angular/http';
import {AuthenticationService} from './authentification.service';
import {Produit} from '../../model/model.produit';
import { StockProjet } from 'src/model/model.StockProjet';
import { CommentaireStock } from 'src/model/model.commentaireStock';


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

  exportEtatStock(stock : Array<StockProjet>) {
    return this.http.post(this.host + '/exportStockExcel', stock, {
        responseType: 'blob' as 'json',
        headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})
      },
    );
  }


  updateProduit(produit:Produit){
    return this.http.put(this.host+'/produits',produit,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }


  deleteCommentaire(commentaire: any){
    console.log("COMMENT TO DELETE "+commentaire);
    return this.http.post(this.host+'/commentaireDelete?id='+commentaire,commentaire,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  
  }

  refreshProduits(){
    return this.http.get(this.host+'/refreshProduit',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }
  
  getAllProduitsProjet() {
    return this.http.get(this.host+'/getStockParProjet',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken(),"Content-Type": "application/json"})});
  }


  getAllStockProjetByFiltre(annee:string,numLot:string, client:string,magasin:string){
    console.log("TEST MAG "+magasin);
    return this.http.get(this.host+"/getAllStockProjetByFiltre?numLot="+numLot+"&client="+client+"&annee="+annee+"&magasin="+magasin,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }



saveCommentaireProjet(commentaire: any,projet:any,id:any,user:any){
  return this.http.post(this.host+'/saveCommentProjet?projet='+projet+"&id="+id+"&user="+user,commentaire,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

}

getCommentaireParStockProjet(projet:string){
  console.log("TOKEN "+this.authenticationService.getToken())
  return this.http.get(this.host+"/getCommentaireParStockProjet?projet="+projet,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
}





}
