import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-procedure-basic-info',
  standalone: false,
  templateUrl: './procedure-basic-info.component.html',
  styleUrl: './procedure-basic-info.component.scss'
})
export class ProcedureBasicInfoComponent {
  @Input() procedureData: any;
}
