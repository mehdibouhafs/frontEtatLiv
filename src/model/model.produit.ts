import {Authorisation} from "./model.authorisation";
import {Service} from "./model.service";
import {Commentaire} from './model.commentaire';
import {CommentaireProduit} from './model.commentaireProduit';
import {User} from "./model.user";

export class Produit {

  public  id : string;

  public  codeMagasin : string;

  public nomMagasin:string ;

  public itemCode:string ;

  public itemName:string ;

  public gerePar:string ;

  public nature:string ;

  public sousNature:string ;

  public domaine:string ;

  public sousDomaine:string ;

  public marque:string ;

  public numLot:string ;


  public client:string ;

  public commercial:string ;

  public chefProjet:string ;

  public dateCmd:Date ;

  public bu:string ;

  public qte:number ;
  public qteRal:number ;
  public pmp:number ;
  public montant :number ;

  public  dateEntre : Date;

  public  commentaires :  Array<CommentaireProduit>;

  public  commentaireArtcileProjet :string;


  public  commentaireLot:string;


  public  commentaireReference:string;

  public lastUpdate :Date;

  public updated : boolean;

  public updatedBy:User;

  public color: string;

  public type_magasin: string;

}
