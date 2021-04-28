import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { CaseEventTrigger } from '../../../domain';
import { CasesService } from '../../case-editor';
import { AlertService } from '../../../services';
export declare class EventTriggerResolver implements Resolve<CaseEventTrigger> {
    private casesService;
    private alertService;
    static readonly PARAM_CASE_ID = "cid";
    static readonly PARAM_EVENT_ID = "eid";
    static readonly IGNORE_WARNING = "ignoreWarning";
    private static readonly IGNORE_WARNING_VALUES;
    private cachedEventTrigger;
    constructor(casesService: CasesService, alertService: AlertService);
    resolve(route: ActivatedRouteSnapshot): Promise<CaseEventTrigger>;
    private isRootTriggerEventRoute;
    private getAndCacheEventTrigger;
}
