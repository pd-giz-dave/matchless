import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { MaterialMethodComponent } from './list/material-method.component';
import { MaterialMethodDetailComponent } from './detail/material-method-detail.component';
import { MaterialMethodUpdateComponent } from './update/material-method-update.component';
import MaterialMethodResolve from './route/material-method-routing-resolve.service';

const materialMethodRoute: Routes = [
  {
    path: '',
    component: MaterialMethodComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MaterialMethodDetailComponent,
    resolve: {
      materialMethod: MaterialMethodResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MaterialMethodUpdateComponent,
    resolve: {
      materialMethod: MaterialMethodResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MaterialMethodUpdateComponent,
    resolve: {
      materialMethod: MaterialMethodResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default materialMethodRoute;
