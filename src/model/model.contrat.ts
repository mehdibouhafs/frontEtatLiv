import {Detail} from './model.detail';
import {Commentaire} from './model.commentaire';
import {EtatProjet} from './model.etatProjet';
import {User} from './model.user';
import {EtatRecouvrement} from './model.etatRecouvrement';
import {Employer} from './model.employer';
import {Echeance} from "./model.echeance";
import {CommandeFournisseur} from "./model.commandeFournisseur";
import {Facture} from "./model.facture";
import {FactureEcheance} from "./model.factureEcheance";
import {Piece} from "./model.piece";


export class Contrat {

  public numContrat : number;

  public codePartenaire :string;

  public nomPartenaire : string;

  public statut : string;

  public du : Date;

  public  au : Date;

  public description:string;

  public nomSousTraitant:string;

  public  contratSigne :boolean=false;

  public codeProjet : string;

  public numMarche:string;

  public pilote:string;

  public montantContrat:number;

  public  periodeFacturation : string;

  public  occurenceFacturation : string;

  public montantValueSi:number;

  public montantValueRs : number;

  public montantValueSw:number;

  public montantVolume:number;

  public montantCablage:number;

  public montantAssitanceAn:number;

  // partie updatable

  public commentaires : Array<Commentaire>;

  public echeances : Array<Echeance> ;

  public commandesFournisseurs : Array<CommandeFournisseur>

  public updated:boolean;

  public sousTraiter:boolean;

  public montantAnnuel:number;

  public montantPaye:number;

  public montantTtc:number;

  public montantFactureAn :number;

  public montantRestFactureAn:number;

  public montantProvisionFactureInfAnneeEnCours;


  public montantProvisionAFactureInfAnneeEnCours;

  public periodeFacturationLabel:string;

  public occurenceFacturationLabel:string;

  public factureEcheances : Array<FactureEcheance>;

  public pieces : Array<Piece>;

  public lastUpdate:Date;

  public bu:string;

  public reconductionTacite:boolean;

  public delaiPreavisResiliation: string;

  public nbEcheancesNonFactureEnRetard:number;





}
