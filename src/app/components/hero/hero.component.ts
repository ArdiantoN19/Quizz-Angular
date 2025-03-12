import { Component } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
    selector: 'hero-app',
    templateUrl: 'hero.component.html',
    styleUrl: 'hero.component.scss',
    imports: [MatButtonModule, MatIconModule, NgOptimizedImage, MatTooltipModule]
})
export class HeroAppComponent {}