import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, MAT_SNACK_BAR_DATA  } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {


  private snackbarRef: MatSnackBarRef<any> | null = null;

  constructor(private snackBar: MatSnackBar) { }

  // showSnackbar(message: string, action: string, duration: number = 5000): void {
  //   this.snackBar.open(message, action, {
  //     duration: duration,
  //   });
  // };

  showSnackbar(message: string, action: string, duration: number = 10000): void {
    const config: MatSnackBarConfig = {
      duration: duration,
      // panelClass: ['custom-snackbar']
    };

    this.snackbarRef = this.snackBar.open(message, action, config);
  }

  closeAllSnackBars() {
    if (this.snackbarRef) {
      this.snackbarRef.dismiss();
    }
  }

}
