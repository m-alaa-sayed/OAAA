import { Component, Input } from '@angular/core';

@Component({
  selector: 'evidence-collection-forms-statistics',
  templateUrl: './evidence-collection-forms-statistics.component.html',
  styleUrl: './evidence-collection-forms-statistics.component.scss'
})
export class EvidenceCollectionFormsStatisticsComponent {

  @Input() groupedFormsStats?: Record<string, Record<string, number>>;


  classroomObservationKeys: string[] = [];
  generalEvidenceKeys: string[] = [];

  ngOnChanges(): void {
    if (this.groupedFormsStats) {
      this.classroomObservationKeys = Object.keys(this.groupedFormsStats['CLASSROOM_OBSERVATION'] || {});
      this.generalEvidenceKeys = Object.keys(this.groupedFormsStats['GENERAL_EVIDENCE'] || {});
    }
  }



}
