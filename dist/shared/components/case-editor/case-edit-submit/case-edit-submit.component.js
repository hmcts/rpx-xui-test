"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var rxjs_1 = require("rxjs");
var services_1 = require("../../../services");
var error_1 = require("../../error");
var palette_1 = require("../../palette");
var case_edit_page_component_1 = require("../case-edit-page/case-edit-page.component");
var case_edit_component_1 = require("../case-edit/case-edit.component");
var domain_1 = require("../domain");
// @dynamic
var CaseEditSubmitComponent = /** @class */ (function () {
    function CaseEditSubmitComponent(caseEdit, formValueService, formErrorService, fieldsUtils, caseFieldService, route, orderService, profileService, profileNotifier) {
        this.caseEdit = caseEdit;
        this.formValueService = formValueService;
        this.formErrorService = formErrorService;
        this.fieldsUtils = fieldsUtils;
        this.caseFieldService = caseFieldService;
        this.route = route;
        this.orderService = orderService;
        this.profileService = profileService;
        this.profileNotifier = profileNotifier;
        this.callbackErrorsSubject = new rxjs_1.Subject();
        this.ignoreWarning = false;
        this.paletteContext = palette_1.PaletteContext.CHECK_YOUR_ANSWER;
    }
    CaseEditSubmitComponent_1 = CaseEditSubmitComponent;
    Object.defineProperty(CaseEditSubmitComponent.prototype, "isDisabled", {
        get: function () {
            // EUI-3452.
            // We don't need to check the validity of the editForm as it is readonly.
            // This was causing issues with hidden fields that aren't wanted but have
            // not been disabled.
            return this.isSubmitting || this.hasErrors;
        },
        enumerable: true,
        configurable: true
    });
    CaseEditSubmitComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.profileSubscription = this.profileNotifier.profile.subscribe(function (_) { return _this.profile = _; });
        this.eventTrigger = this.caseEdit.eventTrigger;
        this.triggerText = this.eventTrigger.end_button_label || error_1.CallbackErrorsComponent.TRIGGER_TEXT_SUBMIT;
        this.editForm = this.caseEdit.form;
        this.wizard = this.caseEdit.wizard;
        this.announceProfile(this.route);
        this.showSummaryFields = this.sortFieldsByShowSummaryContent(this.eventTrigger.case_fields);
        this.isSubmitting = false;
    };
    CaseEditSubmitComponent.prototype.ngOnDestroy = function () {
        this.profileSubscription.unsubscribe();
    };
    CaseEditSubmitComponent.prototype.submit = function () {
        var _this = this;
        this.isSubmitting = true;
        var caseEventData = this.formValueService.sanitise(this.editForm.value);
        this.formValueService.clearNonCaseFields(caseEventData.data, this.eventTrigger.case_fields);
        this.formValueService.removeNullLabels(caseEventData.data, this.eventTrigger.case_fields);
        this.formValueService.removeEmptyDocuments(caseEventData.data, this.eventTrigger.case_fields);
        caseEventData.event_token = this.eventTrigger.event_token;
        caseEventData.ignore_warning = this.ignoreWarning;
        this.caseEdit.submit(caseEventData)
            .subscribe(function (response) {
            var confirmation = _this.buildConfirmation(response);
            if (confirmation && (confirmation.getHeader() || confirmation.getBody())) {
                _this.caseEdit.confirm(confirmation);
            }
            else {
                _this.caseEdit.submitted.emit({ caseId: response['id'], status: _this.getStatus(response) });
            }
        }, function (error) {
            _this.error = error;
            _this.callbackErrorsSubject.next(_this.error);
            if (_this.error.details) {
                _this.formErrorService
                    .mapFieldErrors(_this.error.details.field_errors, _this.editForm.controls['data'], 'validation');
            }
            _this.isSubmitting = false;
        });
    };
    CaseEditSubmitComponent.prototype.getStatus = function (response) {
        return this.hasCallbackFailed(response) ? response['callback_response_status'] : response['delete_draft_response_status'];
    };
    CaseEditSubmitComponent.prototype.hasCallbackFailed = function (response) {
        return response['callback_response_status'] !== 'CALLBACK_COMPLETED';
    };
    Object.defineProperty(CaseEditSubmitComponent.prototype, "hasErrors", {
        get: function () {
            return this.error
                && this.error.callbackErrors
                && this.error.callbackErrors.length;
        },
        enumerable: true,
        configurable: true
    });
    CaseEditSubmitComponent.prototype.navigateToPage = function (pageId) {
        this.caseEdit.navigateToPage(pageId);
    };
    CaseEditSubmitComponent.prototype.callbackErrorsNotify = function (errorContext) {
        this.ignoreWarning = errorContext.ignore_warning;
        this.triggerText = errorContext.trigger_text;
    };
    CaseEditSubmitComponent.prototype.summaryCaseField = function (field) {
        if (null == this.editForm.get('data').get(field.id)) {
            // If not in form, return field itself
            return field;
        }
        var cloneField = this.fieldsUtils.cloneCaseField(field);
        cloneField.value = this.editForm.get('data').get(field.id).value;
        return cloneField;
    };
    CaseEditSubmitComponent.prototype.cancel = function () {
        if (this.eventTrigger.can_save_draft) {
            if (this.route.snapshot.queryParamMap.get(case_edit_component_1.CaseEditComponent.ORIGIN_QUERY_PARAM) === 'viewDraft') {
                this.caseEdit.cancelled.emit({ status: case_edit_page_component_1.CaseEditPageComponent.RESUMED_FORM_DISCARD });
            }
            else {
                this.caseEdit.cancelled.emit({ status: case_edit_page_component_1.CaseEditPageComponent.NEW_FORM_DISCARD });
            }
        }
        else {
            this.caseEdit.cancelled.emit();
        }
    };
    CaseEditSubmitComponent.prototype.isLabel = function (field) {
        return this.caseFieldService.isLabel(field);
    };
    CaseEditSubmitComponent.prototype.isChangeAllowed = function (field) {
        return !this.caseFieldService.isReadOnly(field);
    };
    CaseEditSubmitComponent.prototype.checkYourAnswerFieldsToDisplayExists = function () {
        if (!this.eventTrigger.show_summary) {
            return false;
        }
        for (var _i = 0, _a = this.wizard.pages; _i < _a.length; _i++) {
            var page = _a[_i];
            if (this.isShown(page)) {
                for (var _b = 0, _c = page.case_fields; _b < _c.length; _b++) {
                    var field = _c[_b];
                    if (this.canShowFieldInCYA(field)) {
                        // at least one field needs showing
                        return true;
                    }
                }
            }
        }
        // found no fields to show in CYA summary page
        return false;
    };
    CaseEditSubmitComponent.prototype.readOnlySummaryFieldsToDisplayExists = function () {
        return this.eventTrigger.case_fields.some(function (field) { return field.show_summary_content_option >= 0; });
    };
    CaseEditSubmitComponent.prototype.showEventNotes = function () {
        return this.eventTrigger.show_event_notes !== false;
    };
    CaseEditSubmitComponent.prototype.getLastPageShown = function () {
        var _this = this;
        var lastPage;
        this.wizard.reverse().forEach(function (page) {
            if (!lastPage && _this.isShown(page)) {
                lastPage = page;
            }
        });
        // noinspection JSUnusedAssignment
        return lastPage;
    };
    CaseEditSubmitComponent.prototype.previous = function () {
        if (this.hasPrevious()) {
            this.navigateToPage(this.getLastPageShown().id);
        }
    };
    CaseEditSubmitComponent.prototype.hasPrevious = function () {
        return !!this.getLastPageShown();
    };
    CaseEditSubmitComponent.prototype.isShown = function (page) {
        var fields = this.fieldsUtils
            .mergeCaseFieldsAndFormFields(this.eventTrigger.case_fields, this.editForm.controls['data'].value);
        return page.parsedShowCondition.match(fields);
    };
    CaseEditSubmitComponent.prototype.canShowFieldInCYA = function (field) {
        return field.show_summary_change_option;
    };
    CaseEditSubmitComponent.prototype.isSolicitor = function () {
        return this.profile.isSolicitor();
    };
    CaseEditSubmitComponent.prototype.announceProfile = function (route) {
        var _this = this;
        route.snapshot.pathFromRoot[1].data.profile ?
            this.profileNotifier.announceProfile(route.snapshot.pathFromRoot[1].data.profile)
            : this.profileService.get().subscribe(function (_) { return _this.profileNotifier.announceProfile(_); });
    };
    CaseEditSubmitComponent.prototype.buildConfirmation = function (response) {
        if (response['after_submit_callback_response']) {
            return new domain_1.Confirmation(response['id'], response['callback_response_status'], response['after_submit_callback_response']['confirmation_header'], response['after_submit_callback_response']['confirmation_body']);
        }
        else {
            return null;
        }
    };
    CaseEditSubmitComponent.prototype.sortFieldsByShowSummaryContent = function (fields) {
        return this.orderService
            .sort(fields, CaseEditSubmitComponent_1.SHOW_SUMMARY_CONTENT_COMPARE_FUNCTION)
            .filter(function (cf) { return cf.show_summary_content_option; });
    };
    CaseEditSubmitComponent.prototype.getCaseId = function () {
        return (this.caseEdit.caseDetails ? this.caseEdit.caseDetails.case_id : '');
    };
    CaseEditSubmitComponent.prototype.getCancelText = function () {
        if (this.eventTrigger.can_save_draft) {
            return 'Return to case list';
        }
        else {
            return 'Cancel';
        }
    };
    var CaseEditSubmitComponent_1;
    CaseEditSubmitComponent.SHOW_SUMMARY_CONTENT_COMPARE_FUNCTION = function (a, b) {
        var aCaseField = a.show_summary_content_option === 0 || a.show_summary_content_option;
        var bCaseField = b.show_summary_content_option === 0 || b.show_summary_content_option;
        if (!aCaseField) {
            return !bCaseField ? 0 : 1;
        }
        if (!bCaseField) {
            return -1;
        }
        return a.show_summary_content_option - b.show_summary_content_option;
    };
    CaseEditSubmitComponent = CaseEditSubmitComponent_1 = __decorate([
        core_1.Component({
            selector: 'ccd-case-edit-submit',
            template: "\n    <!-- Event trigger name -->\n    <h1 class=\"govuk-heading-l\">{{ eventTrigger.name}}</h1>\n\n    <!-- Case ID -->\n    <h2 *ngIf=\"getCaseId()\" class=\"heading-h2\">\n      #{{ getCaseId() | ccdCaseReference}}\n    </h2>\n\n    <!-- Generic error heading and error message to be displayed only if there are no specific callback errors or warnings, or no error details -->\n    <div *ngIf=\"error && !(error.callbackErrors || error.callbackWarnings || error.details)\" class=\"error-summary\" role=\"group\" aria-labelledby=\"edit-case-event_error-summary-heading\" tabindex=\"-1\">\n      <h1 class=\"heading-h1 error-summary-heading\" id=\"edit-case-event_error-summary-heading\">\n        Something went wrong\n      </h1>\n      <div class=\"govuk-error-summary__body\" id=\"edit-case-event_error-summary-body\">\n        <p>We're working to fix the problem. Try again shortly.</p>\n        <p><a href=\"get-help\" target=\"_blank\">Contact us</a> if you're still having problems.</p>\n      </div>\n    </div>\n    <!-- Event error heading and error message to be displayed if there are specific error details -->\n    <div *ngIf=\"error && error.details\" class=\"error-summary\" role=\"group\" aria-labelledby=\"edit-case-event_error-summary-heading\" tabindex=\"-1\">\n      <h3 class=\"heading-h3 error-summary-heading\" id=\"edit-case-event_error-summary-heading\">\n        The event could not be created\n      </h3>\n      <p>{{error.message}}</p>\n      <ul *ngIf=\"error.details?.field_errors\" class=\"error-summary-list\">\n        <li *ngFor=\"let fieldError of error.details.field_errors\" class=\"ccd-error-summary-li\">{{fieldError.message}}</li>\n      </ul>\n    </div>\n    <ccd-callback-errors [callbackErrorsSubject]=\"callbackErrorsSubject\"\n                         (callbackErrorsContext)=\"callbackErrorsNotify($event)\"></ccd-callback-errors>\n\n    <form class=\"check-your-answers\" [formGroup]=\"editForm\" (submit)=\"submit()\">\n      <ng-container *ngIf=\"checkYourAnswerFieldsToDisplayExists()\">\n\n        <h2 class=\"heading-h2\">Check your answers</h2>\n        <span class=\"text-16\">Check the information below carefully.</span>\n\n        <table class=\"form-table\">\n          <tbody>\n          <ng-container *ngFor=\"let page of this.wizard.pages\">\n            <ng-container *ngIf=\"isShown(page)\">\n              <ng-container *ngFor=\"let field of page | ccdPageFields:editForm.controls['data'] | ccdReadFieldsFilter: false :undefined :true :editForm.controls['data']\">\n                <ng-container *ngIf=\"canShowFieldInCYA(field)\">\n                  <tr ccdLabelSubstitutor [caseField]=\"field\" [hidden]=\"field.hidden\"\n                      [formGroup]=\"editForm.controls['data']\" [contextFields]=\"eventTrigger.case_fields\">\n                    <th *ngIf=\"!isLabel(field)\" class=\"valign-top case-field-label\"><span class=\"text-16\">{{field.label}}</span></th>\n                    <td class=\"form-cell case-field-content\" [attr.colspan]=\"isLabel(field) ? '2' : '1'\">\n                      <ccd-field-read\n                        [formGroup]=\"editForm.controls['data']\" [topLevelFormGroup]=\"editForm.controls['data']\"\n                        [caseField]=\"summaryCaseField(field)\" [context]=\"paletteContext\"></ccd-field-read>\n                    </td>\n                    <td class=\"valign-top check-your-answers__change case-field-change\">\n                      <a *ngIf=\"isChangeAllowed(field)\" (click)=\"navigateToPage(page.id)\"\n                         href=\"javascript:void(0)\"><span class=\"text-16\">Change</span></a>\n                    </td>\n                  </tr>\n                </ng-container>\n              </ng-container>\n            </ng-container>\n          </ng-container>\n          </tbody>\n        </table>\n      </ng-container>\n      <ng-container *ngIf=\"readOnlySummaryFieldsToDisplayExists()\">\n\n        <table class=\"summary-fields\">\n          <tbody>\n            <ng-container *ngFor=\"let field of this.showSummaryFields\">\n                <ng-container [ngSwitch]=\"!(field | ccdIsCompound)\">\n                  <tr *ngSwitchCase=\"true\" ccdLabelSubstitutor [caseField]=\"field\" [formGroup]=\"editForm.controls['data']\" [contextFields]=\"eventTrigger.case_fields\">\n                    <th>{{field.label}}</th>\n                    <td class=\"form-cell\">\n                      <ccd-field-read [formGroup]=\"editForm.controls['data']\" [caseField]=\"summaryCaseField(field)\"></ccd-field-read>\n                    </td>\n                  </tr>\n                  <tr *ngSwitchCase=\"false\" class=\"compound-field\" ccdLabelSubstitutor [caseField]=\"field\"\n                      [formGroup]=\"editForm.controls['data']\"\n                      [contextFields]=\"eventTrigger.case_fields\">\n                    <td colspan=\"2\">\n                      <ccd-field-read [formGroup]=\"editForm.controls['data']\" [caseField]=\"summaryCaseField(field)\"></ccd-field-read>\n                    </td>\n                  </tr>\n                </ng-container>\n              </ng-container>\n          </tbody>\n        </table>\n      </ng-container>\n      <ng-container *ngIf=\"showEventNotes()\">\n        <fieldset id=\"fieldset-event\" formGroupName=\"event\" *ngIf=\"profile && !isSolicitor()\">\n          <div class=\"form-group\">\n            <label for=\"field-trigger-summary\" class=\"form-label\">\n              Event summary (optional)\n              <span class=\"form-hint\">A few words describing the purpose of the event.</span>\n            </label>\n            <input type=\"text\" id=\"field-trigger-summary\" class=\"form-control bottom-30 width-50\" formControlName=\"summary\" maxlength=\"1024\">\n          </div>\n          <div class=\"form-group\">\n            <label for=\"field-trigger-description\" class=\"form-label\">Event description (optional)</label>\n            <textarea id=\"field-trigger-description\" class=\"form-control bottom-30 width-50\" formControlName=\"description\"\n                      maxlength=\"65536\"></textarea>\n          </div>\n        </fieldset>\n      </ng-container>\n      <div class=\"form-group form-group-related\">\n        <button class=\"button button-secondary\" type=\"button\" [disabled]=\"!hasPrevious() || isSubmitting\" (click)=\"previous()\">Previous</button>\n        <button type=\"submit\" [disabled]=\"isDisabled\" class=\"button\">{{triggerText}}</button>\n      </div>\n      <p class=\"cancel\"><a (click)=\"cancel()\" href=\"javascript:void(0)\" [class.disabled]=\"isSubmitting\">{{getCancelText()}}</a></p>\n    </form>\n  ",
            styles: ["\n    #fieldset-case-data{margin-bottom:30px}#fieldset-case-data th{width:1%;white-space:nowrap;vertical-align:top}.compound-field td{padding:0}#confirmation-header{width:630px;background-color:#17958b;border:solid 1px #979797;color:#ffffff;text-align:center}#confirmation-body{width:630px;background-color:#ffffff}.valign-top{vertical-align:top}.summary-fields{margin-bottom:30px}.summary-fields tbody tr th,.summary-fields tbody tr td{border-bottom:0px}a.disabled{pointer-events:none;cursor:default}.case-field-label{width:45%}.case-field-content{width:50%}.case-field-change{width:5%}\n  "]
        }),
        __metadata("design:paramtypes", [case_edit_component_1.CaseEditComponent,
            services_1.FormValueService,
            services_1.FormErrorService,
            services_1.FieldsUtils,
            services_1.CaseFieldService,
            router_1.ActivatedRoute,
            services_1.OrderService,
            services_1.ProfileService,
            services_1.ProfileNotifier])
    ], CaseEditSubmitComponent);
    return CaseEditSubmitComponent;
}());
exports.CaseEditSubmitComponent = CaseEditSubmitComponent;
//# sourceMappingURL=case-edit-submit.component.js.map