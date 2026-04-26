import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ServiceManagementService } from 'src/app/core/services/service-management.service';
import { OaaaServiceCategoryService } from 'src/app/core/services/oaaa.service.category.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { UserState } from 'src/app/core/states/user.state';
import { OaaaServiceCategoryDto } from 'src/app/core/models/oaaa.service.category.dto';

@Component({
  selector: 'app-service-catalogue',
  templateUrl: './service-catalogue-list.component.html',
  styleUrls: ['./service-catalogue-list.component.scss']
})
export class ServiceCatalogueListComponent implements OnInit {
  user: any = {};
  serviceList: any[] = [];
  displayedServices: any[] = [];
  filteredServices: any[] = [];
  serviceCategoryList: OaaaServiceCategoryDto[] = [];

  currentLang: string = 'ar';
  batchSize = 8;
  currentIndex = 0;

  filterObject: {
    serviceName: string;
    showExternal: boolean;
    showInternal: boolean;
    servicesCategoryIds: number[];
  } = {
      serviceName: '',
      showExternal: true,
      showInternal: true,
      servicesCategoryIds: []
    };

  isAllCheckboxChecked: boolean = true;

  constructor(
    public translate: TranslateService,
    private serviceManagementService: ServiceManagementService,
    private oaaaServiceCategoryService: OaaaServiceCategoryService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('language') || 'ar';

    UserState.getUserState().subscribe(user => {
      if (user !== null) {
        this.user = user;
        if (this.user.externalUser) {
          this.filterObject.showInternal = false;
        }
      }
    });

    this.loadCategoryServices();
    this.loadServices();
  }

  loadServices(): void {
    this.serviceManagementService.listCatalogueServices().subscribe({
      next: (res) => {
        if (res.data) {
          this.serviceList = res.data.sort(
            (a, b) => (a.serviceDisplayOrder ?? 0) - (b.serviceDisplayOrder ?? 0)
          );
          this.applyFilters();
        }
      },
      error: (err) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), {
          classname: 'bg-danger text-white',
            autohide: false
        });
      }
    });
  }

  loadCategoryServices(): void {
    const dto = { displayStatusList: [true] };
    this.oaaaServiceCategoryService.search(dto).subscribe({
      next: (data) => {
        this.serviceCategoryList = data;
      },
      error: (err) => {
        this.toastService.show(this.translate.instant('PAGES.COMMON.MESSAGES.' + err), {
          classname: 'bg-danger text-white',
            autohide: false
        });
      }
    });
  }

  applyFilters(): void {
    this.currentIndex = 0;

    this.filteredServices = this.serviceList.filter(service => {
      const nameMatch =
        !this.filterObject.serviceName ||
        service.serviceNameAr?.toLowerCase().includes(this.filterObject.serviceName.toLowerCase()) ||
        service.serviceNameEn?.toLowerCase().includes(this.filterObject.serviceName.toLowerCase());

      const typeMatch =
        (this.filterObject.showExternal && service.externalService) ||
        (this.filterObject.showInternal && !service.externalService);

      const categoryMatch =
        this.isAllCheckboxChecked ||
        this.filterObject.servicesCategoryIds.includes(service.serviceCategoryId ?? -1);

      return nameMatch && typeMatch && categoryMatch;
    });

    this.displayedServices = [];
    this.loadMore();
  }


  search(): void {
    this.applyFilters();
  }

  reset(): void {
    this.filterObject = {
      serviceName: '',
      showExternal: true,
      showInternal: !this.user.externalUser,
      servicesCategoryIds: []
    };
    this.isAllCheckboxChecked = true;
    this.applyFilters();
  }


  onCategorySelected(categoryId: number): void {
    const index = this.filterObject.servicesCategoryIds.indexOf(categoryId);
    if (index > -1) {
      // Already selected -> remove it
      this.filterObject.servicesCategoryIds.splice(index, 1);
    } else {
      // Not selected -> add it
      this.filterObject.servicesCategoryIds.push(categoryId);
    }
    // Update "Select All" flag
    this.isAllCheckboxChecked = this.filterObject.servicesCategoryIds.length === 0;

    // if (this.filterObject.servicesCategoryIds[0] === categoryId) {
    //   // Unselect if clicked again
    //   this.filterObject.servicesCategoryIds = [];
    //   this.isAllCheckboxChecked = true;
    // } else {
    //   this.filterObject.servicesCategoryIds = [categoryId];
    //   this.isAllCheckboxChecked = false;
    // }

    this.applyFilters();
  }

  selectAllCategories(): void {
    this.filterObject.servicesCategoryIds = [];
    this.isAllCheckboxChecked = true;
    this.applyFilters();
  }

  loadMore(): void {
    const nextBatch = this.filteredServices.slice(this.currentIndex, this.currentIndex + this.batchSize);
    this.displayedServices = [...this.displayedServices, ...nextBatch];
    this.currentIndex += this.batchSize;
  }

  showLess(): void {
    this.currentIndex = this.batchSize;
    this.displayedServices = this.filteredServices.slice(0, this.batchSize);
  }

  hasMore(): boolean {
    return this.currentIndex < this.filteredServices.length;
  }

  selectServiceType(type: 'EXTERNAL' | 'INTERNAL'): void {
    if (type === 'EXTERNAL') {
      this.filterObject.showExternal = true;
      this.filterObject.showInternal = false;
    } else {
      this.filterObject.showInternal = true;
      this.filterObject.showExternal = false;
    }

    this.applyFilters();
  }


}
