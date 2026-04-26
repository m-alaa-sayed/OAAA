import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbDropdownModule, NgbNavModule, NgbToastModule} from '@ng-bootstrap/ng-bootstrap';

import {FlatpickrModule} from 'angularx-flatpickr';
import {CountUpModule} from 'ngx-countup';
import {NgApexchartsModule} from 'ng-apexcharts';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {SimplebarAngularModule} from 'simplebar-angular';

// Swiper Slider
import {SlickCarouselModule} from 'ngx-slick-carousel';

import {LightboxModule} from 'ngx-lightbox';

// Load Icons
import {defineElement} from "@lordicon/element";
import lottie from 'lottie-web';

// Pages Routing
import {PagesRoutingModule} from "./pages-routing.module";
import {SharedModule} from "../shared/shared.module";
import {WidgetModule} from '../shared/widget/widget.module';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';
import { ProfileComponentComponent } from './profile-component/profile-component.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ProfileComponentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    FlatpickrModule.forRoot(),
    CountUpModule,
    NgApexchartsModule,
    NgbNavModule,
    LeafletModule,
    NgbDropdownModule,
    SimplebarAngularModule,
    PagesRoutingModule,
    SharedModule,
    WidgetModule,
    SlickCarouselModule,
    LightboxModule,
    ScrollToModule.forRoot(),
    NgSelectModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
