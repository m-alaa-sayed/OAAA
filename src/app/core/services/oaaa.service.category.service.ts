import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppResponse} from "../models/app-response";
import {AppConstants} from "../constants/app-constants";
import {map, Observable} from "rxjs";
import {OaaaServiceCategorySearchDto} from "../models/oaaa.service.category.search.dto";
import {OaaaServiceCategoryDto} from "../models/oaaa.service.category.dto";

@Injectable({providedIn: 'root'})
export class OaaaServiceCategoryService {

    constructor(private http: HttpClient) {
    }

    getById(id: string): Observable<OaaaServiceCategoryDto> {
        return this.http.get<AppResponse<OaaaServiceCategoryDto>>(`${AppConstants.API.SERVICES_CATEGORY_MANAGEMENT}${id}/`)
            .pipe(map((ret) => ret.data));
    }

    search(searchDto?: OaaaServiceCategorySearchDto): Observable<OaaaServiceCategoryDto[]> {
        return this.http.post<AppResponse<OaaaServiceCategoryDto[]>>(`${AppConstants.API.SERVICES_CATEGORY_MANAGEMENT}search/`, (searchDto ? searchDto : {}))
            .pipe(map((ret) => ret.data));
    }

    add(dto: OaaaServiceCategoryDto): Observable<AppResponse<void>> {
        return this.http.post<AppResponse<void>>(`${AppConstants.API.SERVICES_CATEGORY_MANAGEMENT}`, dto);
    }

    edit(dto: OaaaServiceCategoryDto): Observable<AppResponse<void>> {
        return this.http.put<AppResponse<void>>(`${AppConstants.API.SERVICES_CATEGORY_MANAGEMENT}${dto.id}/`, dto);
    }

    deleteById(id: string): Observable<AppResponse<void>> {
        return this.http.delete<AppResponse<void>>(`${AppConstants.API.SERVICES_CATEGORY_MANAGEMENT}${id}/`);
    }
}