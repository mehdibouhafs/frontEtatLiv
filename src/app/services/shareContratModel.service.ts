import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Echeance} from "../../model/model.echeance";
import {Observable, Subject} from "rxjs/Rx";
import {FactureEcheance} from "../../model/model.factureEcheance";
import {ContratModel} from "../../model/model.contratModel";

@Injectable({
  providedIn: 'root'
})
export class ShareContratModelService {
  private cm = new Subject<ContratModel>();


  getContratModel(): Observable<ContratModel> {
    return this.cm.asObservable();
  }

  setContratModel(contratModel: ContratModel) {
    this.cm.next(contratModel);
  }


}
