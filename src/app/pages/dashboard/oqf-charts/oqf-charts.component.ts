import { Component } from '@angular/core';
import { Permission } from 'src/app/core/enum/permission';

@Component({
  selector: 'app-oqf-charts',
  standalone: false,
  templateUrl: './oqf-charts.component.html',
  styleUrl: './oqf-charts.component.scss'
})
export class OQFChartsComponent {
  protected readonly Permission = Permission;
}
