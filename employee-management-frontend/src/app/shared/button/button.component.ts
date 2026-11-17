import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type"
      [class]="cssClass"
      [disabled]="disabled"
      (click)="clicked.emit()">
      {{ label }}
    </button>
  `
})
export class ButtonComponent {
  @Input() label = 'Click';
  @Input() cssClass = 'btn btn-primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;

  @Output() clicked = new EventEmitter<void>();
}
