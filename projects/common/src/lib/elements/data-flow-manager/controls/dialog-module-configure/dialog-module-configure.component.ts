import { ConnectionStringModel } from './../../../../models/connection-string.model';
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DataFlowModule,
  DataFlowModulePack,
  LCUElementContext
} from '@lcu/common';
import { LazyElementConfig } from '@lowcodeunit/lazy-element';

export class DialogModuleConfigureSettings {
  public Pack: DataFlowModulePack;

  public Module: DataFlowModule;
}

@Component({
  selector: 'lcu-dialog-module-configure',
  templateUrl: './dialog-module-configure.component.html',
  styleUrls: ['./dialog-module-configure.component.scss']
})
export class DialogModuleConfigureComponent implements OnInit {
  //  Helpers

  //  Properties
  public Connections: Array<object>;

  public Config: LazyElementConfig;

  public Context: LCUElementContext<any>;

  public Module: DataFlowModule;

  public ShowConnections: boolean;

  //  Constructors
  constructor(
    protected dialogRef: MatDialogRef<DialogModuleConfigureComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: DialogModuleConfigureSettings
  ) {
    this.ShowConnections = false;
  }

  //  Life Cycle
  public ngOnInit() {

    this.Module = { ...this.data.Module };

    this.Config = {
      Assets: [this.Module.Display.Toolkit],
      ElementName: this.Module.Display.Element
    };

    const settings = this.Module.Settings || {};

    const status: any = this.Module.Status || {};

    const quickView: any = status.QuickView || {};

    const state = {...settings, Chart: quickView.Chart };

    this.Context = { State: state };

    setTimeout(() => {
      this.displayConnections();
    }, 1000);
  }

  //  API Methods
  public Cancel(): void {
    this.dialogRef.close({ ...this.data.Module });
  }

  public Save(): void {
    this.dialogRef.close({ ...this.Module });
  }

  // Helpers

  /**
   * Copy connection string to clipboard
   *
   * @param idx index of selected connection string
   */
  public CopyToClipboard(idx: number): void {
    const selBox = document.createElement('textarea');
    // selBox.style.position = 'fixed';
    // selBox.style.left = '0';
    // selBox.style.top = '0';
    // selBox.style.opacity = '0';
    const selected = this.Connections[idx] as ConnectionStringModel;
    selBox.value = selected.Value;

    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  /**
   * Show connection strings
   */
  protected displayConnections(): void {
    this.Connections = [];

    Object.entries(this.Context.State.Infrastructure.Connections).forEach((itm: Array<any>) => {
      this.Connections.push(new ConnectionStringModel(itm[0], itm[1]));
    });

    this.ShowConnections = true;
  }
}
