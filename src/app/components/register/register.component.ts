import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControlOptions } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StorageService } from 'src/app/services/storage.service';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnDestroy {


  constructor(
    private _router: Router,
    private _auth: AuthService,
    private _api: ApiService,
    private _snackbar: SnackbarService,
    private _storage: StorageService,
    private _alert: AlertService,
    // private _auto_logout: AutoLogoutService,
    private _validator: ValidatorService,
    private _encrypt: EncryptionService,
    private _formBuilder: FormBuilder
  ) {
  }

  private registrationSubscription!: Subscription;

  registrationform: FormGroup = new FormGroup({
    email: new FormControl(''),
    dob: new FormControl(null),
    lastname: new FormControl(''),
    password: new FormControl(''),
    firstname: new FormControl(''),
    phonenumber: new FormControl(''),
    maritalstatus: new FormControl(null),
    confirmpassword: new FormControl('')
  });

  ngOnInit(): void {
    this.initializeForm();
  };


  initializeForm(){
    const minDate = new Date('1960-01-01');
    const maxDate = new Date('2010-12-31');

    this.registrationform = this._formBuilder.group(
      {
        dob: [
          null,
          [
            Validators.required,
            this._validator.dateRangeValidator(minDate, maxDate)
          ]
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)
          ]
        ],
        lastname: [
          '',
          [
            Validators.required
          ]
        ],
        firstname: [
          '',
          [
            Validators.required
          ]
        ],
        username: [
          '',
          [
            Validators.required
          ]
        ],
        profilePic: [
          null,
          [
            Validators.required
          ]
        ],
        phonenumber: [
          '',
          [
            Validators.required
          ]
        ],
        maritalstatus: [
          null,
          [
            Validators.required
          ]
        ],
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
        ]
      },
      {
        validator: [
          this._validator.MustMatch('password', 'confirmpassword')
        ]
      } as AbstractControlOptions
    );
  };

  image: any = null;
  getFile!: any;
  getFileName!: string;

  @ViewChild('myInput') myInputVariable!: ElementRef;

  onFileSelected(event: any) {

    if (event.target.files.length < 1) {
      this._snackbar.showSnackbar('No file was selected.', 'Close');
      return;
    };

    const file = event.target.files[0];

    // Check file extension
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      // console.log('Only JPG, JPEG, and PNG files are allowed.');
      this.registrationform.get('profilePic')?.setErrors({ invalidExtension: true });
      this._snackbar.showSnackbar('Only JPG, JPEG, and PNG files are allowed.', 'Close');
      return;
    };

    // Check file size (in bytes)
    const maxSizeInBytes = 2097152; // 2MB
    if (file.size > maxSizeInBytes) {
      // console.log('File size exceeds the limit.');
      this.registrationform.get('profilePic')?.setErrors({ invalidSize: true });
      this._snackbar.showSnackbar('File size exceeds the limit.', 'Close');
      return;
    };

    // Reset any previous errors
    this.registrationform.get('profilePic')?.setErrors(null);

    this.getFile = file;
    this.getFileName = file.name;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      this.image = image.src || null;
    };

    reader.onerror = function (error) {
      // console.log('Error: ', error); //@todo: Logo to a server somewhere?
    };

    reader.readAsDataURL(this.getFile);
  };

  public register(){

    let data: any = {
      firstName: this.registrationform.value.firstname?.trim(),
      lastName: this.registrationform.value.lastname?.trim(),
      email: this.registrationform.value.email?.trim(),
      password: this.registrationform.value.password?.trim(),
      phoneNumber: this.registrationform.value.phonenumber?.trim(),
      dob: this.registrationform.value.dob?.trim(),
      profilePic: this.image,
      username: this.registrationform.value.username?.trim(),
      maritalStatus: this.registrationform.value.maritalstatus?.trim()
    };
    console.log(data);

    this.isLoading = true;

    // setTimeout(() => this.isLoading = false, 5000)

    this.registrationSubscription = this._api.register(data).subscribe(this.getUserDetailsObserver());

  };

  getUserDetailsObserver() {
    const getUserDetailsObserver = {
      next: (response: any) => {
        console.log(response);

        if (response.statusCode === "00") {

          this._alert.toast_top_end_success('Registration Successful')
          .then(()=> {
            this.isLoading = false;
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
        // console.log('Error fetching room names:', error);
        this._snackbar.showSnackbar('Opps! Something Went Wrong!', 'Close');
      }
    };

    return getUserDetailsObserver;
  }

  get dob() {
    return this.registrationform.get('dob');
  };

  get email() {
    return this.registrationform.get('email');
  };

  get lastname() {
    return this.registrationform.get('lastname');
  };

  get username() {
    return this.registrationform.get('username');
  };

  get profilePic() {
    return this.registrationform.get('profilePic');
  };

  get firstname() {
    return this.registrationform.get('firstname');
  };

  get phonenumber() {
    return this.registrationform.get('phonenumber');
  };

  get maritalstatus() {
    return this.registrationform.get('maritalstatus');
  };

  get password() {
    return this.registrationform.get('password');
  };

  get confirmpassword() {
    return this.registrationform.get('confirmpassword');
  };

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  };

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  };

  isLoading: Boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // imageLogo: any = this._storage.imageLogo;
  imageSpinner: any = this._storage.imageSpinner;


  ngOnDestroy(): void {
    if (this.registrationSubscription) {
      this.registrationSubscription.unsubscribe();
    }
  };

  listOfMarital = [
    {
      name: 'Single'
    },
    {
      name: 'Married'
    },
    {
      name: 'Widow'
    },
    {
      name: 'Widower'
    },
  ]
}
