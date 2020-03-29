import { Component, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogData } from "../app.component";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: "share-dialog",
  templateUrl: "share-dialog.component.html"
})
export class ShareDialog {
  public url: string;
  public copiedTooltip: string = null;
  @ViewChild("tooltip") public tooltip: MatTooltip;

  constructor(
    private dialogRef: MatDialogRef<ShareDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.url = `${location.origin}/join/${data.gameId}`;
  }

  close(): void {
    this.dialogRef.close();
  }

  copy(): void {
    this.copiedTooltip = "Copied!";
    setTimeout(() => {
      this.tooltip.show();
    }, 100);
    setTimeout(() => {
      this.copiedTooltip = null;
    }, 1000);
  }
}
