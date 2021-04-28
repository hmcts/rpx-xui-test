import { Orderable, Field } from '../../../domain';
export declare class SearchInput implements Orderable {
    label: string;
    order: number;
    field: Field;
    metadata?: boolean;
    constructor(label: string, order: number, field: Field, metadata?: boolean);
}
