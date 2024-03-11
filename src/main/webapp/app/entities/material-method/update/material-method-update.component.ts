import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMaterial } from 'app/entities/material/material.model';
import { MaterialService } from 'app/entities/material/service/material.service';
import { MethodType } from 'app/entities/enumerations/method-type.model';
import { MaterialMethodService } from '../service/material-method.service';
import { IMaterialMethod } from '../material-method.model';
import { MaterialMethodFormService, MaterialMethodFormGroup } from './material-method-form.service';

@Component({
  standalone: true,
  selector: 'jhi-material-method-update',
  templateUrl: './material-method-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MaterialMethodUpdateComponent implements OnInit {
  isSaving = false;
  materialMethod: IMaterialMethod | null = null;
  methodTypeValues = Object.keys(MethodType);

  materialsSharedCollection: IMaterial[] = [];

  editForm: MaterialMethodFormGroup = this.materialMethodFormService.createMaterialMethodFormGroup();

  constructor(
    protected materialMethodService: MaterialMethodService,
    protected materialMethodFormService: MaterialMethodFormService,
    protected materialService: MaterialService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareMaterial = (o1: IMaterial | null, o2: IMaterial | null): boolean => this.materialService.compareMaterial(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ materialMethod }) => {
      this.materialMethod = materialMethod;
      if (materialMethod) {
        this.updateForm(materialMethod);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const materialMethod = this.materialMethodFormService.getMaterialMethod(this.editForm);
    if (materialMethod.id !== null) {
      this.subscribeToSaveResponse(this.materialMethodService.update(materialMethod));
    } else {
      this.subscribeToSaveResponse(this.materialMethodService.create(materialMethod));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMaterialMethod>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(materialMethod: IMaterialMethod): void {
    this.materialMethod = materialMethod;
    this.materialMethodFormService.resetForm(this.editForm, materialMethod);

    this.materialsSharedCollection = this.materialService.addMaterialToCollectionIfMissing<IMaterial>(
      this.materialsSharedCollection,
      materialMethod.name,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.materialService
      .query()
      .pipe(map((res: HttpResponse<IMaterial[]>) => res.body ?? []))
      .pipe(
        map((materials: IMaterial[]) =>
          this.materialService.addMaterialToCollectionIfMissing<IMaterial>(materials, this.materialMethod?.name),
        ),
      )
      .subscribe((materials: IMaterial[]) => (this.materialsSharedCollection = materials));
  }
}
