import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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

  range = { start: null, end: null };
  dateRangeList: Array<string> = ["Yesterday","Last 7 days","Last 30 days","Last 90 days","Year to date","Custom range"];
  selectedRangeOption: string = 'Last 30 days';
  selectedRange:string ='';

  baseUnit : BaseUnit = 'weeks';
  labelFormat:string ='{0:MMM dd}';
  totalLocations: number;

  startDate:Date;
  endDate:string;
  today:Date;
  formattedStart:string;
  formattedEnd :string;
  lastSelectedItem:string='';

  firstname = 'Jonathan';
  minDate : Date;
  maxDate : Date;

  valueChangedLocation : boolean = true;
  valueChangedAssesments : boolean = true;
  isLocationDropdownOpen : boolean  = false;
  isAssesmentsDropdownOpen : boolean  = false;
  locationWidth : number;
  tagWidth : any;
  dropdownWidth : any;
  totalWidth : any;
  maxDisplayCount : number;
  storedRange = {start:null,end:null};

  form = this.fb.group({
    location: [''],
    assessment: [''],
    dates: [''],
  });

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

  engagedUsersdata: any = [
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
      value: 50,
      Date: new Date(2023, 10, 10),
    },
    {
      value: 20,
      Date: new Date(2023, 10, 25),
    },
    {
      value: 12,
      Date: new Date(2023, 10, 28),
    },
    {
      value: 80,
      Date: new Date(2023, 11, 3),
    },
    {
      value: 46,
      Date: new Date(2023, 11, 15),
    },
  ];

  completesData: any = [
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
    {
      value: 55,
      Date: new Date(2023, 10, 3),
    },
    {
      value: 23,
      Date: new Date(2023, 10, 26),
    },
    {
      value: 2,
      Date: new Date(2023, 10, 18),
    },
    {
      value: 0,
      Date: new Date(2023, 11, 15),
    },
    {
      value: 17,
      Date: new Date(2023, 11, 31),
    },
  ];

  sqlsData: any = [
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
    {
      value: 22,
      Date: new Date(2023, 10, 17),
    },
    {
      value: 6,
      Date: new Date(2023, 10, 22),
    },
    {
      value: 19,
      Date: new Date(2023, 10, 25),
    },
    {
      value: 15,
      Date: new Date(2023, 11, 16),
    },
    {
      value: 6,
      Date: new Date(2023, 11, 19),
    },
  ];

  mqlsData: any = [
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
    {
      value: 30,
      Date: new Date(2023, 10, 17),
    },
    {
      value: 15,
      Date: new Date(2023, 10, 20),
    },
    {
      value: 50,
      Date: new Date(2023, 10, 22),
    },
    {
      value: 12,
      Date: new Date(2023, 11, 10),
    },
    {
      value: 23,
      Date: new Date(2023, 11, 15),
    },
  ];

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 100);
    this.getDefaultDateRange();
  }

  getDefaultDateRange(){
    this.today = new Date();
    this.endDate = this.today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const startRange = new Date(this.today);
    startRange.setDate(this.today.getDate() - 30);  
    this.startDate = startRange;
    const formattedStart = startRange.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    this.selectedRange = `${formattedStart} - ${this.endDate}`;
    this.minDate = this.startDate;
    this.maxDate = new Date(this.endDate);
  }

  isLocationTree : boolean = false;
  isAssessmentTree : boolean = false;

  tagMapper(tags:any[]){
    const locationTagWidth = 90.25;
    const assessmentTagWidth = 105.56;
    const totalLocations = this.dataLocations[0].items.length;
    const totalAssessments = this.dataAssesments[0].items.length;
    const elementWidth = document.querySelector('.k-input-values')?.getBoundingClientRect();
    this.dropdownWidth = elementWidth?.width;
    const tag = document.querySelector('.k-chip')?.getBoundingClientRect();
    this.tagWidth = tag?.width;
    this.totalWidth = tag?.width * tags.length ;    

    if(this.isLocationTree){
      if(((this.dropdownWidth - this.totalWidth) - (tags.length * 14)) < this.tagWidth && tags.length < totalLocations){
        const displayedTags = tags.slice(0,this.maxDisplayCount);
        const additionalCount = tags.length - this.maxDisplayCount;
        const countString = `+${additionalCount}`;
        return additionalCount > 0 ? [...displayedTags,countString] : [...displayedTags];
      }
      else if(tags.length > totalLocations){
        this.maxDisplayCount = Math.floor((this.dropdownWidth / (this.tagWidth ? this.tagWidth : locationTagWidth)) - 1);
        this.maxDisplayCount = this.maxDisplayCount >=3 ? 2 : this.maxDisplayCount;
        const allLocations = `All locations`;
        return [allLocations];
      }
      else{
        this.maxDisplayCount = tags.length;
        return tags;
      }
    }
    else if(this.isAssessmentTree){
      if(((this.dropdownWidth - this.totalWidth) - (tags.length * 14)) < this.tagWidth && tags.length < totalAssessments){
        const displayedTags = tags.slice(0,this.maxDisplayCount);
        const additionalCount = tags.length - this.maxDisplayCount;
        const countString = `+${additionalCount}`;
        return additionalCount > 0 ? [...displayedTags,countString] : [...displayedTags];
      }
      else if(tags.length > totalAssessments){
        this.maxDisplayCount = Math.floor((this.dropdownWidth / (this.tagWidth ? this.tagWidth : assessmentTagWidth)) - 1);
        this.maxDisplayCount = this.maxDisplayCount >=3 ? 2 : this.maxDisplayCount;
        const allAssessments = `All assessments`;
        return [allAssessments];
      }
      else{
        this.maxDisplayCount = tags.length;
        return tags;
      }
    }
    else{
      return tags;
    }
  }

  public onLegendItemHover(e: any): void {
    e.sender.showTooltip((point) => point.index === e.pointIndex);
  }

  onDateRangeChange(e: any) {
    this.range = e;
    const startRange = new Date(this.range.start);
    const endRange = new Date(this.range.end);
    this.startDate = startRange;
    this.formattedStart = startRange.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    this.formattedEnd = endRange.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  onDateRangeSave(){
    this.selectedRange = `${this.formattedStart} - ${this.formattedEnd}`;
    this.selectedRangeOption = '';
    this.storedRange = this.range;
    this.range = { start: null, end: null };
  }

  getDateRange(day:number,yearsToDate?:string){
    if(yearsToDate){
      const startOfYear = new Date(this.today.getFullYear(), 0, 1);
      const yearStartDate = startOfYear.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      this.startDate = startOfYear;
      this.selectedRange = `${yearStartDate} - ${this.endDate}`;
    }
    else{
      const startRange = new Date(this.today);
      startRange.setDate(this.today.getDate()-day);  
      const formattedStart = startRange.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      this.startDate = startRange;
      this.selectedRange = `${formattedStart} - ${this.endDate}`;
    }
  }

  onDropdownChange(value: any): void {
    this.lastSelectedItem = this.selectedRangeOption;
    this.selectedRangeOption = value;
    switch(value){
      case 'Yesterday':
        this.getDateRange(1);
        break;
      case 'Last 7 days':
        this.getDateRange(7);
        break;
      case 'Last 30 days':
        this.getDateRange(30);
        break;
      case 'Last 90 days':
        this.getDateRange(90);
        break;
      case 'Year to date':
        this.getDateRange(1,'Years to date');
        break;
      default:
        break;
    }
  }

  onSubmit(){
    this.minDate = new Date(this.startDate);
    this.maxDate = new Date(this.selectedRange.split('-')[1]);

    let count = 0;
    this.engagedUsersdata.map((data) => { 
      if(data.Date >=  this.minDate && data.Date <= this.maxDate) {
        console.log("data.date", data.date);
        count += data.value;
      }
    });
    this.cardData[0].count = count;

    switch (this.selectedRangeOption){
      case 'Yesterday':
        this.baseUnit = 'days';
        this.labelFormat ='{0:MMM dd}';
        break;
      case 'Last 7 days':
        this.baseUnit = 'days';
        this.labelFormat ='{0:MMM dd}';
        break;
      case 'Last 30 days':
        this.baseUnit = 'weeks';
        this.labelFormat ='{0:MMM dd}';
        break;
      case 'Last 90 days':
        this.baseUnit = 'months';
        this.labelFormat ='MMM';
        break;
      case 'Year to date':
        this.baseUnit = 'months';
        this.labelFormat ='MMM';
        break;
      case '':
        const timeDifference = this.storedRange.end - this.storedRange.start;   
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24) + 1;
        const yearsDifference = this.storedRange.end.getFullYear() - this.storedRange.start.getFullYear();

        if(daysDifference <= 15 && yearsDifference == 0){
          this.baseUnit = 'days';
          this.labelFormat ='{0:MMM dd}';
        }
        else if (daysDifference > 15 && daysDifference <= 31 && yearsDifference == 0){
          this.baseUnit = 'weeks';
          this.labelFormat ='{0:MMM dd}';
        }
        else if( daysDifference > 31 && daysDifference <= 366 && yearsDifference == 0 ){
          this.baseUnit = 'months';
          this.labelFormat ='MMM';
        }
        else if(yearsDifference > 0){
          this.baseUnit = 'years';
          this.labelFormat ='yyyy';
        }
        else{
          this.baseUnit = 'weeks';
          this.labelFormat ='{0:MMM dd}';
        }
        break;
      default:
        this.baseUnit = 'weeks';
        this.labelFormat ='{0:MMM dd}';
        break;
    }
  }

  onReset(){
    this.selectedRangeOption = 'Last 30 days';
    this.getDefaultDateRange();
  }

  onCancel(){
    this.selectedRangeOption = this.lastSelectedItem;
    this.storedRange = this.range;
    this.range = { start: null, end: null };
  }

  // FOR DEFAULT STATE OF MULTISELECT TREE //
  valueChange(value : any, type : string): void {
    if(value.length > 0){
      if(type === 'location'){
        this.valueChangedLocation = false;
        this.isLocationDropdownOpen = false; 
      }
      else if(type === 'assessment'){
        this.valueChangedAssesments = false;
        this.isAssesmentsDropdownOpen  = false
      }
    }
    else{
      if(type === 'location'){
        this.valueChangedLocation = true;
        this.isLocationDropdownOpen = true; 
      }
      else if(type === 'assessment'){
        this.valueChangedAssesments = true;
        this.isAssesmentsDropdownOpen = true
      }   
    }
  }

  //  Location Dropdown Open-Close
  open(type:string){
      if(type ==='location'){
        this.isLocationDropdownOpen = true; 
        this.isLocationTree = true;
      }
      else{
        this.isAssesmentsDropdownOpen=true;
        this.isAssessmentTree = true;
      }
  }

  close(type:string){
    if(type ==='location'){
      this.isLocationDropdownOpen = false; 
      this.isLocationTree = false;
    }
    else {
      this.isAssesmentsDropdownOpen=false;
      this.isAssessmentTree = false;
    }
  }
}