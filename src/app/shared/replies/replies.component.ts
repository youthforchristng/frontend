import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

import { io, Socket } from 'socket.io-client';
import { StorageService } from 'src/app/services/storage.service';

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
  selector: 'app-reply',
  templateUrl: './replies.component.html',
  styleUrls: ['./replies.component.css']
})
export class RepliesComponent {

  @Input() activeTopic!: any;
  @Input() replies!: any[];
  @Input() reply!: string;

  @ViewChild('offCanvasDiv') offCanvasDiv!: ElementRef;
  isOffCanvasOpen: boolean = false;

  viewReplies(): void {
    this.isOffCanvasOpen = true;
  }

  closeOffCanvas(): void {
    this.isOffCanvasOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Check if the click occurred outside the off-canvas and close it if needed
    if (this.isOffCanvasOpen && this.offCanvasDiv.nativeElement && !this.offCanvasDiv.nativeElement.contains(event.target)) {
      this.closeOffCanvas();
    }
  }


  constructor(
    // private route: ActivatedRoute,
    // private _alert: AlertService,
    // private chatService: ChatService,
    // private encrypt: EncryptionService,
    private _storage: StorageService,
    // private _api: ApiService,
    // private _snackbar: SnackbarService
  ) {
  }
  ngOnDestroy(): void {
    this.socket.disconnect();
  };

  roomId: any = '';
  user: any = '';

  getUserInfo() {
    this.user = this._storage.getUserInfo();

    // console.log(this.user);

    // this.fullname = this.user.name;
    // this.userId = this.user._id;
    // this.fullname = this.user.name;
    // this.maritalstatus = this.user.maritalStatus.toLowerCase();
    // this.role = this.user.role.toLowerCase();
    // this.notAllowed = this.user.notAllowed;

  };

  ngOnInit(): void {
    this.getUserInfo();
    // this.routeParamMap();

    this.socket = io('http://10.70.1.167:4311');

    this.socket.on('connect', () => {
      // console.log('Connected to server'); // Check if the socket successfully connects
    });


    // Assuming you obtain the roomId from somewhere (e.g., user input, URL, etc.)
    this.roomId = "64b93c46881073120fdbc815"; // Replace with the actual roomId
    // console.log(this.roomId);


    // Inform the server that the user is joining the room
    this.socket.emit('join', this.roomId);

    // this.socket.on('message', (message: Reply) => {
    //   console.log(message);
    // });

    this.socket.on('chat', (data: Reply) => {
      // console.log(data);
      // console.log(this.roomId);

      if (data.roomId === this.roomId) {
        // console.log('data');
        // console.log(data);

        this.replies.push(data); // Only add the message to messages if the roomId matches the current roomId
      }
    });
  };



  joinRoom(roomId: string) {
    // this.roomId = roomId;
    // console.log(this.roomId);
    // console.log(roomId);

    // this.socket.emit('joinRoom', this.roomId); // Join the room based on the roomId

    // this.fetchReplies(this.roomId);

  }

  // sendReply() {
  //   if (this.reply.trim() !== '' && this.roomId) {
  //     this.socket.emit('chat', { roomId: this.roomId, message: this.reply });
  //     this.reply = '';
  //   }
  // }

  // private socket: SocketIOClient.Socket;

  private socket!: Socket;

  sendReply(){

  }

  // closeModal() {
  //   const viewRepliesModal = document.getElementById('viewReplies-item');
  //   viewRepliesModal?.classList.remove('show');
  // }

}
