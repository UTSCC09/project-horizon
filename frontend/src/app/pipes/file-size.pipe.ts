import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  BYTE_UNITS = ['B', 'KB', 'MB', 'GB'];

  transform(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    const unit = this.BYTE_UNITS[i];

    return `${value.toFixed(2)} ${unit}`;
  }
}
