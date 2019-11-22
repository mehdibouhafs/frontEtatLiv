import {Detail} from './model.detail';
import {Commentaire} from './model.commentaire';
import {EtatProjet} from './model.etatProjet';
import {User} from './model.user';
import {EtatRecouvrement} from './model.etatRecouvrement';
import {Employer} from './model.employer';


export class Document {

  public codePiece:string;

  public  numPiece : string;

  public  typeDocument : string;

  public  datePiece : Date;

  public  codeClient : string;

  public  client : string;

  public  refClient : string;

  public  codeProjet : string;

  public  projet : string;

  public  codeCommercial : string;

  public  commercial : string;

  public  chefProjet : string;

  public  montantPiece : number;

  public  montantOuvert : number;

  public  chargerRecouvrement : string;

  public  anneePiece : number;


  public  agePiece : number;


  public  age : string;


  public  montantPayer : number;


  public  conditionDePaiement : string;

  public  caution : boolean;

  public  numCaution : string;

  public  typeCaution : string;

  public  montantCaution : number;

  public  dateLiberationCaution : Date;

  public  details : Array<Detail>;


  public  etatRecouvrement : EtatRecouvrement;

  public  cloture : boolean;

  // partie updatable

  public commentaires : Array<Commentaire>;

  public  creation : Date;

  public  lastUpdate : Date;

  public  statut  :string;

  public  updatedBy : User;

  public  motif : string;

  public  montantGarantie : number;

  public  montantProvision : number;

  public  dateFinGarantie : Date;

  public  datePrevuEncaissement : Date;

  public  dureeGarantie : number;

  public  action : string;

  public  responsable : string;

  public  dateDepot : Date;

  public  motifChangementDate : string;

  public  datePvProvisoire : Date;

  public  datePrevuReceptionDefinitive : Date;

  public updated : boolean;

  public isMoreThanSixMonth : boolean;

  public infoClient : string;

  public infoChefProjetOrCommercial: string;

  public infoProjet : string;

  public dateEcheance : Date;

  public isLessThanOneMonth : boolean;

  public isLessThanTwoMonth : boolean;

  public isLessThanTreeMonth : boolean;

  public isMoreThanTreeMonthAndLessThanTweleveMonth : boolean;

  public isMoreThanTwelveMonth : boolean;

  public isGris : boolean;

  public isExpiredEcheance : boolean;

  public ageDepot : number;

  public retenuGarantieIssue : number;




}
