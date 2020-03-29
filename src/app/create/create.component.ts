import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { DataService } from "../services/data.service";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.css"]
})
export class CreateComponent implements OnInit {
  public editable: boolean = true;
  public formGroup: FormGroup;
  public formArray: FormArray;

  constructor(private authService: AuthService, private data: DataService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      gameName: new FormControl("", Validators.required),
      userName: new FormControl("", Validators.required)
    });
  }

  public create() {
    this.editable = false;
    const gameName = this.formGroup.get("gameName").value;
    const userName = this.formGroup.get("userName").value;
    this.authService
      .login$()
      .pipe(
        switchMap(auth => {
          // Create game
          return this.data.createGame(gameName).pipe(
            // Create user with game id
            switchMap(docRef =>
              this.data.createUser(auth.user.uid, userName, docRef.id)
            ),
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
