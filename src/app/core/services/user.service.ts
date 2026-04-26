import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/auth.models';
import { AppConstants } from '../constants/app-constants';
import { map } from 'rxjs';
import { AppResponse } from '../models/app-response';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient) { }




    /**
    * findUser
    * 
    */
    findUser() {
        return this.http.get<AppResponse<User>>(`${AppConstants.API.USER}`);
    }

    /***
     * Get All User
     */
    getAll() {
        return this.http.get<User[]>(`api/users`);
    }

    /***
     * Facked User Register
     */
    register(user: User) {
        return this.http.post(`/users/register`, user);
    }

    updateProfile(user: User){
        return this.http.patch<AppResponse<void>>(`${AppConstants.API.UPDATE_PROFILE}`, user);
    }

    changePassword(changePasswordObj: any){
        return this.http.post<AppResponse<void>>(`${AppConstants.API.CHANGE_PASSWORD}`, changePasswordObj);
    }
}
