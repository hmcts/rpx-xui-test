import { Orderable } from '../order';
import { WizardPageField } from '../../components/case-editor/domain/wizard-page-field.model';
import { AccessControlList } from './access-control-list.model';
import { FieldTypeEnum } from './field-type-enum.model';
import { FixedListItem } from './fixed-list-item.model';
export declare class CaseField implements Orderable {
    id: string;
    hidden: boolean;
    hiddenCannotChange: boolean;
    label: string;
    order?: number;
    field_type: FieldType;
    hint_text?: string;
    security_label?: string;
    display_context: string;
    display_context_parameter?: string;
    show_condition?: string;
    show_summary_change_option?: boolean;
    show_summary_content_option?: number;
    acls?: AccessControlList[];
    metadata?: boolean;
    formatted_value?: any;
    wizardProps?: WizardPageField;
    private _value;
    private _list_items;
    value: any;
    list_items: any;
    readonly dateTimeEntryFormat: string;
    readonly dateTimeDisplayFormat: string;
    isReadonly(): boolean;
    isCollection(): boolean;
    isComplex(): boolean;
    isCaseLink(): boolean;
    private extractBracketValue;
}
export declare class FieldType {
    id: string;
    type: FieldTypeEnum;
    min?: number;
    max?: number;
    regular_expression?: string;
    fixed_list_items?: FixedListItem[];
    complex_fields?: CaseField[];
    collection_field_type?: FieldType;
}
