import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
    selector: 'footer-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [MatIconModule, MatTooltipModule]
})
export class FooterAppComponent {}