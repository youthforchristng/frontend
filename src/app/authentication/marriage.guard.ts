import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate,  Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { EncryptionService } from '../services/encryption.service';

// import { EncryptionService } from '../encryption.service';


@Injectable({
  providedIn: 'root'
})
export class MarriageGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router,
    private _e: EncryptionService){

  }
  private maritalStatus!: string;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // if(sessionStorage.getItem('data')){
    //   const x: any = sessionStorage.getItem('data');
    //   const ii = this._e.decryptR(x);
    //   const p = JSON.parse(ii);
    //   this.role = p.role;
    // };


    const p = {
      "_id": "64ae667c0f4cbf1d412dfbb6",
      "name": "Benson Mattew",
      "email": "matstew@gmail.com",
      "password": "",
      "username": "Benson",
      "phoneNumber": "08168731977",
      "dob": "23/01/1987",
      "maritalStatus": "SINGLE",
      "role": "ADMIN",
      "status": "ACTIVE",
      "notAllowed": [
          "64967161839862c649b30767",
          "64967175839862c649b30769"
      ],
      "createdAt": "2023-07-12T08:38:20.521Z",
      "updatedAt": "2023-07-12T10:17:05.535Z",
      "__v": 0
    };

    if(p.maritalStatus.toLowerCase() !== 'single') {
      return true;
    } else {
      alert('You do not have permission to access this page.');
      return false;
    }
  }

}
