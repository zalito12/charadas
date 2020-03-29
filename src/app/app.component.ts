import { Component, OnInit, NgZone, Inject } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { PlayService } from "./services/play.service";
import { Observable } from "rxjs";
import { GameDto } from "./common/game-dto";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { UserDto } from './common/user-dto';
import { ShareDialog } from './share/share-dialog.component';

export interface DialogData {
  gameId: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  public user: firebase.User;
  public user$: Observable<UserDto>;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthService,
    private playService: PlayService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.auth.onAuthStateChanged(user => {
      this.user = user;
      if (user) {
        // User signed in.
        console.log("Logged in!");
        this.authService.setUser(user);
        this.ngZone.run(() => this.router.navigateByUrl("/play"));
      } else {
        // User not signed in.
        console.log("Logged out!");
      }
    });

    this.user$ = this.playService.getUser$();
  }

  public logout() {
    this.authService
      .logout$()
      .subscribe(_ => this.ngZone.run(() => this.router.navigateByUrl("/")));
  }

  public share(gameId: string) {
    const dialogRef = this.dialog.open(ShareDialog, {
      data: { gameId: gameId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
