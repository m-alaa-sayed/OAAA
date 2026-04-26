import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConstants } from "../constants/app-constants";

// Constants


@Injectable({
  providedIn: "root",
})
export class CmsService {
  constructor(private _httpClient: HttpClient) { }

    /**
     * Get Home Page Content
     * @returns
     * @memberof CmsService
     * @description This method is used to get Home Page Content
     * */
    getHomePageContent(): Observable<any[]> {
      const url = `${AppConstants.API.CMS_API}/pages?filters[name][$eq]=home&populate[0]=sections&populate[1]=sections.programCards.icon&populate[2]=sections.slides&populate[3]=sections.slides.backgroundImage&populate[4]=sections.slides.slideLink&populate[5]=sections.statisticsEntry&populate[6]=sections.questions`;
      return this._httpClient.get<any[]>(url);
    }


    getAboutUsPageContent(): Observable<any[]> {
      const url = `${AppConstants.API.CMS_API}/pages?filters[name][$eq]=about-us&populate[0]=sections&populate[1]=sections.image&populate[2]=sections.orgStructure&populate[3]=sections.members&populate[4]=sections.members.image`;
      return this._httpClient.get<any[]>(url);
    }


    getOpenDataContent(): Observable<any[]> {
      const url = `${AppConstants.API.CMS_API}/pages?filters[name][$eq]=open-data&populate[0]=sections&populate[1]=sections.openData&populate[2]=sections.openData.downloadLink`;
      return this._httpClient.get<any[]>(url);
    }

    getMediaCenterPageContent(): Observable<any[]> {
      const url = `${AppConstants.API.CMS_API}/pages?filters[name][$eq]=media-center&populate[0]=sections&populate[1]=sections.gallery&populate[2]=sections.gallery.image&populate[3]=sections.policies&populate[4]=sections.policies.file&populate[5]=sections.announcement&populate[6]=sections.announcement.tag&populate[7]=sections.reports&populate[8]=sections.reports.image`;
      return this._httpClient.get<any[]>(url);
    }
    /**
     * Get News Items
     * @returns
     * @memberof CmsService
     * @description This method is used to get Get News Items
     * */
    getNews(): Observable<any[]> {
      const url = `${AppConstants.API.CMS_API}/news-items?populate=*`;
      return this._httpClient.get<any[]>(url);
    }

    getActivities(): Observable<any[]> {
      const url = `${AppConstants.API.CMS_API}/activities?populate=*`;
      return this._httpClient.get<any[]>(url);
    }

    getActivityByDocumentId(documentId: string): Observable<any> {
      const url = `${AppConstants.API.CMS_API}/activities/${documentId}?populate=*`;
      return this._httpClient.get<any>(url);
    }
    
    sendFeedback(feedbackData: any): Observable<any> {
      const url = `${AppConstants.API.CMS_API}/feedbacks`;
      return this._httpClient.post<any>(url, feedbackData);
    }

    sendMessage(sendMessageData: any): Observable<any> {
      const url = `${AppConstants.API.CMS_API}/contact/send`;
      return this._httpClient.post<any>(url, sendMessageData);
    }
}