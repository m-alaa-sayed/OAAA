import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-permission-basic-info',
  standalone: false,
  templateUrl: './permission-basic-info.component.html',
  styleUrl: './permission-basic-info.component.scss'
})
export class PermissionBasicInfoComponent {
  @Input() permissionData: any;
}
