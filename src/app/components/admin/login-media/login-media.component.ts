import { AlertService } from './../../../services/alert.service';
import { SnackbarService } from './../../../services/snackbar.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login-media',
  templateUrl: './login-media.component.html',
  styleUrls: ['./login-media.component.css']
})
export class AdminLoginMediaComponent {

  constructor(
    private _snackbar: SnackbarService,
    private _api: ApiService,
    private _alert: AlertService,
  ) {

  }

  text: string = '';
  file: string = '';
  isMedia: Boolean = false;
  fileExtensionException: Boolean = false;
  fileSizeException: Boolean = false;

  selectMediaType(){
    this.text = '';
    this.image = null;
    this.reset();
  };

  image: any = null;
  getFile!: any;
  getFileName!: string;

  @ViewChild('myInput') myInputVariable!: ElementRef;

  onFileSelected(event: any) {

    if (event.target.files.length < 1) {
      this._snackbar.showSnackbar('No file was selected.', 'Close');
      this.image = null;
      return;
    };

    const file = event.target.files[0];

    // Check file extension
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      this.image = null;
      this._snackbar.showSnackbar('Only JPG, JPEG, and PNG files are allowed.', 'Close');
      this.fileExtensionException = true;
      return;
    };

    // Check file size (in bytes)
    const maxSizeInBytes = 2097152; // 2MB
    if (file.size > maxSizeInBytes) {
      this.image = null;
      this.fileSizeException = true;
      this._snackbar.showSnackbar('File size exceeds the limit.', 'Close');
      return;
    };

    this.getFile = file;
    this.getFileName = file.name;

    this.fileExtensionException = false;
    this.fileSizeException = false;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      this.image = image.src || null;
    };

    reader.onerror = function (error) {
    };

    reader.readAsDataURL(this.getFile);
  };

  //RESET "UPLOAD FILE" INPUT FIELD
  reset() {
    // console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = '';
    // console.log(this.myInputVariable.nativeElement.files);
  };

  submit(){
    this._snackbar.closeAllSnackBars();

    if(this.isMedia && this.image == null){
      this.fileExtensionException ?
        this._snackbar.showSnackbar('Only JPG, JPEG, and PNG files are allowed.', 'Close') :
        ( this.fileSizeException ? this._snackbar.showSnackbar('File size exceeds the limit.', 'Close') :
          this._snackbar.showSnackbar('No file was selected for upload.', 'Close') )
    } else if(!this.isMedia && this.text.length < 1 ){
      this._snackbar.showSnackbar('No text was entered.', 'Close');
    } else{
      let data = {
        "isMedia": this.isMedia,
        "text": this.isMedia ? this.image : this.text
      };

      this.isLoading = true;

      this._api.save_login_media(data).subscribe(this.saveMediaObserver());
    };

  };


  saveMediaObserver() {
    const saveMediaObserver = {
      next: (response: any) => {
        console.log(response);

          this.isLoading = false;

        if (response.statusCode === "00") {

          this._alert.toast_top_end_success('Successfully Added');
          this.reset();
          this.isMedia = false;
          this.text = '';
          this.image = null;

        }
        else if(response.statusCode === "96") {
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        }
        else {
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        };

      },
      error: (error: any) => {
        this.isLoading = false;
        // console.log('Error fetching room names:', error);
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };

    return saveMediaObserver;
  };

  isLoading: Boolean = false;

}
