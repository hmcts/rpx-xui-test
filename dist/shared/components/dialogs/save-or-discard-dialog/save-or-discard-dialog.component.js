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
var material_1 = require("@angular/material");
var SaveOrDiscardDialogComponent = /** @class */ (function () {
    function SaveOrDiscardDialogComponent(matDialogRef) {
        this.matDialogRef = matDialogRef;
    }
    SaveOrDiscardDialogComponent.prototype.cancel = function () {
        this.result = 'Cancel';
        this.matDialogRef.close(this.result);
    };
    SaveOrDiscardDialogComponent.prototype.save = function () {
        this.result = 'Save';
        this.matDialogRef.close(this.result);
    };
    SaveOrDiscardDialogComponent.prototype.discard = function () {
        this.result = 'Discard';
        this.matDialogRef.close(this.result);
    };
    SaveOrDiscardDialogComponent = __decorate([
        core_1.Component({
            selector: 'ccd-save-or-discard-dialog',
            template: "\n\n    <div>\n      <div class=\"dialog-header\">\n        <h2 (click)=\"cancel()\" class=\"heading-h2 x\">X</h2>\n      </div>\n      <div>\n        <h2 class=\"heading-h2 dialog-title\">Would you like to save changes to this page?</h2>\n      </div>\n      <div class=\"dialog-info\">\n        <span class=\"text-info\">You will be taken back to your case list.</span>\n      </div>\n      <div>\n        <button type=\"button\" title=\"Save\" class=\"button action-button\" (click)=\"save()\">Save</button>\n        <button type=\"button\" title=\"Discard\" class=\"button button-secondary\" (click)=\"discard()\">Discard</button>\n      </div>\n    </div>\n  ",
            styles: ["\n    .x{margin:0;padding:9px 9px 0px 0px;font-size:24px;font-weight:bold;font-style:normal;font-stretch:normal;cursor:pointer;color:#6e7071}.dialog-header{text-align:right}.dialog-title{margin:0px 0px 21px 25px}.dialog-info{margin:0px 0px 21px 25px}.action-button{margin:0px 15px 0px 25px}\n  "]
        }),
        __metadata("design:paramtypes", [material_1.MatDialogRef])
    ], SaveOrDiscardDialogComponent);
    return SaveOrDiscardDialogComponent;
}());
exports.SaveOrDiscardDialogComponent = SaveOrDiscardDialogComponent;
//# sourceMappingURL=save-or-discard-dialog.component.js.map