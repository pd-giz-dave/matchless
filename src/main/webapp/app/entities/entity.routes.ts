import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'material',
    data: { pageTitle: 'Materials' },
    loadChildren: () => import('./material/material.routes'),
  },
  {
    path: 'material-method',
    data: { pageTitle: 'MaterialMethods' },
    loadChildren: () => import('./material-method/material-method.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
