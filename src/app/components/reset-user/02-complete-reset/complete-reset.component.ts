import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControlOptions, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-complete-reset',
  templateUrl: './complete-reset.component.html',
  styleUrls: ['./complete-reset.component.css']
})
export class CompleteResetComponent implements OnInit {


  constructor(
    private _router: Router,
    private _api: ApiService,
    private _snackbar: SnackbarService,
    private _alert: AlertService,
    private _validator: ValidatorService,
    private _encrypt: EncryptionService,
    private _formBuilder: FormBuilder
  ) {
  }

  complete_reset_form: FormGroup = new FormGroup({
    otp: new FormControl(''),
    password: new FormControl(''),
    confirmpassword: new FormControl('')
  });

  ngOnInit(): void {
    if(sessionStorage.getItem('xxxcf==')){
      const email = sessionStorage.getItem('xxxcf==')!;
      this.email =  JSON.parse(this._encrypt.decryptR(email));
      this.initializeForm();
    } else {
      this._router.navigate(['/reset/generate-otp']);
    };
  };

  ngOnDestroy(): void {
    if (this.completeSubscription) {
      this.completeSubscription.unsubscribe();
    };
  };

  initializeForm(){
    this.complete_reset_form = this._formBuilder.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6)
          ]
        ],
        confirmpassword: [
          '',
          Validators.required
        ],
        otp: [
          '',
          Validators.required
        ]
      },
      {
        validator: [
          this._validator.MustMatch('password', 'confirmpassword')
        ]
      } as AbstractControlOptions
    );
  };

  complete_reset(){
    let data: any = {
      token: this.complete_reset_form.value.otp?.trim(),
      email: this.email,
      newPassword: this.complete_reset_form.value.password?.trim()
    };
    this.isLoading = true;
    this.completeSubscription = this._api.validate_otp(data).subscribe(this.completeResetObserver());
  };

  completeResetObserver() {
    const completeResetObserver = {
      next: (response: any) => {
        if (response.statusCode === "00") {
          this._alert.toast_top_end_success('Reset successful, proceed to login')
          .then(()=>{
            this.isLoading = false;
            sessionStorage.removeItem('xxxcf==')!;
            this._router.navigate(['login']);
          });
        }
        else if(response.statusCode === "96") {
          this.isLoading = false;
          this._snackbar.showSnackbar(response.statusMessage, 'Close');
        }
        else {
          this.isLoading = false;
          this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
        };
      },
      error: (error: any) => {
        this.isLoading = false;
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };

    return completeResetObserver;
  };

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  };

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  };

  get otp() {
    return this.complete_reset_form.get('otp');
  };

  get password() {
    return this.complete_reset_form.get('password');
  };

  get confirmpassword() {
    return this.complete_reset_form.get('confirmpassword');
  };

  email: any = '';

  isLoading: Boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // imageLogo: any = this._storage.imageLogo;
  imageSpinner: any = 'assets/images/spin.gif';

  private completeSubscription!: Subscription;

}
