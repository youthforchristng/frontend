import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-generate-otp',
  templateUrl: './generate-otp.component.html',
  styleUrls: ['./generate-otp.component.css']
})
export class GenerateOtpComponent implements OnInit, OnDestroy {

  constructor(
    private _router: Router,
    private _api: ApiService,
    private _snackbar: SnackbarService,
    private _storage: StorageService,
    private _e: EncryptionService
  ) {
  }

  private generateSubscription!: Subscription;

  ngOnInit(): void {};

  ngOnDestroy(): void {
    if (this.generateSubscription) {
      this.generateSubscription.unsubscribe();
    }
  };

  generate_otp_form = new FormGroup({
    email: new FormControl(
      '',
      [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
      ]
    )
  });

  get email() {
    return this.generate_otp_form.get('email');
  };

  generate_otp(){
    let data: any = {
      email: this.generate_otp_form.value.email?.trim()
    };

    this.isLoading = true;

    const getEmailObserver = {
      next: (response: any) => {
        this.isLoading = false;
        if (response.statusCode === "00") {
          const e = this._e.encryptR(JSON.stringify(data.email));
          //save email used to reset user
          sessionStorage.setItem('xxxcf==', e);
          this._snackbar.showSnackbar('OTP has been sent to your email', 'Close');
          this._router.navigate(['/reset/complete-reset']);
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
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };

    this.generateSubscription = this._api.generate_otp(data).subscribe(getEmailObserver);
  };


  isLoading: Boolean = false;
  showPassword: boolean = false;
  // imageLogo: any = this._storage.imageLogo;
  imageSpinner: any = this._storage.imageSpinner;

}
