import { IMaterialMethod } from 'app/entities/material-method/material-method.model';

export interface IMaterial {
  id: number;
  name?: string | null;
  description?: string | null;
  methods?: IMaterialMethod[] | null;
}

export type NewMaterial = Omit<IMaterial, 'id'> & { id: null };
