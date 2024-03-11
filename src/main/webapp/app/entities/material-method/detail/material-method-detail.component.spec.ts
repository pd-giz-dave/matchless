import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MaterialMethodDetailComponent } from './material-method-detail.component';

describe('MaterialMethod Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialMethodDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: MaterialMethodDetailComponent,
              resolve: { materialMethod: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MaterialMethodDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load materialMethod on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MaterialMethodDetailComponent);

      // THEN
      expect(instance.materialMethod).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
