import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';

import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class AdminUsersComponent implements OnInit, OnDestroy {

  constructor(
    // private _router: Router,
    private _api: ApiService,
    private _alert: AlertService,
    private _snackbar: SnackbarService,
    private _storage: StorageService,
    // private ngxLoader: NgxUiLoaderService,
    private loaderService: LoaderService,
  ) {
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {

    this.filteredStatus = '';

    this.isLoadingUserList = true;

    this._snackbar.closeAllSnackBars();

    const getUserListObserver = {
      next: (response: any) => {

        this.isLoadingUserList = false;

        if (response.statusCode == '00') {
          this.noUserList = false;
          this.userList = response.data;

        } else if (response.statusCode == '96') {
          this.noUserList = true;
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        } else {
          this.noUserList = true;
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        }
      },
      error: (error: any) => {
        this.isLoadingUserList = false;
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      },
    };

    this.getAllUsersSubscription = this._api.getAllUsers().subscribe(getUserListObserver);

  };


  fetch_users_by_status(status: string){
    this.filteredStatus = status;

    let data = {
      status: status
    };

    this.noUserList = false;
    this.isLoadingUserList = true;

    this._snackbar.closeAllSnackBars()

    const find_users_observer = {
      next: (response: any) => {
        // console.log(response);

        this.isLoadingUserList = false;

        if (response.statusCode === "00") {
          this.userList = response.data;

          // console.log(this.userList);

          if(this.userList.length < 1){
            this.noUserList = true;
            this._snackbar.showSnackbar('NO ' + data.status + ' USER(S)', 'Close')
          } else{
            this.noUserList = false ;;
          }
        }
        else if(response.statusCode === "96") {
          this.noUserList = true;
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        }
        else {
          this.noUserList = true;
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        };

      },
      error: (error: any) => {
        this.noUserList = true;
        this.isLoadingUserList = false;
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };

    this.fetchUserSubscription = this._api.fetch_user_status(data).subscribe(find_users_observer);

  };

  viewUser(i: any){
    // console.log(i);
    this.userDetail = i;
  };

  initiateChangeUserStatus(event:any,i: any){
    event.preventDefault();
    event.stopPropagation();

    this.changeUserStatusObject = i;
    // console.log(this.changeUserStatusObject);

    i.status == 'ACTIVE' ? this.changeUserStatusObject.action = 'BLACKLISTED' : this.changeUserStatusObject.action ='ACTIVE';
    // console.log(this.changeUserStatusObject);
  };

  cancelChangeUserStatus(event: any){
    event.preventDefault();
    event.stopPropagation();

    this.changeUserStatusObject = {};
  };

  confirmChangeUserStatus(event: any){

    event.preventDefault();
    event.stopPropagation();

    let data = {
      userId: this.changeUserStatusObject._id,
      status: this.changeUserStatusObject.action
    };

    // console.log(data);
    this._snackbar.closeAllSnackBars();

    this.loaderService.showLoader()
    this._storage.showBackgroundLoader();

    const changeUserStatusObserver = {
      next: (response: any) => {

        // console.log(response);

        this.loaderService.hideLoader()
        this._storage.hideBackgroundLoader();
        if (response.statusCode === "00") {

          this._alert.toast_top_end_success('Operation Successful');

          let index = this.userList.findIndex((i: any) => {
            return i._id === data.userId
          });

          if (index > -1) {
            this.userList[index].status = this.changeUserStatusObject.action;
            this.changeUserStatusObject.status = this.changeUserStatusObject.action;
          };

          if(this.filteredStatus){

            this.userList = this.userList.filter((i: any) => {
              i.status == this.filteredStatus
            });

            this.userList.length < 1 ? this.noUserList = true : this.noUserList = false;

          };
        }
        else if(response.statusCode === "96") {
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        }
        else {
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        };

      },
      error: (error: any) => {
        this._storage.hideBackgroundLoader();
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };

    this.changeUserStatusSubscription = this._api.change_user_status(data).subscribe(changeUserStatusObserver);

  };

  // Function to handle filtering when searchText changes
  applySearchFilter() {
    if (this.searchText.trim() === '') {
      this.filteredUserList = [];
    } else {
      this.filteredUserList = this.userList.filter((topic: any) =>
        topic.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
      this.filteredUserList.length < 1 ? this.noUserList = true : this.noUserList = false;
    }
  };

  searchText: any = '';
  changeUserStatusObject: any = {};

  userDetail: any = {};

  filteredStatus: string = '';

  userList: any = [];
  filteredUserList: any = [];

  userListLength: any;
  filteredUserListLength: any;

  userListPage: any;
  filteredUserListPage: any;

  isLoadingCreateServer: Boolean = false;
  isLoadingUpdateServer: Boolean = false;

  isLoadingUserList: Boolean = false;

  noUserList: Boolean = false;


  ngOnDestroy(): void {
    // Unsubscribe from the API call when the component is destroyed
    if (this.changeUserStatusSubscription) {
      this.changeUserStatusSubscription.unsubscribe();
    }
    if (this.fetchUserSubscription) {
      this.fetchUserSubscription.unsubscribe();
    };
    if (this.getAllUsersSubscription) {
      this.getAllUsersSubscription.unsubscribe();
    };
  };

  private changeUserStatusSubscription!: Subscription;
  private fetchUserSubscription!: Subscription;
  private getAllUsersSubscription!: Subscription;


  imageSpinner: string = this._storage.imageSpinner;
}
