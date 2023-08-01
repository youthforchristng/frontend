import { LoaderService } from 'src/app/services/loader.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class AdminPostsComponent {

  constructor(
    private _api: ApiService,
    private _alert: AlertService,
    private _snackbar: SnackbarService,
    private _storage: StorageService,
    private loaderService: LoaderService,
    private ngxLoader: NgxUiLoaderService,
    private dialog: MatDialog
  ) {}

  confirmAction(decision: string): void {
    this._alert.are_you_sure()
    .then((result: any) => {
      if (result.isConfirmed) {

        if(this.viewPost._id){
          let data = {
            id: this.viewPost._id,
            decision: decision
          }

          // console.log(data);

          // console.log(this.filteredStatus);


          data.decision == 'APPROVED' ? this.isLoadingApprovePost = true : this.isLoadingApprovePost = false;
          data.decision == 'REJECTED' ? this.isLoadingRejectPost = true : this.isLoadingRejectPost = false;

          const confirm_action_observer = {
            next: (response: any) => {
              // console.log(response);

              this.isLoadingApprovePost = false;
              this.isLoadingRejectPost = false;

              if (response.statusCode === "00") {

                // console.log(this.postList);
                this._alert.toast_top_end_success(data.decision + ' SUCCESSFULLY')
                // this._snackbar.showSnackbar(data.decision + ' SUCCESSFULLY', 'Close')

                let index = this.postList.findIndex((i: any) => {
                  return i._id === data.id
                });

                if (index > -1) {
                  this.postList[index].status = data.decision
                };

                this.postList = this.postList.filter((i: any) =>
                  i.status.toLowerCase().includes(this.filteredStatus.toLowerCase())
                );

                this.postList.length > 0 ? this.noPostList = false : this.noPostList = true;

              }
              else if(response.statusCode === "96") {
                this._snackbar.showSnackbar(response.statusMessage, 'Close');
              }
              else {
                this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
              };

            },
            error: (error: any) => {
              this.isLoadingApprovePost = false;
              this.isLoadingRejectPost = false;
              this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
            }
          };

          this.processTopicsSubscription = this._api.process_topic(data).subscribe(confirm_action_observer);

        }

      }
    })
  };


  deleteTopic(i: any){

    console.log(i);

    this._alert.are_you_sure()
    .then((result)=>{
      if(result.isConfirmed){

        let data = {
          id: i._id
        };

        console.log(data);


        this.ngxLoader.startBackground('master');

        const deleteTopicObserver = {
          next: (response: any) => {

            this.ngxLoader.stopBackground('master');

            console.log(response);
            console.log(this.postList);

            if (response.statusCode == '00') {
              let index = this.postList.findIndex((i: any) => {
                return i._id === data.id
              });
              if (index > -1) {
                this.postList.splice(index, 1);
              };

              console.log(this.postList);
              this._snackbar.showSnackbar('Deleted', 'Close');

              this.postList.length < 1 ? this.noPostList = true : this.noPostList = false ;

            } else if (response.statusCode == '96') {
              this._snackbar.showSnackbar(response.statusMessage, 'Close');
            } else {
              this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
            }
          },
          error: (error: any) => {
            this.ngxLoader.stopBackground('master');
            this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
          },
        };

        this.deleteTopicSubscription = this._api.delete_a_topic(data).subscribe(deleteTopicObserver);

      };
    })



  }

  signout(){
    this._storage.signout();
  };

  find_topic_by_status(status: string){
    this.filteredStatus = status;

    this.status = status;

    let data = {
      status: status
    };

    // this.loaderService.showLoader();
    // this.ngxLoader.start();

    this.noPostList = false;
    this.isLoadingPostList = true;

    this._snackbar.closeAllSnackBars()

    const find_topics_observer = {
      next: (response: any) => {
        // console.log(response);

        this.isLoadingPostList = false;

        // this.loaderService.hideLoader()
        // this.ngxLoader.stop();

        if (response.statusCode === "00") {
          this.postList = response.data;

          // console.log(this.postList);

          if(this.postList.length < 1){
            this.noPostList = true;
            this._snackbar.showSnackbar('NO ' + data.status + ' TOPIC(S)', 'Close')
          } else{
            this.noPostList = false ;;
          }
        }
        else if(response.statusCode === "96") {
          this.noPostList = true;
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        }
        else {
          this.noPostList = true;
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        };

      },
      error: (error: any) => {
        this.noPostList = true;
        this.isLoadingPostList = false;
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };

    this.findTopicByStatusSubscription = this._api.find_topic_by_status(data).subscribe(find_topics_observer);

  };

  view(i: any){
    // console.log(i);
    this.viewPost = i;
    this.replies_count = '';
    this.fetchReplies(i._id);
  };

  fetchReplies(roomId: string){
    let data: any = {
      topicId: roomId
    };

    this.isLoadingRepliesCount = true;

    const fetchRepliesCountObserver = {
      next: (response: any) => {
        if (response.statusCode === "00") {
          this.isLoadingRepliesCount = false;
          this.replies_count = response.data;
          // console.log(this.replies_count);
        }
        else if(response.statusCode === "96") {
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        }
        else {
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        };
      },
      error: (error: any) => {
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };

    this.fetchRepliesSubscription = this._api.fetch_replies_count(data).subscribe(fetchRepliesCountObserver);

  };

  // Function to handle filtering when searchText changes
  applySearchFilter() {
    if (this.searchText.trim() === '') {
      this.filteredPostList = []; // If search text is empty, show all items
    } else {
      this.filteredPostList = this.postList.filter((topic: any) =>
        topic.parentServerName.toLowerCase().includes(this.searchText.toLowerCase())
      ); // Apply filter based on item name
      // console.log(this.filteredPostList);
      // console.log(this.filteredPostList.length);
      this.filteredPostList.length < 1 ? this.noPostList = true : this.noPostList = false;
    }
  };

  status: string = 'Status'

  searchText: any = '';

  replies_count: any = '';
  viewPost: any = {};

  postList: any = [];
  filteredPostList: any = [];

  postListLength: any;
  filteredPostListLength: any;

  postListPage: any;
  filteredPostListPage: any;

  isLoadingCreatePost: Boolean = false;
  isLoadingUpdatePost: Boolean = false;

  isLoadingPostList: Boolean = false;

  isLoadingApprovePost: Boolean = false;
  isLoadingRejectPost: Boolean = false;

  isLoadingRepliesCount: Boolean = false;
  noPostList: Boolean = true;

  filteredStatus: string = '';

  imageSpinner: string = this._storage.imageSpinner;


  private fetchRepliesSubscription!: Subscription;
  private findTopicByStatusSubscription!: Subscription;
  private processTopicsSubscription!: Subscription;
  private deleteTopicSubscription!: Subscription;



  ngOnDestroy(): void {
    // Unsubscribe from the API call when the component is destroyed
    if (this.processTopicsSubscription) {
      this.processTopicsSubscription.unsubscribe();
    }
    if (this.findTopicByStatusSubscription) {
      this.findTopicByStatusSubscription.unsubscribe();
    }
    if (this.deleteTopicSubscription) {
      this.deleteTopicSubscription.unsubscribe();
    }
    if (this.fetchRepliesSubscription) {
      this.fetchRepliesSubscription.unsubscribe();
    }
  };


}
