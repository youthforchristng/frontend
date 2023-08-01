import { SnackbarService } from './../../services/snackbar.service';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'welcome-image',
  templateUrl: './welcome-image.component.html',
  styleUrls: ['./welcome-image.component.css']
})
export class WelcomeImageComponent implements OnInit, OnDestroy {

  @ViewChild('sourceImage') sourceImageRef!: ElementRef;
  @ViewChild('container') containerRef!: ElementRef;


  accentColor!: string; // Add this variable declaration

  constructor(private _api: ApiService,
    private _snackbar: SnackbarService
    ) {

  }
  ngOnInit(): void {
    this.getMedia();
  };


  ngOnDestroy(): void {
    if(this.getMediaSubscription){
      this.getMediaSubscription.unsubscribe()
    };
  };

  // extractAccentColor() {
  //   const sourceImage = this.sourceImageRef?.nativeElement;
  //   const container = this.containerRef?.nativeElement;

  //   if (sourceImage && container) {
  //     // Create a canvas element
  //     const canvas = document.createElement('canvas');
  //     const ctx = canvas.getContext('2d');

  //     // Set the canvas dimensions to match the image dimensions
  //     canvas.width = sourceImage.width;
  //     canvas.height = sourceImage.height;

  //     // Draw the base64 image on the canvas
  //     const image = new Image();
  //     image.src = this.base64String;
  //     image.onload = () => {
  //       ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

  //       // Get the average color from the canvas
  //       const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)?.data;
  //       if (imageData) {
  //         const accentColor = this.getAverageColor(imageData);
  //         this.accentColor = `rgb(${accentColor.r}, ${accentColor.g}, ${accentColor.b})`;

  //         // Apply the accent color to the div container
  //         container.style.backgroundColor = this.accentColor;
  //       }
  //     };
  //   }
  // }


  // getAverageColor(imageData: string | any[] | Uint8ClampedArray) {
  //   let r = 0, g = 0, b = 0;
  //   const pixelCount = imageData.length / 4; // Each pixel has 4 values (R, G, B, A)

  //   for (let i = 0; i < imageData.length; i += 4) {
  //     r += imageData[i];
  //     g += imageData[i + 1];
  //     b += imageData[i + 2];
  //   }

  //   r = Math.round(r / pixelCount);
  //   g = Math.round(g / pixelCount);
  //   b = Math.round(b / pixelCount);

  //   return { r, g, b };
  // }

  isLoadingMedia: Boolean = false;
  isMedia: Boolean = false;
  text: string = '';
  base64String: string = '';

  private getMediaSubscription!: Subscription;

  getMedia(){

    this.isLoadingMedia = true;

    const getRoomsObserver = {
      next: (response: any) => {
        console.log(response);
        this.isLoadingMedia = false;

        if (response.statusCode == '00') {
          let responseMedia = response.data[0]
          if(responseMedia.isMedia){
            this.isMedia = true;
            this.text = '';
            this.base64String = responseMedia.text;

              if (this.sourceImageRef && this.containerRef) {
                // Access the ViewChild elements here
                // this.extractAccentColor();
              } else{
                console.log('here');

              }
            // this.extractAccentColor();
          } else if(!responseMedia.isMedia){
            this.isMedia = false;
            this.base64String = '';
            this.text = responseMedia.text;
          };

          console.log(this.isMedia);
          console.log(this.text);
          console.log(this.base64String);


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

    this.getMediaSubscription = this._api.get_login_media().subscribe(getRoomsObserver);
  };



  ngAfterViewInit() {

    // this.getMedia();
    // This code will be executed after the view and ViewChild elements are initialized

    // if (this.sourceImageRef && this.containerRef) {
    //   // Access the ViewChild elements here
    //   this.extractAccentColor();
    // }


    // Use a timeout to call extractAccentColor()
    // setTimeout(() => {
    //   // this.extractAccentColor();
    //   // console.log('tester');
    // }, 0);
  }
}
