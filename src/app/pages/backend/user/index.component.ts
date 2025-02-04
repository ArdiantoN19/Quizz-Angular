import { Component, inject, OnInit } from '@angular/core';
import { TitleBackendAppComponent } from '../../../components/backend/title/index.component';
import {
  TableBackendAppComponent,
  TColumn,
} from '../../../components/backend/table/index.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmBackendAppComponent } from '../../../components/backend/user/dialog/dialogConfirm/index.component';
import { UserService } from '../../../services/userService/index.service';
import { TUser } from '../../../services/authService/index.type';
import { SkeletonAppComponent } from '../../../components/skeleton/index.component';
import { formatDate } from '@angular/common';
import { TResponse } from '../../../services/index.type';
import { MatIconModule } from '@angular/material/icon';
import { DialogFormUserAppComponent } from '../../../components/backend/user/dialog/form/index.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'user-page-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    TitleBackendAppComponent,
    TableBackendAppComponent,
    SkeletonAppComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
})
export class UserPageApp implements OnInit {
  private dialog = inject(MatDialog);
  private userService = inject(UserService);

  isLoading: boolean = true;

  dataTitle = {
    title: 'User',
    subtitle: 'You can manage user here.',
  };

  data: TUser[] = [];
  isAction: boolean = true;
  columns: TColumn<TUser>[] = [
    {
      columnDef: 'fullname',
      header: 'Fullname',
      cell: (element: TUser) => `${element.fullname}`,
    },
    {
      columnDef: 'username',
      header: 'Username',
      cell: (element: TUser) => `${element.username}`,
    },
    {
      columnDef: 'email',
      header: 'Email',
      cell: (element: TUser) => `${element.email}`,
    },
    {
      columnDef: 'avatar',
      header: 'Avatar',
      isImage: true,
      cell: (element: TUser) => [element.avatar, 45, 45],
    },
    {
      columnDef: 'role',
      header: 'Role',
      cell: (element: TUser) => `${element.role}`,
    },
    {
      columnDef: 'createdAt',
      header: 'Created At',
      cell: (element: TUser) =>
        `${formatDate(element.createdAt, 'mediumDate', 'en-US')}`,
    },
    {
      columnDef: 'updatedAt',
      header: 'Updated At',
      cell: (element: TUser) =>
        `${formatDate(element.updatedAt, 'mediumDate', 'en-US')}`,
    },
  ];

  ngOnInit(): void {
    (async () => {
      const response = await this.userService.getUsers();
      if (response.data && response.status === 'success') {
        this.data = response.data;
      }

      this.isLoading = false;
    })();
  }

  onOpenDialogNewUser(): void {
    const dialogRef = this.dialog.open(DialogFormUserAppComponent, {
      data: {
        mode: 'new',
        data: null
      }
    })

    dialogRef.afterClosed().subscribe((result: TResponse<TUser>) => {
      if(!!result && result.status === 'success' && result.data) {
        this.data = [...this.data, result.data]
      }
    })
  }

  onEditHandler(data: any) {
    const dialogRef = this.dialog.open(DialogFormUserAppComponent, {
      data: {
        mode: 'edit',
        data
      }
    })

    dialogRef.afterClosed().subscribe((result: TResponse<TUser>) => {
      if(!!result && result.status === 'success' && result.data) {
        let copyData = [...this.data];
        copyData = copyData.map((data) => {
          if(result.data && data.id === result.data.id) {
            return {...result.data}
          }
          return data;
        })

        this.data = copyData
      }
    })
  }

  onDeleteHandler(dataDelete: TUser) {
    const dialogRef = this.dialog.open(DialogConfirmBackendAppComponent, {
      data: {
        id: dataDelete.id,
      },
    });

    dialogRef.afterClosed().subscribe(async (result: TResponse<string>) => {
      if (!!result && result.status === 'success') {
        const users = this.data.filter((user) => dataDelete.id !== user.id);
        this.data = users;
      }
    });
  }
}
