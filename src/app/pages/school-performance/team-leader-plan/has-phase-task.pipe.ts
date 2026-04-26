import { Pipe, PipeTransform } from '@angular/core';
import { VisitPlanMemberTask } from '../types/visit-plan-member-task';
import { depthFirstOriginalTreeSearch } from 'ag-grid-community/dist/types/core/columns/columnFactory';

@Pipe({
  name: 'hasPhaseTask',
  standalone: false
})
export class HasPhaseTaskPipe implements PipeTransform {

  transform(tasks: VisitPlanMemberTask[], taskSlot: string): boolean {
    
    return tasks?.some(task => task.taskSlot === taskSlot);
  }
}
