import { Component, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
import { ToastService } from 'src/app/core/services/toast-service';

@Component({
  selector: 'service-card',
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss'
})
export class ServiceCardComponent {
  @Input() service: any;
  displayedServices: any[] = [];
  constructor(
          public translate: TranslateService,
          public toastService: ToastService,
          private router: Router
  ) {}
  
  ngOnInit(): void {
  }

  showServiceDetails(){
    this.router.navigate(['/jawda/service-management/service-catalogue-details', this.service.id]);
  }

  previousTransaction(){
    this.router.navigate(['/jawda/service-management/service-previous-request-list', this.service.serviceCode,this.service.serviceNameAr,this.service.serviceNameEn]);
  }

  closePopup(): void {
    console.log('Modal closed');
  }

  login(): void {
    alert('Redirecting to login...');
  }
}
