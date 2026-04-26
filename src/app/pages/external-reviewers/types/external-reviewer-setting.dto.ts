export class ExternalReviewerSettingDto {
    id?: number;
    version?: number;
    module?: string;
    pledgeAr: string = '';
    pledgeEn: string = '';
    editPeriodAllowed: number = 0;
    editPeriodAllowedNotificationPercentage: number = 0;
    successPercent: number = 0;
  }
  