import {Component, inject, OnInit} from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Result} from '../storage/crud';

@Component({
  standalone: true,
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  imports: [HighchartsChartModule]
})
export class StatisticsComponent implements OnInit   {
  readonly dialogRef = inject(MatDialogRef<StatisticsComponent>);
  readonly data = inject<Result[]>(MAT_DIALOG_DATA);
  public Highcharts: typeof Highcharts = Highcharts as any;

  chartOptions: Highcharts.Options = {
    accessibility: {
      enabled: false,
    },
    title: {
      text: 'Statistics'
    },
    series: [
      {
        type: 'line',
        data: [1, 2, 3, 4, 5],
      },
    ],
  };

  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
    this.chartOptions.series = [
      {
        type: 'line',
        name: 'Right',
        data: this.data.map((v) => v.right),
      },
      {
        type: 'line',
        name: 'Wrong',
        data: this.data.map((v) => v.wrong),
      }
    ]

  }

}
