import {Injectable} from "@angular/core";

import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {host} from "./host";
import {Observable} from 'rxjs';
import {Projet} from '../../model/model.projet';
import {ResponseContentType} from '@angular/http';
import {AuthenticationService} from './authentification.service';
import {Contrat} from "../../model/model.contrat";
import {Echeance} from "../../model/model.echeance";
import {Commentaire} from "../../model/model.commentaire";
import {FactureEcheance} from "../../model/model.factureEcheance";


@Injectable()
export class ContratService {

  private host = host;



  constructor(private  http:HttpClient,private authenticationService:AuthenticationService){}

  getAllContrats() {
    //return this.http.get(this.host+"/getProjets?username="+username, {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
    //return this.http.get(this.host+"/getProjects?idEtatProjet=1"+"&page="+page+"&size="+size);
    return this.http.get(this.host+"/getAllContrat",{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getAllCommentaireEcheance() {
    //return this.http.get(this.host+"/getProjets?username="+username, {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
    //return this.http.get(this.host+"/getProjects?idEtatProjet=1"+"&page="+page+"&size="+size);
    return this.http.get(this.host+"/getAllCommentaireEcheance",{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }


  exportContrat(contrats : Array<Contrat>) {
    return this.http.post(this.host + '/exportContratExcel',contrats, {responseType: 'blob' as 'json',headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})},
    );
  }

  updateEcheance(echeance : Echeance){
    return this.http.put(this.host+'/updateEcheance',echeance,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }

  editEcheance(numContrat :any,echeance : Echeance){
    return this.http.put(this.host+'/editEcheance/'+numContrat,echeance,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }

  editFactureEcheance(numContrat :any,factureEcheance : FactureEcheance){
    return this.http.put(this.host+'/editFactureEcheance/'+numContrat,factureEcheance,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }

  deleteEcheance(idEcheance : any){
    return this.http.delete(this.host+'/deleteEcheance/'+idEcheance,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }


  refreshContrats(){
    return this.http.get(this.host+'/refreshContrats',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  addCommentaires(numContrat:number,commentaires:Array<Commentaire>){
    return this.http.put(this.host+'/addCommentaires/'+numContrat,commentaires,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  deleteCommentaire(idCommentaire){
    return this.http.delete(this.host+'/idCommentaire/'+idCommentaire,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }


  exportPiece(fullPath:string){
    return this.http.post(this.host+'/exportPiece',fullPath,{responseType: 'blob' as 'json',headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  contratsFilter(numMarche:string,nomPartenaire:string,pilote:string,sousTraiter:any){

    var res = new Array();
    if(numMarche!=null && numMarche!="null"){
      res.push("numMarche="+numMarche);
    }

    if(nomPartenaire!=null && nomPartenaire!="null"){
      res.push("nomPartenaire="+nomPartenaire);
    }

    if(pilote!=null && pilote!="null"){
      res.push("pilote="+pilote);
    }

    if(sousTraiter!=null && sousTraiter!="null"){
      res.push("sousTraiter="+sousTraiter);
    }

    var str = res.join("&");

    console.log("res " + res);

    return this.http.get(this.host+'/contratsFilter?'+str,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }


}
