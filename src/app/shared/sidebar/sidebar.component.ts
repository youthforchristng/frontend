import { Router, NavigationEnd  } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
// import { ChatService } from 'src/app/services/chat.service';
import { EncryptionService } from 'src/app/services/encryption.service';
// import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  notAllowed!: string;
  activeServerId: string | null = null;


  constructor(
    // private chatService: ChatService,
    private encrypt: EncryptionService,
    private _storage: StorageService,
    private http: HttpClient,
    // private loaderService: LoaderService,
    private _router: Router,
    private _api: ApiService,
    private _snackbar: SnackbarService,
    private router: Router
    // private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnDestroy(): void {
    this.activeServer = null;
    if(this.getServerListSubscription){
      this.getServerListSubscription.unsubscribe()
    };
  }

  ngOnInit(): void {
    this.getUserInfo();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Extract the room id from the current URL
        const urlSegments = this.router.url.split('/');
        if (urlSegments[1] === 'channel') {
          this.activeServerId = urlSegments[2];
        } else {
          this.activeServerId = null;
        }
      }
    });
  };

  isServerActive(serverId: string): boolean {
    return this.activeServerId === serverId;
  };

  joinServer(server: any): void {
    this.activeServer = server;
    this._storage.activeServer = server;
    this._router.navigate(['/channel', server._id]);

    let data = {
      serverId: server._id,
      userId: this.userId
    };

    // console.log(data);

    const joinServerObserver = {
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
      },
    };

    this._api.join_server(data).subscribe(joinServerObserver);

  };

  getUserInfo() {
    let user = this._storage.getUserInfo();

    this.userId = user._id;
    this.fullname = user.name;
    this.role = user.role.toLowerCase();
    this.maritalstatus = user.maritalStatus.toLowerCase();
    this.profilePic = user.profilePic;
    // this.role = 'admin';
    this.notAllowed = user.notAllowed;

    this.getServers();
  };

  getServers() {

    this.isLoadingServers = true;

    const getRoomsObserver = {
      next: (response: any) => {

        if (response.statusCode == '00') {
          this.isLoadingServers = false;
          this.servers = response.data;

          if (this.maritalstatus === 'single') {
            this.servers = this.servers.filter((room: { serverName: string }) => room.serverName.toLowerCase() !== 'marriage');
          };

          const encrypt = this.encrypt.encryptR(JSON.stringify(this.servers))

          sessionStorage.setItem('availableRooms', encrypt);

          if(this.servers.length > 0 && this.activeServer != null) {
            this.joinServer(this.servers[0]); // Join the first room in the list
          };

        } else if (response.statusCode == '96') {
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        } else {
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        }
      },
      error: (error: any) => {
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      },
    };

    this.getServerListSubscription = this._api.getServerList().subscribe(getRoomsObserver);

  };

  signout(){
    this._storage.signout();
  };

  activeServer: any = null;

  servers: any = [];

  role!: string;
  userId!: string;
  fullname!: string;
  profilePic!: string;
  maritalstatus!: string;


  isLoadingServers: boolean = false;

  imageSpinner: any = this._storage.imageSpinner;

  private getServerListSubscription!: Subscription;
  // private joinServerSubscription!: Subscription;

}
