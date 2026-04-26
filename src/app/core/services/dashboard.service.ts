import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { AppConstants } from '../constants/app-constants';
import { AppResponse } from '../models/app-response';
import { DashboardCountsRatiosResponse } from '../models/dashboard-counts-ratios.model';
import {
  DashboardStatusDistributionItem,
  DashboardStatusDistributionResponse
} from '../models/dashboard-status-distribution.model';
import {
  DashboardYearComparisonItem,
  DashboardYearComparisonResponse
} from '../models/dashboard-year-comparison.model';
import { DashboardSpecializationDistributionResponse } from '../models/dashboard-specialization-distribution.model';
import { DashboardCountryDistributionResponse } from '../models/dashboard-country-distribution.model';
import { DashboardEqaActivitiesResponse } from '../models/dashboard-eqa-activities.model';
import { DashboardJoinRequestsResponse } from '../models/dashboard-join-requests.model';
import { DashboardWithdrawalRequestsResponse } from '../models/dashboard-withdrawal-requests.model';
import { DashboardCandidatesRegisterResponse } from '../models/dashboard-candidates-register.model';
import { DashboardReviewersRegisterResponse } from '../models/dashboard-reviewers-register.model';
import { DashboardOqfCountsRatiosResponse } from '../models/dashboard-oqf-counts-ratios.model';
import { DashboardOqfStatusDistributionResponse } from '../models/dashboard-oqf-status-distribution.model';
import { DashboardOqfYearComparisonResponse } from '../models/dashboard-oqf-year-comparison.model';
import { DashboardOqfSpecializationDistributionResponse } from '../models/dashboard-oqf-specialization-distribution.model';
import { DashboardOqfCountryDistributionResponse } from '../models/dashboard-oqf-country-distribution.model';
import { DashboardOqfEmployerDistributionResponse } from '../models/dashboard-oqf-employer-distribution.model';
import { DashboardOqfEqaActivitiesResponse } from '../models/dashboard-oqf-eqa-activities.model';
import { DashboardOqfJoinRequestsResponse } from '../models/dashboard-oqf-join-requests.model';
import {
  DashboardCseqaActivitiesParticipationResponse,
  DashboardCseqaCountryDistributionResponse,
  DashboardCseqaCountsRatiosResponse,
  DashboardCseqaGovernorateWilayatDistributionResponse,
  DashboardCseqaJoinRequestsByStatusResponse,
  DashboardCseqaNationalityDistributionResponse,
  DashboardCseqaQaEvaluationDistributionResponse,
  DashboardCseqaSpecializationDistributionResponse,
  DashboardCseqaStatusDistributionItem,
  DashboardCseqaStatusDistributionResponse,
  DashboardCseqaTeamLeaderEvaluationDistributionResponse,
  DashboardCseqaWithdrawalRequestsByStatusResponse,
  DashboardCseqaYearComparisonItem,
  DashboardCseqaYearComparisonResponse
} from '../models/dashboard-cseqa.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly requestCache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) { }

  private fromCache<T>(cacheKey: string, requestFactory: () => Observable<T>): Observable<T> {
    const cachedRequest = this.requestCache.get(cacheKey) as Observable<T> | undefined;

    if (cachedRequest) {
      return cachedRequest;
    }

    const request$ = requestFactory().pipe(
      shareReplay(1),
      catchError((error) => {
        this.requestCache.delete(cacheKey);
        return throwError(() => error);
      })
    );

    this.requestCache.set(cacheKey, request$);
    return request$;
  }

  clearDashboardCache(): void {
    this.requestCache.clear();
  }

  getCountsRatios(): Observable<DashboardCountsRatiosResponse> {
    return this.fromCache('getCountsRatios', () =>
      this.http.get<AppResponse<DashboardCountsRatiosResponse>>(
        AppConstants.API.DASHBOARD_COUNTS_RATIOS
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getStatusDistribution(): Observable<DashboardStatusDistributionItem[]> {
    return this.fromCache('getStatusDistribution', () =>
      this.http.get<AppResponse<DashboardStatusDistributionResponse>>(
        AppConstants.API.DASHBOARD_DISTRIBUTION_BY_STATUS
      ).pipe(
        map((response) => response.data.rows ?? [])
      )
    );
  }

  getYearComparison(
    previousYear: number,
    currentYear: number,
    reviewerType: string = 'ALL',
    region?: string
  ): Observable<DashboardYearComparisonItem[]> {
    let params = new HttpParams()
      .set('previousYear', previousYear)
      .set('currentYear', currentYear)
      .set('reviewerType', reviewerType);

    if (region) {
      params = params.set('region', region);
    }

    const cacheKey = `getYearComparison:${previousYear}:${currentYear}:${reviewerType}:${region || ''}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardYearComparisonResponse>>(
        AppConstants.API.DASHBOARD_YEAR_COMPARISON,
        { params }
      ).pipe(
        map((response) => response.data.rows ?? [])
      )
    );
  }

  getSpecializationDistribution(): Observable<DashboardSpecializationDistributionResponse> {
    return this.fromCache('getSpecializationDistribution', () =>
      this.http.get<AppResponse<DashboardSpecializationDistributionResponse>>(
        AppConstants.API.DASHBOARD_DISTRIBUTION_BY_SPECIALIZATION
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCountryDistribution(
    page: number = 0,
    size: number = 10,
    sortDirection: string = 'DESC'
  ): Observable<DashboardCountryDistributionResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortDirection', sortDirection);

    const cacheKey = `getCountryDistribution:${page}:${size}:${sortDirection}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardCountryDistributionResponse>>(
        AppConstants.API.DASHBOARD_DISTRIBUTION_BY_COUNTRY,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getEqaActivitiesParticipation(year?: number): Observable<DashboardEqaActivitiesResponse> {
    let params = new HttpParams();

    if (year) {
      params = params.set('year', year);
    }

    const cacheKey = `getEqaActivitiesParticipation:${year || ''}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardEqaActivitiesResponse>>(
        AppConstants.API.DASHBOARD_ACTIVITIES_PARTICIPATION,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getJoinRequestsByStatus(year?: number): Observable<DashboardJoinRequestsResponse> {
    let params = new HttpParams();

    if (year) {
      params = params.set('year', year);
    }

    const cacheKey = `getJoinRequestsByStatus:${year || ''}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardJoinRequestsResponse>>(
        AppConstants.API.DASHBOARD_JOIN_REQUESTS_BY_STATUS,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getWithdrawalRequestsByStatus(year?: number): Observable<DashboardWithdrawalRequestsResponse> {
    let params = new HttpParams();

    if (year) {
      params = params.set('year', year);
    }

    const cacheKey = `getWithdrawalRequestsByStatus:${year || ''}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardWithdrawalRequestsResponse>>(
        AppConstants.API.DASHBOARD_WITHDRAWAL_REQUESTS_BY_STATUS,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCandidatesRegister(): Observable<DashboardCandidatesRegisterResponse> {
    return this.fromCache('getCandidatesRegister', () =>
      this.http.get<AppResponse<DashboardCandidatesRegisterResponse>>(
        AppConstants.API.DASHBOARD_CANDIDATES_REGISTER
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getReviewersRegister(): Observable<DashboardReviewersRegisterResponse> {
    return this.fromCache('getReviewersRegister', () =>
      this.http.get<AppResponse<DashboardReviewersRegisterResponse>>(
        AppConstants.API.DASHBOARD_REVIEWERS_REGISTER
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCseqaCountsRatios(): Observable<DashboardCseqaCountsRatiosResponse> {
    return this.fromCache('getCseqaCountsRatios', () =>
      this.http.get<AppResponse<DashboardCseqaCountsRatiosResponse>>(
        AppConstants.API.CSEQA_DASHBOARD_COUNTS_RATIOS
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCseqaStatusDistribution(): Observable<DashboardCseqaStatusDistributionResponse> {
    return this.fromCache('getCseqaStatusDistribution', () =>
      this.http.get<AppResponse<DashboardCseqaStatusDistributionResponse>>(
        AppConstants.API.CSEQA_DASHBOARD_DISTRIBUTION_BY_STATUS
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCseqaYearComparison(
    previousYear: number,
    currentYear: number,
    reviewerType: string = 'ALL',
    region?: string
  ): Observable<DashboardCseqaYearComparisonResponse> {
    let params = new HttpParams()
      .set('previousYear', previousYear)
      .set('currentYear', currentYear)
      .set('reviewerType', reviewerType);

    if (region) {
      params = params.set('region', region);
    }

    const cacheKey = `getCseqaYearComparison:${previousYear}:${currentYear}:${reviewerType}:${region || ''}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardCseqaYearComparisonResponse>>(
        AppConstants.API.CSEQA_DASHBOARD_YEAR_COMPARISON,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCseqaSpecializationDistribution(): Observable<DashboardCseqaSpecializationDistributionResponse> {
    return this.fromCache('getCseqaSpecializationDistribution', () =>
      this.http.get<AppResponse<DashboardCseqaSpecializationDistributionResponse>>(
        AppConstants.API.CSEQA_DASHBOARD_DISTRIBUTION_BY_SPECIALIZATION
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCseqaCountryDistribution(
    page: number = 0,
    size: number = 10,
    sortDirection: string = 'DESC'
  ): Observable<DashboardCseqaCountryDistributionResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortDirection', sortDirection);

    const cacheKey = `getCseqaCountryDistribution:${page}:${size}:${sortDirection}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardCseqaCountryDistributionResponse>>(
        AppConstants.API.CSEQA_DASHBOARD_DISTRIBUTION_BY_COUNTRY,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCseqaEqaActivitiesParticipation(year?: number): Observable<DashboardCseqaActivitiesParticipationResponse> {
    let params = new HttpParams();

    if (year) {
      params = params.set('year', year);
    }

    const cacheKey = `getCseqaEqaActivitiesParticipation:${year || ''}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardCseqaActivitiesParticipationResponse>>(
        AppConstants.API.CSEQA_DASHBOARD_ACTIVITIES_PARTICIPATION,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCseqaJoinRequestsByStatus(year?: number): Observable<DashboardCseqaJoinRequestsByStatusResponse> {
    let params = new HttpParams();

    if (year) {
      params = params.set('year', year);
    }

    const cacheKey = `getCseqaJoinRequestsByStatus:${year || ''}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardCseqaJoinRequestsByStatusResponse>>(
        AppConstants.API.CSEQA_DASHBOARD_JOIN_REQUESTS_BY_STATUS,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCseqaWithdrawalRequestsByStatus(year?: number): Observable<DashboardCseqaWithdrawalRequestsByStatusResponse> {
    let params = new HttpParams();

    if (year) {
      params = params.set('year', year);
    }

    const cacheKey = `getCseqaWithdrawalRequestsByStatus:${year || ''}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardCseqaWithdrawalRequestsByStatusResponse>>(
        AppConstants.API.CSEQA_DASHBOARD_WITHDRAWAL_REQUESTS_BY_STATUS,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCseqaDistributionByNationality(
    page: number = 0,
    size: number = 10,
    sortDirection: string = 'DESC'
  ): Observable<DashboardCseqaNationalityDistributionResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortDirection', sortDirection);

    const cacheKey = `getCseqaDistributionByNationality:${page}:${size}:${sortDirection}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardCseqaNationalityDistributionResponse>>(
        AppConstants.API.CSEQA_DASHBOARD_DISTRIBUTION_BY_NATIONALITY,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCseqaDistributionByGovernorateWilayat(): Observable<DashboardCseqaGovernorateWilayatDistributionResponse> {
    return this.fromCache('getCseqaDistributionByGovernorateWilayat', () =>
      this.http.get<AppResponse<DashboardCseqaGovernorateWilayatDistributionResponse>>(
        AppConstants.API.CSEQA_DASHBOARD_DISTRIBUTION_BY_GOVERNORATE_WILAYAT
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCseqaTeamLeaderEvaluationDistribution(): Observable<DashboardCseqaTeamLeaderEvaluationDistributionResponse> {
    return this.fromCache('getCseqaTeamLeaderEvaluationDistribution', () =>
      this.http.get<AppResponse<DashboardCseqaTeamLeaderEvaluationDistributionResponse>>(
        AppConstants.API.CSEQA_DASHBOARD_TEAM_LEADER_EVALUATION_DISTRIBUTION
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getCseqaQaEvaluationDistribution(): Observable<DashboardCseqaQaEvaluationDistributionResponse> {
    return this.fromCache('getCseqaQaEvaluationDistribution', () =>
      this.http.get<AppResponse<DashboardCseqaQaEvaluationDistributionResponse>>(
        AppConstants.API.CSEQA_DASHBOARD_QA_EVALUATION_DISTRIBUTION
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getOqfCountsRatios(): Observable<DashboardOqfCountsRatiosResponse> {
    return this.fromCache('getOqfCountsRatios', () =>
      this.http.get<AppResponse<DashboardOqfCountsRatiosResponse>>(
        AppConstants.API.DASHBOARD_OQF_COUNTS_RATIOS
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getOqfStatusDistribution(): Observable<DashboardOqfStatusDistributionResponse> {
    return this.fromCache('getOqfStatusDistribution', () =>
      this.http.get<AppResponse<DashboardOqfStatusDistributionResponse>>(
        AppConstants.API.DASHBOARD_OQF_DISTRIBUTION_BY_STATUS
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getOqfYearComparison(
    previousYear: number,
    currentYear: number,
    reviewerType?: string,
    region?: string
  ): Observable<DashboardOqfYearComparisonResponse> {
    let params = new HttpParams()
      .set('previousYear', previousYear)
      .set('currentYear', currentYear);

    if (reviewerType) {
      params = params.set('reviewerType', reviewerType);
    }

    if (region) {
      params = params.set('region', region);
    }

    const cacheKey = `getOqfYearComparison:${previousYear}:${currentYear}:${reviewerType || ''}:${region || ''}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardOqfYearComparisonResponse>>(
        AppConstants.API.DASHBOARD_OQF_YEAR_COMPARISON,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getOqfSpecializationDistribution(): Observable<DashboardOqfSpecializationDistributionResponse> {
    return this.fromCache('getOqfSpecializationDistribution', () =>
      this.http.get<AppResponse<DashboardOqfSpecializationDistributionResponse>>(
        AppConstants.API.DASHBOARD_OQF_DISTRIBUTION_BY_SPECIALIZATION
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getOqfCountryDistribution(
    page: number = 0,
    size: number = 10,
    sortDirection: string = 'DESC'
  ): Observable<DashboardOqfCountryDistributionResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortDirection', sortDirection);

    const cacheKey = `getOqfCountryDistribution:${page}:${size}:${sortDirection}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardOqfCountryDistributionResponse>>(
        AppConstants.API.DASHBOARD_OQF_DISTRIBUTION_BY_COUNTRY,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getOqfEmployerDistribution(
    page: number = 0,
    size: number = 10,
    sortDirection: string = 'DESC',
    year?: number,
    search?: string
  ): Observable<DashboardOqfEmployerDistributionResponse> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortDirection', sortDirection);

    if (year) {
      params = params.set('year', year);
    }

    if (search) {
      params = params.set('search', search);
    }

    const cacheKey = `getOqfEmployerDistribution:${page}:${size}:${sortDirection}:${year || ''}:${search || ''}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardOqfEmployerDistributionResponse>>(
        AppConstants.API.DASHBOARD_OQF_DISTRIBUTION_BY_EMPLOYER,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getOqfEqaActivitiesParticipation(year?: number): Observable<DashboardOqfEqaActivitiesResponse> {
    let params = new HttpParams();

    if (year) {
      params = params.set('year', year);
    }

    const cacheKey = `getOqfEqaActivitiesParticipation:${year || ''}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardOqfEqaActivitiesResponse>>(
        AppConstants.API.DASHBOARD_OQF_ACTIVITIES_PARTICIPATION,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  getOqfJoinRequestsByStatus(year?: number): Observable<DashboardOqfJoinRequestsResponse> {
    let params = new HttpParams();

    if (year) {
      params = params.set('year', year);
    }

    const cacheKey = `getOqfJoinRequestsByStatus:${year || ''}`;

    return this.fromCache(cacheKey, () =>
      this.http.get<AppResponse<DashboardOqfJoinRequestsResponse>>(
        AppConstants.API.DASHBOARD_OQF_JOIN_REQUESTS_BY_STATUS,
        { params }
      ).pipe(
        map((response) => response.data)
      )
    );
  }

  
}
