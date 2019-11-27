import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataFlowModule, DataFlowModulePack } from "@lcu/common";
import { LazyElementConfig } from "@lowcodeunit/lazy-element";

export class DialogModuleConfigureSettings {
  public Pack: DataFlowModulePack;

  public Module: DataFlowModule;
}

@Component({
  selector: "lcu-dialog-module-configure",
  templateUrl: "./dialog-module-configure.component.html",
  styleUrls: ["./dialog-module-configure.component.scss"]
})
export class DialogModuleConfigureComponent implements OnInit {
  //  Helpers

  //  Properties
  public Config: LazyElementConfig;

  public get Module(): DataFlowModule {
    return this.data.Module;
  }

  public get Settings(): any {
    return this.data.Module.Settings;
  }

  //  Constructors
  constructor(
    protected dialogRef: MatDialogRef<DialogModuleConfigureComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogModuleConfigureSettings
  ) {}

  //  Life Cycle
  public ngOnInit() {
    this.Config = {
      Assets: [this.data.Module.Display.Toolkit],
      ElementName: this.data.Module.Display.Element
    };
  }

  //  API Methods
  public Save(): void {
    this.dialogRef.close(this.data.Module);
  }
}
