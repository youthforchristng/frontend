import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'removeMilliseconds'
})
export class RemoveMillisecondsPipe implements PipeTransform {
  transform(value: any, format: string): string {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(value, format);

    // Remove milliseconds from the formatted string
    if (formattedDate) {
      return formattedDate.replace(/:\d+ /, ' '); // Replace the milliseconds part (e.g., ':123 ') with a space
    }

    return '';
  }
}
