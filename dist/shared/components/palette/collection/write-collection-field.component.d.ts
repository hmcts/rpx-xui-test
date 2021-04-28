import { OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { Subscription } from 'rxjs';
import { CaseField } from '../../../domain/definition/case-field.model';
import { Profile } from '../../../domain/profile';
import { ProfileNotifier } from '../../../services';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';
import { CollectionCreateCheckerService } from './collection-create-checker.service';
export declare class WriteCollectionFieldComponent extends AbstractFieldWriteComponent implements OnInit, OnDestroy {
    private dialog;
    private scrollToService;
    private profileNotifier;
    private createChecker;
    caseFields: CaseField[];
    formGroup: FormGroup;
    formArray: FormArray;
    profile: Profile;
    profileSubscription: Subscription;
    private items;
    private collItems;
    constructor(dialog: MatDialog, scrollToService: ScrollToService, profileNotifier: ProfileNotifier, createChecker: CollectionCreateCheckerService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    buildCaseField(item: any, index: number): CaseField;
    private newCaseField;
    buildIdPrefix(index: number): string;
    private getContainer;
    addItem(doScroll: boolean): void;
    private focusLastItem;
    removeItem(index: number): void;
    itemLabel(index: number): string;
    isNotAuthorisedToCreate(): boolean;
    getCollectionPermission(field: CaseField, type: string): boolean;
    isNotAuthorisedToUpdate(): boolean;
    hasUpdateAccess(role: any): boolean;
    isNotAuthorisedToDelete(index: number): boolean;
    openModal(i: number): void;
    /**
     * TODO: Sort out the logic necessary for this once and for all.
     */
    private getControlIdAt;
    private isCollectionOfSimpleType;
}
