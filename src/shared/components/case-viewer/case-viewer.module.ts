import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CaseViewerComponent } from './case-viewer.component';
import { MatTabsModule } from '@angular/material';
import {
  ActivityService,
  ActivityPollingService,
  OrderService,
  DraftService,
  HttpService,
  NavigationNotifierService,
  ErrorNotifierService
} from '../../services';
import { ErrorsModule } from '../error/errors.module';
import { ActivityModule } from '../activity/activity.module';
import { CaseHeaderModule } from '../case-header';
import { CaseHistoryModule } from '../case-history';
import { EventTriggerModule } from '../event-trigger/event-trigger.module';
import { TabsModule } from '../../../components/tabs';
import { PaletteModule, EventLogModule, ComplexModule } from '../palette';
import { LabelSubstitutorModule, ConditionalShowModule } from '../../directives';
import { CasePrinterComponent, PrintUrlPipe } from './printer';
import { CaseEventTriggerComponent } from './case-event-trigger';
import { EventTriggerResolver, CaseResolver } from './services';
import { CaseEditorModule, CaseNotifier } from '../case-editor';
import { CaseViewComponent } from './case-view/case-view.component';
import { PipesModule, CaseReferencePipe } from '../../pipes';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ErrorsModule,
        ActivityModule,
        CaseHeaderModule,
        EventTriggerModule,
        TabsModule,
        PaletteModule,
        LabelSubstitutorModule,
        CaseEditorModule,
        PipesModule,
        ConditionalShowModule,
        CaseHistoryModule,
        EventLogModule,
        MatTabsModule,
        ComplexModule
    ],
  declarations: [
    CaseEventTriggerComponent,
    CasePrinterComponent,
    CaseViewerComponent,
    CaseViewComponent,
    PrintUrlPipe,
  ],
  exports: [
    CaseViewerComponent,
    CaseViewComponent,
  ],
  providers: [
    CaseNotifier,
    NavigationNotifierService,
    CaseReferencePipe,
    EventTriggerResolver,
    ActivityService,
    ActivityPollingService,
    OrderService,
    DraftService,
    HttpService,
    CaseResolver,
    ErrorNotifierService,
  ]
})
export class CaseViewerModule {
}
