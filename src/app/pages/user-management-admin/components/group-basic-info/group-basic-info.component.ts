import { Component, Input } from '@angular/core';
import { GroupDto } from '../../../users-and-permissions-management/models/role.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-group-basic-info',
  templateUrl: './group-basic-info.component.html',
  styleUrls: ['./group-basic-info.component.scss']
})
export class GroupBasicInfoComponent {
  @Input() groupData!: GroupDto;

  constructor(public translate: TranslateService) {}
}
