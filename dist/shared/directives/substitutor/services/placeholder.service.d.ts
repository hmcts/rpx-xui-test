export declare class PlaceholderService {
    resolvePlaceholders(pageFormFields: any, stringToResolve: any): string;
}
export declare namespace PlaceholderService {
    class PlaceholderSubstitutor {
        private static readonly PLACEHOLDER_CONTENT_PATTERN;
        private static readonly PLACEHOLDER_PATTERN;
        private static readonly STARTING_PLACEHOLDER;
        private static readonly CLOSING_PLACEHOLDER;
        private static readonly OPENING_PLACEHOLDER;
        private static readonly NEW_LINE;
        private stringToResolve;
        private scanIndex;
        private numberCollectionItemsAsPlaceholder;
        private collectionItemIndex;
        private fieldIdToSubstitute;
        private startSubstitutionIndex;
        private isCollecting;
        private resolvedFormValues;
        private readonly pageFormFields;
        private readonly originalStringToResolve;
        constructor(values: {
            stringToResolve: string;
            pageFormFields: any;
        });
        resolvePlaceholders(): string;
        private isScanningStringToResolve;
        private doesPlaceholderContainCollectionItems;
        private hasUnresolvedPlaceholder;
        private isStartPlaceholderAndNotCollecting;
        private isOpeningPlaceholder;
        private isClosingPlaceholder;
        private resetPlaceholderSubstitutor;
        private substitute;
        private appendOriginalStringIfCollectionItemAsPlaceholder;
        private setStartCollecting;
        private appendCharacter;
        private isMatchingPlaceholderPattern;
        private isFieldIdInFormFields;
        private isFieldIdToSubstituteReferringItself;
        private getSubstitutionValueLengthOrZero;
        private getFieldValue;
        private getSubstitutionValueOrEmpty;
        private getNumberOfCollectionItemsIfAny;
        private getNewNumberOfCollectionItemsIfHigher;
        private isStartingPlaceholder;
        private updateNumberOfCollectionItemsAsPlaceholder;
        private substituteFromFormFields;
        private substituteWithEmptyString;
        private resetScanIndexAfterSubstitution;
    }
}
