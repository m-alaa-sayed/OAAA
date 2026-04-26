import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserManagementState } from './user-management.reducer';

export const selectUserManagementState = createFeatureSelector<UserManagementState>('userManagement');

export const selectActiveTab = createSelector(
  selectUserManagementState,
  (state: UserManagementState) => state.activeTab
);
