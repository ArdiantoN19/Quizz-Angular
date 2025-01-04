import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class ErrorCustomMessageService {
    constructor(){}

    private transformName(name: string): string {
        return name[0].toUpperCase() + name.slice(1, name.length)
    }

     getMessage(formControl: AbstractControl<any>, name: string): string {
        const labelError = this.transformName(name);
        
        if(!formControl) return ''

        if(formControl.hasError('required')) {
            return `${labelError} is required`
        }

        if(formControl.hasError('email')) {
            return `Please enter a valid email address`;
        }

        if(formControl.hasError('minlength')) {
            return `${labelError} must be have at least ${formControl.getError('minlength')?.requiredLength} characters`
        }

        if(formControl.hasError('maxlength')) {
            return `${labelError} must be less than ${formControl.getError('maxlength')?.requiredLength} characters`
        }

        return 'error, please check your input'
    }
}