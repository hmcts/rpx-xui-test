import { OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { ControlValueAccessor, Validator } from '@angular/forms';
export declare class DateInputComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
    id: string;
    mandatory: boolean;
    isDateTime: boolean;
    formControl: FormControl;
    isTouched: boolean;
    displayDay: string;
    displayMonth: string;
    displayYear: string;
    displayHour: string;
    displayMinute: string;
    displaySecond: string;
    private readonly DATE_FORMAT;
    private propagateChange;
    private rawValue;
    private day;
    private month;
    private year;
    private hour;
    private minute;
    private second;
    ngOnInit(): void;
    writeValue(obj: string): void;
    validate(control: AbstractControl): ValidationErrors;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    ngOnDestroy(): void;
    dayChange(value: string): void;
    monthChange(value: string): void;
    yearChange(value: string): void;
    hourChange(value: string): void;
    minuteChange(value: string): void;
    secondChange(value: string): void;
    inputFocus(): void;
    inputBlur(): void;
    touch(): void;
    dayId(): string;
    monthId(): string;
    yearId(): string;
    hourId(): string;
    minuteId(): string;
    secondId(): string;
    private viewValue;
    private isDateFormat;
    private pad;
    private getValueForValidation;
    private removeMilliseconds;
}
