import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Component, ElementRef, HostListener, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
// import { ChatService } from 'src/app/services/chat.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';

import { io, Socket } from 'socket.io-client';
import { NightModeService } from 'src/app/services/night-mode.service';
import { Subscription } from 'rxjs';

interface Reply {
  user: string,
  text: string,
  roomId: string,
  isMedia: boolean,
  profilePic: string,
  room: string,
  id: string
}

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private _alert: AlertService,
    // private chatService: ChatService,
    // private _nightModeService: NightModeService,
    private elementRef: ElementRef,
    private encrypt: EncryptionService,
    private _router: Router,
    private _storage: StorageService,
    private _api: ApiService,
    private _snackbar: SnackbarService,
    private ngxLoader: NgxUiLoaderService ) {}

    // Add this getter method to access the nightModeService in the template
  // get nightModeService(): NightModeService {
  //   return this._nightModeService;
  // }

  ngOnInit(): void {
    this.getUserInfo();

    this.routeParamMap();

    this.socket = io('https://yfc-backend.onrender.com');
    // this.socket = io('https://10.70.1.167:4311');

    this.socket.on('connect', () => {
      // console.log('Connected to server'); // Check if the socket successfully connects
    });

    this.socket.on('chat', (data: any) => {
      // console.log(data);

      if (data.roomId === this.roomId && data.userId != this.userId) {
        this.replies.push(data);
        this.replyCount = this.replies.length;
      };
    });

  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchText']) {
      this.applySearchFilter(); // Call the applyFilter() function whenever searchText changes
    }
  };

  ngOnDestroy(): void {
    this.socket.disconnect();
    if(this.leaveServerSubscription){
      this.leaveServerSubscription.unsubscribe()
    };
    if(this.createAtopicSubscription){
      this.createAtopicSubscription.unsubscribe()
    };
    if(this.deleteTopicSubscription){
      this.deleteTopicSubscription.unsubscribe()
    };
    if(this.findTopicsUnderServerSubscription){
      this.findTopicsUnderServerSubscription.unsubscribe()
    };
    if(this.fetchRepliesSubscription){
      this.fetchRepliesSubscription.unsubscribe()
    };
    if(this.userListSubscription){
      this.userListSubscription.unsubscribe()
    };
  }

  private socket!: Socket;

  private routeParamMap(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.serverId = params.get('id');
      this.rooms = this._storage.getAvailableServers();

      this.activeRoom = this.rooms.filter((room: { _id: string }) => room._id.toLowerCase() === this.serverId)[0];

      this._storage.activeServer = this.activeRoom;

      this.roomId = '';
      this.topics = [];

      this.find_topics_under_server(this.serverId);

      if(this.roomId){
        this.leaveRoom()
      };

    });
  };

  getUserInfo() {
    this.user = this._storage.getUserInfo();

    this.fullname = this.user.name;
    this.userId = this.user._id;

    this.fullname = this.user.name;
    this.maritalstatus = this.user.maritalStatus.toLowerCase();
    this.role = this.user.role;
    // console.log(this.role);

    this.notAllowed = this.user.notAllowed;
  };

  openChannelInfo(){
    this.resetSearch();
    this.getUserList();
  };

  getUserList(){

    let data = {
      serverId: this.serverId
    };

    // console.log(data);

    this.isLoadingUserList = true;

    this._snackbar.closeAllSnackBars();

    const user_count_observer = {
      next: (response: any) => {

        this.isLoadingUserList = false;

        if (response.statusCode === "00") {
          this.userList = response.data;
        }
        else if(response.statusCode === "96") {
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        }
        else {
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        };

      },
      error: (error: any) => {
        this.isLoadingUserList = false;
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };
    this.userListSubscription = this._api.user_list_per_server(data).subscribe(user_count_observer);
  };
  // Function to handle filtering when searchText changes
  applySearchUserFilter() {
    if (this.searchText.trim() === '') {
      this.filteredUsers = []; // If search text is empty, show all items
    } else {
      this.filteredUsers = this.userList.filter((user: any) =>
        user.name.toLowerCase().includes(this.searchText.toLowerCase())
      ); // Apply filter based on item name
      this.filteredUsers.length < 1 ? this.noUserList = true : this.noUserList = false;
    }
  };

  blockUser(i: any){
    // console.log(i);
    // console.log(i.userId);

    let data ={
      userId:i.userId,
      channelId: this.serverId
    };

    // console.log(data);


    this.isLoadingBlockUser = true;

    this._snackbar.closeAllSnackBars();

    const user_count_observer = {
      next: (response: any) => {

        this.isLoadingBlockUser = false;

        if (response.statusCode === "00") {
          // this.userList = response.data;

        }
        else if(response.statusCode === "96") {
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        }
        else {
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        };

      },
      error: (error: any) => {
        this.isLoadingBlockUser = false;
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };
    this.blockUserSubscription = this._api.user_list_per_server(data).subscribe(user_count_observer);

  };


  find_topics_under_server(id: any){
    let data: any = {
      parentServerId: id
    };

    this.isLoadingTopics = true;

    const getServerDetailObserver = {
      next: (response: any) => {
        // console.log(response);

        if (response.statusCode === "00") {
          this.isLoadingTopics = false;
          // console.log(this.isLoadingTopics);          
          this.topics = response.data;
          // this.filteredItems = this.topics;
          this.applySearchFilter(); // Call the applyFilter() function on component initialization
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

    this.findTopicsUnderServerSubscription = this._api.find_topics_under_server(data).subscribe(getServerDetailObserver);

  };

  createNewTopic(){

    if (this.message.trim() !== '') {
      const data = {
        parentServerId: this.activeRoom._id,
        topicDesc: this.message,
        ownerId: this.user._id,
        ownerName: this.user.name,
        ownerProfilePic: this.user.profilePic
      };

      this.sendingMessage = true;

      const createTopicObserver = {
        next: (response: any) => {
          this.sendingMessage = false;
          if (response.statusCode == '00') {
            this._alert.toast_top_end_success('Successfully sent, pending admin ppproval')
            this.message = '';
          } else if (response.statusCode == '96') {
            this._snackbar.showSnackbar(response.statusMessage, 'Close');
          } else {
            this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
          }
        },
        error: (error: any) => {
          this.sendingMessage = false;
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        }
      };

      this.createAtopicSubscription = this._api.create_a_topic(data).subscribe(createTopicObserver);
    } else {
      this._snackbar.showSnackbar('Message can not be blank', 'Close');
    };

  };

  viewReplies(i: any, event: any){
    event.stopPropagation();
    this.emptyReply = false;
    this.activeTopic = i;
    this.reply = ''
    this.joinRoom(i._id);
  };

  joinRoom(roomId: string) {
    this.roomId = roomId;
    // Inform the server that the user is joining the room
    this.socket.emit('join', roomId);
    this.fetchReplies(this.roomId);
  };

  leaveRoom() {
    this.socket.emit('leave', this.roomId);
    this.roomId = ''; // Reset the roomId
  };

  replyCount: number = 0;

  fetchReplies(roomId: string){
    let data: any = {
      topicId: roomId
    };

    this.isLoadingReplies = true;

    this.replyCount = 0;

    const fetchRepliesObserver = {
      next: (response: any) => {

        if (response.statusCode === "00") {
          this.isLoadingReplies = false;
          this.replies = response.data;
          this.replyCount = this.replies.length;
          // console.log(this.replies);
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

    this.fetchRepliesSubscription = this._api.fetch_replies(data).subscribe(fetchRepliesObserver);

  };

  newReply() {
    if(this.reply.trim !== '') this.emptyReply = false;
  };

  sendReply(){
    if (this.reply.trim() !== '') {

      const toBeSent = {
        username: this.user.name,
        text: this.reply,
        roomId: this.roomId,
        isMedia: false,
        userId: this.userId,
        // time:
        profilePic: this.user.profilePic,
        room: this.roomId,
      };

      // console.log(toBeSent);

      const newReply = JSON.parse(JSON.stringify(toBeSent));
      newReply.time = this._storage.create_new_chat_date()

      this.replies.push(newReply);

      // console.log(this.replies);

      this.replyCount = this.replies.length;

      this.socket.emit('chat', toBeSent);
      this.reply = '';
    } else {
      this.emptyReply = true
      this._snackbar.showSnackbar('Reply can not be empty!', 'Close');
    };
  };

  resetSearch(){
    this.searchText = '';
    this.filteredItems = [];
    this.filteredUsers = [];
  };

  deleteTopic(i: any){

    this._alert.are_you_sure()
    .then((result)=>{
      if(result.isConfirmed){

        let data = {
          id: i._id
        };

        this.ngxLoader.startBackground('master');

        const deleteTopicObserver = {
          next: (response: any) => {

            this.ngxLoader.stopBackground('master');

            if (response.statusCode == '00') {
              let index = this.topics.findIndex((i: any) => {
                return i._id === data.id
              });
              if (index > -1) {
                this.topics.splice(index, 1);
              };
              this._snackbar.showSnackbar('Deleted', 'Close');

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

  // Function to handle filtering when searchText changes
  applySearchFilter() {
    if (this.searchText.trim() === '') {
      this.filteredItems = []; // If search text is empty, show all items
    } else {
      this.filteredItems = this.topics.filter((topic: any) =>
        topic.topicDesc.toLowerCase().includes(this.searchText.toLowerCase())
      ); // Apply filter based on item name
      // console.log(this.filteredItems);

    }
  };

  // Function to highlight the text based on the search text
  highlightText(name: string): string {
    if (!this.searchText || !name) {
      // console.log(name);

      return name;
    };

    const regex = new RegExp(this.searchText, 'gi');
    return name.replace(regex, match => `<span class="highlight">${match}</span>`);
  };

  leaveServer(): void {

    let data = {
      serverId: this.activeRoom._id,
      userId: this.userId
    };

    // console.log(data);

    // this.showBackground();
    this.ngxLoader.startBackground('master');

    // setTimeout(()=> this.hideBackground(), 5000)

    const leaveServerObserver = {
      next: (response: any) => {
        // console.log(response);

        // this.hideBackground();
        this.ngxLoader.stopBackground('master');

        if (response.statusCode == '00') {
          // this._snackbar.showSnackbar('Successful', 'Close');
          this._router.navigate(['/']);
        } else if (response.statusCode == '96') {
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        } else {
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        }
      },
      error: (error: any) => {
        // this.hideBackground();
        this.ngxLoader.stopBackground('master');
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      },
    };

    this.leaveServerSubscription = this._api.leave_server(data).subscribe(leaveServerObserver);

  };

  noUserList: Boolean = false;


  topics: any = [];
  activeTopic: any = [];
  filteredItems: any = [];
  filteredUsers: any = [];

  reply: any = '';
  replies: any[] = [];

  message: any = '';

  role!: any;
  userId!: any;
  fullname!: any;
  notAllowed!: any;
  maritalstatus!: any;

  user: any = [];
  userList: any[] = [];

  activeRoom: any = [];

  isLoadingTopics: Boolean = false;
  isLoadingReplies: Boolean = false;

  isLoadingUserList: Boolean = false;

  isLoadingBlockUser: Boolean = false;

  emptyReply: Boolean = false;

  sendingMessage: Boolean = false;

  rooms!: any;
  roomId: any = '';

  serverId!: any;

  searchText: any = '';

  imageSpinner: string = this._storage.imageSpinner;

  showBackground() {
    this._storage.showBackgroundLoader();
  };

  hideBackground() {
    this._storage.hideBackgroundLoader();
  };



  private leaveServerSubscription!: Subscription;
  private fetchRepliesSubscription!: Subscription;
  private findTopicsUnderServerSubscription!: Subscription;
  private createAtopicSubscription!: Subscription;
  private deleteTopicSubscription!: Subscription;

  private userListSubscription!: Subscription;
  private blockUserSubscription!: Subscription;

}
