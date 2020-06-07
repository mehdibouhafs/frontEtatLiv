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

  getAllContrat(page: number,size:number) {
    //return this.http.get(this.host+"/getProjets?username="+username, {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
    //return this.http.get(this.host+"/getProjects?idEtatProjet=1"+"&page="+page+"&size="+size);
    return this.http.get(this.host+"/getAllContrats?page="+page+"&size="+size,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getContrat(numContrat : number){

    return this.http.get(this.host+"/getContrat?numContrat="+numContrat,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getEcheance(numContrat : number,page: number,size:number,sortBy :string,sortType :string){

    var res = new Array();
    res.push("numContrat="+numContrat);
    res.push("page="+page);
    res.push("size="+size);
    if(sortBy!=null && sortType!="null" ){
      res.push("sortBy="+sortBy);
      res.push("sortType="+sortType);
    }

    var str = res.join("&");


    return this.http.get(this.host+"/getEcheance?"+str,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getFactureEcheance(numContrat : number,page: number,size:number,sortBy :string,sortType :string){

    var res = new Array();
    res.push("numContrat="+numContrat);
    res.push("page="+page);
    res.push("size="+size);
    if(sortBy!=null && sortType!="null" ){
      res.push("sortBy="+sortBy);
      res.push("sortType="+sortType);
    }

    var str = res.join("&");

    return this.http.get(this.host+"/getFactureEcheance?"+str,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getCommandeFournisseurs(numContrat : number,mc:string,page: number,size:number,sortBy :string,sortType :string){
    var res = new Array();
    res.push("numContrat="+numContrat);
    res.push("page="+page);
    res.push("size="+size);
    if(mc!=null && mc!="null" ){
      res.push("mc="+mc);
    }
    if(sortBy!=null && sortType!="null" ){
      res.push("sortBy="+sortBy);
      res.push("sortType="+sortType);
    }

    var str = res.join("&");
    return this.http.get(this.host+"/getCommandeFournisseur?"+str,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getPieces(numContrat : number,page: number,size:number,sortBy :string,sortType :string){
    var res = new Array();
    res.push("numContrat="+numContrat);
    res.push("page="+page);
    res.push("size="+size);
    if(sortBy!=null && sortType!="null" ){
      res.push("sortBy="+sortBy);
      res.push("sortType="+sortType);
    }

    var str = res.join("&");

    return this.http.get(this.host+"/getPieces?"+str,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getCommentairesContrat(numContrat : number,page: number,size:number){

    return this.http.get(this.host+"/getCommentairesContrat?numContrat="+numContrat+"&page="+page+"&size="+size,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getAllClients(){

    return this.http.get(this.host+"/getAllClients",{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getAllNumMarches(){

    return this.http.get(this.host+"/getAllNumMarches",{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getPilotes(){

    return this.http.get(this.host+"/getPilotes",{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }





  contratsFilter2(page:number,size:number,mc:string,numMarche:string,nomPartenaire:string,pilote:string,sousTraiter:any,sortBy :string,sortType :string){

    var res = new Array();

    res.push("page="+page);
    res.push("size="+size);
    if(mc!=null && mc!="null" ){
      res.push("mc="+mc);
    }

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

    if(sortBy!=null && sortBy!="null" && sortType!=null && sortType!="null" ){
      res.push("sortBy="+sortBy);
      res.push("sortType="+sortType);
    }

    var str = res.join("&");

    console.log("res " + res);

    return this.http.get(this.host+'/contratsFilter2?'+str,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getStatisticsContrat(mc:string,numMarche:string,nomPartenaire:string,pilote:string,sousTraiter:any){

    var res = new Array();


    if(mc!=null && mc!="null" ){
      res.push("mc="+mc);
    }

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

    return this.http.get(this.host+'/getStatisticsContrat?'+str,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }



  getAllEcheancesForContrat(numContrat : number) {
    //return this.http.get(this.host+"/getProjets?username="+username, {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
    //return this.http.get(this.host+"/getProjects?idEtatProjet=1"+"&page="+page+"&size="+size);
    return this.http.get(this.host+"/getAllEcheancesForContrat?numContrat="+numContrat,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getAllCommentaireEcheance() {
    //return this.http.get(this.host+"/getProjets?username="+username, {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
    //return this.http.get(this.host+"/getProjects?idEtatProjet=1"+"&page="+page+"&size="+size);
    return this.http.get(this.host+"/getAllCommentaireEcheance",{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }


  exportContrats(mc:string,numMarche:string,nomPartenaire:string,pilote:string,sousTraiter:any) {
    var res = new Array();

    if(mc!=null && mc!="null" ){
      res.push("mc="+mc);
    }

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

    var str="";
    if(res.length>0){
      str = "?"+res.join("&");
    }


    console.log("res " + res);
    return this.http.get(this.host + '/exportContratExcel'+str, {responseType: 'blob' as 'json',headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})},
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

  addEcheance(numContrat :any,echeance : Echeance){
    return this.http.post(this.host+'/addEcheance/'+numContrat,echeance,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }

  deleteEcheance(idEcheance : any){
    return this.http.delete(this.host+'/deleteEcheance/'+idEcheance,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }


  refreshContrats(){
    return this.http.get(this.host+'/refreshContrats',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  addCommentaire(numContrat:number,commentaire:Commentaire){
    return this.http.put(this.host+'/addCommentaire/'+numContrat,commentaire,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  deleteCommentaire(idCommentaire){
    return this.http.delete(this.host+'/deleteCommentaire/'+idCommentaire,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
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
