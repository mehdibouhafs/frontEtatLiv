import {Detail} from './model.detail';
import {Commentaire} from './model.commentaire';
import {EtatProjet} from './model.etatProjet';
import {User} from './model.user';
import {EtatRecouvrement} from './model.etatRecouvrement';
import {Employer} from './model.employer';
import {Contrat} from "./model.contrat";
import {FactureEcheance} from "./model.factureEcheance";


export class Facture {


  public  numFacture:number;


  public  contrat:Contrat;


  public  dateEnregistrement:Date;


  public  debutPeriode :Date;


  public  finPeriode :Date;

  public  montantRestant : number;

  public montantHT:number;

  public montantTTC:number;


  public  factureEcheances:Array<FactureEcheance>;





}
