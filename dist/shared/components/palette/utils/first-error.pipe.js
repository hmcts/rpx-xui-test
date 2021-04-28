"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FirstErrorPipe = /** @class */ (function () {
    function FirstErrorPipe() {
    }
    FirstErrorPipe.prototype.transform = function (value) {
        if (!value) {
            return '';
        }
        var keys = Object.keys(value);
        if (!keys.length) {
            return '';
        }
        if (keys[0] === 'required') {
            return 'This field is required';
        }
        else if (keys[0] === 'pattern') {
            return 'The data entered is not valid for this type of field.';
        }
        else if (keys[0] === 'minlength') {
            return 'Required minimum length';
        }
        else if (keys[0] === 'maxlength') {
            return 'Exceeds maximum length';
        }
        return value[keys[0]];
    };
    FirstErrorPipe = __decorate([
        core_1.Pipe({
            name: 'ccdFirstError'
        })
    ], FirstErrorPipe);
    return FirstErrorPipe;
}());
exports.FirstErrorPipe = FirstErrorPipe;
//# sourceMappingURL=first-error.pipe.js.map