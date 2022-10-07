import { Component, Input, OnInit } from '@angular/core';
import { ExternalNavigationService } from 'src/app/services/external-navigation.service';

@Component({
  selector: 'app-external-link',
  templateUrl: './external-link.component.html',
  styleUrls: ['./external-link.component.scss'],
})
export class ExternalLinkComponent implements OnInit {

  @Input() url: string;
  @Input() text: string;

  constructor(public exNav: ExternalNavigationService) { }

  ngOnInit() {}

}
