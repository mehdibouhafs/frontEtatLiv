import {Detail} from './model.detail';
import {Commentaire} from './model.commentaire';
import {EtatProjet} from './model.etatProjet';
import {User} from './model.user';
import {EtatRecouvrement} from './model.etatRecouvrement';
import {Employer} from './model.employer';
import {CommentaireEcheance} from "./model.commentaireEcheance";
import {Contrat} from "./model.contrat";


export class ContratModel {

 public id : number;

 public name:string;

  public  du : Date;

  public  au: Date;

  public montant : number;

  public  montantPrevisionel :number;

  public occurenceFacturation : string;

  public periodeFacturation : string;



  public contrat : Contrat;

  public messageDelete:string;

  public addedByUser : boolean;

}
