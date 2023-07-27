import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class AlertService {

  constructor(
    private router: Router,
    // private _snackBar: MatSnackBar
  ) { }

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000
  });

  toast_top_end_success(title: string) {
    return this.Toast.fire({
      icon: 'success',
      title: `${title.toUpperCase()}`,
    });
  }

  toast_top_end_error(title: string) {
    return this.Toast.fire({
      icon: 'warning',
      title: `${title.toUpperCase()}`,
    });
  };

  are_you_sure(){
    return Swal.fire({
      html: 'Are you sure?',
      icon: 'warning',
      customClass: 'swal-wide',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#005D30',
      confirmButtonText: 'OK'
    })
  }

}
