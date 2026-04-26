import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {VisitDomain} from 'src/app/core/enum/visit-domain';
import {VisitSubject} from 'src/app/core/enum/visit-subject';
import {User} from 'src/app/core/models/auth.models';
import {ToastService} from 'src/app/core/services/toast-service';
import {TeamLeaderPlanWizaredService} from 'src/app/pages/school-performance/service/team-leader-plan-wizared.service';
import {
    ReviewTeamAssignmentRequestInfo
} from 'src/app/pages/school-performance/types/review-team-assignment-request-info';
import {VisitPlanMemberTask} from 'src/app/pages/school-performance/types/visit-plan-member-task';
import {VisitPlanMemberTaskAssignment} from 'src/app/pages/school-performance/types/visit-plan-member-task-assignment';
import {VisitPlanRequestInfo} from 'src/app/pages/school-performance/types/visit-plan-request-info';
import {VisitPlanTeamSlotGroup} from 'src/app/pages/school-performance/types/visit-plan-team-slot-group';
import {BaseModal} from 'src/app/shared/base-modal';
import {Subscription} from "rxjs";

@Component({
    selector: 'task-plan',
    templateUrl: './task-plan.component.html',
    styleUrl: './task-plan.component.scss'
})
export class TaskPlanComponent extends BaseModal implements OnInit {

    @Input() visitPlanRequestInfo: VisitPlanRequestInfo = {} as VisitPlanRequestInfo;
    @Input() reviewTeamAssignmentRequestInfoList: ReviewTeamAssignmentRequestInfo[] = [];
    @Input() showButtons: boolean = true;
    @Input() isEditMode: boolean = false;

    @Output() nextEvent = new EventEmitter<void>();
    @Output() previousEvent = new EventEmitter<void>();
    @Output() cancelEvent = new EventEmitter<void>();

    @ViewChild('otherTemplate') otherTemplate!: TemplateRef<any>;
    subscription!: Subscription;

    editTaskObject: VisitPlanMemberTaskAssignment = {} as VisitPlanMemberTaskAssignment;
    editMemberTask: VisitPlanMemberTask = {} as VisitPlanMemberTask;
    currentSlot: string = '';
    currentIndex = -1;
    currentUser: User = {} as User;
    isSubmitted = false;
    index: number = -1;
    otherSubject: string = '';
    visitDomainOptions = Object.values(VisitDomain);
    subjectOptions = Object.values(VisitSubject);
    reviewTeamAssignmentRequestInfoIds: number[] = [];

    constructor(
        public override modalService: NgbModal,
        public translate: TranslateService,
        public toastService: ToastService,
        public teamLeaderPlanWizaredService: TeamLeaderPlanWizaredService
    ) {
        super(modalService);
    }

    ngOnInit(): void {
        this.subscription = this.teamLeaderPlanWizaredService.visitPlanRequestInfoData$.subscribe(message => this.isSubmitted = message);
    }

    addNewMember(visitPlanMemberTaskAssignmentList: VisitPlanMemberTaskAssignment[]) {
        if (!this.visitPlanRequestInfo.taskAssignments) {
            this.visitPlanRequestInfo.taskAssignments = [];
        }
        this.visitPlanRequestInfo.taskAssignments.push(...visitPlanMemberTaskAssignmentList);
        this.close()
    }

    openNewTask(content: any, slot: string, task: VisitPlanMemberTaskAssignment) {

        this.editTaskObject = task;
        this.currentSlot = slot;
        this.editMemberTask = task.memberTasks?.find(t => t.taskSlot == slot) || {};
        // this.currentUser = this.visitPlanRequestInfo.slotGroups[slot]?.[0].user || {};
        if (this.editMemberTask) {
            if (!task.memberTasks) {
                task.memberTasks = [];
            }
            this.currentIndex = task.memberTasks.findIndex(
                memberTask => memberTask.taskSlot === this.editMemberTask.taskSlot
            );
        }
        this.editMemberTask.taskSlot = slot;
        this.editMemberTask.visitPlanMemberTaskAssignmentId = task.id ?? undefined;
        if (!this.editMemberTask.taskType) {
            this.editMemberTask.taskType = 'INTERVIEW'
        }

        this.open(content);
    }

    deleteTask(assignment: VisitPlanMemberTaskAssignment, slot: string): boolean {
        const s = slot?.trim();
        const tasks = assignment.memberTasks ?? [];
        const idx = tasks.findIndex(t => (t.taskSlot ?? '') === s);
        if (idx === -1) return false;
        assignment.memberTasks = [...tasks.slice(0, idx), ...tasks.slice(idx + 1)];
        return true;
    }

    updateTask(memberTask: VisitPlanMemberTask) {

        if (!this.editTaskObject.memberTasks) {
            this.editTaskObject.memberTasks = [];
        }

        if (this.currentIndex != -1) {
            // Update existing task
            this.editTaskObject.memberTasks[this.currentIndex] = {...memberTask};
        } else {
            // Add new task
            this.editTaskObject.memberTasks.push({...memberTask});
        }
        this.editTaskObject.memberTasks = [...this.editTaskObject.memberTasks];
        this.resetPopupData();
    }

    updateSlotGroup(memberTask: VisitPlanMemberTask) {
        const visitPlanTeamSlotGroup: VisitPlanTeamSlotGroup = {
            user: this.currentUser,
            task: memberTask,
        }
        if (!this.visitPlanRequestInfo.slotGroups[this.currentSlot]) {
            this.visitPlanRequestInfo.slotGroups[this.currentSlot] = [];
        }
        this.visitPlanRequestInfo.slotGroups[this.currentSlot].push(visitPlanTeamSlotGroup);
    }

    resetPopupData() {
        this.editTaskObject = {} as VisitPlanMemberTaskAssignment;
        this.editMemberTask = {} as VisitPlanMemberTask;
        this.currentSlot = '';
        this.currentIndex = -1;
        this.close();
    }

    removeTask(index: number): void {
        this.visitPlanRequestInfo.taskAssignments?.splice(index, 1);
    }

    next() {
        this.isSubmitted = true;
        if (!this.teamLeaderPlanWizaredService.validateAllDomainsSelected(this.visitPlanRequestInfo)) {
            return;
        }
        this.nextEvent.emit();
    }

    private showErrorMessage(message: string) {
        scrollTo(0, 0);
        this.toastService.show(this.translate.instant(message), {classname: 'bg-danger text-white', autohide: false});
    }

    save() {
        this.teamLeaderPlanWizaredService.saveTempObject(this.visitPlanRequestInfo, 'SAVE');
    }

    areAllDomainsSelected(): boolean {
        const selectedDomains = new Set<string>();

        this.visitPlanRequestInfo?.domainResponsibilities?.forEach(domainRow => {
            if (Array.isArray(domainRow.domains)) {
                domainRow.domains.forEach(d => selectedDomains.add(d));
            }
        });

        return this.visitDomainOptions.every(opt => selectedDomains.has(opt));
    }

    onSubjectsChange(selected: any[], index: any) {
        this.index = index;

        if (selected[selected.length - 1] == 'OTHER') {
            this.modalService.open(this.otherTemplate, {size: 'md'});
        }
    }

    confirmOther(modal: any) {
        if (this.otherSubject && this.otherSubject.trim() !== '') {
            const domainResponsibilities = this.visitPlanRequestInfo?.domainResponsibilities;

            if (domainResponsibilities && this.index >= 0 && this.index < domainResponsibilities.length) {
                let subjects = domainResponsibilities[this.index]?.subjects;

                if (subjects) {
                    subjects.pop();

                    subjects.push(this.otherSubject);

                    domainResponsibilities[this.index].subjects = [...subjects];
                }
            }
        }

        modal.close();
        this.otherSubject = '';
    }

    closePop(modal: any) {
        this.otherSubject = '';
        const domainResponsibilities = this.visitPlanRequestInfo?.domainResponsibilities;
        if (domainResponsibilities && this.index >= 0 && this.index < domainResponsibilities.length) {
            const subjects = domainResponsibilities[this.index]?.subjects;
            if (subjects && subjects.length > 0) {
                subjects.pop();
                domainResponsibilities[this.index].subjects = [...subjects];
            }
        }
        modal.close();
    }

    downloadMemberTasksReport() {
        this.teamLeaderPlanWizaredService.downloadMemberTasksReport(this.visitPlanRequestInfo.id, this.reviewTeamAssignmentRequestInfoIds).subscribe({
            next: value => {
                this.downloadFile(value.data);
                this.close();
            },
            error: err => {
                this.showErrorMessage('PAGES.COMMON.MESSAGES.' + err);
            }
        });
    }

    downloadFile(fileDto: any) {
        const dataUri = 'data:application/pdf;base64,' + fileDto.file;
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = dataUri;
        a.download = fileDto.fileName;
        a.click();
        window.URL.revokeObjectURL(dataUri);
    }

    getActivityForSlot(memberTasks: VisitPlanMemberTask[], taskSlot: string) {
        let mt: VisitPlanMemberTask = memberTasks?.find(t => t.taskSlot === taskSlot) || {};
        if (mt.activity === 'OTHER') {
            return mt.customActivity;
        } else {
            return this.translate.instant('PAGES.TEAM_LEADER_PLAN.LABELS.' + mt.activity);
        }
    }
}
