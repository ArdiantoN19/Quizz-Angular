import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogUserAppComponent } from '../index.component';

export type TDataDialog = {
    name: string;
}

@Component({
  selector: 'dialog-form-user-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogFormUserAppComponent {
  data = inject<TDataDialog>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<DialogUserAppComponent>);

  onCloseDialogHandler() {
    this.dialogRef.close('closed success');
  }
}
