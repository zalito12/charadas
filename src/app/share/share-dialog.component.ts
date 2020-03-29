import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogData } from "../app.component";

@Component({
  selector: "share-dialog",
  templateUrl: "share-dialog.component.html"
})
export class ShareDialog {
  public url: string;

  constructor(
    private dialogRef: MatDialogRef<ShareDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.url = `${location.origin}/join/${data.gameId}`;
  }

  close(): void {
    this.dialogRef.close();
  }
}
