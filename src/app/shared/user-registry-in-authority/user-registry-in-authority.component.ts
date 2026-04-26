import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'user-registry-in-authority',
  templateUrl: './user-registry-in-authority.component.html',
  styleUrl: './user-registry-in-authority.component.scss'
})
export class UserRegistryInAuthorityComponent implements OnInit {
  @Input() userRegistryList: any[] = [];


  constructor(public translate: TranslateService) {}

  ngOnInit() {
  }

  convertTZ(date: any) {
    if(date !=null){
      return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
    }
    return '';
  }
}

