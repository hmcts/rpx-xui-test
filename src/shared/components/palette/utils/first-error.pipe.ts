import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'ccdFirstError'
})
export class FirstErrorPipe implements PipeTransform {

  transform(value: ValidationErrors): string {
    console.log(value);
    if (!value) {
      return '';
    }

    let keys = Object.keys(value);

    if (!keys.length) {
      return '';
    }
    if (keys[0] ===  'required') {
      return 'This field is required';
    } else if (keys[0] ===  'pattern') {
      return 'The data entered is not valid for this type of field.';
    } else if (keys[0] ===  'minlength') {
      return 'Required minimum length';
    } else if (keys[0] ===  'maxlength') {
      return 'Exceeds maximum length';
    } else if (value.hasOwnProperty('matDatetimePickerParse')) {
      return 'The date entered is not valid. Please provide a valid date'
    }
    return value[keys[0]];
  }

}
