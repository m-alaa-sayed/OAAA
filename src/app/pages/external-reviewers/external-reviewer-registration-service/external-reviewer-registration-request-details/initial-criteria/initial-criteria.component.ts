import {Component, Input, OnInit} from '@angular/core';
import {Criterion} from '../../../types/acceptance-criteria/criterion';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {ExternalReviewersRegistrationRequestInfo} from '../../../types/external-reviewers-registration-request-info';
import {ExternalReviewerCriteriaScores} from '../../../types/external-reviewer-criteria-scores';
import {CriterionItem} from '../../../types/acceptance-criteria/criterion-item';
import {ExternalReviewerValidationService} from '../../../services/external-reviewer-validation.service';
import {limitWords} from 'src/app/shared/utils/word-utils';

@Component({
  selector: 'app-initial-criteria',
  templateUrl: './initial-criteria.component.html',
  styleUrl: './initial-criteria.component.scss'
})
export class InitialCriteriaComponent implements OnInit {

  @Input() isEditMode: boolean = false;
  @Input() criterionList: Criterion[] = [];
  @Input() externalReviewersRegistrationRequestInfo !: ExternalReviewersRegistrationRequestInfo;
  @Input() onCriteriaValueChanged?: (totalScore: number) => void;



  activeTabId  !: number;
  totalScore !: number;
  isSubmitting: boolean = false;
  currentVersionTotalScores !:number;

  constructor(
    private toastService: ToastService,
    public translate: TranslateService,
    private externalReviewerValidationService: ExternalReviewerValidationService
  ) { }

  ngOnInit(): void {
    this.activeTabId = this.criterionList[0]?.currentVersion.id || 0;

    if (!this.externalReviewersRegistrationRequestInfo.criteriaScoreList) {
      this.externalReviewersRegistrationRequestInfo.criteriaScoreList = [];
    }

    if (!this.externalReviewersRegistrationRequestInfo.totalScore) {
      this.externalReviewersRegistrationRequestInfo.totalScore = 0;
    }
    this.populateScoresFromInfo(this.externalReviewersRegistrationRequestInfo, this.criterionList);

    this.externalReviewerValidationService.externalReviewerRegistrationApprovalData$.subscribe(message => {
      this.isSubmitting = message;
    });



    this.currentVersionTotalScores = this.criterionList.reduce((sum, item) => {
      return sum + (item.currentVersion?.totalRequiredScore || 0);
    }, 0);
  }




  populateScoresFromInfo(info: ExternalReviewersRegistrationRequestInfo, criterionList: Criterion[]) {
    const scores: ExternalReviewerCriteriaScores[] = info.criteriaScoreList || [];

    for (let criterion of criterionList) {
      for (let subCriteria of criterion.currentVersion.subCriteriaList) {
        for (let item of subCriteria.items) {
          const matchedScore = scores.find(score =>
            score.criteriaItemId === item.id
          );

          if (matchedScore) {
            item.currentValue = Number(matchedScore.criteriaItemValue) || 0;
            item.currentOptionId = matchedScore.criteriaOptionId;
            item.currentNote = matchedScore.criteriaItemNote;
          }
        }
      }
    }
  }


  onInputChange(item: any, field: 'criteriaItemValue' | 'criteriaItemNote' | 'criteriaOptionId', value: any) {

    if (field == 'criteriaItemValue' && +value > +item.maxScore) {
      const max = item.maxScore;
      const message = this.translate.instant('PAGES.REQUEST_DETAILS.LABELS.VALUE_EXCEEDS_MAX_SCORE', { max });
      this.toastService.show(message, { classname: 'bg-danger text-white', autohide: false });
      item.currentValue = 0;
    } else {
      this.updateCreiteriaList(item, field, value);
      
      // Call callback when criteriaItemValue or criteriaOptionId changes (both affect score)
      if ((field === 'criteriaItemValue' || field === 'criteriaOptionId') && this.onCriteriaValueChanged) {
        this.onCriteriaValueChanged(this.externalReviewersRegistrationRequestInfo.totalScore || 0);
      }
    }
  }


  private updateCreiteriaList(item: CriterionItem, field: 'criteriaItemValue' | 'criteriaItemNote' | 'criteriaOptionId', value: any) {
    if (!this.externalReviewersRegistrationRequestInfo.criteriaScoreList) {
      this.externalReviewersRegistrationRequestInfo.criteriaScoreList = [];
      item.currentValue = undefined;
    }

    if (!this.externalReviewersRegistrationRequestInfo.totalScore) {
      this.externalReviewersRegistrationRequestInfo.totalScore = 0;
    }

    const existing = this.externalReviewersRegistrationRequestInfo.criteriaScoreList.find(x => x.criteriaItemId == item.id);
    if (existing) {
      if (item.required && field != 'criteriaItemNote') {
        const oldValue = field == 'criteriaItemValue' ? Number(existing.criteriaItemValue) : this.getScoreById(item, existing.criteriaOptionId);
        const currentValue = field == 'criteriaItemValue' ? value : this.getScoreById(item, value);
        this.externalReviewersRegistrationRequestInfo.totalScore += currentValue - oldValue;
      }
      existing[field] = value;
    } else {
      const newEntry: ExternalReviewerCriteriaScores = {
        criteriaItemId: item.id,
        criteriaItemValue: field === 'criteriaItemValue' ? value : '',
        criteriaItemNote: field === 'criteriaItemNote' ? value : '',
        criteriaOptionId: field === 'criteriaOptionId' ? value : '',
        criteriaItemScore: field === 'criteriaItemValue' ? Number(item.maxScore) : this.getMaxScore(item),
      };
      this.externalReviewersRegistrationRequestInfo.criteriaScoreList.push(newEntry);
      if (item.required) {
        if (field === 'criteriaItemValue') {
          this.externalReviewersRegistrationRequestInfo.totalScore += Number(newEntry.criteriaItemValue);
        } else {
          this.externalReviewersRegistrationRequestInfo.totalScore += this.getScoreById(item, value);
        }
      }
    }
  }


  onSelectChanged(item: any, field: 'criteriaOptionId', event: any) {
    this.updateCreiteriaList(item, field, event.target.value);
    
    // Call callback when dropdown selection changes (affects score)
    if (this.onCriteriaValueChanged) {
      this.onCriteriaValueChanged(this.externalReviewersRegistrationRequestInfo.totalScore || 0);
    }
  }


  getMaxScore(item: any): number {
    return item.options?.length
      ? Math.max(...item.options.map((opt: any) => opt.score))
      : 0;
  }


  getScoreById(item: CriterionItem, id: any): number {
    const option = item.options
      .find(x => x.id == id);

    return item ? Number(option?.score) || 0 : 0;
  }


  onTextChange(currentNote: string): void {
    const result = limitWords(currentNote || '', 250);
    currentNote = result.trimmedText;
  }

}
