import { Component } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'hero-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [MatButtonModule, MatIconModule, NgOptimizedImage]
})
export class HeroApp {}