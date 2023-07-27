import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { EncryptionService } from './encryption.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor(
    private _router: Router,
    private encrypt: EncryptionService,
    private _auth: AuthService,
    private ngxLoader: NgxUiLoaderService,
    private http: HttpClient) {
  };

  activeServer: any;
  availableServer: any;

  isReplyOffCanvasOpen!: boolean;

  getUserInfo() {
    if(sessionStorage.getItem('data')){
      const x: any = sessionStorage.getItem('data');
      const ii = this.encrypt.decryptR(x);
      const p = JSON.parse(ii);
      return p;
    };
  };

  getAvailableServers() {
    if(sessionStorage.getItem('availableRooms')){
      const x: any = sessionStorage.getItem('availableRooms');
      const ii = this.encrypt.decryptR(x);
      const p = JSON.parse(ii);
      return p;
    };
  };

  // Start the loader
  showLoader(): void {
    this.ngxLoader.start();
  }

  // Stop the loader
  hideLoader(): void {
    this.ngxLoader.stop();
  };

  // Start the loader
  showBackgroundLoader(): void {
    this.ngxLoader.startBackground();
  }

  // Stop the loader
  hideBackgroundLoader(): void {
    this.ngxLoader.stopBackground();
  };

  create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  };

  create_new_chat_date(){
    // Create a new Date object
    const currentDate = new Date();

    // Get the individual date components
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');

    // Determine whether it's AM or PM
    const amOrPm = Number(hours) >= 12 ? 'pm' : 'am';

    // Convert hours to 12-hour format
    const formattedHours = (Number(hours) % 12) || 12;

    // Combine the components to form the desired date string
    const formattedDate = `${year}-${month}-${day} ${formattedHours}:${minutes} ${amOrPm}`;

    console.log(formattedDate);

    return formattedDate
  }


  signout(){
    this._auth.setLoggedIn(false);
    this._router.navigate(['login']);
    sessionStorage.clear();
  };


  imageSpinner: string = 'assets/images/spin.gif';
}
