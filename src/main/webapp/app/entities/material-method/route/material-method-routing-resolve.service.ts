import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMaterialMethod } from '../material-method.model';
import { MaterialMethodService } from '../service/material-method.service';

export const materialMethodResolve = (route: ActivatedRouteSnapshot): Observable<null | IMaterialMethod> => {
  const id = route.params['id'];
  if (id) {
    return inject(MaterialMethodService)
      .find(id)
      .pipe(
        mergeMap((materialMethod: HttpResponse<IMaterialMethod>) => {
          if (materialMethod.body) {
            return of(materialMethod.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default materialMethodResolve;
