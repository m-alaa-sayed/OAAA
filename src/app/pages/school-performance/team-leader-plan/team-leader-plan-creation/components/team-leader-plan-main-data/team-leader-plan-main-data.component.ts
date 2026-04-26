import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'team-leader-plan-main-data',
  templateUrl: './team-leader-plan-main-data.component.html',
  styleUrl: './team-leader-plan-main-data.component.scss'
})
export class TeamLeaderPlanMainDataComponent {

  @Input() mainDataObject : any;

  constructor(public translate: TranslateService) {}
}
