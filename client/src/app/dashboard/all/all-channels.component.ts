import { Component, OnInit } from '@angular/core';

declare var c3:any

@Component({
  selector: 'app-all-channels',
  templateUrl: './all-channels.component.html'
})
export class AllChannelsComponent implements OnInit {

  private negativeMentions = {
    title: 'Products Negatively Mentioned',
    color: '#de1f80',
    products: [
      {
        name: 'Product One',
        value: 91
      },
      {
        name: 'Product Two',
        value: 84
      },
      {
        name: 'Product Tree',
        value: 53
      },
      {
        name: 'Product Four',
        value: 21
      },
      {
        name: 'Product Five',
        value: 9
      }
    ]
  }

  private positiveMentions = {
    title: 'Products Positively Mentioned',
    color: '#36cfbf',
    products: [
      {
        name: 'Product Three',
        value: 70
      },
      {
        name: 'Product Four',
        value: 50
      }
    ]
  }

  private popularTopics = {
    title: 'Most Popular Topics',
    products: [
      {
        name: 'Product One',
        value: 70,
        color: '#d8a7ff'
      },
      {
        name: 'Product Two',
        value: 50,
        color: '#ba8dfb'
      },
      {
        name: 'Product Three',
        value: 50,
        color: '#b168ea'
      },
      {
        name: 'Product Four',
        value: 50,
        color: '#733c9b'
      },
      {
        name: 'Product Five',
        value: 50,
        color: '#562c73'
      }
    ]
  }

  private popularFeatures = {
    title: 'Most Popular Features',
    products: [
      {
        name: 'Product Three',
        value: 70,
        color: '#36cfbf'
      },
      {
        name: 'Product Four',
        value: 50,
        color: '#36cfbf'
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }
}
