import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(
    private _router: Router,
    private _auth: AuthService,
    private _snackbar: SnackbarService,
    private _storage: StorageService,
    // private _alert: AlertService,
    // private _auto_logout: AutoLogoutService,
    // private _validator: ValidatorService,
    private _encrypt: EncryptionService
  ) {
  }

  private loginSubscription!: Subscription;

  ngOnInit(): void {};

  loginform = new FormGroup({
    email: new FormControl(
      '',
      [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
      ]
    ),
    password: new FormControl(
      '',
      [
        Validators.required,
        Validators.maxLength(16)
      ]
    )
  });

  get email() {
    return this.loginform.get('email');
  }

  get password() {
    return this.loginform.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  };

  public login(){
    let data: any = {
        email: this.loginform.value.email?.trim(),
        password: this.loginform.value.password?.trim()
    };

    this.isLoading = true;

    const getUserDetails = {
      next: (response: any) => {

        if (response.statusCode === "00") {

          const encrypt = this._encrypt.encryptR(JSON.stringify(response.data))

          sessionStorage.setItem('data', encrypt);
          this.isLoading = false;
          this._router.navigate(['']);
          this._auth.setLoggedIn(true);

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
        // console.log('Error fetching room names:', error);
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };

    this.loginSubscription = this._auth.getUserDetails(data).subscribe(getUserDetails);

  };


  isLoading: Boolean = false;
  showPassword: boolean = false;
  // imageLogo: any = this._storage.imageLogo;
  imageSpinner: any = this._storage.imageSpinner;


  ngOnDestroy(): void {
    // Unsubscribe from the API call when the component is destroyed
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  };


}
