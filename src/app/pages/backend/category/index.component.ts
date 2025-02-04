import { Component, inject, OnInit } from '@angular/core';
import { TitleBackendAppComponent } from '../../../components/backend/title/index.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonAppComponent } from '../../../components/skeleton/index.component';
import { CategoryService } from '../../../services/categoryService/index.service';
import {
  TableBackendAppComponent,
  TColumn,
} from '../../../components/backend/table/index.component';
import { TCategory } from '../../../services/categoryService/index.type';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'category-page-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    TitleBackendAppComponent,
    MatButtonModule,
    MatIconModule,
    SkeletonAppComponent,
    TableBackendAppComponent,
    MatTooltipModule
  ],
})
export class CategoryPageApp implements OnInit {
  isLoading: boolean = true;
  private categoryService = inject(CategoryService);
  private snackbar = inject(MatSnackBar);

  protected dataTitle = {
    title: 'Category',
    subtitle: 'You can manage category here.',
  };

  protected data$: TCategory[] = [];
  protected isAction: boolean = true;
  protected columns: TColumn<TCategory>[] = [
    {
      columnDef: 'slug',
      header: 'Slug',
      cell: (element: TCategory) => `${element.slug}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: TCategory) => `${element.name}`,
    },
    {
      columnDef: 'createdAt',
      header: 'Created At',
      cell: (element: TCategory) =>
        formatDate(element.createdAt, 'mediumDate', 'en-US'),
    },
    {
      columnDef: 'updatedAt',
      header: 'Updated At',
      cell: (element: TCategory) =>
        formatDate(element.updatedAt, 'mediumDate', 'en-US'),
    },
  ];

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((result) => {
      if (result.status !== 'success') {
        this.snackbar.open(result.message, 'close');
      } else {
        this.data$ = result.data!;
      }

      this.isLoading = false;
    });
  }

  onEditHandler(data: TCategory): void {
    console.log('edit', data);
  }

  onDeleteHandler(data: TCategory): void {
    console.log('delete', data);
  }
}
