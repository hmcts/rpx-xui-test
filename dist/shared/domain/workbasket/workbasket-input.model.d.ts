import { Field } from '../search/field.model';
import { Orderable } from '../order/orderable.model';
export declare class WorkbasketInputModel implements Orderable {
    label: string;
    order: number;
    field: Field;
    metadata?: boolean;
    constructor(label: string, order: number, field: Field, metadata?: boolean);
}
export declare class WorkbasketInput {
    workbasketInputs: WorkbasketInputModel[];
}
