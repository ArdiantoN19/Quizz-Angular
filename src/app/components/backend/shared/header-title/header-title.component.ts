import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

type TData = {
    title: string;
    subtitle: string;
}

@Component({
    selector: 'header-title-backend-app',
    templateUrl: 'header-title.component.html',
    styleUrl: 'header-title.component.scss',
    imports: [MatButtonModule, MatIconModule]
})
export class HeaderTitleBackendAppComponent {
    @Input({required: true}) data!: TData;
}