import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { FathymSharedModule, MaterialModule, LCUServiceSettings } from '@lcu/common';
import { LcuDataFlowModule } from '@napkin-ide/lcu-data-flow-common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FlexLayoutModule,
    FathymSharedModule.forRoot(),
    MaterialModule,
    LcuDataFlowModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: LCUServiceSettings,
      useValue: FathymSharedModule.DefaultServiceSettings(environment)
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    LcuDataFlowModule
  ],
  entryComponents: []
})
export class AppModule {}
