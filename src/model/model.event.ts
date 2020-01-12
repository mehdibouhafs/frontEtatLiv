
import {Document} from "./model.document";
import {User} from "./model.user";
import {Projet} from "./model.projet";
import {Produit} from "./model.produit";

export class Event {
  public id: number;
  public actions: string;
  public date : Date;
  public user: User;
  public projet: Projet;
  public document: Document;
  public produit : Produit;
  public createdby:User;

}
