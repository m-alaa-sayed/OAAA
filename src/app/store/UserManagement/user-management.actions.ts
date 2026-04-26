import { createAction, props } from '@ngrx/store';

export const setActiveTab = createAction(
  '[User Management] Set Active Tab',
  props<{ tabNumber: number }>()
);

export const resetActiveTab = createAction(
  '[User Management] Reset Active Tab'
);
