import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormUserAppComponent, TDataDialog } from './form/index.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dialog-user-app',
  templateUrl: 'index.component.html',
  styleUrl: 'index.component.scss',
  imports: [MatButtonModule, MatIconModule]
})
export class DialogUserAppComponent {
  @Input({ required: true }) mode!: 'new' | 'edit';
  dialog = inject(MatDialog);

  onOpenDialogHandler() {
    this.dialog.open<any, TDataDialog>(DialogFormUserAppComponent, {
      data: {
        name: 'ardi',
        mode: this.mode
      },
    });
  }
}
