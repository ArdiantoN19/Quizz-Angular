import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'footer-app',
    templateUrl: 'footer.component.html',
    styleUrl: 'footer.component.scss',
    imports: [MatIconModule, MatTooltipModule, RouterLink]
})
export class FooterAppComponent {}