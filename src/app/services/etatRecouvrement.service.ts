import {Injectable} from "@angular/core";

import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {host} from "./host";
import {Observable} from 'rxjs';
import {Document} from '../../model/model.document';
import {AuthenticationService} from './authentification.service';



@Injectable()
export class EtatRecouvrementService {

  private host = host;

  constructor(private  http:HttpClient,private authenticationService:AuthenticationService){}

  getDocuments(cloture : boolean,chargeRecouvrement:string,statut:string[],commercial:string,chefProjet:string,client:string,anneePiece:string,age:any) {
    //return this.http.get(this.host+"/getProjets?username="+username, {headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
    //return this.http.get(this.host+"/getProjects?idEtatProjet=1"+"&page="+page+"&size="+size);
    console.log("AGE "+this.authenticationService.getToken());
    
    return this.http.get(this.host+"/getDocuments?idEtatRecouvrement=1&cloturer="+cloture+"&chargeRecouvrement="+chargeRecouvrement+"&statut="+statut+"&commercial="+commercial+"&chefProjet="+chefProjet+"&client="+client+"&anneePiece="+anneePiece+"&age="+age,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  uploadEtat(file:File, file_name:string){
    let formData:FormData = new FormData();
    formData.append('file', file);
    return this.http.post(this.host+"/post",formData,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  updateDocument(document:Document){
    return this.http.put(this.host+'/documents',document,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  pushFileToStorage2(file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', this.host+'/post2', formdata, {
      //headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()}),
      reportProgress: true,
      responseType: 'text'
    },);

    return this.http.request(req,);
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


  getEtatRecouvrement(){
    return this.http.get(this.host+'/getEtatRecouvrement',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getDocumentsByCommercial(cloturer : boolean , codeCommercial:string){
    return this.http.get(this.host+'/getDocumentsByCodeCommercial?cloture='+cloturer+"&codeCommercial="+codeCommercial,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getDocumentsByNumDocument(cloturer : boolean , numDocument:string){
    return this.http.get(this.host+'/getDocumentsByNumDocument?cloture='+cloturer+"&numDocument="+numDocument,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getDocumentsByCommercialOrChefProjet(cloturer : boolean , commercialOrChefProjet:string){
    return this.http.get(this.host+'/getDocumentsByCommercialOrChefProjet?cloture='+cloturer+"&commercialOrChefProjet="+commercialOrChefProjet,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getDocumentsByChargeRecouvrement(cloturer : boolean , chargeRecouvrement:string){
    return this.http.get(this.host+'/getDocumentsByChargeRecouvrement?cloture='+cloturer+"&chargeRecouvrement="+chargeRecouvrement,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getDocumentsByChefProjet(cloturer : boolean , chefProjet:string){
    return this.http.get(this.host+'/getDocumentsByChefProjet?cloture='+cloturer+"&chefProjet="+chefProjet,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getDocumentsByClient(cloturer : boolean , client:string){
    return this.http.get(this.host+'/getDocumentsByCodeClient?cloture='+cloturer+"&codeClient="+client,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getDocumentsByCodeProjet(cloturer : boolean , codeProjet:string){
    return this.http.get(this.host+'/getDocumentsByCodeProjet?cloture='+cloturer+"&codeProjet="+codeProjet,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }



  exportEtatDocument(documents : Array<Document>) {
    return this.http.post(this.host + '/exportDocumentsExcel',documents, {responseType: 'blob' as 'json',headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})},
    );
  }

  exportEncaissementNextMonth(){
    return this.http.get(this.host+'/exportEncaissementNextMonth',{responseType: 'blob' as 'json',headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }

  exportReleveClient(client:string){
    return this.http.get(this.host+'/exportReleveClient?client='+client,{responseType: 'blob' as 'json',headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getDocumentByClientOnDate(client:string,month : any,year : any){
    return this.http.get(this.host+'/exportSituationDocumentsByClientDate?client='+client+"&month="+month+"&year="+year,{responseType: 'blob' as 'json',headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getCountSumDocumentsByClient(client:string){
    return this.http.get(this.host+'/exportSituationDocumentsByClient?client='+client,{responseType: 'blob' as 'json',headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getDistinctAnneePiece(){
    return this.http.get(this.host+'/getDistinctAnneePiece',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }

  refreshDocuments(){
    return this.http.get(this.host+'/refreshDocuments',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }


  getDistinctClientDocument(){
    return this.http.get(this.host+'/getDistinctClientDocument',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }


  getDistinctCommercialDocument(){
    return this.http.get(this.host+'/getDistinctCommercialDocument',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }

  getDistinctChefProjetDocument(){
    return this.http.get(this.host+'/getDistinctChefProjetDocument',{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }








}
