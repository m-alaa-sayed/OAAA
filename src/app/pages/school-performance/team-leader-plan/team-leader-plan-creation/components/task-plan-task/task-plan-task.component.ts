import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActiveType } from 'src/app/core/enum/active-type';
import { TargetAudience } from 'src/app/core/enum/target-audience';
import { VisitDomain } from 'src/app/core/enum/visit-domain';
import { VisitSubject } from 'src/app/core/enum/visit-subject';
import { ToastService } from 'src/app/core/services/toast-service';
import { VisitPlanMemberTask } from 'src/app/pages/school-performance/types/visit-plan-member-task';
import { VisitPlanMemberTaskAssignment } from 'src/app/pages/school-performance/types/visit-plan-member-task-assignment';

@Component({
  selector: 'task-plan-task',
  templateUrl: './task-plan-task.component.html',
  styleUrl: './task-plan-task.component.scss'
})
export class TaskPlanTaskComponent implements OnInit {


  @Input() editTaskObject: VisitPlanMemberTaskAssignment = {} as VisitPlanMemberTaskAssignment;
  @Input() editMemberTask: VisitPlanMemberTask = {} as VisitPlanMemberTask;
  @Input() currentSlot: string = '';
  @Input() isEditMode: boolean = false;


  @Output() onCloseEvent = new EventEmitter<void>();
  @Output() onAddEvent = new EventEmitter<VisitPlanMemberTask>();

  @ViewChild("taskForm") taskForm?: NgForm;

  memberTaskCopy: VisitPlanMemberTask = {} as VisitPlanMemberTask;

  visitDomainOptions = Object.values(VisitDomain);
  subjectOptions = Object.values(VisitSubject);
  targetAudienceOptions = Object.values(TargetAudience);
  activeTypeOptions = Object.values(ActiveType);

  isSubmitting = false;


  constructor(
    public translate: TranslateService,
    public toastService: ToastService
  ) { }


  ngOnInit(): void {
    this.memberTaskCopy = { ...this.editMemberTask };
  }



  addTask() {
    this.isSubmitting = true;
    if (this.taskForm?.invalid) {
      this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS_FOR_SUBMIT'), { classname: 'bg-danger text-white', autohide: false });
      return;
    }
    this.onAddEvent.emit(this.memberTaskCopy);
  }


}
