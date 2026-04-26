import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AppResponse} from '../models/app-response';
import {AppConstants} from '../constants/app-constants';
import {map, Observable} from 'rxjs';
import {OaaaServiceDto} from "../../pages/service-management/types/oaaa-service-dto";


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    })
};

@Injectable({
    providedIn: 'root'
})
export class ServiceManagementService {

    constructor(private http: HttpClient) {
    }

    retrieveOaaaServices() {
        return this.http.get<AppResponse<OaaaServiceDto[]>>(`${AppConstants.API.RETRIEVE_OAAA_SERVICES}`);
    }

    retrieveOaaaServiceById(serviceId: number) {
        return this.http.get<AppResponse<OaaaServiceDto>>(`${AppConstants.API.RETRIEVE_OAAA_SERVICES}${serviceId}/`);
    }

    editService(serviceId: number, oaaaServiceDto: OaaaServiceDto): Observable<void> {
        return this.http.put<void>(`${AppConstants.API.RETRIEVE_OAAA_SERVICES}${serviceId}/`, oaaaServiceDto);
    }

    listServicesByCategoryId(categoryId: string) {
        return this.http.get<AppResponse<OaaaServiceDto[]>>(`${AppConstants.API.RETRIEVE_OAAA_SERVICES}category/${categoryId}/`)
            .pipe(map((ret) => ret.data));
    }

    listCatalogueServices() {
        return this.http.get<AppResponse<OaaaServiceDto[]>>(`${AppConstants.API.RETRIEVE_OAAA_SERVICES}catalogue-services/`);
    }
}
