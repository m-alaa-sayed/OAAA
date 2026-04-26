import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SchoolDocumentDeliveryItem} from "../../../../types/school-document-delivery-item";
import {BaseModal} from "../../../../../../shared/base-modal";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "../../../../../../core/services/common.service";
import {LanguageUtil} from "../../../../../../core/util/language.util";
import {SchoolDocumentDeliveryService} from "../../../../service/school-document-delivery.service";


@Component({
    selector: 'app-document-delivery-item-list',
    templateUrl: './document-delivery-item-list.component.html',
    styleUrl: './document-delivery-item-list.component.scss'
})
export class DocumentDeliveryItemListComponent extends BaseModal implements OnInit {
    protected readonly LanguageUtil = LanguageUtil;

    isAddMode: boolean = false;
    isViewMode: boolean = false;
    newItem: SchoolDocumentDeliveryItem | null = null;
    paginatedSchoolDocumentDeliveryItems: SchoolDocumentDeliveryItem[] = [];
    selectedFileName: any;
    selectedFile: File | null = null;
    pageSize: number = 5;
    currentPage: number = 1;
    selectedDocIndex: number = -1;

    @Input() isRequest = false;
    @Input() isTaskAssigned = false;
    @Input() isTlUser = false;
    @Input() isSchoolUser = false;
    @Input() isSubmitted = false;
    @Input() canUpdateDocuments = false;
    @Input() schoolDocumentDeliveryItems: SchoolDocumentDeliveryItem[] = [];
    @Output() schoolDocumentDeliveryItemsEventEmitter: EventEmitter<SchoolDocumentDeliveryItem[]> = new EventEmitter();

    constructor(modalService: NgbModal,
                private schoolDocumentDeliveryService: SchoolDocumentDeliveryService,
                private commonService: CommonService) {
        super(modalService);
    }

    ngOnInit(): void {
        this.updatePagination();
    }

    addNewItem(content: any): void {
        this.isSubmitted = false;
        this.isViewMode = false;
        this.newItem = {
            id: null,
            documentName: null,
            documentType: null,
            description: null,
            deliveryDate: null,
            deliveredById: null,
            deliveredBy: null,
            deliveryStatus: null,
            receivingDate: null,
            receivedById: null,
            receivedBy: null,
            isReceived: false,
            notes: null,
            documentBucketName: null,
            documentFileName: null,
            createdBy: null,
            user: null,
            createdOn: null,
            updatedBy: null,
            updatedOn: null,
            isNew: true,
            submitStatus: 'NEW'
        };
        this.isAddMode = true;
        this.open(content);
    }

    addNewItemToList(): void {
        this.isSubmitted = true;

        const item: SchoolDocumentDeliveryItem = {
            ...this.newItem,
            id: this.newItem?.id ?? null,
            documentName: this.newItem?.documentName ?? null,
            documentType: this.newItem?.documentType ?? null,
            description: this.newItem?.description ?? null,
            deliveryDate: this.newItem?.deliveryDate ?? null,
            deliveredById: this.newItem?.deliveredById ?? null,
            deliveryStatus: this.newItem?.deliveryStatus ?? null,
            receivingDate: this.newItem?.receivingDate ?? null,
            receivedById: this.newItem?.receivedById ?? null,
            notes: this.newItem?.notes ?? null,
            documentBucketName: this.newItem?.documentBucketName ?? null,
            documentFileName: this.newItem?.documentFileName ?? null,
            createdBy: this.newItem?.createdBy ?? null,
            user: this.newItem?.user ?? null,
            createdOn: this.newItem?.createdOn ?? null,
            updatedBy: this.newItem?.updatedBy ?? null,
            updatedOn: this.newItem?.updatedOn ?? null,
            deliveredBy: this.newItem?.deliveredBy ?? null,
            receivedBy: this.newItem?.receivedBy ?? null,
            isReceived: !!this.newItem?.isReceived,
            isNew: false,
            submitStatus: this.newItem?.submitStatus ?? null
        };

        if (!this.schoolDocumentDeliveryService.validateDocumentItem(item, this.isTlUser, this.isSchoolUser)) return;

        if (this.isAddMode) this.schoolDocumentDeliveryItems.unshift(item);
        else this.schoolDocumentDeliveryItems[this.selectedDocIndex] = structuredClone(item);

        this.updatePagination();
        this.schoolDocumentDeliveryItemsEventEmitter.emit(this.schoolDocumentDeliveryItems);

        this.newItem = null;
        this.selectedDocIndex = -1;
        this.close();
    }

    remove(index: number): void {
        this.schoolDocumentDeliveryItems.splice(index, 1);
        this.updatePagination();
        this.schoolDocumentDeliveryItemsEventEmitter.emit(this.schoolDocumentDeliveryItems);
        this.selectedDocIndex = -1;
        this.close();
    }

    updateDoc(content: any, doc: SchoolDocumentDeliveryItem, isView: boolean): void {
        this.isSubmitted = false;
        this.newItem = structuredClone(doc);
        this.newItem.isNew = false;
        this.isAddMode = false;
        this.isViewMode = isView;
        if(!this.isTaskAssigned && this.isSchoolUser && this.newItem.deliveryStatus !== 'IN_PROGRESS'){
            this.isViewMode = true;
        }
        /*if (this.isTlUser && this.newItem.isReceived) {
            this.isViewMode = true;
        }*/
        this.open(content);
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.uploadFile();
        }
    }

    uploadFile(): void {
        if (!this.selectedFile) {
            console.warn('No file selected');
            return;
        }
        const bucket = 'oaaaqa';
        this.commonService.uploadFileToOci(bucket, this.selectedFile)
            .subscribe({
                next: (response) => {
                    const data = response.data;
                    if (this.newItem) {
                        this.newItem.documentBucketName = data.bucketName;
                        this.newItem.documentFileName = data.objectName;
                    }
                },
                error: (error) => {
                    console.error('Error uploading file:', error);
                }
            });
    }

    downloadUploadedFile(objectName: any, bucketName: any): void {
        if (!objectName || !bucketName) {
            console.warn('Missing file data');
            return;
        }

        this.commonService.getOciPreAuthenticatedUrl(bucketName, objectName)
            .subscribe({
                next: (res) => {
                    const downloadUrl = res.data;

                    fetch(downloadUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('File download failed.');
                            }
                            return response.blob();
                        })
                        .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = objectName;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            window.URL.revokeObjectURL(url);
                        })
                        .catch(err => {
                            console.error('Download via blob failed:', err);
                        });
                },
                error: (err) => {
                    console.error('Download failed:', err);
                }
            });
    }

    updatePagination(): void {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedSchoolDocumentDeliveryItems = this.schoolDocumentDeliveryItems.slice(startIndex, endIndex);
    }

    onDeliveryStatusChanged() {
        if (this.newItem && this.newItem.deliveryStatus !== 'YES') this.newItem.deliveryDate = null;
    }

    onIsReceivedChanged() {
        if (this.newItem && !this.newItem.isReceived) this.newItem.receivingDate = null;
    }

    onPageChange(page: number): void {
        this.currentPage = page;
        this.updatePagination();
    }
}
