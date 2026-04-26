import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DomainCategories, domains} from '../../../../types/domain-categories';
import {VisitFormRequestInfo} from 'src/app/pages/school-performance/types/visit-form-request-info';
import {VisitFormService} from 'src/app/pages/school-performance/service/visit-form.service';
import {ToastService} from 'src/app/core/services/toast-service';
import {Router} from '@angular/router';
import {VisitFormDomainEvaluation} from 'src/app/pages/school-performance/types/visit-form-domain-evaluation';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DomainJudgmentUtilsService} from "../../../../../../shared/domain-evaluation/domain-judgment-utils.service";
import {DomainEvaluationConfiguration} from "../../../../../../shared/domain-evaluation/DomainEvaluationConfiguration";

@Component({
    selector: 'performance-evaluation',
    templateUrl: './performance-evaluation.component.html',
    styleUrl: './performance-evaluation.component.scss'
})
export class PerformanceEvaluationComponent {
    @Input() visitFormRequestInfo: VisitFormRequestInfo = {} as VisitFormRequestInfo;

    @Output() previousEvent = new EventEmitter<void>();
    @Output() nextEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();
    @Input() showButtons: boolean = true;
    @Input() editable: boolean = true;
    @Input() viewComments: boolean = false;
    @Input() isReturnForEdit: boolean = true;
    @Input() isTeamMember: boolean = true;
    activePartitionCode: string | null = null;

    domainList: DomainCategories[] = domains;
    replyToComment: any = null;
    replyingToCommentId: number | null = null;
    standards: any[] = [];

    domainJudgmentMap: Record<string, string | null> = {};
    domainClassMap: Record<string, any> = {};

    judgments: Record<string, number> = {
        'EXCELLENT': 1, // Green - متميز
        'GOOD': 2, // Light Green - جيد
        'ACCEPTABLE': 3, // Yellow - ملائم
        'UNACCEPTABLE': 4, // Orange - غير ملائم
        'INADEQUATE': 4, // Orange - غير ملائم
        'CRITICAL': 5,  // Red - يحتاج إلى تدخل سريع
        'NEEDS_URGENT_INTERVENTION': 5  // Red - يحتاج إلى تدخل سريع
    };

    @ViewChild('commentModal') commentModal!: TemplateRef<any>;

    currentEvaluation: VisitFormDomainEvaluation | null = null;
    newCommentText: string = '';

    constructor(public translate: TranslateService,
                public visitFormService: VisitFormService,
                protected domainJudgmentService: DomainJudgmentUtilsService,
                private router: Router, private modalService: NgbModal,
                private toastService: ToastService) {

    }

    ngOnInit(): void {
        this.loadStaticStandards();
    }

    getOrCreateEvaluation(standardId: number, standard: any) {
        if (!standardId || standardId <= 0) return {} as VisitFormDomainEvaluation;

        if (!this.visitFormRequestInfo.visitFormDomainEvaluations) {
            this.visitFormRequestInfo.visitFormDomainEvaluations = [];
        }

        let entry = this.visitFormRequestInfo.visitFormDomainEvaluations.find(e => e.standardId === standardId);
        if (!entry) {
            entry = {standardId, standard, judgment: 0, notes: '', visitFormEvaluationComments: [], needsUpdate: false};
            this.visitFormRequestInfo.visitFormDomainEvaluations.push(entry);
        }
        return entry;
    }

    getStandardsByDomain(domainCode: string): any[] {
        return this.standards.filter(s => s.domain === domainCode);
    }

    togglePartition(code: string): void {
        this.activePartitionCode = this.activePartitionCode === code ? null : code;
    }

    loadStaticStandards(): void {
        this.visitFormService.getLkStandards().subscribe({
            next: (res) => {
                this.standards = res.data;
                this.recalculateAllDomainJudgments();
            },
            error: (error) => {
                this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                    classname: 'bg-danger text-white', autohide: false
                });
            }
        });
    }

    onJudgmentChanged(domainCode: string): void {
        this.domainJudgmentMap[domainCode] = this.calculateDomainJudgment(domainCode);
        const label = this.calculateDomainJudgment(domainCode);
        this.domainClassMap[domainCode] = this.getDomainJudgmentNgStyle(label);
    }

    recalculateAllDomainJudgments(): void {
        for (const domain of this.domainList) {
            this.domainJudgmentMap[domain.code] = this.calculateDomainJudgment(domain.code);
            const label = this.calculateDomainJudgment(domain.code);
            this.domainClassMap[domain.code] = this.getDomainJudgmentNgStyle(label);
        }
    }

    validateForm(action?: string) {
        if (!this.visitFormService.validateVisitFormRequestInfoMandatoryFields(this.visitFormRequestInfo)) {
            scrollTo(0, 0);
            this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_FOR_SUBMIT'), {
                classname: 'bg-danger text-white', autohide: false
            });
            return;
        }
        this.save(action);
    }

    save(action?: string) {
        const visitFormType = this.visitFormRequestInfo.type;

        this.visitFormService.saveVisitFormRequestInfo(visitFormType, this.visitFormRequestInfo, action)
            .subscribe({
                next: (response) => {
                    if (action === 'SAVE') {
                        this.toastService.show(
                            this.translate.instant('PAGES.COMMON.MESSAGES.SAVE_SUCCESSFULLY'), {
                                classname: 'bg-success text-white',
                                delay: 3000
                            }
                        );
                        this.router.navigate(['/jawda/school-performance/visit-form', response.type, 'creation', response.id, response.formStatus]);
                    } else {
                        this.router.navigate(['/jawda/success-page'], {
                            state: {requestApplicationNo: response.applicationNo, action: action}
                        });
                    }
                },
                error: (error) => {
                    this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + error), {
                        classname: 'bg-danger text-white', autohide: false
                    });
                }
            });

    }

    openCommentModal(evaluation: VisitFormDomainEvaluation) {
        this.currentEvaluation = evaluation;
        this.newCommentText = '';
        this.modalService.open(this.commentModal, {centered: true, size: 'md'});
    }

    setReplyTo(comment: any, id: any) {
        this.replyToComment = comment;
        this.replyingToCommentId = id;
    }

    addComment(modalRef: any) {
        if (!this.currentEvaluation) return;

        const commentObj = {
            comment: this.newCommentText.trim(),
            user: null,
            createdOn: new Date().toISOString(),
            visitFormEvaluationComments: []
        };

        if (this.replyToComment) {
            if (!this.replyToComment.visitFormEvaluationComments) {
                this.replyToComment.visitFormEvaluationComments = [];
            }
            this.replyToComment.visitFormEvaluationComments.push(commentObj);
        } else {
            if (!this.currentEvaluation.visitFormEvaluationComments) {
                this.currentEvaluation.visitFormEvaluationComments = [];
            }
            this.currentEvaluation.visitFormEvaluationComments.push(commentObj);
        }
        // Reset
        this.newCommentText = '';
        this.replyToComment = null;
        this.replyingToCommentId = null;
        // modalRef.close();
    }

    calculateDomainJudgment(domainCode: string): string | null {
        const standards = this.getStandardsByDomain(domainCode);
        const judgments = standards.map(s => {
            const evall = this.getOrCreateEvaluation(s.id, s)
            if (evall) {
                return Number(evall.judgment)
            }
            return 5;
        }); // fallback to 5 if undefined

        switch (domainCode) {
            case 'ACADEMIC_ACHIEVEMENT':
                return this.evaluateJudgment(judgments, [0, 1], [2]);
            case 'PERSONAL_DEVELOPMENT':
                return this.evaluateJudgment(judgments, [0, 1], [2, 3]);
            case 'TEACHING_AND_ASSESSMENT':
            case 'LEADERSHIP_AND_GOVERNANCE':
                return this.evaluateJudgment(judgments, [0, 1, 2, 4], [3]);
            case 'LEARNING_ENVIRONMENT':
                return this.evaluateJudgment(judgments, [0, 1, 2], [3]);
            default:
                return 'ACCEPTABLE';
        }
    }

    evaluateJudgment(judgments: number[], mainIndices: number[], secondaryIndices: number[]): string | null {
        const mainJudgments = mainIndices.map(i => judgments[i] ?? 0);
        const secondaryJudgments = secondaryIndices.map(i => judgments[i] ?? 0);
        let evaluateResult = this.domainJudgmentService.evaluate(mainJudgments, secondaryJudgments);
        if (evaluateResult)
            return this.domainJudgmentService.getJudgmentLabel(evaluateResult);
        else return null;
    }

    getDomainJudgmentNgStyle(judgmentKey: string | null): any {
        if (judgmentKey) {
            const judgment = this.judgments[judgmentKey];
            return this.domainJudgmentService.getJudgmentStyles(judgment);
        } else this.domainJudgmentService.getJudgmentStyles(null);
    }

    getCommentNgStyle(std: any) {
        const visitFormDomainEvaluation: VisitFormDomainEvaluation = this.getOrCreateEvaluation(std.id, std);
        return this.disableCommentBtn(visitFormDomainEvaluation) ? 'none' :
            ((visitFormDomainEvaluation?.visitFormEvaluationComments?.length == 0) ?
                'brightness(0) saturate(100%) invert(26%) sepia(92%) saturate(7471%) hue-rotate(203deg) brightness(95%) contrast(101%)' :
                'brightness(0) saturate(100%) invert(50%) sepia(95%) saturate(5000%) hue-rotate(90deg) brightness(95%) contrast(105%)');
    }

    disableCommentBtn(visitFormDomainEvaluation: VisitFormDomainEvaluation) {
        return (visitFormDomainEvaluation.visitFormEvaluationComments.length == 0 && this.isTeamMember)
            || !(visitFormDomainEvaluation.visitFormEvaluationComments.length >= 0);
    }
}
