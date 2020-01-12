import {User} from './model.user';
import {Employer} from './model.employer';
import {Projet} from './model.projet';

export class CommentaireProduit {
  public id: number;
  public content: string;
  public date : Date;
  public user: User;
  public employer : string;



}
