import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TitleBackendAppComponent } from "../../../components/backend/title/index.component";

@Component({
    selector: 'user-page-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [TitleBackendAppComponent]
})
export class UserPageApp {
    dataTitle = {
        title: 'User',
        subtitle: 'You can manage user here.'
    }
}