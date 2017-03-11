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

  constructor(private http: Http, private authService: LoopbackLoginService, private sampleDataService: SampleDataService) { }

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

  public getBrandPerceptionOverTime(sentiment:string, dateType:string): Observable<any> {
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

    //return this.sampleDataService.getPerceptionOverTimeData()
  }

  public getCurrentBrandSentiment(dateType:string): Observable<any> {
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
    //return this.sampleDataService.getPerceptionOverTimeData()
  }

  public getProductMentions(dateType:string, sentiment:string): Observable<any> {
    let url = DISCOVERY_URL + '/getProductMentions'
    let token = this.authService.get().token;
    let urlWithToken = url + '?access_token=' + token;

    let dateTypeParams = this.getDateTypeParams(dateType)
    let formData: FormData = new FormData();
    formData.append('startDt', dateTypeParams.startDt)
    formData.append('endDt', dateTypeParams.endDt)
    formData.append('sentiment', sentiment)
    formData.append('count', 5)

    return this.http.post(urlWithToken, formData)
       .map((res:Response) => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    //return this.sampleDataService.getPerceptionOverTimeData()
  }

  public getMostPopular(type: string, dateType: string): Observable<any> {
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
    formData.append('count', 5)

    return this.http.post(urlWithToken, formData)
       .map((res:Response) => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    //return this.sampleDataService.getPerceptionOverTimeData()
  }

}
