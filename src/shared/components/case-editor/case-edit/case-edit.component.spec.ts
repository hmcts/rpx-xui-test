import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng2-mock-component';
import { CaseEditComponent } from './case-edit.component';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FieldsPurger, FieldsUtils, ProfileNotifier, ProfileService } from '../../../services';
import { ConditionalShowRegistrarService } from '../../../directives';
import { FieldsFilterPipe, PaletteUtilsModule } from '../../palette';
import { WizardFactoryService } from '../services/wizard-factory.service';
import { FormErrorService } from '../../../services/form/form-error.service';
import { FormValueService } from '../../../services/form/form-value.service';
import { createCaseEventTrigger } from '../../../fixture/shared.test.fixture';
import { CaseEventTrigger } from '../../../domain/case-view/case-event-trigger.model';
import { WizardPageField } from '../domain/wizard-page-field.model';
import { CaseField } from '../../../domain/definition/case-field.model';
import { Wizard } from '../domain/wizard.model';
import { WizardPage } from '../domain/wizard-page.model';
import { Profile } from '../../../domain';
import createSpyObj = jasmine.createSpyObj;

describe('CaseEditComponent', () => {

  const EVENT_TRIGGER: CaseEventTrigger = createCaseEventTrigger(
    'TEST_TRIGGER',
    'Test Trigger',
    'caseId',
    false,
    [
      <CaseField>({
        id: 'PersonFirstName',
        label: 'First name',
        field_type: null,
        display_context: 'READONLY'
      }),
      <CaseField>({
        id: 'PersonLastName',
        label: 'Last name',
        field_type: null,
        display_context: 'OPTIONAL'
      })
    ]
  );

  const WIZARD_PAGE_FIELD_WITH_SHOW_CONDITION: WizardPageField = {
    case_field_id: 'PersonFirstName'
  };

  const WIZARD_PAGE_1: WizardPageField = {
    case_field_id: 'PersonFirstName'
  };

  const WIZARD_PAGE_2: WizardPageField = {
    case_field_id: 'PersonLastName'
  };

  const WIZARD_PAGE_3: WizardPageField = {
    case_field_id: 'Address'
  };

  const CASE_FIELD_WITH_SHOW_CONDITION: CaseField = <CaseField>({
    id: 'PersonFirstName',
    label: 'First name',
    field_type: null,
    display_context: 'READONLY',
    show_condition: 'PersonLastName=\"Smith\"'
  });

  const CASE_FIELD_1: CaseField = <CaseField>({
    id: 'PersonFirstName',
    label: 'First name',
    field_type: null,
    display_context: 'READONLY'
  });

  const CASE_FIELD_2: CaseField = <CaseField>({
    id: 'PersonLastName',
    label: 'First name',
    field_type: null,
    display_context: 'READONLY'
  });

  const CASE_FIELD_3: CaseField = <CaseField>({
    id: 'Address',
    label: 'Address',
    field_type: null,
    display_context: 'READONLY'
  });

  let fixture: ComponentFixture<CaseEditComponent>;
  let component: CaseEditComponent;
  let de: DebugElement;

  let EventTriggerHeaderComponent: any = MockComponent({
    selector: 'ccd-event-trigger-header',
    inputs: ['eventTrigger']
  });

  let FieldRead: any = MockComponent({
    selector: 'ccd-field-read',
    inputs: ['caseField']
  });

  let FieldWrite: any = MockComponent({
    selector: 'ccd-field-write',
    inputs: ['caseField', 'formGroup', 'idPrefix', 'isExpanded', 'parent']
  });

  const RouterLinkComponent: any = MockComponent({
    selector: 'a',
    inputs: ['routerLink']
  });

  let cancelHandler: any;
  let submitHandler: any;
  let formErrorService: any;
  let formValueService: any;
  let callbackErrorsSubject: any;
  let wizard: any;
  let routerStub: any;
  let fieldsUtils = new FieldsUtils();
  let fieldsPurger = new FieldsPurger(fieldsUtils);
  let registrarService = new ConditionalShowRegistrarService();
  let route: any;
  let profileService;
  let profileNotifier;
  let profileNotifierSpy;

  describe('profile available in route', () => {

    routerStub = {
      navigate: jasmine.createSpy('navigate'),
      routerState: {}
    };

    let USER = {
      idam: {
        id: 'userId',
        email: 'string',
        forename: 'string',
        surname: 'string',
        roles: ['caseworker', 'caseworker-test', 'caseworker-probate-solicitor']
      }
    };
    let FUNC = () => false;
    let PROFILE: Profile = {
      channels: [],
      jurisdictions: [],
      default: {
        workbasket: {
          case_type_id: '',
          jurisdiction_id: '',
          state_id: ''
        }
      },
      user: USER,
      'isSolicitor': FUNC,
      'isCourtAdmin': FUNC
    };

    beforeEach(async(() => {
      cancelHandler = createSpyObj('cancelHandler', ['applyFilters']);
      cancelHandler.applyFilters.and.returnValue();

      submitHandler = createSpyObj('submitHandler', ['applyFilters']);
      submitHandler.applyFilters.and.returnValue();

      callbackErrorsSubject = createSpyObj('callbackErrorsSubject', ['next']);
      wizard = createSpyObj<Wizard>('wizard', ['getPage', 'firstPage', 'nextPage', 'previousPage', 'hasPreviousPage']);
      wizard.pages = [];
      formErrorService = createSpyObj<FormErrorService>('formErrorService', ['mapFieldErrors']);

      formValueService = createSpyObj<FormValueService>('formValueService', ['sanitise']);

      profileService = createSpyObj<ProfileService>('profileService', ['get']);
      profileNotifier = new ProfileNotifier();
      profileNotifierSpy = spyOn(profileNotifier, 'announceProfile').and.callThrough();

      route = {
        queryParams: of({Origin: 'viewDraft'}),
        snapshot: {
          data: {},
          params: {},
          pathFromRoot: [
            {},
            {
              data: {
                profile: PROFILE
              }
            }
          ]
        },
        params: of({})
      };

      TestBed
        .configureTestingModule({
          imports: [
            ReactiveFormsModule,
            PaletteUtilsModule,
            RouterTestingModule
          ],
          declarations: [
            CaseEditComponent,

            // Mock
            EventTriggerHeaderComponent,
            RouterLinkComponent,
            FieldsFilterPipe,
            FieldRead,
            FieldWrite
          ],
          providers: [
            WizardFactoryService,
            { provide: FormErrorService, useValue: formErrorService },
            { provide: FormValueService, useValue: formValueService },
            { provide: FieldsUtils, useValue: fieldsUtils },
            { provide: FieldsPurger, useValue: fieldsPurger },
            { provide: ConditionalShowRegistrarService, useValue: registrarService },
            { provide: Router, useValue: routerStub },
            { provide: ActivatedRoute, useValue: route },
            { provide: ProfileService, useValue: profileService },
            { provide: ProfileNotifier, useValue: profileNotifier }
          ]
        })
        .compileComponents();

      fixture = TestBed.createComponent(CaseEditComponent);
      component = fixture.componentInstance;
      component.wizard = wizard;
      component.eventTrigger = EVENT_TRIGGER;
      component.cancelled.subscribe(cancelHandler.applyFilters);
      component.submitted.subscribe(submitHandler.applyFilters);
      // component.errorsSubject = errorSubject;

      de = fixture.debugElement;
      fixture.detectChanges();
    }));

    beforeEach(() => {
    });

    // Moved this test case to case-edit-page.component

    it('should return true for hasPrevious', () => {
      component.wizard = wizard;
      wizard.hasPreviousPage.and.returnValue(true);
      fixture.detectChanges();
      expect(component.hasPrevious('last')).toBeTruthy();
      expect(wizard.hasPreviousPage).toHaveBeenCalled();
    });

    it('should navigate to first page when first is called', () => {
      component.wizard = wizard;
      wizard.firstPage.and.returnValue(new WizardPage());
      fixture.detectChanges();
      component.first();
      expect(wizard.firstPage).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
    });

    it('should announce profile when profile exists on a path from root set by Router', () => {
      expect(profileNotifierSpy.calls.mostRecent().args[0].user).toEqual(USER);
      expect(profileNotifierSpy.calls.mostRecent().args[0].isSolicitor.toString()).toEqual(FUNC.toString());
      expect(profileService.get).not.toHaveBeenCalled();
    });

    describe('fieldShowCondition', () => {

      describe('next page', () => {

        it('should navigate to next page when next is called and do not clear READONLY hidden field value', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_FIELD_WITH_SHOW_CONDITION];
          currentPage.case_fields = [CASE_FIELD_WITH_SHOW_CONDITION, CASE_FIELD_2];
          wizard.getPage.and.returnValue(currentPage);
          wizard.nextPage.and.returnValue(new WizardPage());
          component.form = new FormGroup({
            data : new FormGroup({
              PersonFirstName: new FormControl('John'),
              PersonLastName: new FormControl('Smith')
            })
          });
          fixture.detectChanges();

          component.next('somePage');

          expect(wizard.nextPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id).value).toBe('John');
          expect(component.form.get('data').get(CASE_FIELD_2.id).value).toBe('Smith');
        });

        it('should navigate to next page when next is called and do not clear visible field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_FIELD_WITH_SHOW_CONDITION];
          currentPage.case_fields = [CASE_FIELD_WITH_SHOW_CONDITION, CASE_FIELD_2];
          wizard.getPage.and.returnValue(currentPage);
          wizard.nextPage.and.returnValue(new WizardPage());
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormControl('John'),
                PersonLastName: new FormControl('Smith')
              })
          });
          fixture.detectChanges();

          component.next('somePage');

          expect(wizard.nextPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id).value).toBe('John');
          expect(component.form.get('data').get(CASE_FIELD_2.id)).not.toBeNull();
        });

        it('should navigate to next page when next is called and clear hidden simple form field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_FIELD_WITH_SHOW_CONDITION];
          currentPage.case_fields = [CASE_FIELD_WITH_SHOW_CONDITION, CASE_FIELD_2];
          wizard.getPage.and.returnValue(currentPage);
          wizard.nextPage.and.returnValue(new WizardPage());
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormControl('John'),
                PersonLastName: new FormControl('Other')
              })
            });
          fixture.detectChanges();

          component.next('somePage');

          expect(wizard.nextPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).not.toBeNull();
        });

        it('should navigate to next page when next is called and clear hidden complex form field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_FIELD_WITH_SHOW_CONDITION];
          currentPage.case_fields = [CASE_FIELD_WITH_SHOW_CONDITION, CASE_FIELD_2];
          wizard.getPage.and.returnValue(currentPage);
          wizard.nextPage.and.returnValue(new WizardPage());
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormGroup({PersonMiddleName: new FormControl('John')}),
                PersonLastName: new FormControl('Other')
              })
            });
          fixture.detectChanges();

          component.next('somePage');

          expect(wizard.nextPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).not.toBeNull();
        });

        it('should navigate to next page when next is called and clear hidden collection form field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_FIELD_WITH_SHOW_CONDITION];
          currentPage.case_fields = [CASE_FIELD_WITH_SHOW_CONDITION, CASE_FIELD_2];
          wizard.getPage.and.returnValue(currentPage);
          wizard.nextPage.and.returnValue(new WizardPage());
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormArray([new FormGroup({PersonMiddleName: new FormControl('John')})]),
                PersonLastName: new FormControl('Other')
              })
            });
          fixture.detectChanges();

          component.next('somePage');

          expect(wizard.nextPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).not.toBeNull();
        });
      });

      describe('previous page', () => {
        it('should navigate to previous page when previous is called and do not clear READONLY hidden field value', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_FIELD_WITH_SHOW_CONDITION];
          currentPage.case_fields = [CASE_FIELD_WITH_SHOW_CONDITION, CASE_FIELD_2];
          wizard.getPage.and.returnValue(currentPage);
          wizard.previousPage.and.returnValue(new WizardPage());
          component.form = new FormGroup({
            data : new FormGroup({
              PersonFirstName: new FormControl('John'),
              PersonLastName: new FormControl('Smith')
            })
          });
          fixture.detectChanges();

          component.previous('somePage');

          expect(wizard.previousPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id).value).toBe('John');
          expect(component.form.get('data').get(CASE_FIELD_2.id).value).toBe('Smith');
        });

        it('should navigate to previous page when previous is called and do not clear visible field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_FIELD_WITH_SHOW_CONDITION];
          currentPage.case_fields = [CASE_FIELD_WITH_SHOW_CONDITION, CASE_FIELD_2];
          wizard.getPage.and.returnValue(currentPage);
          wizard.previousPage.and.returnValue(new WizardPage());
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormControl('John'),
                PersonLastName: new FormControl('Smith')
              })
            });
          fixture.detectChanges();

          component.previous('somePage');

          expect(wizard.previousPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id).value).toBe('John');
          expect(component.form.get('data').get(CASE_FIELD_2.id)).not.toBeNull();
        });

        it('should navigate to previous page when previous is called and clear hidden simple form field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_FIELD_WITH_SHOW_CONDITION];
          currentPage.case_fields = [CASE_FIELD_WITH_SHOW_CONDITION, CASE_FIELD_2];
          wizard.getPage.and.returnValue(currentPage);
          wizard.previousPage.and.returnValue(new WizardPage());
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormControl('John'),
                PersonLastName: new FormControl('Other')
              })
            });
          fixture.detectChanges();

          component.previous('somePage');

          expect(wizard.previousPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).not.toBeNull();
        });

        it('should navigate to previous page when next is called and clear hidden complex form field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_FIELD_WITH_SHOW_CONDITION];
          currentPage.case_fields = [CASE_FIELD_WITH_SHOW_CONDITION, CASE_FIELD_2];
          wizard.getPage.and.returnValue(currentPage);
          wizard.previousPage.and.returnValue(new WizardPage());
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormGroup({PersonMiddleName: new FormControl('John')}),
                PersonLastName: new FormControl('Other')
              })
            });
          fixture.detectChanges();

          component.previous('somePage');

          expect(wizard.previousPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).not.toBeNull();
        });

        it('should navigate to previous page when next is called and clear hidden collection form field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_FIELD_WITH_SHOW_CONDITION];
          currentPage.case_fields = [CASE_FIELD_WITH_SHOW_CONDITION, CASE_FIELD_2];
          wizard.getPage.and.returnValue(currentPage);
          wizard.previousPage.and.returnValue(new WizardPage());
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormArray([new FormGroup({PersonMiddleName: new FormControl('John')})]),
                PersonLastName: new FormControl('Other')
              })
            });
          fixture.detectChanges();

          component.previous('somePage');

          expect(wizard.previousPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).not.toBeNull();
        });
      });
    });

    describe('pageShowCondition', () => {

      describe('next page', () => {

        it('should navigate to next page when next is called and do not clear visible field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_1];
          currentPage.case_fields = [CASE_FIELD_1];
          wizard.getPage.and.returnValue(currentPage);
          let nextPage = new WizardPage();
          nextPage.show_condition = 'PersonFirstName=\"John\"';
          nextPage.case_fields = [CASE_FIELD_2, CASE_FIELD_3]
          nextPage.wizard_page_fields = [WIZARD_PAGE_2, WIZARD_PAGE_3];
          wizard.pages = [currentPage, nextPage];
          wizard.nextPage.and.returnValue(nextPage);
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormControl('John'),
                PersonLastName: new FormControl('Smith'),
                Address: new FormControl('Some street')
              })
            });
          fixture.detectChanges();

          component.next('somePage');

          expect(wizard.nextPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_3.id)).not.toBeNull();
        });

        it('should navigate to next page when next is called and clear hidden simple form field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_1];
          currentPage.case_fields = [CASE_FIELD_1];
          wizard.getPage.and.returnValue(currentPage);
          let nextPage = new WizardPage();
          nextPage.show_condition = 'PersonFirstName=\"John\"';
          nextPage.case_fields = [CASE_FIELD_2, CASE_FIELD_3]
          nextPage.wizard_page_fields = [WIZARD_PAGE_2, WIZARD_PAGE_3];
          wizard.nextPage.and.returnValue(nextPage);
          wizard.pages = [currentPage, nextPage];
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormControl('Other'),
                PersonLastName: new FormControl('Smith'),
                Address: new FormControl('Some street')
              })
            });
          fixture.detectChanges();

          component.next('somePage');

          expect(wizard.nextPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_3.id)).toBeNull();
        });

        it('should navigate to next page when next is called and clear hidden complex form field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_1];
          currentPage.case_fields = [CASE_FIELD_1];
          wizard.getPage.and.returnValue(currentPage);
          let nextPage = new WizardPage();
          nextPage.show_condition = 'PersonFirstName=\"John\"';
          nextPage.case_fields = [CASE_FIELD_2, CASE_FIELD_3]
          nextPage.wizard_page_fields = [WIZARD_PAGE_2, WIZARD_PAGE_3];
          wizard.nextPage.and.returnValue(nextPage);
          wizard.pages = [currentPage, nextPage];
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormControl('Other'),
                PersonLastName: new FormGroup({PersonMiddleName: new FormControl('John')}),
                Address: new FormGroup({AddressLine1: new FormControl('Street')})
              })
            });
          fixture.detectChanges();

          component.next('somePage');

          expect(wizard.nextPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_3.id)).toBeNull();
        });

        it('should navigate to next page when next is called and clear hidden collection form field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_1];
          currentPage.case_fields = [CASE_FIELD_1];
          wizard.getPage.and.returnValue(currentPage);
          let nextPage = new WizardPage();
          nextPage.show_condition = 'PersonFirstName=\"John\"';
          nextPage.case_fields = [CASE_FIELD_2, CASE_FIELD_3]
          nextPage.wizard_page_fields = [WIZARD_PAGE_2, WIZARD_PAGE_3];
          wizard.nextPage.and.returnValue(nextPage);
          wizard.pages = [currentPage, nextPage];
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormControl('Other'),
                PersonLastName: new FormArray([new FormGroup({PersonMiddleName: new FormControl('John')})]),
                Address: new FormArray([new FormGroup({AddressLine1: new FormControl('Street')})])
              })
            });
          fixture.detectChanges();

          component.next('somePage');

          expect(wizard.nextPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_3.id)).toBeNull();
        });
      });

      describe('previous page', () => {

        it('should navigate to previous page when previous is called and do not clear visible field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_1];
          currentPage.case_fields = [CASE_FIELD_1];
          wizard.getPage.and.returnValue(currentPage);
          let previousPage = new WizardPage();
          previousPage.show_condition = 'PersonFirstName=\"John\"';
          previousPage.case_fields = [CASE_FIELD_2, CASE_FIELD_3]
          previousPage.wizard_page_fields = [WIZARD_PAGE_2, WIZARD_PAGE_3];
          wizard.pages = [previousPage, currentPage];
          wizard.previousPage.and.returnValue(previousPage);
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormControl('John'),
                PersonLastName: new FormControl('Smith'),
                Address: new FormControl('Some street')
              })
            });
          fixture.detectChanges();

          component.previous('somePage');

          expect(wizard.previousPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_3.id)).not.toBeNull();
        });

        it('should navigate to previous page when previous is called and clear hidden simple form field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_1];
          currentPage.case_fields = [CASE_FIELD_1];
          wizard.getPage.and.returnValue(currentPage);
          let previousPage = new WizardPage();
          previousPage.show_condition = 'PersonFirstName=\"John\"';
          previousPage.case_fields = [CASE_FIELD_2, CASE_FIELD_3]
          previousPage.wizard_page_fields = [WIZARD_PAGE_2, WIZARD_PAGE_3];
          wizard.previousPage.and.returnValue(previousPage);
          wizard.pages = [previousPage, currentPage];
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormControl('Other'),
                PersonLastName: new FormControl('Smith'),
                Address: new FormControl('Some street')
              })
            });
          fixture.detectChanges();

          component.previous('somePage');

          expect(wizard.previousPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_3.id)).toBeNull();
        });

        it('should navigate to previous page when previous is called and clear hidden complex form field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_1];
          currentPage.case_fields = [CASE_FIELD_1];
          wizard.getPage.and.returnValue(currentPage);
          let previousPage = new WizardPage();
          previousPage.show_condition = 'PersonFirstName=\"John\"';
          previousPage.case_fields = [CASE_FIELD_2, CASE_FIELD_3]
          previousPage.wizard_page_fields = [WIZARD_PAGE_2, WIZARD_PAGE_3];
          wizard.previousPage.and.returnValue(previousPage);
          wizard.pages = [previousPage, currentPage];
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormControl('Other'),
                PersonLastName: new FormGroup({PersonMiddleName: new FormControl('John')}),
                Address: new FormGroup({AddressLine1: new FormControl('Street')})
              })
            });
          fixture.detectChanges();

          component.previous('somePage');

          expect(wizard.previousPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_3.id)).toBeNull();
        });

        it('should navigate to previous page when previous is called and clear hidden collection form field', () => {
          component.wizard = wizard;
          let currentPage = new WizardPage();
          currentPage.wizard_page_fields = [WIZARD_PAGE_1];
          currentPage.case_fields = [CASE_FIELD_1];
          wizard.getPage.and.returnValue(currentPage);
          let previousPage = new WizardPage();
          previousPage.show_condition = 'PersonFirstName=\"John\"';
          previousPage.case_fields = [CASE_FIELD_2, CASE_FIELD_3]
          previousPage.wizard_page_fields = [WIZARD_PAGE_2, WIZARD_PAGE_3];
          wizard.previousPage.and.returnValue(previousPage);
          wizard.pages = [currentPage, previousPage];
          component.form = new FormGroup({
            data : new FormGroup({
                PersonFirstName: new FormControl('Other'),
                PersonLastName: new FormArray([new FormGroup({PersonMiddleName: new FormControl('John')})]),
                Address: new FormArray([new FormGroup({AddressLine1: new FormControl('Street')})])
              })
            });
          fixture.detectChanges();

          component.previous('somePage');

          expect(wizard.previousPage).toHaveBeenCalled();
          expect(routerStub.navigate).toHaveBeenCalled();
          expect(component.form.get('data').get(CASE_FIELD_1.id)).not.toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_2.id)).toBeNull();
          expect(component.form.get('data').get(CASE_FIELD_3.id)).toBeNull();
        });
      });
    });

    it('should navigate to the page when navigateToPage is called', () => {
      component.wizard = wizard;
      wizard.getPage.and.returnValue(new WizardPage());
      fixture.detectChanges();
      component.navigateToPage('somePage');
      expect(wizard.getPage).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
    });

    it('should emit cancel event when cancel is called', () => {
      component.cancel();
      expect(cancelHandler.applyFilters).toHaveBeenCalled();
    });
  });

  describe('profile not available in route', () => {

    let USER = {
      idam: {
        id: 'userId',
        email: 'string',
        forename: 'string',
        surname: 'string',
        roles: ['caseworker', 'caseworker-test', 'caseworker-probate-solicitor']
      }
    };
    let FUNC = () => false;
    let PROFILE: Profile = {
      channels: [],
      jurisdictions: [],
      default: {
        workbasket: {
          case_type_id: '',
          jurisdiction_id: '',
          state_id: ''
        }
      },
      user: USER,
      'isSolicitor': FUNC,
      'isCourtAdmin': FUNC
    };

    let PROFILE_OBS: Observable<Profile> = Observable.of(PROFILE);

    beforeEach(async(() => {
      cancelHandler = createSpyObj('cancelHandler', ['applyFilters']);
      cancelHandler.applyFilters.and.returnValue();

      submitHandler = createSpyObj('submitHandler', ['applyFilters']);
      submitHandler.applyFilters.and.returnValue();

      callbackErrorsSubject = createSpyObj('callbackErrorsSubject', ['next']);
      wizard = createSpyObj<Wizard>('wizard', ['getPage', 'firstPage', 'nextPage', 'previousPage', 'hasPreviousPage']);
      wizard.pages = [];
      formErrorService = createSpyObj<FormErrorService>('formErrorService', ['mapFieldErrors']);

      formValueService = createSpyObj<FormValueService>('formValueService', ['sanitise']);

      profileService = createSpyObj<ProfileService>('profileService', ['get']);
      profileService.get.and.returnValue(PROFILE_OBS);
      profileNotifier = new ProfileNotifier();
      profileNotifierSpy = spyOn(profileNotifier, 'announceProfile').and.callThrough();

      let snapshotNoProfile = {
        pathFromRoot: [
          {},
          {
            data: {
              nonProfileData: {
                user: {
                  idam: {
                    id: 'userId',
                    email: 'string',
                    forename: 'string',
                    surname: 'string',
                    roles: ['caseworker', 'caseworker-test', 'caseworker-probate-solicitor']
                  }
                },
                'isSolicitor': () => false,
              }
            }
          }
        ]
      };
      let mockRouteNoProfile = {
        queryParams: of({Origin: 'viewDraft'}),
        params: of({id: 123}),
        snapshot: snapshotNoProfile
      };

      TestBed
        .configureTestingModule({
          imports: [
            ReactiveFormsModule,
            PaletteUtilsModule,
            RouterTestingModule
          ],
          declarations: [
            CaseEditComponent,

            // Mock
            EventTriggerHeaderComponent,
            RouterLinkComponent,
            FieldRead,
            FieldWrite
          ],
          providers: [
            WizardFactoryService,
            { provide: FormErrorService, useValue: formErrorService },
            { provide: FormValueService, useValue: formValueService },
            { provide: FieldsUtils, useValue: fieldsUtils },
            { provide: FieldsPurger, useValue: fieldsPurger },
            { provide: ConditionalShowRegistrarService, useValue: registrarService },
            { provide: Router, useValue: routerStub },
            { provide: ActivatedRoute, useValue: mockRouteNoProfile },
            { provide: ProfileService, useValue: profileService },
            { provide: ProfileNotifier, useValue: profileNotifier }
          ]
        })
        .compileComponents();

      fixture = TestBed.createComponent(CaseEditComponent);
      component = fixture.componentInstance;
      component.wizard = wizard;
      component.eventTrigger = EVENT_TRIGGER;
      component.cancelled.subscribe(cancelHandler.applyFilters);
      component.submitted.subscribe(submitHandler.applyFilters);
      // component.errorsSubject = errorSubject;

      de = fixture.debugElement;
      fixture.detectChanges();
    }));

    it('should announce profile when profile not in route and get profile successful', () => {
      expect(profileNotifierSpy.calls.mostRecent().args[0].user).toEqual(USER);
      expect(profileNotifierSpy.calls.mostRecent().args[0].isSolicitor.toString()).toEqual(FUNC.toString());
      expect(profileService.get).toHaveBeenCalled();
    });
  });

});
