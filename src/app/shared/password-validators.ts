import { Validators, AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidators() {
  return [
    Validators.required,
    Validators.minLength(6),
    (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && !/\d/.test(value)) {
        return { numberRequired: true };
      }
      return null;
    }
  ];
}
