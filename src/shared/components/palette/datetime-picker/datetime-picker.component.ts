import {
  NGX_MAT_DATE_FORMATS,
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NgxMatDatetimePicker
} from '@angular-material-components/datetime-picker';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, ThemePalette } from '@angular/material';
import { AbstractFormFieldComponent } from '../base-field/abstract-form-field.component';
import { CaseField } from '../../../domain';
import { NgxMatMomentAdapter } from '@angular-material-components/moment-adapter';
import { CUSTOM_MOMENT_FORMATS } from './datetime-picker-utils';
import { FormatTranslatorService } from '../../../services/case-fields/format-translator.service';
import { Moment } from 'moment/moment';
import moment = require('moment/moment');

@Component({
  selector: 'ccd-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_MOMENT_FORMATS},
    {provide: NgxMatDateAdapter, useClass: NgxMatMomentAdapter},
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}]
})

export class DatetimePickerComponent extends AbstractFormFieldComponent implements OnInit {

  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  public disableMinute = true;
  public hideTime = true;
  public hideMinutes = true;
  public startView = 'month';
  public yearSelection = false;
  public checkTime = true;
  public stringEdited = false;
  @Input() public dateControl: FormControl = new FormControl(new Date());

  @ViewChild('picker') datetimePicker: NgxMatDatetimePicker<any>;
  @ViewChild('input') inputElement: ElementRef<HTMLInputElement>;
  private dateTimeEntryFormat;

  constructor(private readonly formatTranslationService: FormatTranslatorService,
              @Inject(NGX_MAT_DATE_FORMATS) private ngxMatDateFormats: NgxMatDateFormats) {

    super();
  }

  ngOnInit(): void {
    this.dateTimeEntryFormat = this.caseField.dateTimeEntryFormat;
    this.configureDatePicker(this.dateTimeEntryFormat);
    this.setDateTimeFormat();
    this.dateControl = this.registerControl(new FormControl(this.caseField.value)) as FormControl;
    // in resetting the format just after the page initialises, the input can be reformatted
    // otherwise the last format given will be how the text shown will be displayed
    setTimeout(() => {
      this.setDateTimeFormat();
    }, 1);
  }

  setDateTimeFormat(): void {
    this.ngxMatDateFormats.parse.dateInput = this.dateTimeEntryFormat;
    this.ngxMatDateFormats.display.dateInput = this.dateTimeEntryFormat;
  }

  focusIn(): void {
    this.setDateTimeFormat();
  }

  toggleClick(): void {
    this.setDateTimeFormat();
  }

  minDate(caseField: CaseField): Date {
    return caseField.field_type.min ? new Date(caseField.field_type.min) : null;
  }

  maxDate(caseField: CaseField): Date {
    return caseField.field_type.max ? new Date(caseField.field_type.max) : null;
  }

  configureDatePicker(dateTimePickerFormat: string): void {
    if (this.caseField.field_type.type === 'Date') {
      this.hideTime = true;
      this.checkTime = false;
      this.dateTimeEntryFormat = this.formatTranslationService.removeTime(this.dateTimeEntryFormat);
    }

    if (this.checkTime) {

      if (this.formatTranslationService.hasSeconds(dateTimePickerFormat)) {
        this.showSeconds = true;
        this.hideMinutes = false;
        this.disableMinute = false;
        this.hideTime = false;
        if (!this.formatTranslationService.is24Hour(dateTimePickerFormat)) {
          this.enableMeridian = true;
        }
      }
      if (this.formatTranslationService.hasHours(dateTimePickerFormat)) {
        this.hideTime = false;
        if (!this.formatTranslationService.is24Hour(dateTimePickerFormat)) {
          this.enableMeridian = true;
        }
        return;
      }

      if (this.formatTranslationService.hasMinutes(dateTimePickerFormat)) {
        this.hideMinutes = false;
        this.disableMinute = false;
        this.hideTime = false;
        if (!this.formatTranslationService.is24Hour(dateTimePickerFormat)) {
          this.enableMeridian = true;
        }
        return;
      }
    }

    if (this.formatTranslationService.hasDate(dateTimePickerFormat)) {
      return;
    }

    if (this.formatTranslationService.hasNoDay(dateTimePickerFormat)) {
      this.startView = 'multi-year';
    }

    if (this.formatTranslationService.hasNoDayAndMonth(dateTimePickerFormat)) {
      this.startView = 'multi-year';
      this.yearSelection = true;
    }
  }

  yearSelected(event: Moment): void {
    if (this.startView === 'multi-year' && this.yearSelection) {
      this.dateControl.patchValue(event.toISOString());
      this.datetimePicker.close();
    }
  }

  monthSelected(event: Moment): void {
    if (this.startView === 'multi-year') {
      this.dateControl.patchValue(event.toISOString());
      this.dateControl.patchValue(event.toISOString());
      this.datetimePicker.close();
    }
  }
}
