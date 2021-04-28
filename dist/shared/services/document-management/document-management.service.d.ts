import { Observable } from 'rxjs';
import { DocumentData } from '../../domain/document/document-data.model';
import { HttpService } from '../http';
import { AbstractAppConfig } from '../../../app.config';
export declare class DocumentManagementService {
    private http;
    private appConfig;
    private static readonly PDF;
    private static readonly IMAGE;
    private static readonly RESPONSE_DELAY;
    imagesList: string[];
    constructor(http: HttpService, appConfig: AbstractAppConfig);
    uploadFile(formData: FormData): Observable<DocumentData>;
    getMediaViewerInfo(documentFieldValue: any): string;
    getContentType(documentFieldValue: any): string;
    isImage(imageType: string): boolean;
    transformDocumentUrl(documentBinaryUrl: string): string;
}
