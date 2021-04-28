import { Observable } from 'rxjs';
import { HttpError } from '../../domain/http/http-error.model';
import { AuthService } from '../auth';
import { HttpErrorResponse } from '@angular/common/http';
export declare class HttpErrorService {
    private authService;
    private static readonly CONTENT_TYPE;
    private static readonly JSON;
    private error;
    constructor(authService: AuthService);
    setError(error: HttpError): void;
    removeError(): HttpError;
    handle(error: HttpErrorResponse | any, redirectIfNotAuthorised?: boolean): Observable<never>;
}
