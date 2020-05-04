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
import { BalanceAgee } from 'src/model/model.balanceAgee';


@Injectable()
export class BalanceAgeeService {

  private host = host;


  constructor(private  http:HttpClient,private authenticationService:AuthenticationService){}

  getBalance() {
    return this.http.get(this.host+"/getBalance",{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});
  }

  getBalanceByCR(user: any){
    return this.http.get(this.host+"/getBalanceByCR?cr="+user,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }

  getBalanceByFiltre(client: any,cr:any){
    return this.http.get(this.host+"/getBalanceByFiltre?client="+client+"&cr="+cr,{headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})});

  }

  exportBalance(balance : Array<BalanceAgee>) {
    return this.http.post(this.host + '/exportBalance', balance, {
        responseType: 'blob' as 'json',
        headers: new HttpHeaders({'Authorization': this.authenticationService.getToken()})
      },
    );
  }






}
