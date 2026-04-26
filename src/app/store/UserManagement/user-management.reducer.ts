import { createReducer, on } from '@ngrx/store';
import * as UserManagementActions from './user-management.actions';

export interface UserManagementState {
  activeTab: number;
}

export const initialState: UserManagementState = {
  activeTab: 1
};

export const userManagementReducer = createReducer(
  initialState,
  on(UserManagementActions.setActiveTab, (state, { tabNumber }) => ({
    ...state,
    activeTab: tabNumber
  })),
  on(UserManagementActions.resetActiveTab, (state) => ({
    ...state,
    activeTab: 1
  }))
);
