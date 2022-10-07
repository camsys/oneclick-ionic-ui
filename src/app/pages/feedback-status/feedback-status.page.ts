import { Component, OnInit } from '@angular/core';
import { FeedbackModel } from 'src/app/models/feedback';
import { OneClickService } from 'src/app/services/one-click.service';

@Component({
  selector: 'app-feedback-status',
  templateUrl: './feedback-status.page.html',
  styleUrls: ['./feedback-status.page.scss'],
})
export class FeedbackStatusPage implements OnInit {

  feedbacks: FeedbackModel[] = [];

  constructor(private oneClick: OneClickService) {
  }

  ngOnInit() {
    this.oneClick.getFeedbacks()
                 .subscribe((feedbacks) => this.feedbacks = feedbacks);
  }

}
