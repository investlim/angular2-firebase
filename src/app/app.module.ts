import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'ng2-materialize';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './authorization/login/login.component';
import { TourListingComponent } from './user-components/tour-listing/tour-listing.component';
import { TourComponent } from './user-components/tour/tour.component';
import { SharedModule } from './shared/shared.module';
import { AuthServiceService } from './shared/services/auth-service.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { Constants } from './shared/core/constants';
import { RegistrationComponent } from './authorization/registration/registration.component';
import { AdminPanelModule } from './admin-panel/admin-panel.module';
import { MainComponentComponent } from './user-components/main-component/main-component.component';
import { ToursService } from './shared/services/tours.service';
import { CanActiveService } from './shared/services/can-active.service';
import { ProcessHandlerService } from './shared/services/process-handler.service';
import { TourItemComponent } from './user-components/tour-listing/tour-item/tour-item.component';
import { ToursFiltersAndSortingComponent } from './user-components/tour-listing/tours-filters-and-sorting/tours-filters-and-sorting.component'
import * as firebase from 'firebase';
import { OrderModalComponent } from './user-components/tour/order-modal/order-modal.component';
import { FooterComponent } from './user-components/main-component/footer/footer.component';
import {OrderModalSharedDataService} from "./user-components/tour/order-modal/order-modal-shared-data.service";
import {HelpersService} from "./shared/services/helpers.service";

firebase.initializeApp(Constants.fireBaseConfig);


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TourListingComponent,
    TourComponent,
    RegistrationComponent,
    MainComponentComponent,
    TourItemComponent,
    ToursFiltersAndSortingComponent,
    OrderModalComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AdminPanelModule,
    AppRoutingModule,
    MaterializeModule.forRoot(),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(Constants.fireBaseConfig),
  ],
  providers: [
    AuthServiceService,
    ToursService,
    CanActiveService,
    ProcessHandlerService,
    OrderModalSharedDataService,
    HelpersService
  ],
  entryComponents: [
    OrderModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
