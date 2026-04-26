import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'request-main-data',
  templateUrl: './request-main-data.component.html',
  styleUrl: './request-main-data.component.scss'
})
export class RequestMainDataComponent implements OnInit {

  @Input() mainRequestData!: any;
  @Input() showRequestType :boolean = false;
  @Input() showRequestStatus :boolean = true;
  @Input() title :string = 'PAGES.SEVERVICE_MANAGEMENT.LABELS.REQUEST_DATA';
  constructor(
    public translate: TranslateService
  ) {

  }
  ngOnInit(): void {
  }

  isEmpty(value: any): boolean {
    return (
      !value ||
      (Array.isArray(value) &&
        (value.length === 0 || value.every(v => v === "" || v == null)))
    );
  }
}
