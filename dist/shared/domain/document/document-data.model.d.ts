export declare class HRef {
    href: string;
}
export declare class DocumentLinks {
    self: HRef;
    binary: HRef;
}
export declare class Document {
    _links: DocumentLinks;
    originalDocumentName: string;
}
export declare class Embedded {
    documents: Document[];
}
export declare class DocumentData {
    _embedded: Embedded;
}
