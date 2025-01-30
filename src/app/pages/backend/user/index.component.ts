import { Component, inject, OnInit } from '@angular/core';
import { TitleBackendAppComponent } from '../../../components/backend/title/index.component';
import {
  TableBackendAppComponent,
  TColumn,
} from '../../../components/backend/table/index.component';
import { DialogUserAppComponent } from '../../../components/backend/user/dialog/index.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmBackendAppComponent } from '../../../components/backend/user/dialog/dialogConfirm/index.component';
import { UserService } from '../../../services/userService/index.service';
import { TUser } from '../../../services/authService/index.type';
import { SkeletonAppComponent } from '../../../components/skeleton/index.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';

@Component({
  selector: 'user-page-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [
    TitleBackendAppComponent,
    TableBackendAppComponent,
    DialogUserAppComponent,
    SkeletonAppComponent,
  ],
})
export class UserPageApp implements OnInit {
  dialog = inject(MatDialog);
  userService = inject(UserService);
  snackbar = inject(MatSnackBar);

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
      cell: (element: TUser) => `${formatDate(element.createdAt, 'mediumDate', 'en-US')}`,
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

  onEditHandler(data: any) {
    console.log(data);
  }

  onDeleteHandler(dataDelete: any) {
    const dialogRef = this.dialog.open(DialogConfirmBackendAppComponent, {
      data: dataDelete,
    });

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        const response = await this.userService.deleteUserById(
          dataDelete.id
        );

        if (response.status === 'success') {
          const users = this.data.filter((user) => dataDelete.id !== user.id);
          this.data = users;
        }
        
        this.snackbar.open(response.message, 'close');
      }
    });
  }
}
