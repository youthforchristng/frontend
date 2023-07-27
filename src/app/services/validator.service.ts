import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class ValidatorService {

  // MustMatch(controlName: string, matchingControlName: string) {
  //   return (formGroup: FormGroup) => {
  //   const control = formGroup.controls[controlName];
  //   const matchingControl = formGroup.controls[matchingControlName];
  //     if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
  //     return;
  //     }
  //     if (control.value !== matchingControl.value) {
  //     matchingControl.setErrors({ mustMatch: true });
  //     } else {
  //     matchingControl.setErrors(null);
  //     }
  //   }
  // };

  MustMatch(controlName: string, matchingControlName: string) {
    return (control: AbstractControl) => {
      const controlValue = control.get(controlName)?.value;
      const matchingControlValue = control.get(matchingControlName)?.value;

      if (controlValue !== matchingControlValue) {
        control.get(matchingControlName)?.setErrors({ mustMatch: true });
      } else {
        control.get(matchingControlName)?.setErrors(null);
      }
    };
  };

  dateRangeValidator(minDate: Date, maxDate: Date) {
    return (control: FormControl) => {
      const selectedDate = new Date(control.value);
      if (selectedDate < minDate || selectedDate > maxDate) {
        return { 'dateRangeError': true };
      }
      return null;
    };
  }


}
