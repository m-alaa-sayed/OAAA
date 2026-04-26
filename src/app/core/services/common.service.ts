import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppResponse } from '../models/app-response';
import { CountryDto } from '../models/country-dto';
import { AppConstants } from '../constants/app-constants';
import { Observable } from 'rxjs';
import { CityDto } from '../models/city-dto';
import { environment } from "../../../environments/environment";
import { GovernorateDto } from '../models/governorate-dto';
import { WilayatDto } from '../models/wilayat-dto';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  getAllCountries() {
    return this.http.get<AppResponse<CountryDto[]>>(AppConstants.API.GET_ALL_COUNTRIES);
  }

  getAllGovernorates() {
    return this.http.get<AppResponse<GovernorateDto[]>>(AppConstants.API.GET_ALL_GOVERNORATES);
  }

  getCitiesByCountryId(countryId: number) {
    return this.http.get<AppResponse<CityDto[]>>(`${AppConstants.API.GET_CITIES}/${countryId}`);
  }

  getWilayatByGovernorateId(governorateId: number) {
    return this.http.get<AppResponse<WilayatDto[]>>(`${AppConstants.API.GET_WILAYAT}/${governorateId}`);
  }

  getByLookupCode(code: string) {
    return this.http.get<AppResponse<CountryDto[]>>(`${AppConstants.API.GET_SYSTEM_LOOKUPS}${code}`);
  }

  uploadOaaaFile(bucket: string, file: File, email: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);
    return this.http.post<any>(`${AppConstants.API.UPLOAD_FILE}${bucket}`, formData);
  }



  /**
  * validateService
  * @param serviceCode
  */
  validateService(serviceCode: string) {
    return this.http.get<AppResponse<void>>(`${AppConstants.API.SERVICE_VALIDATION}${serviceCode}`);
  }

  uploadFileToOci(bucket: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${environment.baseURL}/oaaaqa/documents/oci/api/upload/${bucket}`, formData);
  }

  getOciPreAuthenticatedUrl(bucket: string, objectName: string): Observable<any> {
    return this.http.get<any>(`${environment.baseURL}/oaaaqa/documents/oci/api/pre-authenticated-url/${bucket}/${objectName}`);
  }
}
