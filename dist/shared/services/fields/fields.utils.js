"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var definition_1 = require("../../domain/definition");
var common_1 = require("@angular/common");
var utils_1 = require("../../components/palette/utils");
var class_transformer_1 = require("class-transformer");
var format_translator_service_1 = require("../case-fields/format-translator.service");
var forms_1 = require("@angular/forms");
// @dynamic
var FieldsUtils = /** @class */ (function () {
    function FieldsUtils() {
    }
    FieldsUtils_1 = FieldsUtils;
    FieldsUtils.convertToCaseField = function (obj) {
        if (!(obj instanceof definition_1.CaseField)) {
            return class_transformer_1.plainToClassFromExist(new definition_1.CaseField(), obj);
        }
        return obj;
    };
    FieldsUtils.toValuesMap = function (caseFields) {
        var valueMap = {};
        caseFields.forEach(function (field) {
            valueMap[field.id] = FieldsUtils_1.prepareValue(field);
        });
        return valueMap;
    };
    FieldsUtils.getType = function (elem) {
        return Object.prototype.toString.call(elem).slice(8, -1);
    };
    FieldsUtils.isObject = function (elem) {
        return typeof elem === 'object' && elem !== null;
    };
    FieldsUtils.isNonEmptyObject = function (elem) {
        return this.isObject(elem) && Object.keys(elem).length !== 0;
    };
    FieldsUtils.isArray = function (elem) {
        return Array.isArray(elem);
    };
    FieldsUtils.areCollectionValuesSimpleFields = function (fieldValue) {
        return !this.isObject(fieldValue[0]['value']) && !Array.isArray(fieldValue[0]['value']) && fieldValue[0]['value'] !== undefined;
    };
    FieldsUtils.isCollectionOfSimpleTypes = function (fieldValue) {
        return this.isCollection(fieldValue) && this.areCollectionValuesSimpleFields(fieldValue);
    };
    FieldsUtils.isMultiSelectValue = function (form) {
        return this.isNonEmptyArray(form) && !this.isCollectionWithValue(form);
    };
    FieldsUtils.isNonEmptyArray = function (pageFormFields) {
        return Array.isArray(pageFormFields) && pageFormFields[0] !== undefined;
    };
    FieldsUtils.isCollection = function (pageFormFields) {
        return this.isNonEmptyArray(pageFormFields) && this.isCollectionWithValue(pageFormFields);
    };
    FieldsUtils.isCollectionWithValue = function (pageFormFields) {
        return pageFormFields[0]['value'] !== undefined;
    };
    FieldsUtils.cloneObject = function (obj) {
        return Object.assign({}, obj);
    };
    // temporary function until this can be moved to CaseView class (RDM-2681)
    FieldsUtils.getCaseFields = function (caseView) {
        var caseDataFields = caseView.tabs.reduce(function (acc, tab) {
            return acc.concat(tab.fields);
        }, []);
        var metadataFields = caseView.metadataFields;
        return metadataFields.concat(caseDataFields.filter(function (caseField) {
            return metadataFields.findIndex(function (metadataField) { return metadataField.id === caseField.id; }) < 0;
        }));
    };
    FieldsUtils.prepareValue = function (field) {
        if (field.value) {
            return field.value;
        }
        else if (field.isComplex()) {
            var valueMap_1 = {};
            field.field_type.complex_fields.forEach(function (complexField) {
                valueMap_1[complexField.id] = FieldsUtils_1.prepareValue(complexField);
            });
            return valueMap_1;
        }
    };
    FieldsUtils.getMoneyGBP = function (fieldValue) {
        return fieldValue ? FieldsUtils_1.currencyPipe.transform(fieldValue / 100, 'GBP', 'symbol') : fieldValue;
    };
    FieldsUtils.getDate = function (fieldValue) {
        try {
            // Format specified here wasn't previously working and lots of tests depend on it not working
            // Now that formats work correctly many test would break - and this could affect services which may depend on
            // the orginal behaviour of returning dates in "d MMM yyyy"
            return FieldsUtils_1.datePipe.transform(fieldValue, null, 'd MMM yyyy');
        }
        catch (e) {
            return this.textForInvalidField('Date', fieldValue);
        }
    };
    FieldsUtils.getFixedListLabelByCodeOrEmpty = function (field, code) {
        var relevantItem = code ? field.field_type.fixed_list_items.find(function (item) { return item.code === code; }) : '';
        return relevantItem ? relevantItem.label : '';
    };
    FieldsUtils.textForInvalidField = function (type, invalidValue) {
        return "{ Invalid " + type + ": " + invalidValue + " }";
    };
    FieldsUtils.addCaseFieldAndComponentReferences = function (c, cf, comp) {
        c['caseField'] = cf;
        c['component'] = comp;
    };
    FieldsUtils.prototype.buildCanShowPredicate = function (eventTrigger, form) {
        var currentState = this.getCurrentEventState(eventTrigger, form);
        return function (page) {
            return page.parsedShowCondition.match(currentState);
        };
    };
    FieldsUtils.prototype.getCurrentEventState = function (eventTrigger, form) {
        return this.mergeCaseFieldsAndFormFields(eventTrigger.case_fields, form.controls['data'].value);
    };
    FieldsUtils.prototype.cloneCaseField = function (obj) {
        return Object.assign(new definition_1.CaseField(), obj);
    };
    FieldsUtils.prototype.mergeCaseFieldsAndFormFields = function (caseFields, formFields) {
        return this.mergeFields(caseFields, formFields, FieldsUtils_1.DEFAULT_MERGE_FUNCTION);
    };
    FieldsUtils.prototype.mergeLabelCaseFieldsAndFormFields = function (caseFields, formFields) {
        return this.mergeFields(caseFields, formFields, FieldsUtils_1.LABEL_MERGE_FUNCTION);
    };
    FieldsUtils.prototype.controlIterator = function (aControl, formArrayFn, formGroupFn, controlFn) {
        if (aControl instanceof forms_1.FormArray) { // We're in a collection
            var cf = aControl['caseField'];
            formArrayFn(aControl, cf);
        }
        else if (aControl instanceof forms_1.FormGroup) {
            formGroupFn(aControl);
        }
        else if (aControl instanceof forms_1.FormControl) { // FormControl
            controlFn(aControl);
        }
    };
    FieldsUtils.prototype.mergeFields = function (caseFields, formFields, mergeFunction) {
        var _this = this;
        var result = FieldsUtils_1.cloneObject(formFields);
        caseFields.forEach(function (field) {
            mergeFunction(field, result);
            if (field.field_type && field.field_type.complex_fields && field.field_type.complex_fields.length > 0) {
                result[field.id] = _this.mergeFields(field.field_type.complex_fields, result[field.id], mergeFunction);
            }
        });
        return result;
    };
    var FieldsUtils_1;
    FieldsUtils.currencyPipe = new common_1.CurrencyPipe('en-GB');
    FieldsUtils.datePipe = new utils_1.DatePipe(new format_translator_service_1.FormatTranslatorService());
    FieldsUtils.LABEL_SUFFIX = '-LABEL';
    FieldsUtils.DEFAULT_MERGE_FUNCTION = function mergeFunction(field, result) {
        if (!result.hasOwnProperty(field.id)) {
            result[field.id] = field.value;
        }
    };
    FieldsUtils.LABEL_MERGE_FUNCTION = function mergeFunction(field, result) {
        if (!result.hasOwnProperty(field.id)) {
            result[field.id] = field.value;
        }
        switch (field.field_type.type) {
            case 'FixedList': {
                result[field.id] = FieldsUtils_1.getFixedListLabelByCodeOrEmpty(field, result[field.id] || field.value);
                break;
            }
            case 'MultiSelectList': {
                var fieldValue = result[field.id] || [];
                result[field.id + FieldsUtils_1.LABEL_SUFFIX] = [];
                fieldValue.forEach(function (code, idx) {
                    result[field.id + FieldsUtils_1.LABEL_SUFFIX][idx] = FieldsUtils_1.getFixedListLabelByCodeOrEmpty(field, code);
                });
                break;
            }
            case 'MoneyGBP': {
                var fieldValue = (result[field.id] || field.value);
                result[field.id] = FieldsUtils_1.getMoneyGBP(fieldValue);
                break;
            }
            case 'Date': {
                var fieldValue = (result[field.id] || field.value);
                result[field.id] = FieldsUtils_1.getDate(fieldValue);
                break;
            }
            case 'Collection': {
                var elements = (result[field.id] || field.value);
                if (elements) {
                    elements.forEach(function (elem) {
                        switch (field.field_type.collection_field_type.type) {
                            case 'MoneyGBP': {
                                elem.value = FieldsUtils_1.getMoneyGBP(elem.value);
                                break;
                            }
                            case 'Date': {
                                elem.value = FieldsUtils_1.getDate(elem.value);
                                break;
                            }
                        }
                    });
                }
                break;
            }
        }
    };
    FieldsUtils = FieldsUtils_1 = __decorate([
        core_1.Injectable()
    ], FieldsUtils);
    return FieldsUtils;
}());
exports.FieldsUtils = FieldsUtils;
//# sourceMappingURL=fields.utils.js.map