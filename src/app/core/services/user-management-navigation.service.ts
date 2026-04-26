import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootReducerState } from 'src/app/store';
import { setActiveTab } from 'src/app/store/UserManagement/user-management.actions';

@Injectable({
  providedIn: 'root'
})
export class UserManagementNavigationService {

  constructor(private store: Store<RootReducerState>) { }

  /**
   * Sets the active tab before navigating to users detail pages
   */
  setUsersTab(): void {
    this.store.dispatch(setActiveTab({ tabNumber: 1 }));
  }

  /**
   * Sets the active tab before navigating to roles detail pages
   */
  setRolesTab(): void {
    this.store.dispatch(setActiveTab({ tabNumber: 2 }));
  }

  /**
   * Resets tab to default (users)
   */
  resetTab(): void {
    this.store.dispatch(setActiveTab({ tabNumber: 1 }));
  }
}