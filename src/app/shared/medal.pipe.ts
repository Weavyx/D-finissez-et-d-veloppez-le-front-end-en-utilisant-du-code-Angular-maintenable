import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'medal',
  standalone: true
})
export class MedalPipe implements PipeTransform {
  transform(value: number): string {
    return value + ' 🏅';
  }
}

