import { Component, OnInit } from '@angular/core';
import { AbstractFieldReadComponent } from '../base-field/abstract-field-read.component';
import { SortOrder } from './sort-order'

@Component({
  selector: 'ccd-read-complex-field-collection-table',
  template: `
     <div class="complex-panel" [hidden]="caseField.hidden">
          <dl class="complex-panel-title"><dt><span class="text-16">{{caseField.label}}</span></dt><dd></dd></dl>
          <table class="complex-panel-table">
            <tbody>
            <!-- <COMPLEX table field header>-->
            <tr>
              <ng-container *ngFor="let heading of columns">
                <ng-container *ngFor="let name of columnsAllLabels | keyvalue:keepOriginalOrder">
                  <th *ngIf="heading.trim() == name.key">
                    <span class="text-16">{{name.value.label}}</span>
                    <a href="javascript:void(0)" (click)="sortRowsByColumns(name.key)"  class="sort-widget" [innerHTML]="sortWidget(name.value)"></a>
                  </th>
                </ng-container>
              </ng-container>
              <th></th>
            </tr>
            <!-- </COMPLEX table field header>-->
            <ng-container *ngFor="let item of rows; let i = index;trackBy:trackByIndex;" >
              <!-- <COMPLEX table collapsed view>-->
              <tr class="new-table-row accordion-heading" (click)="isHidden[i] = !isHidden[i]" [class.last-accordion]="lastAccordion && isHidden[i]">
                <ng-container *ngFor="let heading of columns">
                  <ng-container  *ngFor="let name of item | keyvalue">
                    <td *ngIf="heading.trim() == name.key" class="text-16">
                      <div *ngIf="name.value;else showEmptyTd">
                      <ccd-field-read [caseField]="{
                            id: name.key,
                            label: name.value.label,
                            field_type: columnsHorizontalLabel[heading.trim()].type,
                            value: name.value
                          }" [context]="context"></ccd-field-read>
                      </div>
                      <ng-template #showEmptyTd><div>&nbsp;</div></ng-template>
                    </td>

                  </ng-container>
                </ng-container>
                  <td>
                    <div style="float: right;">
                      <a href="javascript:void(0)"> <img src="{{ getImage(i) }}" class="accordion-image"/></a>
                    </div>
                   </td>
              </tr>
              <!-- </COMPLEX table collapsed view>-->
              <!-- <COMPLEX table expanded view>-->
              <tr [hidden]="isHidden[i]">
                <td [colSpan]="columns.length +1">
                  <table class="complex-panel-table">
                    <tbody>
                  
                    <ng-container *ngFor="let vLabel of columnsVerticalLabel | keyvalue:keepOriginalOrder">
                      <ng-container  *ngFor="let name of item | keyvalue">
                        <ng-container *ngIf="vLabel.key == name.key && isNotBlank(name.value)" >
                        <!-- <COMPLEX table expandable body simple field>-->

                        <tr class="complex-panel-simple-field accordion-body" [class.last-accordion]="lastAccordion"
                            ccdConditionalShow [caseField]="vLabel.value.caseField" [contextFields]="caseField | ccdFieldsFilter :true :i">
                          <th><span class="text-16">{{vLabel.value.label}}</span></th>
                          <td *ngIf="vLabel.value.type !== 'Complex'" class="text-16">
                            <ccd-field-read [caseField]="{
                                  id: name.key,
                                  label: vLabel.value.label,
                                   field_type:  vLabel.value.type,
                                  value: name.value
                                }" [context]="context"></ccd-field-read>
                          </td>
                        </tr>
                      
                        <!-- </COMPLEX table expandable body simple field>-->
                        <!-- <COMPLEX table expandable body complex field>-->

                        <tr *ngIf="vLabel.value.type === 'Complex' && addCaseFieldValue(vLabel.value.caseField, name.value)">
                          <td colspan="2">
                            <ng-container *ngFor="let field of vLabel.value.caseField | ccdFieldsFilter">
                              <ng-container *ngIf="(field | ccdIsCompound); else SimpleRow">
                                <tr class="complex-panel-compound-field" ccdConditionalShow ccdLabelSubstitutor [caseField]="field"
                                    [contextFields]="vLabel.value.caseField | ccdFieldsFilter">
                                  <td colspan="2">
                                    <span class="text-16"><ccd-field-read [caseField]="field" [context]="context"></ccd-field-read></span>
                                  </td>
                                </tr>
                              </ng-container>
                              <ng-template #SimpleRow>
                                <tr class="complex-panel-nested-field" ccdConditionalShow ccdLabelSubstitutor [caseField]="field"
                                    [contextFields]="vLabel.value.caseField  | ccdFieldsFilter">
                                  <th><span class="text-16">{{field.label}}</span></th>
                                  <td *ngIf="!name.value.hasOwnProperty('CaseReference')">
                                    <span class="text-16"><ccd-field-read [caseField]="field" [context]="context"></ccd-field-read></span>
                                  </td>
                                  <td *ngIf="name.value.hasOwnProperty('CaseReference')">
                                    <ccd-read-case-link-field [caseField]="addCaseReferenceValue(field, name.value.CaseReference)" [context]="context"></ccd-read-case-link-field>
                                  </td>
                                </tr>
                              </ng-template>
                            </ng-container>
                          </td>
                        </tr>
                        <!-- <COMPLEX table expandable body complex field>-->
                      </ng-container>
                      </ng-container>
                    </ng-container>
                    </tbody>
                  </table>
                </td>
              </tr>
              <!-- </COMPLEX table expanded view>-->
            </ng-container>
            </tbody>
          </table>
        </div>
  `,
  styles: [`
    .complex-panel{margin:13px 0px;border:1px solid #bfc1c3}.complex-panel .complex-panel-title{background-color:#dee0e2;padding:5px;border-bottom:1px solid #bfc1c3;font-weight:bold;display:block;color:#0b0c0c;padding-bottom:2px;font-family:"nta",Arial,sans-serif;font-weight:700;text-transform:none;font-size:16px;line-height:1.25}@media (min-width: 641px){.complex-panel .complex-panel-title{font-size:19px;line-height:1.31579}}.complex-panel .complex-panel-table>tbody>tr>th{vertical-align:top}.complex-panel .complex-panel-table>tbody>tr:last-child>th{border-bottom:none}.complex-panel .complex-panel-table th{padding-left:5px;font-weight:bold;border-bottom:none}.complex-panel .complex-panel-table td{padding-left:5px;padding-top:0;padding-bottom:0;border-bottom:none}.complex-panel .new-table-row{border-top:1px solid #bfc1c3}.complex-panel .complex-panel-simple-field th{padding-left:5px;padding-top:0px;padding-bottom:0px;width:295px}.complex-panel .complex-panel-nested-field th{padding-left:33px;padding-top:0px;padding-bottom:0px;width:200px}.complex-panel .complex-panel-compound-field td{padding:5px;border-bottom:none}.sort-widget{cursor:pointer;text-decoration:none;color:#0b0c0c}.accordion-wrapper{margin-bottom:20px}.accordion-wrapper .heading-medium{margin:0px}.accordion-wrapper .accordion-heading{border-top:1px solid #bfc1c3;padding-top:20px;padding-bottom:10px;height:20px;cursor:pointer}.accordion-wrapper .accordion-heading .accordion-image{width:25px;margin-right:20px}.accordion-wrapper .accordion-body{margin-top:20px;margin-right:20px}.accordion-wrapper .last-accordion{border-bottom:1px solid #bfc1c3;padding-bottom:30px}
  `]
})
export class ReadComplexFieldCollectionTableComponent extends AbstractFieldReadComponent implements OnInit {

  public columns: String[];
  public columnsVerticalLabel: any;
  public columnsHorizontalLabel: any;
  public columnsAllLabels: any;
  public rows: any[] = [];
  public isHidden: boolean[] = [];

  ngOnInit(): void {
    super.ngOnInit();
    console.log('this should be used somehow')
    if (this.caseField.display_context_parameter
      && this.caseField.display_context_parameter.trim().startsWith('#TABLE(')) {

      let displayContextParameter = this.caseField.display_context_parameter.trim();
      let result: string = displayContextParameter.replace('#TABLE(', '');
      this.columns = result.replace(')', '').split(',');

      let labelsVertical: { [k: string]: any } = {};
      let labelsHorizontal: { [k: string]: any } = {};
      let allLabels: { [k: string]: any } = {};
      this.populateCaseFieldValuesIntoRows();
      this.populateLabels(labelsVertical, allLabels);
      this.populateHorizontalLabels(labelsHorizontal, allLabels, labelsVertical);

      this.columnsVerticalLabel = labelsVertical;
      this.columnsHorizontalLabel = labelsHorizontal;
      this.columnsAllLabels = allLabels;

    }
  }

  private populateHorizontalLabels(labelsHorizontal: { [p: string]: any },
                                   allLabels: { [p: string]: any },
                                   labelsVertical: { [p: string]: any }) {
    for (let id of this.columns) {
      labelsHorizontal[id.trim()] = allLabels[id.trim()];
      labelsHorizontal[id.trim()].sortOrder = SortOrder.UNSORTED;
      delete labelsVertical[id.trim()];
    }
  }

  private populateLabels(labelsVertical: { [p: string]: any }, allLabels: { [p: string]: any }) {
    for (let obj of this.caseField.field_type.complex_fields) {
      if (obj.field_type.type === 'FixedList' ||
        obj.field_type.type === 'MultiSelectList' ||
        obj.field_type.type === 'FixedRadioList') {
        labelsVertical[obj.id] = {label: obj.label, type: obj.field_type, caseField: obj};
        allLabels[obj.id] = {label: obj.label, type: obj.field_type};
      } else if (obj.isComplex()) {
        labelsVertical[obj.id] = {label: obj.label, type: obj.field_type.type, caseField: obj};
        allLabels[obj.id] = {label: obj.label, type: obj.field_type.type, caseField: obj};
      } else {
        labelsVertical[obj.id] = {label: obj.label, type: {type: obj.field_type.type}, caseField: obj};
        allLabels[obj.id] = {label: obj.label, type: {type: obj.field_type.type}, caseField: obj};
      }
    }
  }

  private populateCaseFieldValuesIntoRows() {
    for (let obj of this.caseField.value) {
      this.rows.push(obj.value);
      this.isHidden.push(true);
    }
  }

  getImage(row) {
    if (this.isHidden[row]) {
      return 'img/accordion-plus.png';
    } else {
      if (this.isVerticleDataNotEmpty(row)) {
        return 'img/accordion-minus.png';
      } else {
        this.isHidden[row] = true;
        return 'img/accordion-plus.png';
      }
    }
  }

  /**
   * Needs to be called before 'ccdFieldsFilter' pipe is used, as it needs a caseField value.
   */
  addCaseFieldValue(field, value) {
    field.value = value;
    return true;
  }

  isNotBlank(value: string) {
    return value !== null && value !== '';
  }

  addCaseReferenceValue(field, value: any) {
    field.value = { CaseReference: value};
    return field;
  }

  private isVerticleDataNotEmpty(row) {
    let result = false
    for (let key in this.columnsVerticalLabel) {
      if (this.rows[row][key]) {
        result = true;
      }
    }
    return result;
  }

  keepOriginalOrder = (a, b) => a.key;

  sortRowsByColumns(column) {
    let shouldSortInAscendingOrder = this.columnsHorizontalLabel[column].sortOrder === SortOrder.UNSORTED
      || this.columnsHorizontalLabel[column].sortOrder === SortOrder.DESCENDING;

    switch (this.columnsHorizontalLabel[column].type.type) {
      case 'Number':
      case 'MoneyGBP': {
        if (shouldSortInAscendingOrder) {
          this.rows.sort((a, b) => a[column] - b[column]);
          this.columnsHorizontalLabel[column].sortOrder = SortOrder.ASCENDING;
        } else {
          this.rows.sort((a, b) => b[column] - a[column]);
          this.columnsHorizontalLabel[column].sortOrder = SortOrder.DESCENDING;
        }
        break;
      }
      case 'Text':
      case 'TextArea':
      case 'Email':
      case 'Date':
      case 'DateTime':
      case 'Label':
      case 'Postcode':
      case 'YesOrNo':
      case 'PhoneUK':
      case 'FixedList': {
        if (shouldSortInAscendingOrder) {
          this.rows.sort((a, b) => a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0);
          this.columnsHorizontalLabel[column].sortOrder = SortOrder.ASCENDING;
        } else {
          this.rows.sort((a, b) => a[column] < b[column] ? 1 : a[column] > b[column] ? -1 : 0);
          this.columnsHorizontalLabel[column].sortOrder = SortOrder.DESCENDING;
        }
      }
        break;
    }
  }

  private isSortAscending(column: any): boolean {
    return !(column.sortOrder === SortOrder.UNSORTED || column.sortOrder === SortOrder.DESCENDING);
  }

  sortWidget(column: any) {
    return this.isSortAscending(column) ? '&#9660;' : '&#9650;';
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
