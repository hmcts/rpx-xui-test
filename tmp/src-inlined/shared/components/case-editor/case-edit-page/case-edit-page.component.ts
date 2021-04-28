import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CaseEditComponent } from '../case-edit/case-edit.component';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CallbackErrorsContext } from '../../error/domain/error-context';
import { CaseEventTrigger } from '../../../domain/case-view/case-event-trigger.model';
import { HttpError } from '../../../domain/http/http-error.model';
import { FormValueService } from '../../../services/form/form-value.service';
import { PageValidationService } from '../services/page-validation.service';
import { SaveOrDiscardDialogComponent } from '../../dialogs/save-or-discard-dialog';
import { WizardPage } from '../domain/wizard-page.model';
import { FormErrorService } from '../../../services/form/form-error.service';
import { CaseEventData } from '../../../domain/case-event-data.model';
import { DRAFT_PREFIX } from '../../../domain/draft.model';
import { Wizard } from '../domain/wizard.model';
import { CaseField } from '../../../domain/definition';
import { FieldsUtils } from '../../../services/fields';

@Component({
  selector: 'ccd-case-edit-page',
  template: `
    <ng-container *ngIf="currentPage">
      <h1 *ngIf="!currentPage.label" class="govuk-heading-l">{{eventTrigger.name}}</h1>
      <ng-container *ngIf="currentPage.label">
        <span class="govuk-caption-l">{{ eventTrigger.name}}</span>
        <h1 class="govuk-heading-l">{{currentPage.label}}</h1>
      </ng-container>
    </ng-container>

    <!-- Case ID -->
    <h2 *ngIf="getCaseId()" class="heading-h2">
      #{{ getCaseId() | ccdCaseReference}}
    </h2>

    <!-- Generic error heading and error message to be displayed only if there are no specific callback errors or warnings, or no error details -->
    <div *ngIf="error && !(error.callbackErrors || error.callbackWarnings || error.details)" class="error-summary"
         role="group" aria-labelledby="edit-case-event_error-summary-heading" tabindex="-1">
      <h1 class="heading-h1 error-summary-heading" id="edit-case-event_error-summary-heading">
        Something went wrong
      </h1>
      <div class="govuk-error-summary__body" id="edit-case-event_error-summary-body">
        <p>We're working to fix the problem. Try again shortly.</p>
        <p><a href="get-help" target="_blank">Contact us</a> if you're still having problems.</p>
      </div>
    </div>
    <!-- Event error heading and error message to be displayed if there are specific error details -->
    <div *ngIf="error && error.details" class="error-summary" role="group"
         aria-labelledby="edit-case-event_error-summary-heading" tabindex="-1">
      <h3 class="heading-h3 error-summary-heading" id="edit-case-event_error-summary-heading-3">
        The event could not be created
      </h3>
      <p>{{error.message}}</p>
      <ul *ngIf="error.details?.field_errors" class="error-summary-list">
        <li *ngFor="let fieldError of error.details.field_errors" class="ccd-error-summary-li">{{fieldError.message}}</li>
      </ul>
    </div>
    <ccd-callback-errors
      [triggerTextContinue]="triggerTextStart"
      [triggerTextIgnore]="triggerTextIgnoreWarnings"
      [callbackErrorsSubject]="callbackErrorsSubject"
      (callbackErrorsContext)="callbackErrorsNotify($event)">
    </ccd-callback-errors>
    <div class="width-50">
      <form *ngIf="currentPage" class="form" [formGroup]="editForm" (submit)="submit()">
        <fieldset id="fieldset-case-data">
          <!-- single column -->
          <ccd-case-edit-form id='caseEditForm' *ngIf="!currentPage.isMultiColumn()" [fields]="currentPage.getCol1Fields()"
                              [formGroup]="editForm.controls['data']" [caseFields]="caseFields"
                              [pageChangeSubject]="pageChangeSubject"
                              (valuesChanged)="applyValuesChanged($event)"></ccd-case-edit-form>
          <!-- two columns -->
          <div *ngIf="currentPage.isMultiColumn()" class="grid-row">
            <div class="column-two-thirds rightBorderSeparator">
              <ccd-case-edit-form id='caseEditForm1' [fields]="currentPage.getCol1Fields()"
                                  [formGroup]="editForm.controls['data']" [caseFields]="caseFields"></ccd-case-edit-form>
            </div>
            <div class="column-one-third">
              <ccd-case-edit-form id='caseEditForm2' [fields]="currentPage.getCol2Fields()"
                                  [formGroup]="editForm.controls['data']" [caseFields]="caseFields"></ccd-case-edit-form>
            </div>
          </div>
        </fieldset>

        <div class="form-group form-group-related">
          <button class="button button-secondary" type="button" [disabled]="!(hasPreviousPage$ | async)" (click)="toPreviousPage()">
            Previous
          </button>
          <button class="button" type="submit" [disabled]="currentPageIsNotValid() || submitting()">{{triggerText}}</button>
        </div>

        <p class="cancel"><a (click)="cancel()" href="javascript:void(0)">{{getCancelText()}}</a></p>

      </form>
    </div>
  `,
  styles: [`
    .rightBorderSeparator{border-right-width:4px;border-right-color:#ffcc02;border-right-style:solid}
  `]
})
export class CaseEditPageComponent implements OnInit, AfterViewChecked {

  static readonly RESUMED_FORM_DISCARD = 'RESUMED_FORM_DISCARD';
  static readonly NEW_FORM_DISCARD = 'NEW_FORM_DISCARD';
  static readonly NEW_FORM_SAVE = 'NEW_FORM_CHANGED_SAVE';
  static readonly RESUMED_FORM_SAVE = 'RESUMED_FORM_SAVE';
  static readonly TRIGGER_TEXT_START = 'Continue';
  static readonly TRIGGER_TEXT_SAVE = 'Save and continue';
  static readonly TRIGGER_TEXT_CONTINUE = 'Ignore Warning and Continue';

  eventTrigger: CaseEventTrigger;
  editForm: FormGroup;
  wizard: Wizard;
  currentPage: WizardPage;
  dialogConfig: MatDialogConfig;
  error: HttpError;
  callbackErrorsSubject: Subject<any> = new Subject();
  ignoreWarning = false;
  triggerTextStart = CaseEditPageComponent.TRIGGER_TEXT_START;
  triggerTextIgnoreWarnings = CaseEditPageComponent.TRIGGER_TEXT_CONTINUE;
  triggerText: string;
  isSubmitting = false;
  formValuesChanged = false;
  pageChangeSubject: Subject<boolean> = new Subject();
  caseFields: CaseField[];

  hasPreviousPage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private static scrollToTop(): void {
    window.scrollTo(0, 0);
  }

  private static setFocusToTop() {
    const topContainer = document.getElementById('top');
    if (topContainer) {
      topContainer.focus();
    }
  }

  constructor(
    private caseEdit: CaseEditComponent,
    private route: ActivatedRoute,
    private formValueService: FormValueService,
    private formErrorService: FormErrorService,
    private cdRef: ChangeDetectorRef,
    private pageValidationService: PageValidationService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.initDialog();
    this.eventTrigger = this.caseEdit.eventTrigger;
    this.editForm = this.caseEdit.form;
    this.wizard = this.caseEdit.wizard;
    this.caseFields = this.getCaseFields();
    this.triggerText = this.getTriggerText();

    this.route.params
      .subscribe(params => {
        let pageId = params['page'];
        if (!this.currentPage || pageId !== this.currentPage.id) {
          let page = this.caseEdit.getPage(pageId);
          if (page) {
            this.currentPage = page;
          } else {
            if (this.currentPage) {
              return this.next();
            } else {
              return this.first();
            }
          }
          this.hasPreviousPage$.next(this.caseEdit.hasPrevious(this.currentPage.id))
        }
      });
    CaseEditPageComponent.setFocusToTop();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  applyValuesChanged(valuesChanged: boolean): void {
    this.formValuesChanged = valuesChanged;
  }

  first(): Promise<boolean> {
    return this.caseEdit.first();
  }

  currentPageIsNotValid(): boolean {
    return !this.pageValidationService.isPageValid(this.currentPage, this.editForm);
  }

  /**
   * caseEventData.event_data contains all the values from the previous pages so we set caseEventData.data = caseEventData.event_data
   * This builds the form with data from the previous pages
   * EUI-3732 - Breathing space data not persisted on Previous button click with ExpUI Demo
   */
  toPreviousPage() {
    let caseEventData: CaseEventData = this.buildCaseEventData();
    caseEventData.data = caseEventData.event_data;
    this.updateFormData(caseEventData);
    this.previous();
    CaseEditPageComponent.setFocusToTop();
  }

  submit() {
    if (!this.isSubmitting) {
      this.isSubmitting = true;
      this.error = null;
      let caseEventData: CaseEventData = this.buildCaseEventData();
      this.caseEdit.validate(caseEventData, this.currentPage.id)
        .subscribe((jsonData) => {
          if (jsonData) {
            this.updateFormData(jsonData as CaseEventData);
          }
          this.saveDraft();
          this.next();
        }, error => this.handleError(error));
      CaseEditPageComponent.scrollToTop();
    }
    CaseEditPageComponent.setFocusToTop();
  }

  updateFormData(jsonData: CaseEventData): void {
    for (const caseFieldId of Object.keys(jsonData.data)) {
      if (this.pageWithFieldExists(caseFieldId)) {
        this.updateEventTriggerCaseFields(caseFieldId, jsonData, this.caseEdit.eventTrigger);
        this.updateFormControlsValue(this.editForm, caseFieldId, jsonData.data[caseFieldId]);
      }
    }
  }

  // we do the check, becasue the data comes from the external source
  pageWithFieldExists(caseFieldId) {
    return this.wizard.findWizardPage(caseFieldId);
  }

  updateEventTriggerCaseFields(caseFieldId: string, jsonData: CaseEventData, eventTrigger: CaseEventTrigger) {
    if (eventTrigger.case_fields) {
      eventTrigger.case_fields
        .filter(element => element.id === caseFieldId)
        .forEach(element => element.value = jsonData.data[caseFieldId]);
    }
  }

  updateFormControlsValue(formGroup: FormGroup, caseFieldId: string, value: any): void {
    let theControl = formGroup.controls['data'].get(caseFieldId);
    if (theControl) {
      theControl.patchValue(value);
    }
  }

  callbackErrorsNotify(errorContext: CallbackErrorsContext) {
    this.ignoreWarning = errorContext.ignore_warning;
    this.triggerText = errorContext.trigger_text;
  }

  next(): Promise<boolean> {
    this.resetErrors();
    this.isSubmitting = false;
    this.formValuesChanged = false;
    this.pageChangeSubject.next(true);
    return this.caseEdit.next(this.currentPage.id);
  }

  previous(): Promise<boolean> {
    this.resetErrors();
    this.saveDraft();
    this.formValuesChanged = false;
    this.pageChangeSubject.next(true);
    return this.caseEdit.previous(this.currentPage.id);
  }

  hasPrevious(): boolean {
    return this.caseEdit.hasPrevious(this.currentPage.id);
  }

  cancel(): void {
    if (this.eventTrigger.can_save_draft) {
      if (this.formValuesChanged) {
        const dialogRef = this.dialog.open(SaveOrDiscardDialogComponent, this.dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'Discard') {
            this.discard();
          } else if (result === 'Save') {
            const draftCaseEventData: CaseEventData = this.formValueService.sanitise(this.editForm.value) as CaseEventData;
            if (this.route.snapshot.queryParamMap.get(CaseEditComponent.ORIGIN_QUERY_PARAM) === 'viewDraft') {
              this.caseEdit.cancelled.emit({status: CaseEditPageComponent.RESUMED_FORM_SAVE, data: draftCaseEventData});
            } else {
              this.caseEdit.cancelled.emit({status: CaseEditPageComponent.NEW_FORM_SAVE, data: draftCaseEventData});
            }
          }
        });
      } else {
        this.discard();
      }
    } else {
      this.caseEdit.cancelled.emit();
    }
  }

  submitting(): boolean {
    return this.isSubmitting;
  }

  getCaseId(): string {
    return (this.caseEdit.caseDetails ? this.caseEdit.caseDetails.case_id : '');
  }

  getCancelText(): string {
    return this.eventTrigger.can_save_draft ? 'Return to case list' : 'Cancel';
  }

  getTriggerText(): string {
    return this.eventTrigger && this.eventTrigger.can_save_draft
      ? CaseEditPageComponent.TRIGGER_TEXT_SAVE
      : CaseEditPageComponent.TRIGGER_TEXT_START
  }

  private initDialog() {
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.ariaLabel = 'Label';
    this.dialogConfig.height = '245px';
    this.dialogConfig.width = '550px';
    this.dialogConfig.panelClass = 'dialog';

    this.dialogConfig.closeOnNavigation = false;
    this.dialogConfig.position = {
      top: window.innerHeight / 2 - 120 + 'px', left: window.innerWidth / 2 - 275 + 'px'
    }
  }

  private discard(): void {
    if (this.route.snapshot.queryParamMap.get(CaseEditComponent.ORIGIN_QUERY_PARAM) === 'viewDraft') {
      this.caseEdit.cancelled.emit({status: CaseEditPageComponent.RESUMED_FORM_DISCARD});
    } else {
      this.caseEdit.cancelled.emit({status: CaseEditPageComponent.NEW_FORM_DISCARD});
    }
  }

  private handleError(error) {
    this.isSubmitting = false;
    this.error = error;
    this.callbackErrorsSubject.next(this.error);
    if (this.error.details) {
      this.formErrorService
        .mapFieldErrors(this.error.details.field_errors, this.editForm.controls['data'] as FormGroup, 'validation');
    }
  }

  private resetErrors(): void {
    this.error = null;
    this.ignoreWarning = false;
    this.triggerText = this.getTriggerText();
    this.callbackErrorsSubject.next(null);
  }

  private saveDraft() {
    if (this.eventTrigger.can_save_draft) {
      let draftCaseEventData: CaseEventData = this.formValueService.sanitise(this.editForm.value) as CaseEventData;
      draftCaseEventData.event_token = this.eventTrigger.event_token;
      draftCaseEventData.ignore_warning = this.ignoreWarning;
      this.caseEdit.saveDraft(draftCaseEventData).subscribe(
        (draft) => this.eventTrigger.case_id = DRAFT_PREFIX + draft.id, error => this.handleError(error)
      );
    }
  }

  private getCaseFields(): CaseField[] {
    if (this.caseEdit.caseDetails) {
      return FieldsUtils.getCaseFields(this.caseEdit.caseDetails);
    }

    return this.eventTrigger.case_fields;
  }

  private getCaseFieldsFromCurrentAndPreviousPages(): CaseField[] {
    const result: CaseField[] = [];
    this.wizard.pages.forEach(page => {
      if (page.order <= this.currentPage.order) {
        page.case_fields.forEach(field => result.push(field));
      }
    });
    return result;
  }

  private buildCaseEventData(): CaseEventData {
    const formValue: object = this.editForm.value;

    // Get the CaseEventData for the current page.
    const pageFields: CaseField[] = this.currentPage.case_fields;
    const pageEventData: CaseEventData = this.getFilteredCaseEventData(pageFields, formValue, true);

    // Get the CaseEventData for the entire form (all pages).
    const allCaseFields = this.getCaseFieldsFromCurrentAndPreviousPages();
    const formEventData: CaseEventData = this.getFilteredCaseEventData(allCaseFields, formValue, false, true);

    // Now here's the key thing - the pageEventData has a property called `event_data` and
    // we need THAT to be the value of the entire form: `formEventData.data`.
    pageEventData.event_data = formEventData.data;

    // Finalise the CaseEventData object.
    pageEventData.event_token = this.eventTrigger.event_token;
    pageEventData.ignore_warning = this.ignoreWarning;

    // Finally, try to set up the case_reference.
    if (this.caseEdit.caseDetails) {
      pageEventData.case_reference = this.caseEdit.caseDetails.case_id;
    }

    // Return the now hopefully sane CaseEventData.
    return pageEventData;
  }

  /**
   * Abstracted this method from buildCaseEventData to remove duplication.
   * @param caseFields The fields to filter the data by.
   * @param formValue The original value of the form.
   * @param clearEmpty Whether or not to clear out empty values.
   * @param clearNonCase Whether or not to clear out fields that are not part of the case.
   * @returns CaseEventData for the specified parameters.
   */
  private getFilteredCaseEventData(caseFields: CaseField[], formValue: object, clearEmpty = false, clearNonCase = false): CaseEventData {
    // Get the data for the fields specified.
    const formFields = this.formValueService.filterCurrentPageFields(caseFields, formValue);

    // Sort out the dynamic lists.
    this.formValueService.sanitiseDynamicLists(caseFields, formFields);

    // Get hold of the CaseEventData.
    const caseEventData: CaseEventData = this.formValueService.sanitise(formFields) as CaseEventData;

    // Tidy it up before we return it.
    this.formValueService.removeUnnecessaryFields(caseEventData.data, caseFields, clearEmpty, clearNonCase);

    return caseEventData;
  }
}
