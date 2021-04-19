import { FormValueService } from './form-value.service';
import { CaseField, FieldType } from '../../domain/definition';
import { FieldTypeSanitiser } from './field-type-sanitiser';

describe('FormValueService', () => {
  let formValueService: FormValueService;
  beforeEach(() => {
    formValueService = new FormValueService(new FieldTypeSanitiser());
  });

  it('should return null when given null', () => {
    const value = formValueService.sanitise(null);
    expect(value).toEqual(null);
  });

  it('should trim spaces from strings', () => {
    const value = formValueService.sanitise({
      'string1': '     x     ',
      'string2': '     y      '
    });
    expect(value).toEqual({
      'string1': 'x',
      'string2': 'y'
    } as object);
  });

  it('should trim spaces from strings recursively', () => {
    const value = formValueService.sanitise({
      'object': {
        'string1': '    x     '
      },
      'string2': '     y      '
    });

    expect(value).toEqual({
      'object': {
        'string1': 'x'
      },
      'string2': 'y'
    } as object);
  });

  it('should trim spaces from strings in collection', () => {
    const value = formValueService.sanitise({
      'collection': [
        {
          'value': '      x        '
        }
      ]
    });

    expect(value).toEqual({
      'collection': [
        {
          'value': 'x'
        }
      ]
    } as object);
  });

  it('should convert numbers to strings', () => {
    const value = formValueService.sanitise({
      'number': 42
    });

    expect(value).toEqual({
      'number': '42'
    } as object);
  });

  it('should fiter current page fields and process DynamicList values back to Json', () => {
    const formFields = { data: { dynamicList: 'L2', thatTimeOfTheDay: {} } };
    const caseField = new CaseField();
    const fieldType = new FieldType();
    fieldType.type = 'DynamicList';
    caseField.id = 'dynamicList';
    caseField.field_type = fieldType
    caseField.value = {
      value: { code: 'L1', label: 'List 1' },
      list_items: [{ code: 'L1', label: 'List 1' }, { code: 'L2', label: 'List 2' }]
    }
    const caseFields = [caseField];
    formValueService.sanitiseDynamicLists(caseFields, formFields);
    const actual = '{"value":{"code":"L2","label":"List 2"},"list_items":[{"code":"L1","label":"List 1"},{"code":"L2","label":"List 2"}]}';
    expect(JSON.stringify(formFields.data.dynamicList))
      .toEqual(actual);
  });

  describe('sanitise for Document fields', () => {
    it('should return null for the Document field if the data to be sanitised has document_url = null', () => {
      const data = {
        document1: {
          document_url: null,
          document_binary_url: 'http://document.binary',
          document_filename: 'doc.file'
        }
      };
      const actual = {
        document1: null
      }
      expect(formValueService.sanitise(data)).toEqual(actual);
    });

    it('should return null for the Document field if the data to be sanitised has document_binary_url = null', () => {
      const data = {
        document1: {
          document_url: 'http://document.url',
          document_binary_url: null,
          document_filename: 'doc.file'
        }
      };
      const actual = {
        document1: null
      }
      expect(formValueService.sanitise(data)).toEqual(actual);
    });

    it('should return null for the Document field if the data to be sanitised has document_filename = null', () => {
      const data = {
        document1: {
          document_url: 'http://document.url',
          document_binary_url: 'http://document.binary',
          document_filename: null
        }
      };
      const actual = {
        document1: null
      }
      expect(formValueService.sanitise(data)).toEqual(actual);
    });
  });

  describe('removeNullLabels', () => {
    it('should remove unnecessary fields', () => {
      const data = { fieldId: null, type: 'Label', label: 'Text Field 0' };
      const caseField = new CaseField();
      const fieldType = new FieldType();
      fieldType.id = 'fieldId';
      fieldType.type = 'Label';
      caseField.id = 'fieldId';
      caseField.field_type = fieldType;
      caseField.value = { label: 'Text Field 0', default_value: 'test text' }
      const caseFields = [caseField];
      formValueService.removeNullLabels(data, caseFields);
      const actual = '{"type":"Label","label":"Text Field 0"}';
      expect(JSON.stringify(data)).toEqual(actual);
    })

  })

  describe('get field value', () => {
    describe('simple types', () => {
      it('should return value if form is a simple object', () => {
        const pageFormFields = { 'PersonFirstName': 'John' };
        const fieldIdToSubstitute = 'PersonFirstName';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBe('John');
      });

      it('should return value if form is a simple object recursive', () => {
        const pageFormFields = { 'PersonFirstName': 'John' };
        const fieldIdToSubstitute = 'PersonFirstName';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBe('John');
      });

      it('should return value if form is a collection with simple object referenced by exact key reference', () => {
        const pageFormFields = [{ 'value': { 'PersonFirstName': 'John' } }];
        const fieldIdToSubstitute = '0.value.PersonFirstName';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBe('John');
      });

      it('should return value if form is a complex item with nonempty object', () => {
        const pageFormFields = { '_1': { 'field': 'value' }, '_2': 'two', '_3': 'three' };
        const fieldIdToSubstitute = '_1.field';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBe('value');
      });

      it('should return value if form is a complex item with nonempty object recursive', () => {
        const pageFormFields = { '_1': { 'field': 'value' }, '_2': 'two', '_3': 'three' };
        const fieldIdToSubstitute = '_1.field';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBe('value');
      });

      it('should retrieve undefined if form is a collection with one empty item', () => {
        const pageFormFields = [{}];
        const fieldIdToSubstitute = 'PersonFirstName';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBeUndefined();
      });

      it('should return undefined if form is a simple item with no value ', () => {
        const pageFormFields = { 'PersonFirstName': null };
        const fieldIdToSubstitute = 'PersonFirstName';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBeNull();
      });

      it('should return empty value if form is a simple item with empty value', () => {
        const pageFormFields = { 'PersonFirstName': '' };
        const fieldIdToSubstitute = 'PersonFirstName';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBe('');
      });

      it('should return empty object if form is a simple item with empty object value', () => {
        const pageFormFields = { 'PersonFirstName': {} };
        const fieldIdToSubstitute = 'PersonFirstName';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toEqual({});
      });

      it('should return undefined referenced key is not in the form', () => {
        const pageFormFields = { '_1': 'one' };
        const fieldIdToSubstitute = '_2';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBeUndefined();
      });

      it('should return label value if form is an object with a collection that is multivalue list', () => {
        const pageFormFields = { '_1_one': ['code1', 'code2'], '_1_one-LABEL': ['label1', 'label2'] };
        const fieldIdToSubstitute = '_1_one';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toEqual('label1, label2');
      });
    });

    describe('complex types', () => {

      it('should return leaf value', () => {
        const pageFormFields = {
          'complex': {
            'nested': 'nested value', 'nested2': 'nested value2', 'nested3': { 'doubleNested': 'double nested' }
          }
        };
        const fieldIdToSubstitute = 'complex.nested3.doubleNested';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBe('double nested');
      });

      it('should return undefined if complex leaf value', () => {
        const pageFormFields = {
          'complex': {
            'nested': 'nested value', 'nested2': 'nested value2', 'nested3': { 'doubleNested': 'double nested' }
          }
        };
        const fieldIdToSubstitute = 'complex.nested3';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBeUndefined();
      });

      it('should return undefined if reference key has trailing delimiter', () => {
        const pageFormFields = {
          'complex': {
            'nested': 'nested value', 'nested2': 'nested value2'
            , 'nested3': { 'doubleNested': 'double nested' }
          }
        };
        const fieldIdToSubstitute = 'complex.nested3.';
        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBeUndefined();
      });

      it('should return undefined if reference key not matched', () => {
        const pageFormFields = {
          'complex': {
            'nested': 'nested value', 'nested2': 'nested value2'
            , 'nested3': { 'doubleNested': 'double nested' }
          }
        };
        let fieldIdToSubstitute = 'complex.nested21';
        let actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBeUndefined();
        fieldIdToSubstitute = 'complex.neste';
        actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);
        expect(actual).toBeUndefined();
      });

    });

    describe('complex of collection of complex types', () => {
      it('should return collection item by index', () => {
        const pageFormFields = {
          'topComplex': {
            'field': 'value',
            'collection': [
              { 'value': {
                'complex': { 'nested': 'nested value1', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested7' } } } }
              },
              { 'value': {
                'complex': { 'nested': 'nested value2', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested8' } } } }
              },
              { 'value': {
                'complex': { 'nested': 'nested value3', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested9' } } } }
              }
            ]
          }
        };
        const fieldIdToSubstitute = 'topComplex.collection.complex.nested2.doubleNested.trippleNested';

        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 1);

        expect(actual).toBe('tripple nested8');
      });

      it('should return undefined if collection item absent for given index', () => {
        const pageFormFields = {
          'topComplex': {
            'field': 'value',
            'collection': [
              { 'value': {
                'complex': { 'nested': 'nested value1', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested7' } } } }
              },
              { 'value': {
                'complex': { 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested8' } } } }
              },
              { 'value': {
                'complex': { 'nested': 'nested value3', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested9' } } } }
              }
            ]
          }
        };
        const fieldIdToSubstitute = 'topComplex.collection.complex.nested';

        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 1);

        expect(actual).toBeUndefined();
      });

      it('should return undefined if collection item is complex leaf value', () => {
        const pageFormFields = {
          'topComplex': {
            'collection': [
              { 'value': {
                'complex': { 'nested': 'nested value1', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested7' } } } }
              },
              { 'value': {
                'complex': { 'nested': 'nested value2', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested8' } } } }
              },
              { 'value': {
                'complex': { 'nested': 'nested value3', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested9' } } } }
              }
            ]
          }
        };
        const fieldIdToSubstitute = 'topComplex.collection.complex.nested2.doubleNested';

        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 1);

        expect(actual).toBeUndefined();
      });
    });

    describe('collection types', () => {

      it('should return simple text collection item by index', () => {
        const pageFormFields = { '_1_one': [{ 'value': 'value1' }, { 'value': 'value2' }], '_3_three': 'simpleValue' };
        const fieldIdToSubstitute = '_1_one';

        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);

        expect(actual).toEqual('value1, value2');
      });

      it('should return simple number collection item by index', () => {
        const pageFormFields = { '_1_one': [{ 'value': 35 }, { 'value': 45 }], '_3_three': 'simpleValue' };
        const fieldIdToSubstitute = '_1_one';

        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 0);

        expect(actual).toEqual('35, 45');
      });

      it('should return undefined if collection item is complex leaf value', () => {
        const pageFormFields = {
          '_1_one': [{ 'value': { 'id': 'complex1' } }, { 'value': { 'id': 'complex2' } }],
          '_3_three': 'simpleValue'
        };
        const fieldIdToSubstitute = '_1_one';

        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 1);

        expect(actual).toBeUndefined();
      });

      it('should return undefined if collection item is another collection', () => {
        const pageFormFields = {
          '_1_one': [{ 'value': [{ 'value': { 'id': 'complex1' } }] }, { 'value': [{ 'value': { 'id': 'complex2' } }] }],
          '_3_three': 'simpleValue'
        };
        const fieldIdToSubstitute = '_1_one';

        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 1);

        expect(actual).toBeUndefined();
      });
    });

    describe('collection of complex types', () => {

      it('should return simple text collection item by index', () => {
        const pageFormFields = {
          'collection': [
            { 'value': {
              'complex': { 'nested': 'nested value1', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested7' } } } }
            },
            { 'value': {
              'complex': { 'nested': 'nested value2', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested8' } } } }
            },
            { 'value': {
              'complex': { 'nested': 'nested value3', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested9' } } } }
            }
          ]
        };
        const fieldIdToSubstitute = 'collection.complex.nested2.doubleNested.trippleNested';

        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 2);

        expect(actual).toBe('tripple nested9');
      });

      it('should return undefined if collection item absent for given index', () => {
        const pageFormFields = {
          'collection': [
            { 'value': {
              'complex': { 'nested': 'nested value1', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested7' } } } }
            },
            { 'value': {
              'complex': { 'nested': 'nested value1' } }
            },
            { 'value': {
              'complex': { 'nested': 'nested value3', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested9' } } } }
            }
          ]
        };
        const fieldIdToSubstitute = 'collection.complex.nested2.doubleNested.trippleNested';

        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 1);

        expect(actual).toBeUndefined();
      });

      it('should return undefined if collection item is a complex leaf value', () => {
        const pageFormFields = {
          'collection': [
            { 'value': {
              'complex': { 'nested': 'nested value1', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested7' } } } }
            },
            { 'value': {
              'complex': { 'nested': 'nested value2', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested8' } } } }
            },
            { 'value': {
              'complex': { 'nested': 'nested value3', 'nested2': { 'doubleNested': { 'trippleNested': 'tripple nested9' } } } }
            }
          ]
        };
        const fieldIdToSubstitute = 'collection.complex.nested2.doubleNested';

        const actual = FormValueService.getFieldValue(pageFormFields, fieldIdToSubstitute, 2);

        expect(actual).toBeUndefined();
      });
    });
  });
});
