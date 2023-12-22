import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DashboardCard } from '../../post-login.modal';
import { BaseUnit, ChartComponent } from '@progress/kendo-angular-charts';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  @ViewChild(ChartComponent) chart: any;
  showUsersMarkers: boolean = false;
  showCompletesMarkers: boolean = false;
  showSqlsMarkers: boolean = false;
  showMqlsMarkers: boolean = false;

  isLoading: boolean = true;

  form = this.fb.group({
    location: [''],
    assessment: [''],
    dates: [''],
  });

  firstname = 'Jonathan';
  minDate = new Date(2022, 11, 1);
  maxDate = new Date(2023, 5, 1);

  dataLocations: any[] = [
    {
      text: 'Select all',
      items: [
        { text: 'Location 1' },
        { text: 'Location 2' },
        { text: 'Location 3' },
        { text: 'Location 4' },
        { text: 'Location 5' },
        { text: 'Location 6' },
      ],
    },
  ];
  views = 2;
  dataAssesments: any[] = [
    {
      text: 'Select all',
      items: [
        { text: 'Community 1' },
        {
          text: 'Community 2',
        },
        { text: 'Community 3' },
        { text: 'Community 4' },
        { text: 'Community 5' },
        { text: 'Community 6' },
      ],
    },
  ];

  cardData: DashboardCard[] = [
    {
      title: 'Engaged Users',
      subTitle: 'Assessment starts',
      count: 500,
      upDowns: {
        status: 'down',
        count: 184,
        percentage: 2.7,
      },
      prevDays: 30,
      rate: '60% start rate',
    },
    {
      title: 'Completes',
      subTitle: 'Assessment completions',
      count: 300,
      upDowns: {
        status: 'up',
        count: 284,
        percentage: 3.7,
      },
      prevDays: 30,
      rate: '60% start rate',
    },
    {
      title: 'SQLs',
      subTitle: 'Unique sales qualified leads ',
      count: 150,
      upDowns: {
        status: 'down',
        count: 184,
        percentage: 2.7,
      },
      prevDays: 30,
      rate: '50% start rate',
    },
    {
      title: 'MQLs',
      subTitle: 'Marketing qualified leads',
      count: 50,
      upDowns: {
        status: 'up',
        count: 284,
        percentage: 3.7,
      },
      prevDays: 30,
      rate: '60% start rate',
    },
  ];

  data: any = [
    {
      value: 10,
      Date: new Date(2022, 11, 1),
    },
    {
      value: 11,
      Date: new Date(2023, 0, 3),
    },
    {
      value: 22,
      Date: new Date(2023, 0, 23),
    },
    {
      value: 22,
      Date: new Date(2023, 2, 2),
    },
    {
      value: 31,
      Date: new Date(2023, 3, 1),
    },
    {
      value: 32,
      Date: new Date(2023, 3, 27),
    },
    {
      value: 43,
      Date: new Date(2023, 5, 1),
    },
    {
      value: 4,
      Date: new Date(2025, 5, 1),
    },
  ];

  data2: any = [
    {
      value: 29,
      Date: new Date(2022, 11, 1),
    },
    {
      value: 48,
      Date: new Date(2023, 0, 2),
    },
    {
      value: 44,
      Date: new Date(2023, 1, 2),
    },
    {
      value: 58,
      Date: new Date(2023, 2, 13),
    },
    {
      value: 51,
      Date: new Date(2023, 3, 15),
    },
    {
      value: 52,
      Date: new Date(2023, 4, 9),
    },
    {
      value: 59,
      Date: new Date(2023, 5, 1),
    },
  ];

  data3: any = [
    {
      value: 42,
      Date: new Date(2022, 11, 1),
    },
    {
      value: 48,
      Date: new Date(2023, 0, 2),
    },
    {
      value: 46,
      Date: new Date(2023, 1, 2),
    },
    {
      value: 73,
      Date: new Date(2023, 1, 16),
    },
    {
      value: 67,
      Date: new Date(2023, 2, 20),
    },
    {
      value: 65,
      Date: new Date(2023, 3, 18),
    },
    {
      value: 69,
      Date: new Date(2023, 5, 1),
    },
  ];

  data4: any = [
    {
      value: 55,
      Date: new Date(2022, 11, 1),
    },
    {
      value: 78,
      Date: new Date(2023, 0, 2),
    },
    {
      value: 73,
      Date: new Date(2023, 1, 2),
    },
    {
      value: 82,
      Date: new Date(2023, 2, 16),
    },
    {
      value: 80,
      Date: new Date(2023, 3, 17),
    },
    {
      value: 87,
      Date: new Date(2023, 4, 7),
    },
    {
      value: 80,
      Date: new Date(2023, 5, 1),
    },
  ];

  public baseUnit: BaseUnit = 'months';
  public labelFormat: string = 'MMM';
  totalLocations: number;

  tagMapper(tags: any[]): any[] {
    this.totalLocations = this.dataLocations[0].items.length;
    const maxDisplayCount = 2;
    if (tags.length <= maxDisplayCount) {
      return tags;
    } else if (tags.length > this.totalLocations) {
      const allLocations = `All locations`;
      return [allLocations];
    } else {
      const displayedTags = tags.slice(0, maxDisplayCount);
      const additionalCount = tags.length - maxDisplayCount;

      const countString = `+${additionalCount}`;
      return [...displayedTags, countString];
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 4000);
  }

  onUpdateChart() {
    this.minDate = new Date(2022, 11, 1);
    this.maxDate = new Date(2023, 12, 10);
    this.cdr.detectChanges();
    (this.chart as any).refresh();
  }

  public onLegendItemHover(e: any): void {
    console.log('e', e);
    e.sender.showTooltip((point) => point.index === e.pointIndex);
  }
}
