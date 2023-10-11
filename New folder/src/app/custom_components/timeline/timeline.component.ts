import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-question-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class QuestionTimelineComponent implements OnInit {
  @Input() history: any;
  galleryImages: any;
  galleryOptions: any;
  stacked = false;
  constructor() { 
    this.galleryImages=[];
  }

  ngOnChanges()
  {
  }

  ngOnInit() {
    this.galleryOptions = [
      {
        'image': false,
        'height': '80px',
        'previewFullscreen': true,
        'previewCloseOnEsc': true
      },
      { 'breakpoint': 300, 'width': 'auto' }
    ];
    
    /* this.galleryImages = [
      {
        small: 'assets/images/unsplash/1.jpg',
        medium: 'assets/images/unsplash/1.jpg',
        big: 'assets/images/unsplash/1.jpg'
      },
      {
        small: 'assets/images/unsplash/2.jpg',
        medium: 'assets/images/unsplash/2.jpg',
        big: 'assets/images/unsplash/2.jpg'
      }
    ]; */
  }

}