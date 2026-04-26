import { BehaviorSubject } from 'rxjs';
import { User } from '../models/auth.models';
import { AppConstants } from '../constants/app-constants';


export class UserState {

  private static userState: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(UserState.loadUserFromStorage());


  private static loadUserFromStorage(): User | null {
    const userJson = localStorage.getItem(AppConstants.PERSISTED_KEYS.CURRENT_USER);
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch (e) {
        console.error('Failed to parse user JSON:', e);
        return null;
      }
    }
    return null;
  }

  static getUserState(): BehaviorSubject<User | null> {
    return this.userState;
  }

  static setUserState(user: User): void {
    if (user) {
      localStorage.setItem(AppConstants.PERSISTED_KEYS.CURRENT_USER, JSON.stringify(user));
    }
    this.userState.next(user);
  }

}
