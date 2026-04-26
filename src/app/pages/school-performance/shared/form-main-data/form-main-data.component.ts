import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'form-main-data',
  templateUrl: './form-main-data.component.html',
  styleUrl: './form-main-data.component.scss'
})
export class FormMainDataComponent implements OnInit {

  @Input() mainRequestData!: any;
  @Input() title :string = 'PAGES.SEVERVICE_MANAGEMENT.LABELS.REQUEST_DATA';
  constructor(
    public translate: TranslateService
  ) {

  }
  ngOnInit(): void {
  }

  isEmpty(value: any): boolean {
    return !value || (Array.isArray(value) && value.length === 0);
  }
}
