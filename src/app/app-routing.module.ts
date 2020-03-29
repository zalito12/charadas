import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateComponent } from "./create/create.component";
import { PlayComponent } from "./play/play.component";
import { redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { JoinComponent } from './join/join.component';
import { FirebaseAuthv5Guard } from './services/firebase-auth-v5.guard';
import { ImportComponent } from './import/import.component';

const redirectLoggedInToPlay = () => redirectLoggedInTo(['play']);
const redirectUnauthorizedToNew = () => redirectUnauthorizedTo(['new']);

const routes: Routes = [
  {
    path: "new",
    component: CreateComponent,
    canActivate: [FirebaseAuthv5Guard],
    data: { authGuardPipe: redirectLoggedInToPlay }
  },
  {
    path: "join/:hash",
    component: JoinComponent,
    canActivate: [FirebaseAuthv5Guard],
    data: { authGuardPipe: redirectLoggedInToPlay }
  },
  {
    path: "play",
    component: PlayComponent,
    canActivate: [FirebaseAuthv5Guard],
    data: { authGuardPipe: redirectUnauthorizedToNew }
  },
  { path: "**", redirectTo: "/new" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
