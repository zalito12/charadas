import { Component, OnInit, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  public user: firebase.User;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthService
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
  }

  public logout() {
    this.authService
      .logout$()
      .subscribe(_ => this.ngZone.run(() => this.router.navigateByUrl("/")));
  }
}
