import { IMaterial } from 'app/entities/material/material.model';
import { MethodType } from 'app/entities/enumerations/method-type.model';

export interface IMaterialMethod {
  id: number;
  type?: keyof typeof MethodType | null;
  name?: IMaterial | null;
}

export type NewMaterialMethod = Omit<IMaterialMethod, 'id'> & { id: null };
