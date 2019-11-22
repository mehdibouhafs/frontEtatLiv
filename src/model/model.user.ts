import {Authorisation} from "./model.authorisation";
import {Service} from "./model.service";

export class User {
  public username: string;
  public firstName: string;
  public lastName: string;
  public service: Service;
  public autorisations: Authorisation[];
  public sigle : string;

}
