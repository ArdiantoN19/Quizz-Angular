import { NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
    selector: 'cta-app',
    templateUrl: 'cta.component.html',
    styleUrl: 'cta.component.scss',
    imports: [MatButtonModule, MatIconModule, NgOptimizedImage, MatTooltipModule]
})
export class CtaComponent {}