import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EtatProjetComponent} from './etat-projet/etat-projet.component';
import {AuthentificationComponent} from './authentification/authentification.component';
import {ReunionComponent} from './reunion/reunion.component';
import {EtatRecouvrementComponent} from './etat-recouvrement/etat-recouvrement.component';
import {EtatStockComponent} from './etat-stock/etat-stock.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {EtatStockProjetComponent} from './etat-stock-projet/etat-stock-projet.component';
import { BalanceAgeeComponent } from './balance-agee/balance-agee.component';
import {ContratsComponent} from "./contrats/contrats.component";
import {EcheancesComponent} from "./echeances/echeances.component";
import {EcheancesRafComponent} from "./echeances-raf/echeances-raf.component";




const routes: Routes = [
  {path:"",component:DashboardComponent},
  {path:"notifications",component:DashboardComponent},
  {path:"etatProjet",component:EtatProjetComponent},
  {path:"etatRecouvrement",component:EtatRecouvrementComponent},
  {path:"etatRecouvrementClient/:client",component:EtatRecouvrementComponent},
  {path:"etatRecouvrementClientAge/:age/:client",component:EtatRecouvrementComponent},
  {path:"etatRecouvrementNumDocument/:numDocument",component:EtatRecouvrementComponent},
  {path:"etatRecouvrementCodeCommercial/:codeCommercial",component:EtatRecouvrementComponent},
  {path:"etatRecouvrementCodeClient/:codeClient",component:EtatRecouvrementComponent},
  {path:"etatRecouvrementChefProjet/:chefProjet",component:EtatRecouvrementComponent},
  {path:"etatRecouvrementCodeProjet/:codeProjet",component:EtatRecouvrementComponent},
  {path:"etatStock",component:EtatStockComponent},
  {path:"etatStockProjet",component:EtatStockProjetComponent},
  {path:"balanceAgee",component:BalanceAgeeComponent},
  {path:"etatStockCodeProjet/:codeProjet",component:EtatStockComponent},
  {path:"etatStockNature/:codeProjet/:nature",component:EtatStockComponent},
  {path:"login",component:AuthentificationComponent},
  {path:"consultReunions",component:ReunionComponent},
  {path:"contrats",component:ContratsComponent},
  {path:"echeances",component:EcheancesComponent},
  {path:"echeancesRAF",component:EcheancesRafComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
