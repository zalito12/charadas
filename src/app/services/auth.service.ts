import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { from, Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private authUser: firebase.User;

  constructor(private auth: AngularFireAuth) {}

  public getUser(): firebase.User {
    return this.authUser;
  }

  public setUser(authUser: firebase.User) {
    this.authUser = authUser;
  }

  public login$(): Observable<auth.UserCredential> {
    return from(this.auth.setPersistence(auth.Auth.Persistence.LOCAL)).pipe(
      switchMap(value => {
        console.log(value);
        return this.signIn();
      })
    );
  }

  public loginNow() {
    from(this.auth.setPersistence(auth.Auth.Persistence.LOCAL))
      .pipe(
        switchMap(value => {
          console.log(value);
          return this.signIn();
        })
      )
      .subscribe(
        value => {
          console.log(value);
        },
        error => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          if (errorCode === "auth/operation-not-allowed") {
            alert("You must enable Anonymous auth in the Firebase Console.");
          } else {
            console.error(error);
          }
        }
      );
  }

  public logout$() {
    return from(this.auth.signOut());
  }

  public logoutNow() {
    this.auth
      .signOut()
      .then(
        value => {
          console.log(value);
        },
        reason => {
          console.log(reason);
        }
      )
      .catch(function(error) {
        // Handle Errors here.
        console.error(error);
      });
  }

  private signIn(): Observable<auth.UserCredential> {
    return from(this.auth.signInAnonymously()).pipe(
      map(loggedUser => {
        this.authUser = loggedUser.user;
        return loggedUser;
      })
    );
  }
}
