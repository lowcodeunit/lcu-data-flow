import { Color, Label } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

export class LCUChart {
  Results: any[];

  Colors: Color[];

  Labels: Label[];

  Options: ChartOptions & { annotation: any };
}
