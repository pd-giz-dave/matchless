import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IMaterial } from 'app/entities/material/material.model';
import { MaterialService } from 'app/entities/material/service/material.service';
import { MaterialMethodService } from '../service/material-method.service';
import { IMaterialMethod } from '../material-method.model';
import { MaterialMethodFormService } from './material-method-form.service';

import { MaterialMethodUpdateComponent } from './material-method-update.component';

describe('MaterialMethod Management Update Component', () => {
  let comp: MaterialMethodUpdateComponent;
  let fixture: ComponentFixture<MaterialMethodUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let materialMethodFormService: MaterialMethodFormService;
  let materialMethodService: MaterialMethodService;
  let materialService: MaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MaterialMethodUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MaterialMethodUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MaterialMethodUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    materialMethodFormService = TestBed.inject(MaterialMethodFormService);
    materialMethodService = TestBed.inject(MaterialMethodService);
    materialService = TestBed.inject(MaterialService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Material query and add missing value', () => {
      const materialMethod: IMaterialMethod = { id: 456 };
      const name: IMaterial = { id: 9700 };
      materialMethod.name = name;

      const materialCollection: IMaterial[] = [{ id: 5208 }];
      jest.spyOn(materialService, 'query').mockReturnValue(of(new HttpResponse({ body: materialCollection })));
      const additionalMaterials = [name];
      const expectedCollection: IMaterial[] = [...additionalMaterials, ...materialCollection];
      jest.spyOn(materialService, 'addMaterialToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ materialMethod });
      comp.ngOnInit();

      expect(materialService.query).toHaveBeenCalled();
      expect(materialService.addMaterialToCollectionIfMissing).toHaveBeenCalledWith(
        materialCollection,
        ...additionalMaterials.map(expect.objectContaining),
      );
      expect(comp.materialsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const materialMethod: IMaterialMethod = { id: 456 };
      const name: IMaterial = { id: 5050 };
      materialMethod.name = name;

      activatedRoute.data = of({ materialMethod });
      comp.ngOnInit();

      expect(comp.materialsSharedCollection).toContain(name);
      expect(comp.materialMethod).toEqual(materialMethod);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMaterialMethod>>();
      const materialMethod = { id: 123 };
      jest.spyOn(materialMethodFormService, 'getMaterialMethod').mockReturnValue(materialMethod);
      jest.spyOn(materialMethodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ materialMethod });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: materialMethod }));
      saveSubject.complete();

      // THEN
      expect(materialMethodFormService.getMaterialMethod).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(materialMethodService.update).toHaveBeenCalledWith(expect.objectContaining(materialMethod));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMaterialMethod>>();
      const materialMethod = { id: 123 };
      jest.spyOn(materialMethodFormService, 'getMaterialMethod').mockReturnValue({ id: null });
      jest.spyOn(materialMethodService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ materialMethod: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: materialMethod }));
      saveSubject.complete();

      // THEN
      expect(materialMethodFormService.getMaterialMethod).toHaveBeenCalled();
      expect(materialMethodService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMaterialMethod>>();
      const materialMethod = { id: 123 };
      jest.spyOn(materialMethodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ materialMethod });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(materialMethodService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMaterial', () => {
      it('Should forward to materialService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(materialService, 'compareMaterial');
        comp.compareMaterial(entity, entity2);
        expect(materialService.compareMaterial).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
