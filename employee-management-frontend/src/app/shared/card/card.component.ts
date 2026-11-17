import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card shadow-sm h-100">
      <div class="card-body">
        <h6 class="text-muted">{{ title }}</h6>
        <h2>{{ value }}</h2>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() title = '';
  @Input() value: string | number = 0;
}
