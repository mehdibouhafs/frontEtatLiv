import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs/Rx";

@Injectable({
  providedIn: 'root'
})
export class ShareBlockedKeyService {
  private blockedKey = new Subject<boolean>();



  getBlockedKey(): Observable<boolean> {
    return this.blockedKey.asObservable();
  }

  setBlockedKey(blockedKey: boolean) {
    this.blockedKey.next(blockedKey);
  }

}
