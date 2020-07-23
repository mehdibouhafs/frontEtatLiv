import {Authorisation} from "./model.authorisation";
import {Service} from "./model.service";
import {Commentaire} from './model.commentaire';
import {CommentaireProduit} from './model.commentaireProduit';
import {User} from "./model.user";
import { CommentaireStock } from './model.commentaireStock';
import { Type } from '@angular/compiler';

export class StockProjet {

  public  id_stock : number;
  public num_lot:string ;
  public client:string ;
  public commercial:string ;
  public chef_projet:string ;
  public montant :number ;
  public  annee : string;
  public nom_lot: string;
  public magasin: string;
  public date_rec:string;
  public type_magasin:string;
  public  commentaires :  Array<CommentaireStock>;



}
