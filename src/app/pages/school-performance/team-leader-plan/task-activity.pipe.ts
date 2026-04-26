import { Pipe, PipeTransform } from "@angular/core";
import { VisitPlanMemberTask } from "../types/visit-plan-member-task";

@Pipe({
  name: 'taskActivity',
  standalone: false
})
export class TaskActivity implements PipeTransform {

  transform(tasks: VisitPlanMemberTask[], taskSlot: string): string {
    
    return tasks?.find(m => m.taskSlot === taskSlot)?.activity || '';
  }

}