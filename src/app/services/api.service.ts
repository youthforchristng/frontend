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

export class ApiService {

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

  private header(){
    // let encoded = window.btoa(`${this._storage.username + ':' + this._storage.password}`);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${encoded}`
    });
    return headers;
  };


  baseurl = 'https://yfc-backend.onrender.com'
  // baseurl = 'http://10.70.1.167:4311'

  register(data: any) {
    let url = this.baseurl + "/users/register"
    return this._http.post(url, data, { headers: this.header()}
    )
    .pipe(
      map(response => response),
      retry(3),
      shareReplay()
    );
  };

  //FORGOT PASSWORD
  generate_otp(data: any) {
    let url = this.baseurl + "/users/forgot-password"
    return this._http.post(url, data, { headers: this.header()}
    )
    .pipe(
      map(response => response),
      retry(3),
      shareReplay()
    );
  };

  validate_otp(data: any) {
    let url = this.baseurl + "/users/reset-password"
    return this._http.post(url, data, { headers: this.header()}
    )
    .pipe(
      map(response => response),
      retry(3),
      shareReplay()
    );
  };


  //servers
  getServerList(): Observable<any[]> {
    let url = this.baseurl + "/server/fetch-servers"
    // console.log(url);

    return this._http.get<any[]>(url, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(3),
      shareReplay()
    );
  };

  create_a_server(data: any) {
    let url = this.baseurl + "/server/create-server";
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(3),
      shareReplay()
    );
  };

  update_a_server(data: any) {
    let url = this.baseurl + "/server/update-server";
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(3),
      shareReplay()
    );
  };

  join_server(data: any) {
    let url = this.baseurl + "/server/join-server";
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(3),
      shareReplay()
    );
  };

  leave_server(data: any) {
    let url = this.baseurl + "/server/leave-server";
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(3),
      shareReplay()
    );
  };

  delete_a_server(data: any) {
    let url = this.baseurl + "/server/delete-server";
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(3),
      shareReplay()
    );
  };


  //topics
  create_a_topic(data: any) {
    let url = this.baseurl + "/topic/create-topic"
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(2),
      shareReplay());
  };

  find_topic_by_status(data: any) {
    let url = this.baseurl + "/topic/find-topics-by-status"
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(2),
      shareReplay());
  };

  process_topic(data: any) {
    let url = this.baseurl + "/topic/process-topic"
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(2),
      shareReplay());
  };

  delete_a_topic(data: any) {
    let url = this.baseurl + "/topic/delete-topic"
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(2),
      shareReplay());
  };

  find_topics_under_server(data: any) {
    let url = this.baseurl + "/topic/find-topics-under-server"
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(2),
      shareReplay());
  };

  fetch_replies(data: any) {
    let url = this.baseurl + "/chat/fetch-replies"
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(2),
      shareReplay());
  };

  fetch_replies_count(data: any) {
    let url = this.baseurl + "/topic/fetch-reply-count"
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(2),
      shareReplay());
  };

  //USERS
  getAllUsers(): Observable<any[]> {
    let url = this.baseurl + "/users/fetch-all-users"
    // console.log(url);

    return this._http.get<any[]>(url, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(3),
      shareReplay()
    );
  };

  fetch_user_status(data: any) {
    let url = this.baseurl + "/users/fetch-users-by-status";
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(3),
      shareReplay()
    );
  };

  change_user_status(data: any) {
    let url = this.baseurl + "/users/process-user";
    return this._http.post(url, data, { headers: this.header()})
    .pipe(
      map(response => response),
      retry(3),
      shareReplay()
    );
  };


}
