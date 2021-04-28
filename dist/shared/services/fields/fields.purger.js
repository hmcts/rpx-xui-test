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
var fields_utils_1 = require("./fields.utils");
var conditional_show_model_1 = require("../../directives/conditional-show/domain/conditional-show.model");
// @dynamic
var FieldsPurger = /** @class */ (function () {
    function FieldsPurger(fieldsUtils) {
        this.fieldsUtils = fieldsUtils;
    }
    FieldsPurger.prototype.clearHiddenFields = function (form, wizard, eventTrigger, currentPageId) {
        this.clearHiddenFieldForFieldShowCondition(currentPageId, form, wizard, eventTrigger);
        this.clearHiddenFieldForPageShowCondition(form, wizard, eventTrigger);
    };
    FieldsPurger.prototype.clearHiddenFieldForPageShowCondition = function (form, wizard, eventTrigger) {
        var _this = this;
        var currentEventState = this.fieldsUtils.getCurrentEventState(eventTrigger, form);
        wizard.pages.forEach(function (wp) {
            if (_this.hasShowConditionPage(wp, currentEventState)) {
                var condition = new conditional_show_model_1.ShowCondition(wp.show_condition);
                if (_this.isHidden(condition, currentEventState)) {
                    _this.resetPage(form, wp);
                }
            }
        });
    };
    FieldsPurger.prototype.clearHiddenFieldForFieldShowCondition = function (currentPageId, form, wizard, eventTrigger) {
        var _this = this;
        var formFields = form.getRawValue();
        var currentPage = wizard.getPage(currentPageId, this.fieldsUtils.buildCanShowPredicate(eventTrigger, form));
        currentPage.wizard_page_fields.forEach(function (wpf) {
            var case_field = _this.findCaseFieldByWizardPageFieldId(currentPage, wpf);
            if (_this.hasShowConditionField(case_field, formFields)) {
                var condition = new conditional_show_model_1.ShowCondition(case_field.show_condition);
                if (_this.isHidden(condition, formFields.data) && !(_this.isReadonly(case_field))) {
                    _this.resetField(form, case_field);
                }
            }
            _this.retainHiddenValueByFieldType(case_field, form);
        });
    };
    FieldsPurger.prototype.retainHiddenValueByFieldType = function (field, form) {
        // so far only applies to the new field type OrganisationPolicy which needs to retain the default case role value
        // for other case fields there should be no side effects
        if (field && field.field_type && field.field_type.id === 'OrganisationPolicy') {
            // <bubble_wrap>
            // Doing some null checking to stop it from falling over.
            var data = form.get('data');
            if (data) {
                var fieldGroup = data.get(field.id);
                if (fieldGroup) {
                    var caseRoleFormControl = fieldGroup.get('OrgPolicyCaseAssignedRole');
                    if (caseRoleFormControl) {
                        caseRoleFormControl.enable();
                    }
                }
            }
            // </bubble_wrap>
        }
    };
    FieldsPurger.prototype.isHidden = function (condition, formFields) {
        return !condition.match(formFields);
    };
    FieldsPurger.prototype.findCaseFieldByWizardPageFieldId = function (currentPage, wizardPageField) {
        return currentPage.case_fields.find(function (cf) { return cf.id === wizardPageField.case_field_id; });
    };
    FieldsPurger.prototype.hasShowConditionPage = function (wizardPage, formFields) {
        return wizardPage.show_condition && formFields[this.getShowConditionKey(wizardPage.show_condition)];
    };
    FieldsPurger.prototype.hasShowConditionField = function (case_field, formFields) {
        return case_field.show_condition && formFields.data[this.getShowConditionKey(case_field.show_condition)];
    };
    FieldsPurger.prototype.getShowConditionKey = function (show_condition) {
        return show_condition.split('=')[0];
    };
    FieldsPurger.prototype.resetField = function (form, field) {
        if (Array.isArray(field.value)) {
            field.value.splice(0, field.value.length);
        }
        else if (this.isObject(field.value)) {
            if (field.formatted_value) {
                field.value = field.formatted_value;
            }
            else {
                field.value = {};
            }
        }
        else {
            field.value = '';
        }
        form.get('data').removeControl(field.id);
    };
    FieldsPurger.prototype.resetPage = function (form, wizardPage) {
        var _this = this;
        wizardPage.wizard_page_fields.forEach(function (wpf) {
            var case_field = _this.findCaseFieldByWizardPageFieldId(wizardPage, wpf);
            _this.resetField(form, case_field);
        });
    };
    FieldsPurger.prototype.getType = function (elem) {
        return Object.prototype.toString.call(elem).slice(8, -1);
    };
    FieldsPurger.prototype.isObject = function (elem) {
        return this.getType(elem) === 'Object';
    };
    ;
    // TODO: call isReadOnly on CaseFields once we make it available
    FieldsPurger.prototype.isReadonly = function (case_field) {
        return case_field.display_context.toUpperCase() === 'READONLY';
    };
    FieldsPurger = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [fields_utils_1.FieldsUtils])
    ], FieldsPurger);
    return FieldsPurger;
}());
exports.FieldsPurger = FieldsPurger;
//# sourceMappingURL=fields.purger.js.map