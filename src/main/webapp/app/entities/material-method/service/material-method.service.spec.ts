import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMaterialMethod } from '../material-method.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../material-method.test-samples';

import { MaterialMethodService } from './material-method.service';

const requireRestSample: IMaterialMethod = {
  ...sampleWithRequiredData,
};

describe('MaterialMethod Service', () => {
  let service: MaterialMethodService;
  let httpMock: HttpTestingController;
  let expectedResult: IMaterialMethod | IMaterialMethod[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MaterialMethodService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a MaterialMethod', () => {
      const materialMethod = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(materialMethod).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MaterialMethod', () => {
      const materialMethod = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(materialMethod).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MaterialMethod', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MaterialMethod', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MaterialMethod', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMaterialMethodToCollectionIfMissing', () => {
      it('should add a MaterialMethod to an empty array', () => {
        const materialMethod: IMaterialMethod = sampleWithRequiredData;
        expectedResult = service.addMaterialMethodToCollectionIfMissing([], materialMethod);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(materialMethod);
      });

      it('should not add a MaterialMethod to an array that contains it', () => {
        const materialMethod: IMaterialMethod = sampleWithRequiredData;
        const materialMethodCollection: IMaterialMethod[] = [
          {
            ...materialMethod,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMaterialMethodToCollectionIfMissing(materialMethodCollection, materialMethod);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MaterialMethod to an array that doesn't contain it", () => {
        const materialMethod: IMaterialMethod = sampleWithRequiredData;
        const materialMethodCollection: IMaterialMethod[] = [sampleWithPartialData];
        expectedResult = service.addMaterialMethodToCollectionIfMissing(materialMethodCollection, materialMethod);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(materialMethod);
      });

      it('should add only unique MaterialMethod to an array', () => {
        const materialMethodArray: IMaterialMethod[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const materialMethodCollection: IMaterialMethod[] = [sampleWithRequiredData];
        expectedResult = service.addMaterialMethodToCollectionIfMissing(materialMethodCollection, ...materialMethodArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const materialMethod: IMaterialMethod = sampleWithRequiredData;
        const materialMethod2: IMaterialMethod = sampleWithPartialData;
        expectedResult = service.addMaterialMethodToCollectionIfMissing([], materialMethod, materialMethod2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(materialMethod);
        expect(expectedResult).toContain(materialMethod2);
      });

      it('should accept null and undefined values', () => {
        const materialMethod: IMaterialMethod = sampleWithRequiredData;
        expectedResult = service.addMaterialMethodToCollectionIfMissing([], null, materialMethod, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(materialMethod);
      });

      it('should return initial array if no MaterialMethod is added', () => {
        const materialMethodCollection: IMaterialMethod[] = [sampleWithRequiredData];
        expectedResult = service.addMaterialMethodToCollectionIfMissing(materialMethodCollection, undefined, null);
        expect(expectedResult).toEqual(materialMethodCollection);
      });
    });

    describe('compareMaterialMethod', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMaterialMethod(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMaterialMethod(entity1, entity2);
        const compareResult2 = service.compareMaterialMethod(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMaterialMethod(entity1, entity2);
        const compareResult2 = service.compareMaterialMethod(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMaterialMethod(entity1, entity2);
        const compareResult2 = service.compareMaterialMethod(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
