
import {Echeance} from "./model.echeance";
import {Facture} from "./model.facture";
import {Contrat} from "./model.contrat";


export class FactureEcheance {


  public  id :number;
  public  contrat:Contrat;
  public  facture:Facture;
  public  echeance :Echeance;
  public  montant:number;
  public affectedByUser:boolean;


}
