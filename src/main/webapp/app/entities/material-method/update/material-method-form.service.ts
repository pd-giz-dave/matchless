import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMaterialMethod, NewMaterialMethod } from '../material-method.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMaterialMethod for edit and NewMaterialMethodFormGroupInput for create.
 */
type MaterialMethodFormGroupInput = IMaterialMethod | PartialWithRequiredKeyOf<NewMaterialMethod>;

type MaterialMethodFormDefaults = Pick<NewMaterialMethod, 'id'>;

type MaterialMethodFormGroupContent = {
  id: FormControl<IMaterialMethod['id'] | NewMaterialMethod['id']>;
  type: FormControl<IMaterialMethod['type']>;
  name: FormControl<IMaterialMethod['name']>;
};

export type MaterialMethodFormGroup = FormGroup<MaterialMethodFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MaterialMethodFormService {
  createMaterialMethodFormGroup(materialMethod: MaterialMethodFormGroupInput = { id: null }): MaterialMethodFormGroup {
    const materialMethodRawValue = {
      ...this.getFormDefaults(),
      ...materialMethod,
    };
    return new FormGroup<MaterialMethodFormGroupContent>({
      id: new FormControl(
        { value: materialMethodRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      type: new FormControl(materialMethodRawValue.type, {
        validators: [Validators.required],
      }),
      name: new FormControl(materialMethodRawValue.name),
    });
  }

  getMaterialMethod(form: MaterialMethodFormGroup): IMaterialMethod | NewMaterialMethod {
    return form.getRawValue() as IMaterialMethod | NewMaterialMethod;
  }

  resetForm(form: MaterialMethodFormGroup, materialMethod: MaterialMethodFormGroupInput): void {
    const materialMethodRawValue = { ...this.getFormDefaults(), ...materialMethod };
    form.reset(
      {
        ...materialMethodRawValue,
        id: { value: materialMethodRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MaterialMethodFormDefaults {
    return {
      id: null,
    };
  }
}
