import { Activity } from '../../domain/activity';
import { Observable } from 'rxjs';
import { AbstractAppConfig } from '../../../app.config';
import { HttpService } from '../../services/http';
export declare class ActivityService {
    private http;
    private appConfig;
    static readonly DUMMY_CASE_REFERENCE = "0";
    static readonly ACTIVITY_VIEW: string;
    static readonly ACTIVITY_EDIT: string;
    private userAuthorised;
    constructor(http: HttpService, appConfig: AbstractAppConfig);
    getActivities(...caseId: string[]): Observable<Activity[]>;
    postActivity(caseId: string, activityType: String): Observable<Activity[]>;
    verifyUserIsAuthorized(): void;
    private activityUrl;
    readonly isEnabled: boolean;
}
