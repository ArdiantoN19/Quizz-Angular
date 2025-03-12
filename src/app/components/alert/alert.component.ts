import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

type TAlert = 'danger' | 'warning' | 'success' | 'info';

const iconType: Record<TAlert, string> = {
  danger: 'cancel',
  info: 'warning',
  warning: 'warning',
  success: 'check_circle',
};

@Component({
  selector: 'alert-app',
  templateUrl: 'alert.component.html',
  styleUrl: 'alert.component.scss',
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
})
export class AlertAppComponent {
  @Input({ required: true }) type!: TAlert;
  @Input({ required: true }) message!: string;
  @Input({ required: true }) title!: string;

  @ViewChild('alert') alert!: ElementRef;

  get iconType(): string {
    return iconType[this.type];
  }

  onDismissAlertHandler() {
    this.alert.nativeElement.style.display = 'none'
  }
}
