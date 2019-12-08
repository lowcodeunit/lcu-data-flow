import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'lcu-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.scss']
})
export class DialogBodyComponent implements OnInit {

  /**
   * Access address field
   */
  public get NameControl(): AbstractControl {
    return this.Form.get('nameControl');
  }

  /**
   * property for reactive form
   */
  public Form: FormGroup;

  protected action: string;
  protected localData: any;

  constructor(
    protected dialogRef: MatDialogRef<DialogBodyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.setupForm();
  }

  protected setupForm(): void {
    this.Form = new FormGroup({
      nameControl: new FormControl(this.data.Text, Validators.compose([Validators.required])),
    });

    this.onChanges();
  }

  /**
   * Listen for form changes
   */
  protected onChanges(): void {

    this.Form.valueChanges.subscribe((val: any) => {
      // this.updateSessionStorage(val);
    });
  }

  public Create(): void {
    this.dialogRef.close({event: 'test', data: this.NameControl.value});
  }

}
