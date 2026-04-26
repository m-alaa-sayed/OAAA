import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgbActiveModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SchoolConflictsService } from 'src/app/core/services/school-conflicts.service';

@Component({
    selector: 'app-history-modal',
    standalone: true,
    imports: [CommonModule, TranslateModule, NgbPaginationModule],
    templateUrl: './history-modal.component.html',
    styleUrls: ['./history-modal.component.scss']
})
export class HistoryModalComponent implements OnInit {
    historyData: any[] = [];
    paginatedData: any[] = [];
    private rawData: any[] = [];
    
    page = 1;
    pageSize = 5;
    collectionSize = 0;

    constructor(
        public activeModal: NgbActiveModal,
        private schoolConflictsService: SchoolConflictsService,
        public translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.getHistory();
        this.translate.onLangChange.subscribe(() => this.mapData());
    }

    getHistory() {
        this.schoolConflictsService.getSchoolConflictsAudit().subscribe({
            next: (data) => {
                this.rawData = data;
                this.mapData();
            },
            error: (err) => {
                console.error('Error fetching audit logs:', err);
            }
        });
    }

    private mapData() {
        this.historyData = this.rawData.map(item => ({
            actionType: item.operationType,
            schoolName: this.translate.currentLang === 'ar' ? item.schoolNameAr : item.schoolNameEn,
            employeeName: item.createdBy,
            actionDate: item.createdOn,
            notes: item.justification
        }));
        this.collectionSize = this.historyData.length;
        this.paginateData();
    }

    paginateData() {
        const start = (this.page - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedData = this.historyData.slice(start, end);
    }

    onPageChange(page: number) {
        this.page = page;
        this.paginateData();
    }
}
