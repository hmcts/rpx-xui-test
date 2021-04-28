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
var forms_1 = require("@angular/forms");
var abstract_field_write_component_1 = require("../../components/palette/base-field/abstract-field-write.component");
var fields_utils_1 = require("../../services/fields/fields.utils");
var domain_1 = require("./domain");
var conditional_show_registrar_service_1 = require("./services/conditional-show-registrar.service");
var grey_bar_service_1 = require("./services/grey-bar.service");
var operators_1 = require("rxjs/operators");
var ConditionalShowFormDirective = /** @class */ (function () {
    function ConditionalShowFormDirective(el, fieldsUtils, registry, renderer, greyBarService) {
        var _this = this;
        this.el = el;
        this.fieldsUtils = fieldsUtils;
        this.registry = registry;
        this.renderer = renderer;
        this.greyBarService = greyBarService;
        this.contextFields = [];
        // make sure for the 3 callbacks that we are bound to this via an arrow function
        this.handleFormControl = function (c) {
            _this.evaluateControl(c);
        };
        this.handleFormArray = function (c, caseField) {
            _this.evaluateControl(c);
            c.controls.forEach(function (formControl, ix) {
                _this.fieldsUtils.controlIterator(formControl, _this.handleFormArray, _this.handleFormGroup, _this.handleFormControl);
            });
        };
        this.handleFormGroup = function (g) {
            _this.evaluateControl(g);
            var groupControl = g;
            if (g.get('value') && g.get('value') instanceof forms_1.FormGroup) { // Complex Field
                groupControl = g.get('value');
            }
            else if (g.controls) {
                // Special Fields like AddressUK, AddressGlobal
                groupControl = g;
            }
            if (groupControl.controls) {
                Object.keys(groupControl.controls).forEach(function (cKey) {
                    // EUI-3359.
                    // Get the control from groupControl.controls[cKey] rather than
                    // groupControl.get(cKey) as the latter does pathing and will interpret
                    // full stops in cKey as delimeters for being nested within an array,
                    // which makes no sense in this situation.
                    var control = groupControl.controls[cKey];
                    _this.fieldsUtils.controlIterator(control, _this.handleFormArray, _this.handleFormGroup, _this.handleFormControl);
                });
            }
        };
    }
    ConditionalShowFormDirective.prototype.ngOnInit = function () {
        if (!this.formGroup) {
            console.log('**** no form group in conditional-show-form directive');
            this.formGroup = new forms_1.FormGroup({});
        }
    };
    /**
     * Moved the evaluation of show/hide conditions and subscription
     * to form changes until after the form has been fully created.
     *
     * Prior to this change, I traced more than 5,100,000 firings of
     * the evaluateCondition INSIDE the show_condition check on page
     * load for an event with a lot of content. After this change,
     * that number dropped to fewer than 2,500 - that's a.
     */
    ConditionalShowFormDirective.prototype.ngAfterViewInit = function () {
        this.evalAllShowHideConditions();
        this.subscribeToFormChanges();
    };
    ConditionalShowFormDirective.prototype.ngOnDestroy = function () {
        this.unsubscribeFromFormChanges();
    };
    /*
    * Delay the execution of evalShowHideConditions for 500ms
    * Evaluating showHideConditions on input is inefficient as all forms are evaluated
    * whilst the user is still typing. We are better off allowing the user to finish typing
    * then evaluate the show hide conditions.
    */
    ConditionalShowFormDirective.prototype.subscribeToFormChanges = function () {
        var _this = this;
        this.unsubscribeFromFormChanges();
        this.formChangesSubscription = this.formGroup.valueChanges
            .pipe(operators_1.debounceTime(500))
            .subscribe(function (_) {
            _this.evalAllShowHideConditions();
        });
    };
    ConditionalShowFormDirective.prototype.evaluateControl = function (control) {
        var cf = control['caseField'];
        var component = control['component'];
        this.evaluateCondition(cf, component, control);
    };
    ConditionalShowFormDirective.prototype.evaluateCondition = function (cf, component, control) {
        if (cf) {
            if (cf.display_context === 'HIDDEN') {
                cf.hidden = true; // display_context === 'HIDDEN' means always hide
            }
            else if (cf.show_condition) {
                var showCondition = domain_1.ShowCondition.getInstance(cf.show_condition);
                var condResult = showCondition.match(this.allFieldValues, this.buildPath(component, cf));
                if (cf.hidden === null || cf.hidden === undefined) {
                    cf.hidden = false;
                }
                if (condResult === cf.hidden) {
                    if (cf.hidden) {
                        this.greyBarService.addToggledToShow(cf.id);
                    }
                    else {
                        this.greyBarService.removeToggledToShow(cf.id);
                    }
                    cf.hidden = !condResult;
                }
                // EUI-3267. If we've not assessed the hiddenCannotChange flag and
                // this field is showing, set the flag appropriately now.
                if (cf.hiddenCannotChange === undefined && !cf.hidden) {
                    cf.hiddenCannotChange = showCondition.hiddenCannotChange(this.caseFields);
                }
                // Disable the control if it's hidden so that it doesn't count towards the
                // validation state of the form, but only if it's actually being validated.
                if (control.validator) {
                    if (cf.hidden === true && !control.disabled) {
                        control.disable({ emitEvent: false });
                    }
                    else if (cf.hidden !== true && control.disabled) {
                        control.enable({ emitEvent: false });
                    }
                }
            }
        }
    };
    ConditionalShowFormDirective.prototype.evalAllShowHideConditions = function () {
        this.getCurrentPagesReadOnlyAndFormFieldValues();
        this.fieldsUtils.controlIterator(this.formGroup, this.handleFormArray, this.handleFormGroup, this.handleFormControl);
    };
    ConditionalShowFormDirective.prototype.buildPath = function (c, field) {
        if (c && c instanceof abstract_field_write_component_1.AbstractFieldWriteComponent) {
            if (c.idPrefix) {
                return c.idPrefix + field.id;
            }
        }
        return field.id;
    };
    ConditionalShowFormDirective.prototype.getCurrentPagesReadOnlyAndFormFieldValues = function () {
        var formFields = this.getFormFieldsValuesIncludingDisabled();
        this.allFieldValues = this.fieldsUtils.mergeCaseFieldsAndFormFields(this.contextFields, formFields);
        return this.allFieldValues;
    };
    ConditionalShowFormDirective.prototype.getFormFieldsValuesIncludingDisabled = function () {
        return this.formGroup.getRawValue();
    };
    ConditionalShowFormDirective.prototype.unsubscribeFromFormChanges = function () {
        if (this.formChangesSubscription) {
            this.formChangesSubscription.unsubscribe();
        }
    };
    // TODO - remove or make work for a specific field
    ConditionalShowFormDirective.prototype.updateGreyBar = function (caseField, shown) {
        if (shown) {
            this.greyBarService.addToggledToShow(caseField.id);
            this.greyBarService.showGreyBar(caseField, this.el);
        }
        else {
            this.greyBarService.removeToggledToShow(caseField.id);
            this.greyBarService.removeGreyBar(this.el);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], ConditionalShowFormDirective.prototype, "caseFields", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], ConditionalShowFormDirective.prototype, "contextFields", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", forms_1.FormGroup)
    ], ConditionalShowFormDirective.prototype, "formGroup", void 0);
    ConditionalShowFormDirective = __decorate([
        core_1.Directive({ selector: '[ccdConditionalShowForm]' })
        /** Hides and shows all fields in a form. Works on read only fields and form fields.
         *  The show condition is evaluated on all the fields of the page. i.e. read only and form fields.
         *  Evaluation of the show condition includes disabled fields, which can be on their initial value or empty. Executes on the
         *  host field initialization and when any field of the form changes.
         *  Collaborates with the GreyBarService to show a vertical grey bar when a field initially hidden on the page is shown. When returning
         *  to the page after the page has been left, the grey bar has to be redisplayed. If instead on initial page load the field renders as
         *  initially shown, the grey bar is not displayed.
         */
        ,
        __metadata("design:paramtypes", [core_1.ElementRef,
            fields_utils_1.FieldsUtils,
            conditional_show_registrar_service_1.ConditionalShowRegistrarService,
            core_1.Renderer2,
            grey_bar_service_1.GreyBarService])
    ], ConditionalShowFormDirective);
    return ConditionalShowFormDirective;
}());
exports.ConditionalShowFormDirective = ConditionalShowFormDirective;
//# sourceMappingURL=conditional-show-form.directive.js.map