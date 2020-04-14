import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EtatProjetComponent } from './etat-projet/etat-projet.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from './services/authentification.service';
import {EtatProjetService} from './services/etatProjet.service';
import {UserService} from './services/user.service';
import {NgxPaginationModule} from 'ngx-pagination';
import {AngularFontAwesomeModule} from 'angular-font-awesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSortModule, MatTableModule} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ModalModule} from 'ngx-bootstrap';
import { ReunionComponent } from './reunion/reunion.component';
import {ReunionService} from './services/reunion.service';
import {PagerService} from './services/pager.service';

import {CurrencyPipe, HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { EtatRecouvrementComponent } from './etat-recouvrement/etat-recouvrement.component';
import {EtatRecouvrementService} from './services/etatRecouvrement.service';
import {NgxSpinnerModule} from 'ngx-spinner';
import { EtatStockComponent } from './etat-stock/etat-stock.component';
import {EtatStockService} from './services/etatStock.service';
import {NgSelectModule} from '@ng-select/ng-select';
import { DashboardComponent } from './dashboard/dashboard.component';
import {EventService} from "./services/event.service";
import { ContratComponent } from './contrat/contrat.component';
import {ContratService} from "./services/contrat.service";
import { ViewEcheanceComponent } from './view-echeance/view-echeance.component';
import { ViewCommandesFournisseurComponent } from './view-commandes-fournisseur/view-commandes-fournisseur.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { ViewFacturesComponent } from './view-factures/view-factures.component';
import { ViewPiecesComponent } from './view-pieces/view-pieces.component';
import { EtatStockProjetComponent } from './etat-stock-projet/etat-stock-projet.component';
registerLocaleData(localeFr, 'fr');


@NgModule({
  declarations: [
    AppComponent,
    EtatProjetComponent,
    AuthentificationComponent,
    ReunionComponent,
    EtatRecouvrementComponent,
    EtatStockComponent,
    EtatStockProjetComponent,
    DashboardComponent,
    ContratComponent,
    ViewEcheanceComponent,
    ViewCommandesFournisseurComponent,
    NavigationBarComponent,
    ViewFacturesComponent,
    ViewPiecesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    AngularFontAwesomeModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    NgbModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelectModule

  ],
  providers: [ContratService,EventService,CurrencyPipe,AuthenticationService,EtatProjetService,EtatRecouvrementService,EtatStockService,UserService,ReunionService,PagerService,{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],

})
export class AppModule {



}
