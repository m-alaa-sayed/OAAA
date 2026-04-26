import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/core/services/toast-service';
import { VisitFormService } from 'src/app/pages/school-performance/service/visit-form.service';

@Component({
  selector: 'general-evidence-visit-details',
  templateUrl: './general-evidence-visit-details.component.html',
  styleUrl: './general-evidence-visit-details.component.scss'
})
export class GeneralEvidenceVisitDetailsComponent implements OnInit {

  @Input() visitFormRequestInfo: any;
  @Input() activityTypes: any;
  @Input() visitData: any;
  @Input() showButtons: boolean = true;
   @Input() editable: boolean = true;

  @Output() nextEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  validateDetails: boolean = true;
  constructor(
    public translate: TranslateService,
    public visitFormService:VisitFormService,
    private router: Router,
    public toastService: ToastService) {
  }

  ngOnInit(): void {

  }

  save(){
    this.visitFormService.save(this.visitFormRequestInfo);
  }

}
