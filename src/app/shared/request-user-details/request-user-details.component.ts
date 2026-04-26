import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'request-user-details',
  templateUrl: './request-user-details.component.html',
  styleUrl: './request-user-details.component.scss'
})
export class RequestUserDetailsComponent {
  @Input() applicantData!: any;

  constructor(
    public translate: TranslateService
  ) {

  }
  ngOnInit(): void {      
  }

}
