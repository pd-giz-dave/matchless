import { IMaterial, NewMaterial } from './material.model';

export const sampleWithRequiredData: IMaterial = {
  id: 32180,
  name: 'than warn markup',
};

export const sampleWithPartialData: IMaterial = {
  id: 17490,
  name: 'modulo opportunity',
  description: 'jolly focused dock',
};

export const sampleWithFullData: IMaterial = {
  id: 2336,
  name: 'coordinated prompt',
  description: 'catalog',
};

export const sampleWithNewData: NewMaterial = {
  name: 'as',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
