export class OaaaServiceCategoryDto {
    id?: number;
    categoryNameAr?: string;
    categoryNameEn?: string;
    categoryDescAr?: string;
    categoryDescEn?: string;
    displayStatus?: boolean = true;
    displayOrder?: number;
    createdBy?: number;
    createdOn?: Date;
    updatedBy?: number;
    updatedOn?: Date;
}