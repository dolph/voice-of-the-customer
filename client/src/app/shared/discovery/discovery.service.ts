import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { LoopbackLoginService } from '../../auth/loopback/lb-login.service';
import { SampleDataService } from './sample-data.service'

// Import RxJs required methods
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

declare var moment:any

const DISCOVERY_URL = '/api/discovery'

@Injectable()
export class DiscoveryService {

  private runLocal = true

  constructor(private http: Http, private authService: LoopbackLoginService, private sampleDataService: SampleDataService) { }

  public getAverageLengthOfCalls(dateType: string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getVolumeOfCallsOverTime'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('interval', dateTypeParams.interval)
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)

      return this.http.post(urlWithToken, formData)
         .map((res:Response) => res.json())
         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    } else {
      return this.sampleDataService.getAverageLengthOfCallsData()
    }
  }

  public getVolumeOfCallsOverTime(dateType: string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getVolumeOfCallsOverTime'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('interval', dateTypeParams.interval)
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)

      return this.http.post(urlWithToken, formData)
         .map((res:Response) => res.json())
         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    } else {
      return this.sampleDataService.getVolumeOfCallsOverTimeData()
    }
  }

  public getPerceptionAnalysis(ofDate:string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getPerceptionAnalysis'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let formData = new FormData();
      formData.append('ofDate', ofDate)

      return this.http.post(urlWithToken, formData)
         .map((res:Response) => res.json())
         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    } else {
      return this.sampleDataService.getPerceptionAnalysisData()
    }
  }

  public getBrandPerceptionOverTime(sentiment:string, dateType:string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getBrandPerceptionOverTime'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)

      let formData = new FormData();
      formData.append('interval', dateTypeParams.interval)
      formData.append('sentiment', sentiment)
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)

      return this.http.post(urlWithToken, formData)
         .map((res:Response) => res.json())
         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    } else {
      return this.sampleDataService.getPerceptionOverTimeData()
    }
  }

  public getCurrentBrandSentiment(dateType:string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getCurrentBrandSentiment'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)

      return this.http.post(urlWithToken, formData)
         .map((res:Response) => res.json())
         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    } else {
      return this.sampleDataService.getCurrentBrandSentiment()
    }
  }

  public getProductMentions(dateType:string, source:string, sentiment:string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getProductMentions'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)
      formData.append('source', source)
      formData.append('sentiment', sentiment)
      formData.append('count', 5)

      return this.http.post(urlWithToken, formData)
         .map((res:Response) => res.json())
         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    } else {
      return this.sampleDataService.getNegativeProductMentions()
    }
  }

  public getMostPopular(type: string, source:string, dateType: string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getMostPopularTopics'
      if (type == 'features') {
        url = DISCOVERY_URL + '/getMostPopularFeatures'
      }
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)
      formData.append('source', source)
      formData.append('count', 5)

      return this.http.post(urlWithToken, formData)
         .map((res:Response) => res.json())
         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    } else {
      if (type === 'topics') {
        return this.sampleDataService.getMostPopularTopics()
      } else {
        return this.sampleDataService.getMostPopularFeatures()
      }
    }
  }

  private getDateTypeParams(dateType:string) {
    let params = {
      interval: '1year',
      endDt: null,
      startDt: null
    }
    switch (dateType) {
      case 'last12months':
        params.interval = '1month'
        params.endDt = new Date()
        params.startDt = moment().subtract(1, 'year')
        break
      case 'thisyear':
        params.interval = '1week'
        params.endDt = new Date()
        params.startDt = moment().dayOfYear(1);
        break
      case 'thismonth':
        params.interval = '1day'
        params.endDt = new Date()
        params.startDt = moment().date(1)
        break
      case 'last4weeks':
        params.interval = '1day'
        params.endDt = new Date()
        params.startDt = moment().week(moment().week() - 4)
        break
      case 'last14days':
        params.interval = '1day'
        params.endDt = new Date()
        params.startDt = moment().subtract(14, 'days')
        break
    }
    return params
  }
}
