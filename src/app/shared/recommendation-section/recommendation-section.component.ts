import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recommendation-section',
  templateUrl: './recommendation-section.component.html',
  styleUrls: ['./recommendation-section.component.scss']
})
export class RecommendationSectionComponent implements OnInit {
  @Input() model: any;
  @Input() erActivities: any[] = [];
  @Input() module: string | null = null;
  @Input() isEditable: any = null; // original used taskId presence
  @Input() canEditMetAndNotMet = false;
  @Input() isSubmitted = false;
  @Input() acceptancePercentageMsg = { exceeded: false, msg: '' };

  @Output() modelChange = new EventEmitter<any>();


  constructor(
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    if (!this.model) {
      this.model = {};
    }
    if (!this.model.recommendedActivityList) {
      this.model.recommendedActivityList = [];
    }
  }

  isChecked(activityId: any): boolean {
    return this.model && this.model.recommendedActivityList && this.model.recommendedActivityList.indexOf(activityId) > -1;
  }

  toggleActivity(activity: any, checked: boolean) {
    if (!this.model.recommendedActivityList) {
      this.model.recommendedActivityList = [];
    }
    const idx = this.model.recommendedActivityList.indexOf(activity.id);
    if (checked && idx === -1) {
        const activityObj: any = {
          activityId: activity.id
        }
      this.model.recommendedActivityList.push(activityObj);
    } else if (!checked && idx > -1) {
      this.model.recommendedActivityList.splice(idx, 1);
    }
    this.emitModelChange();
  }

  onTextChange() {
    this.emitModelChange();
  }

  onRecommendationChange() {
    if (this.model && this.model.evaluationRecommendation !== 'MET') {
      this.model.recommendedActivityList = [];
    }
    this.emitModelChange();
  }

  private emitModelChange() {
    this.modelChange.emit(this.model);
  }
}
