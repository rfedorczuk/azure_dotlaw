import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    if (value && !isNaN(value)) {
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);

      return `${hours}h ${minutes}min`;
    }
    return '0h 0min';
  }
}
