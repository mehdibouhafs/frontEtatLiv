import {Detail} from './model.detail';
import {Commentaire} from './model.commentaire';
import {EtatProjet} from './model.etatProjet';
import {Reunion} from './model.reunion';
import {Employer} from './model.employer';
import {User} from './model.user';

export class Projet {

  public codeProjet: string;

  public details : Array<Detail>;

  public  dateFinProjet : Date;

  public  condPaiement : string;

  public  preRequis : string;

  public  livraison : string;

  public  designProjet : string;

  public  intervenant : string;

  public  action : string;

  public  garantie : string;

  public  maintenance : string;

  // private String ralAndLnf;

  public  cloture : boolean;

  public creation : Date;

  public lastUpdate : Date;


  public commentaires : Array<Commentaire>;

  public syntheseProjet : string;

  public avantVente : string;

  public perimetreProjet : string;

  public client : string;

  public codeCommercial : string;

  public commercial : string;

  public chefProjet : string;

  public  projet : string;

  public  refCom : string;

  public  age : number;

  public  codeClient : string;


  public  facturation : number;


  public  prestationCommande : number;


  public  ralJrsPrestCalc  : number;

  public montantStock:number;


  public  factEncours : number;

  public  risque : string;


  public  bu : string;

  public statut :string;

  public  dateCmd : Date;

  public  montantCmd : number;

  public  restAlivrer : number;

  public  livrer : number;

  public  livrerNonFacture : number;

  public  livreFacturePayer : number;

  public  montantPayer : number;

  public isMoreThanSixMonth : boolean;

  public updated : boolean;

  public reunions : Array<Reunion>;

  public suivre : boolean;

  public intervenantPrincipal : string;

  public intervenantSecondaire : string;

  public updatedBy : User;

  public infoClient : string;

  public infoFournisseur: string;

  public infoProjet : string;


}
