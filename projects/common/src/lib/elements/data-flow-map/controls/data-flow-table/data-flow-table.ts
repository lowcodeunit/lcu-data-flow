import { Component, OnInit } from '@angular/core';
import { jsPlumbToolkit, Surface } from 'jsplumbtoolkit';
import { JSONSchema } from '@lcu/common';

@Component({
  selector: 'lcu-data-flow-table',
  templateUrl: './data-flow-table.html'
})
export class DataFlowTableComponent implements OnInit {
  // 	Fields
  protected surface: Surface;

  protected toolkit: jsPlumbToolkit;

  // 	Properties
  public obj: any;

  // 	Constructors
  constructor() {}

  // 	Runtime
  public ngOnInit() {}

  // 	API Methods
  public GetPadding(prop: JSONSchema) {
    const padding = [];

    for (let i = 0; i < prop.multipleOf; i++) {
      padding.push(i);
    }

    return padding;
  }

  public IsNodeError() {
    if (!this.toolkit.getNode(this.obj.id)) {
      return false;
    }

    const edges = this.toolkit
      .getNode(this.obj.id)
      .getPorts()
      .filter((port) => {
        return (
          this.toolkit.getAllEdgesFor(port).filter((edge) => {
            return edge.target.id === port.id;
          }).length > 0
        );
      });
    return (
      this.obj.GroupError ||
      this.obj.JoinFunctionError ||
      this.obj.FilterFunctionError ||
      this.obj.JoinFunctionNeeded ||
      (this.obj.SchemaType === 'outgoing' && edges.length === 0) ||
      (this.obj.SchemaType === 'incomming' && !this.obj.IncommingModuleID) ||
        (this.obj.SchemaType === 'outgoing' &&
          this.obj.OutgoingModuleIDs.length === 0) ||
        this.obj.TimestampError
    );
  }

  public NodeError() {
    if (!this.toolkit.getNode(this.obj.id)) {
      return false;
    }

    const edges = this.toolkit
      .getNode(this.obj.id)
      .getPorts()
      .filter((port) => {
        return (
          this.toolkit.getAllEdgesFor(port).filter((edge) => {
            return edge.target.id === port.id;
          }).length > 0
        );
      });

    if (this.obj.JoinFunctionNeeded) {
      return 'Schema relationships improperly configured or not present';
    } else if (this.obj.JoinFunctionError) {
      return 'Schema relationship functions have errors';
    } else if (this.obj.SchemaType === 'outgoing' && edges.length === 0) {
      return 'No incomming mappings for this schema';
    } else if (
      this.obj.SchemaType === 'incomming' &&
      !this.obj.IncommingModuleID
    ) {
      return 'No incomming module selected';
    } else if (
      this.obj.SchemaType === 'outgoing' &&
      this.obj.OutgoingModuleIDs.length === 0
    ) {
      return 'No outgoing module selected';
    } else if (this.obj.FilterFunctionError) {
      return 'Filter functions have errors';
    } else if (this.obj.GroupError) {
      return 'Group/Aggregation error.  When using groups and/or aggregations every field must either be a result of an aggregate function OR in that schemas group, but NOT both';
    } else if (this.obj.TimestampError) {
      return 'Timestamp filed required';
    }
  }

  public PivotProperties() {
    if (this.obj && this.obj.Schema) {
      return this.recurseProperties(this.obj.Schema, 0);
    }
  }

  public PrepareSchemaTypeText() {
    return (
      this.obj.SchemaType.charAt(0).toUpperCase() + this.obj.SchemaType.slice(1)
    );
  }

  public ShowMappingError(id: string) {
    if (
      this.obj.id &&
      this.toolkit.getNode(this.obj.id) &&
      id &&
      this.toolkit.getNode(this.obj.id).getPort(id) &&
      this.toolkit.getNode(this.obj.id).getPort(id).data
    ) {
      return this.toolkit.getNode(this.obj.id).getPort(id).data
        .MappingFunctionNeeded;
    }
    return false;
  }

  public ShowMappingFunctionError(id: string) {
    if (
      this.obj.id &&
      this.toolkit.getNode(this.obj.id) &&
      id &&
      this.toolkit.getNode(this.obj.id).getPort(id) &&
      this.toolkit.getNode(this.obj.id).getPort(id).data
    ) {
      return this.toolkit.getNode(this.obj.id).getPort(id).data
        .MappingFunctionError;
    }
    return false;
  }

  // 	Helpers
  protected recurseProperties(schema: JSONSchema, level: number) {
    const returnList: JSONSchema[] = [];

    if (!schema.properties) {
      return returnList;
    }

    const keys = Object.keys(schema.properties);

    keys.forEach(key => {
      schema.properties[key].multipleOf = level;

      returnList.push(schema.properties[key]);

      if (schema.properties[key].type === 'object') {
        const list = this.recurseProperties(
          schema.properties[key].oneOf[0],
          level + 1
        );
        list.forEach(item => {
          returnList.push(item);
        });
      }
    });

    return returnList;
  }
}
