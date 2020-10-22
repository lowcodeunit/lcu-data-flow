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

  public DisableCreateButton: boolean = true;

  public ResourceName: string;

  protected action: string;
  protected localData: any;

  constructor(
    protected dialogRef: MatDialogRef<DialogBodyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log("Data: ", data)
      
  }

  ngOnInit() {
    this.setupForm();
    this.setupTitle();
  }

  protected setupForm(): void {
    this.Form = new FormGroup({
      nameControl: new FormControl(this.data.Text, Validators.compose([Validators.required])),
    });

    this.onChanges();
  }

  /**
   * Builds the title of the dialog from the data type passed in
   */
  protected setupTitle(): void{
    if(this.data.Type){
      let TitleName = "";
      //loop through words capitalize first letter add rest of word 
      this.data.Type.split("-").forEach((item: string) => {
        TitleName += item.charAt(0).toLocaleUpperCase() +  item.slice(1) + " ";
      });
      this.ResourceName = TitleName.trim();
    }
    
  }

  /**
   * Listen for form changes
   */
  protected onChanges(): void {

    this.Form.valueChanges.subscribe((val: any) => {
      // this.updateSessionStorage(val);
      //Determines whether or not the Resource name title is 
      //valid and if the create button should be disabled
      if(val.nameControl === "" || !val.nameControl || val.nameControl.length < 2){
        this.DisableCreateButton = true;
      }
      else{
        this.DisableCreateButton = false;
      }
    });
  }

  public Create(): void {
    this.dialogRef.close({event: 'test', data: this.NameControl.value});
  }

  public CancelResourceCreation(): void{
    this.dialogRef.close();
  }

}
