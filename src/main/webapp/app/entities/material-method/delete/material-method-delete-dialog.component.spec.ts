jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MaterialMethodService } from '../service/material-method.service';

import { MaterialMethodDeleteDialogComponent } from './material-method-delete-dialog.component';

describe('MaterialMethod Management Delete Component', () => {
  let comp: MaterialMethodDeleteDialogComponent;
  let fixture: ComponentFixture<MaterialMethodDeleteDialogComponent>;
  let service: MaterialMethodService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MaterialMethodDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(MaterialMethodDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MaterialMethodDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MaterialMethodService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
