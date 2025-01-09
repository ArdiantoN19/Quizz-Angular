import { NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'notfound-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [NgOptimizedImage, MatButtonModule, MatIconModule, RouterLink]
})
export class NotFoundAppComponent {}