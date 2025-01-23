import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

type TData = {
    title: string;
    subtitle: string;
}

@Component({
    selector: 'title-backend-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [MatButtonModule, MatIconModule]
})
export class TitleBackendAppComponent {
    @Input({required: true}) data!: TData;
}