import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';

import { Subscription } from 'rxjs';
import { LCUServiceSettings, JSONSchema, DataFlowModule } from '@lcu/common';
import { LazyElementConfig } from '@lowcodeunit/lazy-element';
import {
  SchemaFunctionDefinition,
  LcuDataFlowMapElementComponent,
  LcuDataFlowMapContext,
  DataFlowInOutSchemaMap
} from '@napkin-ide/lcu-data-flow-common';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  public BackgroundImage: string;

  public LazyConfig: LazyElementConfig;

  public MapContext: LcuDataFlowMapContext;

  public Schemas: JSONSchema[];

  public SchemaFunctionDefs: SchemaFunctionDefinition[];

  public SelectedTheme: string;

  public ShowMap = true;

  @ViewChild(LcuDataFlowMapElementComponent, { static: false })
  public DataMap: LcuDataFlowMapElementComponent;

  constructor(
    protected overlayContainer: OverlayContainer,
    protected settings: LCUServiceSettings
  ) {
    this.BackgroundImage = './assets/images/bg_image.jpg';

    this.LazyConfig = {
      Assets: ['/assets/wc/lcu-data-flow.lcu.js'],
      ElementName: 'lcu-data-flow-manager-element'
    };

    this.MapContext = { State: {} };
  }

  public ngAfterViewInit() {
    this.MapContext = {
      State: {
        Schemas: this.Schemas,
        AvailableSchemaFunctions: this.SchemaFunctionDefs,
        InputModules: [
          <DataFlowModule>{
            ID: '1234567890',
            Text: 'Input Module 1'
          }
        ],
        OutputModules: [
          <DataFlowModule>{
            ID: '0987654321',
            Text: 'Output Module 1'
          },
          <DataFlowModule>{
            ID: '5647382910',
            Text: 'Output Module 2'
          },
          <DataFlowModule>{
            ID: '1234509876',
            Text: 'Output Module 3'
          }
        ],
        SchemaMap: {
          Input: { 1234567890: 'https://example.com/person.schema.json' },
          Output: {
            '0987654321': 'https://example.com/person.schema.json',
            5647382910: 'https://example.com/person.schema.json',
            1234509876: 'https://example.com/person.schema.json'
          }
        }
      }
    };
  }

  public ngOnInit(): void {
    this.Schemas = [
      {
        $id: 'https://example.com/person.schema.json',
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'Person',
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            description: "The person's first name."
          },
          lastName: {
            type: 'string',
            description: "The person's last name."
          },
          age: {
            description:
              'Age in years which must be equal to or greater than zero.',
            type: 'integer',
            minimum: 0
          }
        }
      }
    ];

    this.SchemaFunctionDefs = [
      {
        // AllowMany: true,
        Description: 'Concatenation Function',
        // EnterpriseID: '51eb2185-dd6c-47a3-bec0-19da4bd6a408',
        // EnterpriseTypeKey: '51eb2185-dd6c-47a3-bec0-19da4bd6a408|SchemaFunctionDefinition',
        FunctionType: 'Standard',
        MinProperties: 2,
        MaxProperties: 5,
        Name: 'Concat',
        // Type: 'SchemaFunctionDefinition',
        ID: 'b3e56e96-80de-431d-933f-243c2cc2c2b8',
        // Active: true,
        Lookup: 'Function_Concat',
        // Created: null,
        // Modified: null,
        AllowedIncommingTypes: ['string'],
        AllowDifferentIncommingTypes: false,
        AllowMultipleIncomming: true,
        ReturnType: 'string'
        // SQL: 'CONCAT({N},)'
      }
    ];
  }

  public SchemaMapped(map: DataFlowInOutSchemaMap) {
    this.MapContext = {
      ...this.MapContext,
      State: { ...this.MapContext.State, SchemaMap: map }
    };
  }

  public Toggle(): void {
    this.ShowMap = !this.ShowMap;
  }
}
