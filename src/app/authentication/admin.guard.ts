import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate,  Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { EncryptionService } from '../services/encryption.service';

// import { EncryptionService } from '../encryption.service';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router,
    private _e: EncryptionService){

  }
  private role!: string;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(sessionStorage.getItem('data')){
      const x: any = sessionStorage.getItem('data');
      const ii = this._e.decryptR(x);
      const p = JSON.parse(ii);
      this.role = p.role.toLowerCase();
    };

    if (this.role.toLowerCase() == 'admin') {
      return true;
    } else {
      alert('You do not have permission to access this page.');
      return false;
    }
  }

}
