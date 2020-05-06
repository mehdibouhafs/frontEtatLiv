import {Detail} from './model.detail';
import {Commentaire} from './model.commentaire';
import {EtatProjet} from './model.etatProjet';
import {User} from './model.user';
import {EtatRecouvrement} from './model.etatRecouvrement';
import {Employer} from './model.employer';
import {CommentaireEcheance} from "./model.commentaireEcheance";
import {Contrat} from "./model.contrat";


export class Echeance {

 public id : number;

  public   du : Date;

  public   au: Date;

  public  montantPrevision :number;

  public occurenceFacturation : string;

  public periodeFacturation : string;

  public montantFacture:number;

  public montantRestFacture :number;

  public factures:string;

  public factures2 : Array<String>;

  public commentaire : CommentaireEcheance;

  public contrat : Contrat;

  public messageDelete:string;

}
