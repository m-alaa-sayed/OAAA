import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToastService} from 'src/app/core/services/toast-service';
import {
    ReviewTeamAssignmentRequestInfo
} from 'src/app/pages/school-performance/types/review-team-assignment-request-info';
import {VisitPlanMemberTaskAssignment} from 'src/app/pages/school-performance/types/visit-plan-member-task-assignment';

@Component({
    selector: 'task-plan-member',
    templateUrl: './task-plan-member.component.html',
    styleUrl: './task-plan-member.component.scss'
})
export class TaskPlanMemberComponent implements OnInit {

    @Input() visitLeaderPlanRequestInfoId?: number;
    @Input() reviewTeamAssignmentRequestInfoList: ReviewTeamAssignmentRequestInfo[] = [];
    @Input() taskAssignmentList: VisitPlanMemberTaskAssignment[] = [];
    @Input() visitFrom !: string;
    @Input() visitTo !: string;

    @Output() onCloseEvent = new EventEmitter<void>();
    @Output() onAddEvent = new EventEmitter<VisitPlanMemberTaskAssignment[]>();


    visitPlanMemberTaskAssignmentList: VisitPlanMemberTaskAssignment[] = [];


    fromDate !: Date;
    toDate !: Date;

    visitDateFrom !: Date;
    visitDateTo !: Date;

    reviewTeamAssignmentRequestInfoId !: number;


    constructor(private toastService: ToastService,
                public translate: TranslateService
    ) {
    }


    ngOnInit(): void {
        this.visitDateFrom = new Date(this.visitFrom);
        this.visitDateTo = new Date(this.visitTo);
    }

    addMember() {

        const start = new Date(this.fromDate);
        const end = new Date(this.toDate);

        if (!(start >= this.visitDateFrom && end <= this.visitDateTo)) {
            this.toastService.show(this.translate.instant('PAGES.TEAM_LEADER_PLAN.MESSAGES.DATES_OUT_OF_RANGE_OF_VISIT'), {
                classname: 'bg-danger text-white',
                autohide: false
            });

            return;
        }


        if (!this.reviewTeamAssignmentRequestInfoId || !this.fromDate || !this.toDate) {
            this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.ADD_ALL_MANDATORY_FIELDS'), {
                classname: 'bg-danger text-white',
                autohide: false
            });
            return;
        }

        // Ensure fromDate <= toDate
        if (start > end) {
            this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.DATES_OUT_OF_RANGE'), {
                classname: 'bg-danger text-white',
                autohide: false
            });
            return;
        }
        const current = new Date(start);
        const alreadyExists = this.taskAssignmentList.some(task =>
            task.reviewTeamAssignmentRequestInfoId === this.reviewTeamAssignmentRequestInfoId &&
            task.taskAssignmentDate === this.formatDate(current)
        );

        if (alreadyExists) {
            this.toastService.show(this.translate.instant('PAGES.TEAM_LEADER_PLAN.MESSAGES.MEMBER_ALREADY_ASSIGNED_FOR_SAME_PERIOD'), {
                classname: 'bg-danger text-white',
                autohide: false
            });
            return;
        }

        this.preparedMemberObjects(start, end, current);
        this.onAddEvent.emit(this.visitPlanMemberTaskAssignmentList);
    }


    private preparedMemberObjects(start: Date, end: Date, current: Date) {
        this.visitPlanMemberTaskAssignmentList = []; // Clear previous entries
        const currentMember = this.reviewTeamAssignmentRequestInfoList.find(task =>
            task.id == this.reviewTeamAssignmentRequestInfoId
        );

        while (current <= end) {
            const newTask: VisitPlanMemberTaskAssignment = {
                id: null,
                visitLeaderPlanRequestInfoId: this.visitLeaderPlanRequestInfoId,
                reviewTeamAssignmentRequestInfoId: this.reviewTeamAssignmentRequestInfoId,
                taskAssignmentDate: this.formatDate(current),
                memberTasks: [],
                memberNameAr: currentMember?.user?.fullNameAr,
                memberNameEn: currentMember?.user?.fullNameEn,
                role: currentMember?.role
            };

            this.visitPlanMemberTaskAssignmentList.push(newTask);

            // Move to next day
            current.setDate(current.getDate() + 1);
        }
    }


    formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

}
