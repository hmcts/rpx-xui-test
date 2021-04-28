import { FormGroup } from '@angular/forms';
import { CaseFieldService } from '../../../services/case-fields/case-field.service';
import { WizardPage } from '../domain/wizard-page.model';
export declare class PageValidationService {
    private caseFieldService;
    constructor(caseFieldService: CaseFieldService);
    isPageValid(page: WizardPage, editForm: FormGroup): boolean;
    private checkDocumentField;
    private isHidden;
    private checkOptionalField;
    private checkMandatoryField;
}
