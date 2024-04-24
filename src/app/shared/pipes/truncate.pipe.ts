import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {

  transform(text: string, maxLength: number = 20): string {
    if(text) {
      if (text && text.length <= maxLength) {
        return text;
      }
      return text.substring(0, maxLength) + '...';
    } else {
      return '--';
    }
   
  }

}
