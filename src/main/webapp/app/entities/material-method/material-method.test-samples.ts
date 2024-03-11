import { IMaterialMethod, NewMaterialMethod } from './material-method.model';

export const sampleWithRequiredData: IMaterialMethod = {
  id: 20159,
  type: 'MAKE',
};

export const sampleWithPartialData: IMaterialMethod = {
  id: 20930,
  type: 'MAKE',
};

export const sampleWithFullData: IMaterialMethod = {
  id: 22001,
  type: 'BUY',
};

export const sampleWithNewData: NewMaterialMethod = {
  type: 'BUY',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
