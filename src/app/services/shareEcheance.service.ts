import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Echeance} from "../../model/model.echeance";
import {Observable, Subject} from "rxjs/Rx";
import {FactureEcheance} from "../../model/model.factureEcheance";

@Injectable({
  providedIn: 'root'
})
export class ShareEcheanceService {
  private echeance = new Subject<Echeance>();

  private factures = new Subject<FactureEcheance>();

  getEcheance(): Observable<Echeance> {
    return this.echeance.asObservable();
  }

  setEcheance(echeance: Echeance) {
    this.echeance.next(echeance);
  }

  getFactureEcheance(): Observable<FactureEcheance> {
    return this.factures.asObservable();
  }

  setFactureEcheance(factureEcheance: FactureEcheance) {
    this.factures.next(factureEcheance);
  }
}
