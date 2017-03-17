import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

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

  private runLocal = false

  constructor(private router: Router, private http: Http, private authService: LoopbackLoginService, private sampleDataService: SampleDataService) { }

  public getProductKeywordMentions(dateType: string, product: string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getProductKeywordMentions'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)
      formData.append('product', product)

      return this.genericHttpPost(urlWithToken, formData)
    } else {
      return this.sampleDataService.getProductKeywordMentionsData()
    }
  }

  public getProductPerceptionOverTime(dateType: string, product: string, sentiment: string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getProductPerceptionOverTime'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)
      formData.append('interval', dateTypeParams.interval)
      formData.append('product', product)
      formData.append('sentiment', sentiment)

      return this.genericHttpPost(urlWithToken, formData)
    } else {
      return this.sampleDataService.getProductPerceptionOverTimeData()
    }
  }

  public getProductConceptsMentioned(dateType: string, product: string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getProductConceptsMentioned'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)
      formData.append('product', product)

      return this.genericHttpPost(urlWithToken, formData)
    } else {
      return this.sampleDataService.getProductConceptsMentionedData()
    }
  }

  public getProductSentiment(dateType: string, product: string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getProductSentiment'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('interval', dateTypeParams.interval)
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)
      formData.append('product', product)

      return this.genericHttpPost(urlWithToken, formData)
    } else {
      return this.sampleDataService.getProductSentimentData()
    }
  }

  public getCallsByDuration(dateType: string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getCallsByDuration'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)

      return this.genericHttpPost(urlWithToken, formData)
    } else {
      return this.sampleDataService.getCallsByDurationData()
    }
  }

  public getVolumeOfOverTime(dateType: string, source: String): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getVolumeOfOverTime'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('interval', dateTypeParams.interval)
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)
      formData.append('source', source)

      return this.genericHttpPost(urlWithToken, formData)
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

      return this.genericHttpPost(urlWithToken, formData)
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

      return this.genericHttpPost(urlWithToken, formData)
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

      return this.genericHttpPost(urlWithToken, formData)
    } else {
      return this.sampleDataService.getCurrentBrandSentiment()
    }
  }

  public getProductMentionsSentiment(dateType:string, source:string, sentiment:string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getProductMentionsSentiment'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)
      formData.append('source', source)
      formData.append('sentiment', sentiment)
      formData.append('count', 5)

      return this.genericHttpPost(urlWithToken, formData)
    } else {
      return this.sampleDataService.getNegativeProductMentions()
    }
  }

  public getProductMentions(dateType:string, source:string): Observable<any> {
    if (!this.runLocal) {
      let url = DISCOVERY_URL + '/getProductMentions'
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)
      formData.append('source', source)
      formData.append('count', 5)

      return this.genericHttpPost(urlWithToken, formData)
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
      if (!source) {
        source = 'all'
      }
      let token = this.authService.get().token;
      let urlWithToken = url + '?access_token=' + token;

      let dateTypeParams = this.getDateTypeParams(dateType)
      let formData: FormData = new FormData();
      formData.append('startDt', dateTypeParams.startDt)
      formData.append('endDt', dateTypeParams.endDt)
      formData.append('source', source)
      formData.append('count', 5)

      return this.genericHttpPost(urlWithToken, formData)
    } else {
      if (type === 'topics') {
        return this.sampleDataService.getMostPopularTopics()
      } else {
        return this.sampleDataService.getMostPopularFeatures()
      }
    }
  }

  private genericHttpPost(url, formData): Observable<any> {
    return this.http.post(url, formData)
       .map((res:Response) => res.json())
       .catch((error:any) => {
         if (error.status === 401) {
           this.router.navigate(['login'])
         }
         return Observable.throw(error.json().error || 'Server error')
       });
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
