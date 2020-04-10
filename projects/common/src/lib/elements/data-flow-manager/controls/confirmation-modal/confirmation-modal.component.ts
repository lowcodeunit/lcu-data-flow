import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class ConfirmationModalData {
  Content: string;
  ObjData: any;
  Title: string;
  Button: {
    Color: string;
    Text: string;
  };
}

@Component({
  selector: 'lcu-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {

  constructor(
    private dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public Data: ConfirmationModalData
  ) { }

  public OnNoClick(): void {
    this.dialogRef.close();
  }
}
