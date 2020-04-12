import {User} from './model.user';
import {Employer} from './model.employer';
import {Projet} from './model.projet';
import { StockProjet } from './model.StockProjet';

export class CommentaireStock {
  public id: number;
  public content: string;
  public date : Date;
  public user_username: User;
  public employer : string;
  public projet : Projet;
  public stock : StockProjet;



}
