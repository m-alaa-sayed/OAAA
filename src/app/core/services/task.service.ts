import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../constants/app-constants';
import { AppResponse } from '../models/app-response';
import { RequestDto } from 'src/app/pages/user-tasks/model/request-dto';

@Injectable({
    providedIn: 'root'
})
export class TaskService {


    constructor(private http: HttpClient) { }

    getTasksCount(): Observable<AppResponse<number>> {
        return this.http.post<AppResponse<number>>(AppConstants.API.TASK_COUNT, {});
    }

    getUserTasks(searchDto:any) {
        return this.http.post<AppResponse<RequestDto[]>>(AppConstants.API.TASKS, {searchDto});
    }
}