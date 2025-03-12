import { NgOptimizedImage } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'notfound-app',
    templateUrl: '404-notfound.component.html',
    styleUrl: '404-notfound.component.scss',
    imports: [NgOptimizedImage, MatButtonModule, MatIconModule, RouterLink]
})
export class NotFoundAppComponent {}