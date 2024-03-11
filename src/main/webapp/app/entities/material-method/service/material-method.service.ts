import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMaterialMethod, NewMaterialMethod } from '../material-method.model';

export type PartialUpdateMaterialMethod = Partial<IMaterialMethod> & Pick<IMaterialMethod, 'id'>;

export type EntityResponseType = HttpResponse<IMaterialMethod>;
export type EntityArrayResponseType = HttpResponse<IMaterialMethod[]>;

@Injectable({ providedIn: 'root' })
export class MaterialMethodService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/material-methods');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(materialMethod: NewMaterialMethod): Observable<EntityResponseType> {
    return this.http.post<IMaterialMethod>(this.resourceUrl, materialMethod, { observe: 'response' });
  }

  update(materialMethod: IMaterialMethod): Observable<EntityResponseType> {
    return this.http.put<IMaterialMethod>(`${this.resourceUrl}/${this.getMaterialMethodIdentifier(materialMethod)}`, materialMethod, {
      observe: 'response',
    });
  }

  partialUpdate(materialMethod: PartialUpdateMaterialMethod): Observable<EntityResponseType> {
    return this.http.patch<IMaterialMethod>(`${this.resourceUrl}/${this.getMaterialMethodIdentifier(materialMethod)}`, materialMethod, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMaterialMethod>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMaterialMethod[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMaterialMethodIdentifier(materialMethod: Pick<IMaterialMethod, 'id'>): number {
    return materialMethod.id;
  }

  compareMaterialMethod(o1: Pick<IMaterialMethod, 'id'> | null, o2: Pick<IMaterialMethod, 'id'> | null): boolean {
    return o1 && o2 ? this.getMaterialMethodIdentifier(o1) === this.getMaterialMethodIdentifier(o2) : o1 === o2;
  }

  addMaterialMethodToCollectionIfMissing<Type extends Pick<IMaterialMethod, 'id'>>(
    materialMethodCollection: Type[],
    ...materialMethodsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const materialMethods: Type[] = materialMethodsToCheck.filter(isPresent);
    if (materialMethods.length > 0) {
      const materialMethodCollectionIdentifiers = materialMethodCollection.map(
        materialMethodItem => this.getMaterialMethodIdentifier(materialMethodItem)!,
      );
      const materialMethodsToAdd = materialMethods.filter(materialMethodItem => {
        const materialMethodIdentifier = this.getMaterialMethodIdentifier(materialMethodItem);
        if (materialMethodCollectionIdentifiers.includes(materialMethodIdentifier)) {
          return false;
        }
        materialMethodCollectionIdentifiers.push(materialMethodIdentifier);
        return true;
      });
      return [...materialMethodsToAdd, ...materialMethodCollection];
    }
    return materialMethodCollection;
  }
}
