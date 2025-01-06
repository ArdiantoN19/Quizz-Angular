import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { ErrorCustomMessageService } from "../../../utils/errorCustomMessage.service";
import { patternPassword } from "../../../utils";
import { Location } from "@angular/common";

@Component({
    selector: 'login-app',
    templateUrl: 'index.component.html',
    styleUrl: 'index.component.scss',
    imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule]
})
export class LoginAppComponent {
    constructor(private errorCustomMessageService: ErrorCustomMessageService, private location: Location) {}

    loginForm = new FormGroup({
        email: new FormControl<string>('', [Validators.required, Validators.email]),
        password: new FormControl<string>('', [Validators.required, Validators.minLength(8), Validators.pattern(patternPassword)])
    })

    goBackHandler() {
        this.location.back()
    }

    getErrorMessage(name: 'email' | 'password') {
        const formControl = this.loginForm.get(name);
        return this.errorCustomMessageService.getMessage(formControl as any, name)
    }

    onSubmitHandler(): void {
        console.log(this.loginForm.value)
    }
}