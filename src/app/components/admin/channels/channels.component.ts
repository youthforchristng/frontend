import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';

// import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class AdminChannelsComponent implements OnInit{


  constructor(
    // private _router: Router,
    private _api: ApiService,
    private _alert: AlertService,
    private _snackbar: SnackbarService,
    private _storage: StorageService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private formBuilder: FormBuilder,

    private loaderService: LoaderService,
    // private _alert: AlertService,
    // private _auto_logout: AutoLogoutService,
    // private _validator: ValidatorService,
    // private _encrypt: EncryptionService
  ) {
  }

  // @ViewChild('offcanvas', { static: true }) offcanvasElementRef!: ElementRef;
  ngAfterViewInit() {
    // The AfterViewInit lifecycle hook ensures that the view is ready and the offcanvasElementRef is accessible.
    // this.initializeOffcanvas();
  }

  // initializeOffcanvas() {
  //   const offcanvasElement = this.offcanvasElementRef.nativeElement;

  //   if (offcanvasElement) {
  //     const bootstrapOffcanvas = new (window as any).bootstrap.Offcanvas(offcanvasElement);
  //   }
  // }


  // dismissOffcanvas() {
  //   // const offcanvasElement = this.elementRef.nativeElement.querySelector('.offcanvas'); // Adjust the selector based on your offcanvas element's class or ID
  //   // if (offcanvasElement) {
  //   //   this.renderer.setProperty(offcanvasElement, 'hidden', true);
  //   //   this.renderer.removeClass(document.body, 'modal-open');
  //   // }
  //   const offcanvasElement = this.offcanvasElementRef.nativeElement;

  //   if (offcanvasElement) {
  //     const bootstrapOffcanvas = new (window as any).bootstrap.Offcanvas(offcanvasElement);
  //     bootstrapOffcanvas.hide();
  //   }
  // }

  ngOnInit(): void {
    this.getServerList();

    this.newChannelForm = this.formBuilder.group(
      {
        serverName: [
          '',
          [
            Validators.required,
            // Validators.maxLength(10)
          ]
        ],
        serverDescription: [
          '',
          [
            Validators.required,
            // Validators.maxLength(10)
          ]
        ],
      }
    );
  };

  newChannelForm: FormGroup = new FormGroup({
    serverName: new FormControl(''),
    serverDescription: new FormControl('')
  });


  get serverName() {
    return this.newChannelForm.get('serverName');
  }

  get serverDescription() {
    return this.newChannelForm.get('serverDescription');
  }

  public createNewServer(event: any){
    event.preventDefault();
    event.stopPropagation();
    let data: any = {
      serverName: this.newChannelForm.value.serverName?.trim(),
      description: this.newChannelForm.value.serverDescription?.trim()
    };

    this.isLoadingCreateServer = true;

    const getNewServerDetails = {
      next: (response: any) => {

        this.isLoadingCreateServer = false;

        if (response.statusCode === "00") {

          this._alert.toast_top_end_success(response.statusMessage);
          // this.newChannelForm.reset();
          // const date = new Date();

          // const newServer =
          // {
          //   _id: this._storage.create_UUID(),
          //   serverName: data.serverName,
          //   description: data.description,
          //   createdAt: date.toISOString(),
          //   updatedAt: date.toISOString(),
          //   __v: 0
          // };

          // this.serverList.push(newServer);


          (window as any).location.reload();
        }
        else if(response.statusCode === "96") {
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        }
        else {
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        };

      },
      error: (error: any) => {
        this.isLoadingCreateServer = false;
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };

    this.createServerSubscription = this._api.create_a_server(data).subscribe(getNewServerDetails);

  };

  // openOffCanvas() {
  //   const myOffcanvas = document.getElementById('myOffcanvas')!; // Add non-null assertion here
  //   if(myOffcanvas){
  //     // const offcanvas = new bootstrap.Offcanvas(myOffcanvas);
  //     // offcanvas.show();
  //   }
  // }

  // Function to close the Offcanvas
  // closeOffCanvas_() {
  //   console.log('closeOffCanvasValue:', this.closeOffCanvas); // Will output 'offcanvas'
  //   const myOffcanvas = document.getElementById('myOffcanvas')!;
  //   if(myOffcanvas){
  //     // const offcanvas = new bootstrap.Offcanvas(myOffcanvas);
  //     // offcanvas.hide();
  //   }
  // }

  // Function to set the value of closeOffCanvasValue
  // setCloseOffCanvasValue(value: string) {
  //   this.closeOffCanvas = value;
  // };

  getServerList() {

    this.isLoadingServerList = true;

    const getServerListObserver = {
      next: (response: any) => {

        this.isLoadingServerList = false;

        if (response.statusCode == '00') {
          this.noServerList = false;
          this.serverList = response.data;

        } else if (response.statusCode == '96') {
          this.noServerList = true;
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        } else {
          this.noServerList = true;
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        }
      },
      error: (error: any) => {
        this.isLoadingServerList = false;
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      },
    };

    this.getServerListSubscription = this._api.getServerList().subscribe(getServerListObserver);

  };

  deleteServer(event: any, i: any) {
    event.preventDefault();
    event.stopPropagation();
    this.serverToDelete = i;
  };

  confirmDeleteServer (event: any){

    event.preventDefault();
    event.stopPropagation();

    let data = {
      id: this.serverToDelete._id
    };

    // console.log(data);

    this.loaderService.showLoader();
    this._storage.showBackgroundLoader();

    const deleteServerObserver = {
      next: (response: any) => {
        // console.log(response);

        this.loaderService.hideLoader();
        this._storage.hideBackgroundLoader();
        if (response.statusCode === "00") {
          this._alert.toast_top_end_success('Deleted Successfully')

          let index = this.serverList.findIndex((i: any) => {
            return i._id === this.serverToDelete._id
          });
          if (index > -1) {
            this.serverList.splice(index, 1);
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
        this.loaderService.hideLoader();
        this._storage.hideBackgroundLoader();
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };

    this.deleteServerSubscription = this._api.delete_a_server(data).subscribe(deleteServerObserver);

  };

  cancelDeleteServer (){
    this.serverToDelete = {};
  };

  // Function to handle filtering when searchText changes
  applySearchFilter() {
    if (this.searchText.trim() === '') {
      this.filteredServerList = []; // If search text is empty, show all items
    } else {
      this.filteredServerList = this.serverList.filter((topic: any) =>
        topic.serverName.toLowerCase().includes(this.searchText.toLowerCase())
      ); // Apply filter based on item name
      this.filteredServerList.length < 1 ? this.noServerList = true : this.noServerList = false;
    }
  };

  update_a_server(i: any) {
    this.updateServer.serverId = i._id;
    this.updateServer.serverName = i.serverName;
    this.updateServer.description = i.description;
  }


  update(){
    let data = {
      serverName: this.updateServer.serverName,
      description: this.updateServer.description,
      serverId: this.updateServer.serverId
    };

    this.isLoadingUpdateServer = true;

    const update_a_server_observer = {
      next: (response: any) => {

        this.isLoadingUpdateServer = false;

        if (response.statusCode === "00") {
          this._alert.toast_top_end_success('Updated Successfully');
          (window as any).location.reload();

          // let index = this.serverList.findIndex((i: any) => {
          //   return i._id === data.serverId
          // });

          // if (index > -1) {
          //   this.serverList[index].serverName = data.serverName;
          //   this.serverList[index].description = data.description;
          // };

          // this.updateServer = {
          //   serverName: '',
          //   description: '',
          // };

        }
        else if(response.statusCode === "96") {
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        }
        else {
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        };

      },
      error: (error: any) => {
        this.isLoadingUpdateServer = false;
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };

    this.updateServerSubscription = this._api.update_a_server(data).subscribe(update_a_server_observer);

  };


  ngOnDestroy(): void {
    // Unsubscribe from the API call when the component is destroyed
    if (this.getServerListSubscription) {
      this.getServerListSubscription.unsubscribe();
    }
    if (this.createServerSubscription) {
      this.createServerSubscription.unsubscribe();
    }
    if (this.updateServerSubscription) {
      this.updateServerSubscription.unsubscribe();
    }
    if (this.deleteServerSubscription) {
      this.deleteServerSubscription.unsubscribe();
    }
  };

  updateServer: any = {
    serverName: '',
    description: '',
  };

  private getServerListSubscription!: Subscription;
  private createServerSubscription!: Subscription;
  private updateServerSubscription!: Subscription;
  private deleteServerSubscription!: Subscription;


  searchText: any = '';
  // closeOffCanvas = '';

  serverToDelete: any = {};

  serverList: any = [];
  filteredServerList: any = [];

  serverListLength: any;
  filteredServerListLength: any;

  serverListPage: any;
  filteredServerListPage: any;

  isLoadingCreateServer: Boolean = false;
  isLoadingUpdateServer: Boolean = false;
  isLoadingServerList: Boolean = false;
  noServerList: Boolean = false;

}
