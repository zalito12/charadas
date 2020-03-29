import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { DataService } from "../services/data.service";
import { switchMap, map } from "rxjs/operators";
import { FormGroup, FormControl, FormArray, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";

@Component({
  selector: "app-join",
  templateUrl: "./join.component.html",
  styleUrls: ["./join.component.css"]
})
export class JoinComponent implements OnInit {
  @ViewChildren("stepper") public matStepper: MatStepper[];

  public gameId: string;
  public game$: Observable<
    firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
  >;

  public editable: boolean = true;
  public formGroup: FormGroup;
  public formArray: FormArray;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private data: DataService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      gameId: new FormControl("", Validators.required),
      userName: new FormControl("", Validators.required)
    });

    this.gameId = this.route.snapshot.paramMap.get("hash");
    if (this.gameId) {
      this.game$ = this.data.getGame$(this.gameId);
      this.formGroup.get("gameId").setValue(this.gameId);
    }
  }

  public join() {
    const userName = this.formGroup.get("userName").value;
    this.auth
      .login$()
      .pipe(
        switchMap(auth => {
          // Create user with game id
          return this.data
            .createUser(auth.user.uid, userName, this.gameId)
            .pipe(
              // Add user to game
              switchMap(user => this.data.addUserToGame(user))
            );
        })
      )
      .subscribe({
        error: error => console.log(error)
      });
  }
}
