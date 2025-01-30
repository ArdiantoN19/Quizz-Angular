import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

type TDataSource<T> = T & {
  no: number;
};

/**  
 * if isImage true format cell is () => [url, width, height]
 * if isAction true format cell is () => [editFn, deleteFn] 
 * */
export type TColumn<T> = {
  columnDef: string;
  header: string;
  isImage?: boolean;
  cell: (arg: TDataSource<T>) => any; 
};

@Component({
  selector: 'table-backend-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgOptimizedImage,
    MatButtonModule,
    MatIconModule,
    MatTooltip
  ],
})
export class TableBackendAppComponent<T extends Record<string, any>>
  implements AfterViewInit, OnChanges
{
  @Input({ required: true }) data!: T[];
  @Input({ required: true }) columns!: TColumn<T>[];
  @Input() isAction: boolean = false;

  @Output() eventEdit = new EventEmitter<TDataSource<T>>()
  @Output() eventDelete = new EventEmitter<TDataSource<T>>()

  dataSource: MatTableDataSource<TDataSource<T>> = new MatTableDataSource<
    TDataSource<T>
  >([]);
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const copyData = this.data.map((data, index) => ({
      no: index + 1,
      ...data,
    }));

    if (changes['data'] && this.data && changes['columns'] && this.columns) {
      this.dataSource = new MatTableDataSource(copyData);
      this.columns = [
        {
          columnDef: 'no',
          header: 'No.',
          cell: (element) => `${element.no}`
        }, 
        ...this.columns
      ]

      if(this.isAction) {
        this.columns = [
          ...this.columns,
          {
            columnDef: 'action',
            header: 'Action',
            cell: () => `` 
          }
        ]
      }

      this.displayedColumns = this.columns.map(({columnDef}) => columnDef);
    }

    if(changes['data']) {
      this.dataSource = new MatTableDataSource(copyData)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEditHandler(row: TDataSource<T>) {
    this.eventEdit.emit(row)
  }

  onDeleteHandler(row: TDataSource<T>) {
    this.eventDelete.emit(row)
  }
}
