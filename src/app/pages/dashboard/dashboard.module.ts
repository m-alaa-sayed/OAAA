import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { StackedBarChartComponent } from './components/stacked-bar-chart/stacked-bar-chart.component';
import { GroupedBarChartComponent } from './components/grouped-bar-chart/grouped-bar-chart.component';
import { HeatmapChartComponent } from './components/heatmap-chart/heatmap-chart.component';
import { CHEQAChartsComponent } from './cheqa-charts/cheqa-charts.component';
import { OQFChartsComponent } from './oqf-charts/oqf-charts.component';
import { OqfDashboardHelperService } from './helpers/oqf-dashboard-helper.service';
import { OqfCountsRatiosCardComponent } from './oqf-charts/cards/oqf-counts-ratios-card.component';
import { OqfStatusDistributionCardComponent } from './oqf-charts/cards/oqf-status-distribution-card.component';
import { OqfYearComparisonCardComponent } from './oqf-charts/cards/oqf-year-comparison-card.component';
import { OqfSpecializationCardComponent } from './oqf-charts/cards/oqf-specialization-card.component';
import { OqfCountryDistributionCardComponent } from './oqf-charts/cards/oqf-country-distribution-card.component';
import { OqfEmployerDistributionCardComponent } from './oqf-charts/cards/oqf-employer-distribution-card.component';
import { OqfActivitiesCardComponent } from './oqf-charts/cards/oqf-activities-card.component';
import { OqfJoinRequestsCardComponent } from './oqf-charts/cards/oqf-join-requests-card.component';
import { CheqaDashboardHelperService } from './helpers/cheqa-dashboard-helper.service';
import { CheqaCountsRatiosCardComponent } from './cheqa-charts/cards/cheqa-counts-ratios-card.component';
import { CheqaStatusDistributionCardComponent } from './cheqa-charts/cards/cheqa-status-distribution-card.component';
import { CheqaYearComparisonCardComponent } from './cheqa-charts/cards/cheqa-year-comparison-card.component';
import { CheqaSpecializationCardComponent } from './cheqa-charts/cards/cheqa-specialization-card.component';
import { CheqaCountryDistributionCardComponent } from './cheqa-charts/cards/cheqa-country-distribution-card.component';
import { CheqaActivitiesCardComponent } from './cheqa-charts/cards/cheqa-activities-card.component';
import { CheqaJoinRequestsCardComponent } from './cheqa-charts/cards/cheqa-join-requests-card.component';
import { CheqaWithdrawalRequestsCardComponent } from './cheqa-charts/cards/cheqa-withdrawal-requests-card.component';
import { HasPermissionDirective } from "src/app/core/directives/has-permission.directive";
import { CseqaCountsRatiosCardComponent } from './cseqa-charts/cards/cseqa-counts-ratios-card.component';
import { CseqaStatusDistributionCardComponent } from './cseqa-charts/cards/cseqa-status-distribution-card.component';
import { CseqaYearComparisonCardComponent } from './cseqa-charts/cards/cseqa-year-comparison-card.component';
import { CseqaSpecializationCardComponent } from './cseqa-charts/cards/cseqa-specialization-card.component';
import { CseqaCountryDistributionCardComponent } from './cseqa-charts/cards/cseqa-country-distribution-card.component';
import { CseqaActivitiesCardComponent } from './cseqa-charts/cards/cseqa-activities-card.component';
import { CseqaJoinRequestsCardComponent } from './cseqa-charts/cards/cseqa-join-requests-card.component';
import { CseqaWithdrawalRequestsCardComponent } from './cseqa-charts/cards/cseqa-withdrawal-requests-card.component';
import { CSEQAChartsComponent } from './cseqa-charts/cseqa-charts.component';
import { CseqaHeatmapCardComponent } from './cseqa-charts/cards/cseqa-heatmap-card.component';
import { CseqaNationalityDistributionCardComponent } from './cseqa-charts/cards/cseqa-nationality-distribution-card.component';
import { CseqaEvaluationByQACardComponent } from './cseqa-charts/cards/cseqa-evaluation-by-qa-card.component';
import { CseqaEvaluationByTeamLeaderCardComponent } from './cseqa-charts/cards/cseqa-evaluation-by-team-leader-card.component';


@NgModule({
  declarations: [
    DashboardComponent,
    BarChartComponent,
    DonutChartComponent,
    StackedBarChartComponent,
    GroupedBarChartComponent,
    HeatmapChartComponent,
    CHEQAChartsComponent,
    CheqaCountsRatiosCardComponent,
    CheqaStatusDistributionCardComponent,
    CheqaYearComparisonCardComponent,
    CheqaSpecializationCardComponent,
    CheqaCountryDistributionCardComponent,
    CheqaActivitiesCardComponent,
    CheqaJoinRequestsCardComponent,
    CheqaWithdrawalRequestsCardComponent,
    OQFChartsComponent,
    OqfCountsRatiosCardComponent,
    OqfStatusDistributionCardComponent,
    OqfYearComparisonCardComponent,
    OqfSpecializationCardComponent,
    OqfCountryDistributionCardComponent,
    OqfEmployerDistributionCardComponent,
    OqfActivitiesCardComponent,
    OqfJoinRequestsCardComponent,
    CSEQAChartsComponent,
    CseqaCountsRatiosCardComponent,
    CseqaStatusDistributionCardComponent,
    CseqaYearComparisonCardComponent,
    CseqaSpecializationCardComponent,
    CseqaCountryDistributionCardComponent,
    CseqaActivitiesCardComponent,
    CseqaJoinRequestsCardComponent,
    CseqaWithdrawalRequestsCardComponent,
    CseqaHeatmapCardComponent,
    CseqaNationalityDistributionCardComponent,
    CseqaEvaluationByQACardComponent,
    CseqaEvaluationByTeamLeaderCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DashboardRoutingModule,
    NgApexchartsModule,
    HasPermissionDirective
  ],
  providers: [OqfDashboardHelperService, CheqaDashboardHelperService]
})
export class DashboardModule { }
