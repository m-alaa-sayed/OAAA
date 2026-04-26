import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {SelfEvaluationDocument} from 'src/app/pages/school-performance/types/self-evaluation-document';
import {SelfEvaluationDomain} from 'src/app/pages/school-performance/types/self-evaluation-domain';

@Component({
  selector: 'self-evaluation-document-self-eval',
  templateUrl: './self-evaluation-document-self-eval.component.html',
  styleUrl: './self-evaluation-document-self-eval.component.scss'
})
export class SelfEvaluationDocumentSelfEvalComponent implements OnInit, AfterViewInit {

  @Input() selfEvaluationDocument: SelfEvaluationDocument = {} as SelfEvaluationDocument;
  @Input() showButtons: boolean = true;

  @Output() nextEvent = new EventEmitter<void>();
  @Output() previousEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>();

  @ViewChild("submitForm") submitForm?: NgForm;

  isSubmitting = false;

  isEditable: boolean = false;

  domainKeys: string[] = [
    'FIRST_DOMAIN',
    'SECOND_DOMAIN',
    'THIRD_DOMAIN',
    'FOURTH_DOMAIN',
    'FIFTH_DOMAIN'
  ];


  constructor(
    private toastService: ToastService,
    public translate: TranslateService
  ) { }


  ngOnInit(): void {
    this.initializeDomains();
    this.isEditable = this.selfEvaluationDocument.status != 'SUBMITTED';
  }


  ngAfterViewInit() {
    // Prevent scroll jump on focus
    const editors = document.querySelectorAll('.ck-editor__editable');
    editors.forEach(editor => {
      editor.addEventListener('focus', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setTimeout(() => window.scrollTo({ top: scrollTop }), 0);
      });
    });
  }


  private initializeDomains(): void {
    if (!this.selfEvaluationDocument.selfEvaluationDomains) {
      this.selfEvaluationDocument.selfEvaluationDomains = [];
    }

    for (const key of this.domainKeys) {
      const exists = this.selfEvaluationDocument.selfEvaluationDomains.some(d => d.domain === key);
      if (!exists) {
        this.selfEvaluationDocument.selfEvaluationDomains.push({
          domain: key,
          selfEvaluationDocumentId: this.selfEvaluationDocument.id
        } as SelfEvaluationDomain);
      }
    }
  }

  get domains(): SelfEvaluationDomain[] {
    return this.selfEvaluationDocument.selfEvaluationDomains ?? [];
  }


  next() {
    this.isSubmitting = true;
    if (this.submitForm?.invalid) {
      this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_FOR_SUBMIT'), { classname: 'bg-danger text-white', autohide: false });
      scrollTo(0, 0);
      return
    }
    this.nextEvent.emit();
  }
}
