import { FieldsUtils } from './fields.utils';
import { Wizard } from '../../components';
import { CaseEventTrigger } from '../../domain';
export declare class FieldsPurger {
    private fieldsUtils;
    constructor(fieldsUtils: FieldsUtils);
    clearHiddenFields(form: any, wizard: Wizard, eventTrigger: CaseEventTrigger, currentPageId: string): void;
    private clearHiddenFieldForPageShowCondition;
    private clearHiddenFieldForFieldShowCondition;
    private retainHiddenValueByFieldType;
    private isHidden;
    private findCaseFieldByWizardPageFieldId;
    private hasShowConditionPage;
    private hasShowConditionField;
    private getShowConditionKey;
    private resetField;
    private resetPage;
    private getType;
    private isObject;
    private isReadonly;
}
