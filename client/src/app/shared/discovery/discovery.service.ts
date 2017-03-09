import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { LoopbackLoginService } from '../../auth/loopback/lb-login.service';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const DISCOVERY_URL = '/api/discovery'

@Injectable()
export class DiscoveryService {

  private brandPerceptionOverTimeColumns = [
  [
    "Months",
    "2016-04-01",
    "2016-05-01",
    "2016-06-01",
    "2016-07-01",
    "2016-08-01",
    "2016-09-01",
    "2016-10-01",
    "2016-11-01",
    "2016-12-01",
    "2017-01-01",
    "2017-02-01",
    "2017-03-01"
  ],
  [
    "Percentage",
    39,
    100,
    12,
    75,
    34,
    16,
    67,
    50,
    45,
    18,
    25,
    13
  ]
]

  constructor(private http: Http, private authService: LoopbackLoginService) { }

  public getBrandPerceptionOverTime(): Observable<any> {
    return Observable.create(observer => {
      observer.next(this.brandPerceptionOverTimeColumns)
      observer.complete()
    });
  }
}
