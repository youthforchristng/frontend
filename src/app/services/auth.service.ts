import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, retry, shareReplay, Observable  } from 'rxjs';
// import Swal from 'sweetalert2';

// import { ConfigService } from './config.service';
// import { StorageService } from './storage.service';
import { EncryptionService } from './encryption.service';
// import { ValidatorService } from 'src/app/services/validator.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private _http: HttpClient,
    private _router: Router,
    // private _storage: StorageService,
    // private _validator: ValidatorService,
    // private _configService: ConfigService,
    private _encryptionService: EncryptionService
  ) {
    //decrypt baseurl!
    // this.ibank = this._encryptionService.decrypt(this._configService.data.glassfishBaseUrl);
  }

  // data: any = [];
  // private loggedInStatus: Boolean = false;
  private loggedInStatus = JSON.parse(sessionStorage.getItem('loggedIn') || 'false');

  setLoggedIn(value: Boolean){
    this.loggedInStatus = value;

    sessionStorage.setItem('ln', this._encryptionService.encryptR(JSON.stringify(true)));
  };

  setLoggedOut(value: Boolean){
    this.loggedInStatus = value
    sessionStorage.setItem('ln', this._encryptionService.encryptR(JSON.stringify(false)))
  };

  get isLoggedIn(){
    return !!(sessionStorage.getItem('ln') || this.loggedInStatus)
  };

  // get isLoggedIn(){
  //   return !!this.loggedInStatus
  // };

  private header(){
    // let encoded = window.btoa('gims:gims');
    // let encoded = window.btoa(`${this._storage.username + ':' + this._storage.password}`);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${encoded}`
    });
    return headers;
  };

  //  ibank: any = 'http://10.11.100.123:8080' //new glassFish 7.0
  //  ibank: any = 'https://suntrustdigital.herokuapp.com/http://openapi.suntrustng.com:8080'; //new glassFish 7.0 (public facing url)
  //  ibank: any = 'https://suntrustdigital.herokuapp.com/http://10.112.20.4:8080' // older glassFish 4.0 (in house url)

  // ibank: any = 'http://10.112.20.4:1997' // new glassFish(public facing url)
  ibank2: any = 'https://suntrustdigital.herokuapp.com/http://ibankcorp.suntrustng.com:1997' // new glassFish(public facing url)


  getUserDetails(data: any): Observable<any> {
    // this._validator.getKey();
    // let url =  'http://10.70.1.167:4311/users/login';
    let url =  'https://yfc-backend.onrender.com/users/login';
    // let url =  this.ibank2 + '/LoginService/webresources/login';
    // console.log(url);
    return this._http.post(url,
    data, { headers: this.header()}
    )
    .pipe(
      map(response => response),
      retry(3),
      shareReplay());
  };

  logout(){
    this._router.navigate(['login'])
    this.setLoggedOut(false);
    // this._storage.transaction_history = null;
    sessionStorage.clear();
    // Swal.close();
  };

}
