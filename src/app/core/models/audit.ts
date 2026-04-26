export class Audit {
    id!: string;
    action!: string;
    actionTime!: string;
    resourceName!: string;
    resourceId!: any;
    executedByFullNameAr!: string;
    executedByFullNameEn!: string;
    parameters!: { [key: string]: any };
}