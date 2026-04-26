import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { PrintTableComponent } from './print-table/print-table.component';
import {NgbAccordionModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbToastModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

// Load Icons
import { defineElement } from "@lordicon/element";
import lottie from 'lottie-web';

// Swiper Slider
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {RouterModule} from '@angular/router';
// Counter
import {CountUpModule} from 'ngx-countup';

import {BreadcrumbsComponent} from './breadcrumbs/breadcrumbs.component';
import {ClientLogoComponent} from './landing/index/client-logo/client-logo.component';
import {ServicesComponent} from './landing/index/services/services.component';
import {CollectionComponent} from './landing/index/collection/collection.component';
import {CtaComponent} from './landing/index/cta/cta.component';
import {DesignedComponent} from './landing/index/designed/designed.component';
import {PlanComponent} from './landing/index/plan/plan.component';
import {FaqsComponent} from './landing/index/faqs/faqs.component';
import {ReviewComponent} from './landing/index/review/review.component';
import {CounterComponent} from './landing/index/counter/counter.component';
import {WorkProcessComponent} from './landing/index/work-process/work-process.component';
import {TeamComponent} from './landing/index/team/team.component';
import {ContactComponent} from './landing/index/contact/contact.component';
import {FooterComponent} from './landing/index/footer/footer.component';
import {ScrollspyDirective} from './scrollspy.directive';

// NFT Landing
import {MarketPlaceComponent} from './landing/nft/market-place/market-place.component';
import {WalletComponent} from './landing/nft/wallet/wallet.component';
import {FeaturesComponent} from './landing/nft/features/features.component';
import {CategoriesComponent} from './landing/nft/categories/categories.component';
import {DiscoverComponent} from './landing/nft/discover/discover.component';
import {TopCreatorComponent} from './landing/nft/top-creator/top-creator.component';

// Job Landing
import {BlogComponent} from './landing/job/blog/blog.component';
import {CandidateComponent} from './landing/job/candidate/candidate.component';
import {FindjobsComponent} from './landing/job/findjobs/findjobs.component';
import {JobFooterComponent} from './landing/job/job-footer/job-footer.component';
import {JobcategoriesComponent} from './landing/job/jobcategories/jobcategories.component';
import {ProgressComponent} from './landing/job/progress/progress.component';
import {LandingScrollspyDirective} from './landingscrollspy.directive';
import {ToastsContainer} from './toast/toasts-container.component';
import {AgGridModule} from 'ag-grid-angular';
import {OaaaqaAgGridComponent} from './oaaaqa-ag-grid/oaaaqa-ag-grid.component';
import {DropdownFilterComponent} from './oaaaqa-ag-grid/DropdownFilterComponent';
import {TranslateModule} from '@ngx-translate/core';
import {PageTitleComponent} from './page-title/page-title.component';
import {NoWhitespaceValidatorDirective} from "../core/directives/no-white-space-validator.directive";
import { ModalConfirmComponent } from './app-modal-confirm/modal-confirm.component';
import { SuccessModalComponent } from './success-modal/success-modal.component';
import {FormsModule} from "@angular/forms";
import { WizardComponent } from './wizard-template/wizard/wizard.component';
import { CommonAttachmentsComponent } from './common-attachments/common-attachments.component';
import { RequestMainDataComponent } from './request-main-data/request-main-data.component';
import { RequestUserDetailsComponent } from './request-user-details/request-user-details.component';
import { FollowUpRequestComponent } from './follow-up-request/follow-up-request.component';
import { RecommendationSectionComponent } from './recommendation-section/recommendation-section.component';
import { TabsComponent } from './tabs-template/tabs/tabs.component';
import { UserRegistryInAuthorityComponent } from './user-registry-in-authority/user-registry-in-authority.component';
import { ActionButtonsRendererComponent } from './oaaaqa-ag-grid/ActionButtonsRendererComponent';
import { TrainingResultComponent } from './training-result/training-result.component';
import { ExternalReviewerOperationsComponent } from './external-reviewer-operations/external-reviewer-operations.component';
import { ExternalReviewerSummaryComponent } from './external-reviewer-summary/external-reviewer-summary.component';
import { InterviewResultComponent } from './interview-result/interview-result.component';
import { SelfEvaluationDocumentMainDataComponent } from './self-evaluation-document-main-data/self-evaluation-document-main-data.component';
import {ReportComponent} from "./report/report.component";
import {HasPermissionDirective} from "../core/directives/has-permission.directive";

import {CustomCkeditorComponent} from './custom-ckeditor/custom-ckeditor.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
// PrintTableComponent imported above

@NgModule({
    declarations: [
        BreadcrumbsComponent,
        ClientLogoComponent,
        ServicesComponent,
        CollectionComponent,
        CtaComponent,
        DesignedComponent,
        PlanComponent,
        FaqsComponent,
        ReviewComponent,
        CounterComponent,
        WorkProcessComponent,
        TeamComponent,
        ContactComponent,
        FooterComponent,
        ScrollspyDirective,
        LandingScrollspyDirective,
        MarketPlaceComponent,
        WalletComponent,
        FeaturesComponent,
        CategoriesComponent,
        DiscoverComponent,
        TopCreatorComponent,
        BlogComponent,
        CandidateComponent,
        FindjobsComponent,
        JobFooterComponent,
        JobcategoriesComponent,
        ProgressComponent,
        ToastsContainer,
        ActionButtonsRendererComponent,
        OaaaqaAgGridComponent,
        DropdownFilterComponent,
        PageTitleComponent,
        ModalConfirmComponent,
        SuccessModalComponent,
        WizardComponent,
        CommonAttachmentsComponent,
        RequestMainDataComponent,
        RequestUserDetailsComponent,
        FollowUpRequestComponent,
        RecommendationSectionComponent,
        TabsComponent,
        UserRegistryInAuthorityComponent,
        TrainingResultComponent,
        ExternalReviewerOperationsComponent,
        ExternalReviewerSummaryComponent,
        InterviewResultComponent,
        SelfEvaluationDocumentMainDataComponent,
        ReportComponent,
        CustomCkeditorComponent,
        PrintTableComponent
    ],
    imports: [
        NgbToastModule,
        CommonModule,
        NgbNavModule,
        NgbAccordionModule,
        NgbDropdownModule,
        SlickCarouselModule,
        CountUpModule,
        RouterModule,
        AgGridModule,
        NgbTooltipModule,
        TranslateModule,
        NoWhitespaceValidatorDirective,
        FormsModule,
        NgbPaginationModule,
        HasPermissionDirective,
        CKEditorModule
    ],
    exports: [BreadcrumbsComponent,
        ClientLogoComponent,
        ServicesComponent,
        CollectionComponent,
        CtaComponent,
        DesignedComponent,
        PlanComponent,
        FaqsComponent,
        ReviewComponent,
        CounterComponent,
        WorkProcessComponent,
        TeamComponent,
        ContactComponent,
        FooterComponent,
        ScrollspyDirective,
        LandingScrollspyDirective,
        WalletComponent,
        MarketPlaceComponent,
        FeaturesComponent,
        CategoriesComponent,
        DiscoverComponent,
        TopCreatorComponent,
        ProgressComponent,
        FindjobsComponent,
        CandidateComponent,
        BlogComponent,
        JobcategoriesComponent,
        JobFooterComponent,
        ToastsContainer,
        ActionButtonsRendererComponent,
        OaaaqaAgGridComponent,
        DropdownFilterComponent,
        PageTitleComponent,
        WizardComponent,
        SuccessModalComponent,
        CommonAttachmentsComponent,
        TranslateModule,
        RequestMainDataComponent,
        RequestUserDetailsComponent,
        FollowUpRequestComponent,
        RecommendationSectionComponent,
        TabsComponent,
        UserRegistryInAuthorityComponent,
        TrainingResultComponent,
        ExternalReviewerOperationsComponent,
        ExternalReviewerSummaryComponent,
        InterviewResultComponent,
        ModalConfirmComponent,
        SelfEvaluationDocumentMainDataComponent,
        AgGridModule,
        ReportComponent,
        CustomCkeditorComponent,
        PrintTableComponent
        
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {
    constructor() {
        defineElement(lottie.loadAnimation);
    }
}
