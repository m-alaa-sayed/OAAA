import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
    selector: '[noWhitespace]',
    standalone: true,
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: NoWhitespaceValidatorDirective,
        multi: true
    }]
})
export class NoWhitespaceValidatorDirective implements Validator {
    validate(control: AbstractControl): ValidationErrors | null {
        const isWhitespace = (control.value || '').trim().length === 0;
        return isWhitespace ? {'whitespace': true} : null;
    }
}
