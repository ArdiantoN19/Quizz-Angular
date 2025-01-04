import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

@Component({
    selector: 'subscribe-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [MatIconModule, MatButtonModule, ReactiveFormsModule]
})
export class SubscribeAppComponent {
    subscribeForm = new FormGroup({
        email: new FormControl<string>('', [Validators.required, Validators.email])
    })

    onSubmitHandler() {
        console.log(this.subscribeForm.value)
    }
}