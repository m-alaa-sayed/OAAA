import { Component } from '@angular/core';
import { Permission } from 'src/app/core/enum/permission';

@Component({
  selector: 'app-cheqa-charts',
  standalone: false,
  templateUrl: './cheqa-charts.component.html',
  styleUrl: './cheqa-charts.component.scss'
})
export class CHEQAChartsComponent {
  protected readonly Permission = Permission;
}
