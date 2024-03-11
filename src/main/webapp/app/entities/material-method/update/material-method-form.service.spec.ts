import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../material-method.test-samples';

import { MaterialMethodFormService } from './material-method-form.service';

describe('MaterialMethod Form Service', () => {
  let service: MaterialMethodFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialMethodFormService);
  });

  describe('Service methods', () => {
    describe('createMaterialMethodFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMaterialMethodFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing IMaterialMethod should create a new form with FormGroup', () => {
        const formGroup = service.createMaterialMethodFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getMaterialMethod', () => {
      it('should return NewMaterialMethod for default MaterialMethod initial value', () => {
        const formGroup = service.createMaterialMethodFormGroup(sampleWithNewData);

        const materialMethod = service.getMaterialMethod(formGroup) as any;

        expect(materialMethod).toMatchObject(sampleWithNewData);
      });

      it('should return NewMaterialMethod for empty MaterialMethod initial value', () => {
        const formGroup = service.createMaterialMethodFormGroup();

        const materialMethod = service.getMaterialMethod(formGroup) as any;

        expect(materialMethod).toMatchObject({});
      });

      it('should return IMaterialMethod', () => {
        const formGroup = service.createMaterialMethodFormGroup(sampleWithRequiredData);

        const materialMethod = service.getMaterialMethod(formGroup) as any;

        expect(materialMethod).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMaterialMethod should not enable id FormControl', () => {
        const formGroup = service.createMaterialMethodFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMaterialMethod should disable id FormControl', () => {
        const formGroup = service.createMaterialMethodFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
