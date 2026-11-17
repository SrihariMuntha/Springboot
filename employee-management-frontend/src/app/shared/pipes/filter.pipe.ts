import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];

    if (!searchText) return items;

    const search = searchText.toLowerCase();

    return items.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(search)
      )
    );
  }
}
