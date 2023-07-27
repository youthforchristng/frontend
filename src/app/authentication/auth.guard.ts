import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate,  Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { EncryptionService } from '../services/encryption.service';

// import { EncryptionService } from '../encryption.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router,
    private _encryptionService: EncryptionService){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (sessionStorage.getItem('ln')) {
      // if (this.auth.isLoggedIn) {
        return true;
    } else {
        // console.log('Could not authenticate');
        this.router.navigate(['login']
        // ,{queryParams:{'returnUrl':state.url}}
        );
        return false;
    }
  }

}
