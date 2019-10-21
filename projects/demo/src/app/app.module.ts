import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { FathymSharedModule, MaterialModule, LCUServiceSettings } from '@lcu/common';
import { RouterModule } from '@angular/router';
import { LcuDataFlowModule } from '@napkin-ide/lcu-data-flow-common';
import 'zone.js';
import { LazyElementModule } from '@lowcodeunit/lazy-element';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FlexLayoutModule,
    FathymSharedModule.forRoot(),
    MaterialModule,
    // LcuDataFlowModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    LazyElementModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LCUServiceSettings,
      useValue: FathymSharedModule.DefaultServiceSettings(environment)
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    // LcuDataFlowModule
  ],
  entryComponents: []
})
export class AppModule {}
