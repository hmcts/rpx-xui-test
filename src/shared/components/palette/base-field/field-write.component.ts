import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { PaletteService } from '../palette.service';
import { AbstractFieldWriteComponent } from './abstract-field-write.component';
import { AbstractControl, FormControl } from '@angular/forms';
import { CaseField } from '../../../domain/definition';
import { FormValidatorsService } from '../../../services/form';
import { plainToClassFromExist } from 'class-transformer';

@Component({
  selector: 'ccd-field-write',
  template: `
    <div>
      <ng-container #fieldContainer></ng-container>
    </div>
  `
})
export class FieldWriteComponent extends AbstractFieldWriteComponent implements OnInit {

  @Input()
  caseFields: CaseField[] = [];

  @ViewChild('fieldContainer', {read: ViewContainerRef})
  fieldContainer: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver,
              private paletteService: PaletteService,
              private formValidatorsService: FormValidatorsService) {
    super();
  }

  protected addValidators(caseField: CaseField, control: AbstractControl): void {
    this.formValidatorsService.addValidators(caseField, control);
  }

  ngOnInit(): void {
    if (this.registerControl) {
      this.registerControl(new FormControl(this.caseField.value));
    }
    let componentClass = this.paletteService.getFieldComponentClass(this.caseField, true);

    let injector = Injector.create([], this.fieldContainer.parentInjector);
    let component = this.resolver.resolveComponentFactory(componentClass).create(injector);

    // Only Fixed list use plainToClassFromExist
    // Better performance
    if (this.caseField.field_type.type === 'FixedList') {
      component.instance['caseField'] = plainToClassFromExist(new CaseField(), this.caseField);
    } else {
      component.instance['caseField'] =  this.caseField;
    }

    component.instance['caseFields'] = this.caseFields;
    component.instance['formGroup'] = this.formGroup;
    component.instance['registerControl'] = this.registerControl || this.defaultControlRegister();
    component.instance['idPrefix'] = this.idPrefix;
    if (this.caseField.field_type.id === 'AddressGlobal') {
      component.instance['ignoreMandatory'] = true;
    }
    component.instance['isExpanded'] = this.isExpanded;
    this.fieldContainer.insert(component.hostView);
  }
}
