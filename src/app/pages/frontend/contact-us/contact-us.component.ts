import { Component } from "@angular/core";
import { ContactUsAppComponent } from "../../../components/contact-us/contact-us.component";

@Component({
    selector: 'contact-us-page-app',
    templateUrl: 'contact-us.component.html',
    styleUrl: 'contact-us.component.scss',
    imports: [ContactUsAppComponent]
})
export class ContactUsPageApp {}