import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class SampleDataService {

  constructor() { }

  public getProductKeywordMentionsData(): Observable<any> {
    let averageLengthOfCallData = [["Date","2017-2-28","2017-3-1","2017-3-2","2017-3-3","2017-3-4","2017-3-5","2017-3-6","2017-3-7","2017-3-8","2017-3-9","2017-3-10","2017-3-11"],["Count",3,39,32,18,12,22,19,30,33,24,9,9]]
    return Observable.create(observer => {
      observer.next(averageLengthOfCallData)
      observer.complete()
    });
  }

  public getProductPerceptionOverTimeData(): Observable<any> {
    let averageLengthOfCallData = [["Date","2017-2-28","2017-3-1","2017-3-2","2017-3-3","2017-3-4","2017-3-5","2017-3-6","2017-3-7","2017-3-8","2017-3-9","2017-3-10","2017-3-11"],["Count",3,39,32,18,12,22,19,30,33,24,9,9]]
    return Observable.create(observer => {
      observer.next(averageLengthOfCallData)
      observer.complete()
    });
  }

  public getProductConceptsMentionedData(): Observable<any> {
    let averageLengthOfCallData = [["Date","2017-2-28","2017-3-1","2017-3-2","2017-3-3","2017-3-4","2017-3-5","2017-3-6","2017-3-7","2017-3-8","2017-3-9","2017-3-10","2017-3-11"],["Count",3,39,32,18,12,22,19,30,33,24,9,9]]
    return Observable.create(observer => {
      observer.next(averageLengthOfCallData)
      observer.complete()
    });
  }

  public getProductSentimentData(): Observable<any> {
    let averageLengthOfCallData = [["Date","2017-2-28","2017-3-1","2017-3-2","2017-3-3","2017-3-4","2017-3-5","2017-3-6","2017-3-7","2017-3-8","2017-3-9","2017-3-10","2017-3-11"],["Count",3,39,32,18,12,22,19,30,33,24,9,9]]
    return Observable.create(observer => {
      observer.next(averageLengthOfCallData)
      observer.complete()
    });
  }

  public getCallsByDurationData() : Observable<any> {
    let averageLengthOfCallData = [["Date","2017-2-28","2017-3-1","2017-3-2","2017-3-3","2017-3-4","2017-3-5","2017-3-6","2017-3-7","2017-3-8","2017-3-9","2017-3-10","2017-3-11"],["Count",3,39,32,18,12,22,19,30,33,24,9,9]]
    return Observable.create(observer => {
      observer.next(averageLengthOfCallData)
      observer.complete()
    });
  }

  public getVolumeOfCallsOverTimeData() : Observable<any> {
    let volumeOfCallsOverTimeData =
      [["Date","2016-2-29","2016-3-31","2016-4-30","2016-5-31","2016-6-30","2016-7-31","2016-8-31","2016-9-30","2016-10-31","2016-11-30","2016-12-31","2017-1-31","2017-2-28"],["Count",6,12,81,49,39,75,79,107,121,248,596,572,280]]
      return Observable.create(observer => {
        observer.next(volumeOfCallsOverTimeData)
        observer.complete()
      });
  }

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
