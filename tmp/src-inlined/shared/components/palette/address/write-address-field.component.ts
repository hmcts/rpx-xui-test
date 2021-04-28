import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';
import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { WriteComplexFieldComponent } from '../complex/write-complex-field.component';
import { AddressModel } from '../../../domain/addresses/address.model';
import { AddressOption } from './address-option.model';
import { AddressesService } from '../../../services/addresses/addresses.service';
import { FormControl, FormGroup } from '@angular/forms';
import { IsCompoundPipe } from '../utils/is-compound.pipe';
import { FocusElementDirective } from '../../../directives/focus-element';

@Component({
  selector: 'ccd-write-address-field',
  template: `
    <div class="form-group" [id]="id()">

      <div *ngIf="!isComplexWithHiddenFields()">
        <h2 class="heading-h2">{{caseField | ccdFieldLabel }}</h2>

        <div class="form-group bottom-30" id="postcodeLookup" [ngClass]="{'form-group-error': missingPostcode}" *ngIf="!isExpanded">
          <label [for]="createId('postcodeInput')">
            <span class="form-label">Enter a UK postcode</span>
          </label>
          <span class="error-message" *ngIf="missingPostcode">Enter the Postcode</span>
          <input type="text" [id]="createId('postcodeInput')" name="postcode" class="form-control postcodeinput inline-block" [formControl]="postcode">
          <button type="button" class="button button-30" (click)="findAddress()">Find address</button>
        </div>

        <div class="form-group" *ngIf="addressOptions" id="selectAddress">
          <label [for]="createId('addressList')">
            <span class="form-label">Select an address</span>
          </label>

          <select class="form-control ccd-dropdown addressList" [id]="createId('addressList')" name="address" [formControl]="addressList" (change)="addressSelected()" focusElement>
            <option *ngFor="let addressOption of addressOptions" [ngValue]="addressOption.value">
              {{addressOption.description}}
            </option>
          </select>
        </div>

        <a class="manual-link bottom-30" *ngIf="!shouldShowDetailFields()" (click)="blankAddress()" href="javascript:void(0)">I can't enter a UK postcode</a>
      </div>

      <ccd-write-complex-type-field
        [hidden]="!shouldShowDetailFields()"
        [caseField]="caseField"
        [renderLabel]="false"
        [parent]="parent"
        [formGroup]="formGroup"
        [ignoreMandatory]="true"
        [idPrefix]="idPrefix"
        #writeComplexFieldComponent>
      </ccd-write-complex-type-field>

    </div>
  `,
  styles: [`
    .manual-link{cursor:pointer;display:block;text-decoration:underline}
  `]
})
export class WriteAddressFieldComponent extends AbstractFieldWriteComponent implements OnInit, OnChanges {

  @ViewChild('writeComplexFieldComponent')
  writeComplexFieldComponent: WriteComplexFieldComponent;

  @ViewChildren(FocusElementDirective)
  focusElementDirectives: QueryList<FocusElementDirective>;

  addressesService: AddressesService;

  @Input()
  formGroup: FormGroup;

  addressFormGroup = new FormGroup({});
  postcode: FormControl;
  addressList: FormControl;

  addressOptions: AddressOption[];

  missingPostcode = false;

  constructor(addressesService: AddressesService, private isCompoundPipe: IsCompoundPipe) {
    super();
    this.addressesService = addressesService;
  }

  ngOnInit(): void {
    if (!this.isComplexWithHiddenFields()) {
      this.postcode = new FormControl('');
      this.addressFormGroup.addControl('postcode', this.postcode);
      this.addressList = new FormControl('');
      this.addressFormGroup.addControl('address', this.addressList);
    }
  }

  findAddress() {
    if (!this.postcode.value) {
      this.missingPostcode = true;
    } else {
      this.missingPostcode = false;
      const postcode = this.postcode.value;
      this.caseField.value = null;
      this.addressOptions = new Array();
      this.addressesService.getAddressesForPostcode(postcode.replace(' ', '').toUpperCase()).subscribe(
        result => {
          result.forEach(
            address => {
              this.addressOptions.push(new AddressOption(address, null));
            }
          );
          this.addressOptions.unshift(
            new AddressOption(undefined, this.defaultLabel(this.addressOptions.length))
          );
        }, (error) => {
          console.log(`An error occurred retrieving addresses for postcode ${postcode}. ` + error);
          this.addressOptions.unshift(
            new AddressOption(undefined, this.defaultLabel(this.addressOptions.length))
          );
        });
      this.addressList.setValue(undefined);
      this.refocusElement();
    }
  }

  refocusElement(): void {
    if (this.focusElementDirectives && this.focusElementDirectives.length > 0) {
      this.focusElementDirectives.first.focus();
    }
  }

  blankAddress() {
    this.caseField.value = new AddressModel();
    this.setFormValue();
  }

  isComplexWithHiddenFields() {
    if (this.caseField.isComplex() && this.caseField.field_type.complex_fields
      && this.caseField.field_type.complex_fields.some(cf => cf.hidden === true)) {
      return true;
    }
  }

  shouldShowDetailFields() {
    if (this.isComplexWithHiddenFields()) {
      return true;
    }
    if (this.isExpanded) {
      return true;
    }
    if (!this.writeComplexFieldComponent || !this.writeComplexFieldComponent.complexGroup) {
      return false;
    }
    const address = this.writeComplexFieldComponent.complexGroup.value;
    let hasAddress = false;
    if (address) {
      Object.keys(address).forEach(function (key) {
        if (address[key] != null) {
          hasAddress = true;
        }
      });
    }
    return hasAddress;
  }

  addressSelected() {
    this.caseField.value = this.addressList.value;
    this.setFormValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    let change = changes['caseField'];
    if (change) {
      this.setFormValue();
    }
  }

  createId(elementId: string): string {
    return this.id() + '_' + elementId;
  }

  private defaultLabel(numberOfAddresses) {
    return numberOfAddresses === 0 ? 'No address found'
      : numberOfAddresses + (numberOfAddresses === 1 ? ' address ' : ' addresses ') + 'found';
  }

  private setFormValue() {
    if (this.writeComplexFieldComponent.complexGroup) {
      this.writeComplexFieldComponent.complexGroup.setValue(
        this.caseField.value
      );
    }
  }
}
