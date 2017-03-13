import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class SampleDataService {

  constructor() { }

  public getPerceptionAnalysisData(): Observable<any> {
    let perceptionAnalysisData = {
      "changePercentage": 5,
      "change": "drop",
      "changeText": "drop in positive perception in 30 days",
      "fromPercentage": 24,
      "from": "Feb 11th 2017",
      "toPercentage": 19,
      "to": "Mar 11th 2017"
    }
    return Observable.create(observer => {
      observer.next(perceptionAnalysisData)
      observer.complete()
    });
  }

  public getPerceptionOverTimeData(): Observable<any> {
    let brandPerceptionOverTimeColumns = [ [ "Date", "2016-04-01", "2016-05-01", "2016-06-01", "2016-07-01", "2016-08-01",
      "2016-09-01", "2016-10-01", "2016-11-01", "2016-12-01", "2017-01-01", "2017-02-01", "2017-03-01" ],
    [ "Percentage", 39, 100, 12, 75, 34, 16, 67, 50, 45, 18, 25, 13 ]]
    return Observable.create(observer => {
      observer.next(brandPerceptionOverTimeColumns)
      observer.complete()
    });
  }

  public getCurrentBrandSentiment(): Observable<any> {
    let brandSentimentColumns = [["negative",60],["positive",29],["neutral",11]]
    return Observable.create(observer => {
      observer.next(brandSentimentColumns)
      observer.complete()
    });
  }

  public getPositiveProductMentions(): Observable<any> {
    let positiveProductMentionsData = [{"name":"Direct TV","count":24,"percentage":29},
      {"name":"Directv","count":10,"percentage":12},{"name":"direct tv","count":7,"percentage":9},
      {"name":"DirecTV","count":6,"percentage":7},{"name":"iPad","count":3,"percentage":4}]
    return Observable.create(observer => {
      observer.next(positiveProductMentionsData)
      observer.complete()
    });
  }

  public getNegativeProductMentions(): Observable<any> {
    let negativeProductMentionsData = [{"name":"Directv","count":54,"percentage":20},
      {"name":"Direct TV","count":37,"percentage":14},{"name":"DirecTV","count":25,"percentage":9},
      {"name":"direct tv","count":17,"percentage":6},{"name":"directv","count":17,"percentage":6}]
    return Observable.create(observer => {
      observer.next(negativeProductMentionsData)
      observer.complete()
    });
  }

  public getMostPopularTopics(): Observable<any> {
    let mostPopularTopicsData = [
      { "name": "Mobile phone", "count": 355, "percentage": 40 }, { "name": "Telephone", "count": 171, "percentage": 19 }, { "name": "Customer service", "count": 157, "percentage": 18 }, { "name": "SIM lock", "count": 122, "percentage": 14 }, { "name": "English-language films", "count": 87, "percentage": 10 }
    ]
    return Observable.create(observer => {
      observer.next(mostPopularTopicsData)
      observer.complete()
    });
  }

  public getMostPopularFeatures(): Observable<any> {
    let mostPopularFeatresData = [
      { "name": "sim card", "count": 129, "percentage": 44 }, { "name": "screen", "count": 119, "percentage": 41 }, { "name": "camera", "count": 23, "percentage": 8 }, { "name": "sim cards", "count": 10, "percentage": 3 }, { "name": "sim", "count": 9, "percentage": 3 }
    ]
    return Observable.create(observer => {
      observer.next(mostPopularFeatresData)
      observer.complete()
    });
  }
}
