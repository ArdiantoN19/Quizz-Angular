import { Component } from "@angular/core";
import { ContactUsAppComponent } from "../../../components/contactUs/index.component";

@Component({
    selector: 'contact-us-page-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [ContactUsAppComponent]
})
export class ContactUsPageApp {}