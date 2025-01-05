import { Component } from "@angular/core";
import { NavbarAppComponent } from "../../../components/navbar/index.component";
import { FooterAppComponent } from "../../../components/footer/index.component";
import { RouterOutlet } from "@angular/router";
import { ScrollToTopAppComponent } from "../../../components/scrollToTop/index.component";

@Component({
    selector: 'frontend-layout-app',
    templateUrl: 'index.component.html',
    imports: [NavbarAppComponent, FooterAppComponent, RouterOutlet, ScrollToTopAppComponent]
})
export class FrontendLayoutAppComponent {}