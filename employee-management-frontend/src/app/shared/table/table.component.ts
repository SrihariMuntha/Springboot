
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    ButtonComponent
  ],
  template: `
    <div class="table-responsive">
      <table class="table table-bordered table-striped">

        <thead class="table-dark">
          <tr>
            <th *ngFor="let column of columns">
              {{ column }}
            </th>

            <th *ngIf="showActions">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let item of items | paginate: {
            itemsPerPage: 5,
            currentPage: page
          }">

            <td *ngFor="let column of keys">
              {{ item[column] }}
            </td>

            <td *ngIf="showActions">

              <app-button
                label="Edit"
                cssClass="btn btn-warning btn-sm me-2"
                (clicked)="edit.emit(item)">
              </app-button>

              <app-button
                label="Delete"
                cssClass="btn btn-danger btn-sm"
                (clicked)="delete.emit(item)">
              </app-button>

            </td>
          </tr>

          <tr *ngIf="items.length === 0">
            <td
              [attr.colspan]="columns.length + (showActions ? 1 : 0)"
              class="text-center">

              No records found

            </td>
          </tr>

        </tbody>
      </table>

      <pagination-controls
        (pageChange)="page = $event">
      </pagination-controls>

    </div>
  `
})
export class TableComponent implements OnChanges {

  @Input() items: any[] = [];
  @Input() columns: string[] = [];
  @Input() keys: string[] = [];
  @Input() showActions = false;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  page = 1;

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['items']) {

      console.log('Employee table data changed');

      // Return to the first page when table data changes
      this.page = 1;

    }

  }

}
