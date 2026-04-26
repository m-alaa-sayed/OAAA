import { Pipe, PipeTransform } from "@angular/core";
import { VisitPlanMemberTask } from "../types/visit-plan-member-task";

@Pipe({
  name: 'taskType',
  standalone: false
})
export class TaskType implements PipeTransform {

  transform(tasks: VisitPlanMemberTask[], taskSlot: string): string {
    
    return tasks?.find(m => m.taskSlot === taskSlot)?.taskType || '';
  }

}