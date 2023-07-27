import { Router } from '@angular/router';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
// import { ChatService } from 'src/app/services/chat.service';
import { EncryptionService } from 'src/app/services/encryption.service';
// import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {

  notAllowed!: string;

  constructor(
    // private chatService: ChatService,
    private encrypt: EncryptionService,
    private _storage: StorageService,
    private http: HttpClient,
    // private loaderService: LoaderService,
    private _router: Router,
    private _api: ApiService,
    private _snackbar: SnackbarService,
    // private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getUserInfo();
  }

  activeRoom: any;
  rooms: any = [];
  userId!: string;
  fullname!: string;
  maritalstatus!: string;
  role!: string;

  isLoadingRooms: boolean = false;

  getUserInfo() {
    let user = this._storage.getUserInfo();

    this.userId = user._id;
    this.fullname = user.name;
    this.role = user.role.toLowerCase();
    this.maritalstatus = user.maritalStatus.toLowerCase();
    this.profilePic = user.profilePic;
    this.role = 'admin';
    this.notAllowed = user.notAllowed;

  };


  profilePic!: string

  signout(){
    this._storage.signout();
  };

  imageSpinner: any = this._storage.imageSpinner; //'assets/images/spin.gif';

}
