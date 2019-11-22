import {Projet} from "./model.projet";
import {Document} from './model.document';

export class EtatRecouvrement {
   id: any;
   creationDate: Date;
  lastUpdate: Date;
   documents: Document[] = new Array();

}
