import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserDetailsDto } from 'src/app/core/models/user-details.model';

export interface UserBasicInfoData {
  name?: string;
  civilOrPassportNumber?: string;
  idType: string;
  email?: string;
  username?: string;
  accountType: string;
  center?: string;
  mobile?: string;
  status: string;
  centerOrOrganization?: string;
}

@Component({
  selector: 'app-user-basic-info',
  templateUrl: './user-basic-info.component.html',
  styleUrl: './user-basic-info.component.scss'
})
export class UserBasicInfoComponent implements OnInit, OnChanges {
  @Input() userFullData?: UserDetailsDto;
  @Input() userData: any = {
    name: '',
    civilId: '',
    idType: '',
    email: '',
    username: '',
    accountType: '',
    centerOrOrganization: '',
    mobile: '',
    status: '',
  };

  ngOnInit(): void {
    if (this.userFullData) {
      this.userData = this.mapUserToBasicInfo(this.userFullData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userFullData'] && changes['userFullData'].currentValue) {
      this.userData = this.mapUserToBasicInfo(changes['userFullData'].currentValue);
      console.log('userData updated via ngOnChanges:', this.userData);
    }
  }

  private mapUserToBasicInfo(user: UserDetailsDto): UserBasicInfoData {
    const lang = this.translate.currentLang;

    const name = lang === 'ar'
      ? (user.fullNameAr || user.fullNameEn || user.username || '')
      : (user.fullNameEn || user.fullNameAr || user.username || '');

    const centerOrOrganization = user.externalUser ?
      lang == 'ar' ? user.organization.lookupValueAr : user.organization.lookupValueEn :
      lang == 'ar' ? user.group.nameAr : user.group.nameEn;

    const idTypeKey = user.insideOman === false
      ? 'PAGES.CREATE_ACCOUNT.LABELS.PASSPORT_NUMBER'
      : 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.CIVIL_ID';

    const accountTypeKey = user.externalUser
      ? 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.EXTERNAL_USER'
      : 'PAGES.PERMISSIONS_MANAGEMENT.LABELS.AUTHORITY_EMPLOYEE';

    const statusKey = (user.status === 'ACTIVE' || user.status as any === true)
      ? 'PAGES.COMMON.LABELS.ACTIVE'
      : 'PAGES.COMMON.LABELS.INACTIVE';

    return {
      name: name || '-',
      civilOrPassportNumber: user.insideOman ? user.civilNo : user.passportNo || '-',
      email: user.email || '-',
      username: user.username || '-',
      centerOrOrganization: centerOrOrganization || '-',
      mobile: user.mobileNo || '-',
      idType: idTypeKey,
      accountType: accountTypeKey,
      status: statusKey,
    };
  }

  constructor(public translate: TranslateService) {}
}
