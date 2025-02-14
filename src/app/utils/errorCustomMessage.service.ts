import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { patternPassword } from ".";

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

        if(formControl.hasError('min')) {
            return `${labelError} must be greater than ${formControl.getError('min')?.min}`
        }

        if(formControl.hasError('pattern') && formControl.getError('pattern')?.requiredPattern === String(patternPassword)) {
            return `${labelError} must be have at least 1 capital character, 1 small character, and 1 number`
        }

        return 'Error, please check your input'
    }
}