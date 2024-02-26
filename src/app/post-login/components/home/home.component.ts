import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DashboardCard } from '../../post-login.modal';
import { BaseUnit, ChartComponent, LineStyle, SeriesType } from '@progress/kendo-angular-charts';
import { MultiSelectTreeComponent } from '@progress/kendo-angular-dropdowns';
import { DialogService } from '@progress/kendo-angular-dialog';
import { TourVideoPopUpComponent } from '../tour-video-pop-up/tour-video-pop-up.component';
import { PostLoginService } from '../../post-login.service';
import { Data } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public style: LineStyle = "smooth";
  chartType:SeriesType = 'scatterLine'

  constructor(private fb: FormBuilder,private dialogService: DialogService, private postLoginService : PostLoginService) {}

  @ViewChild(ChartComponent) chart: any;
  @ViewChild('locationTree') locationTree : MultiSelectTreeComponent;
  @ViewChild('assessmentTree') assessmentTree : MultiSelectTreeComponent;

  isLoading: boolean = true;
  range = { start: null, end: null };
  dateRangeList : Array<string> = [
    "Yesterday",
    "Last 7 days",
    "Last 30 days",
    "Last 90 days",
    "Year to date",
    "Custom range"
  ];
  selectedRangeOption : string = 'Last 30 days';
  selectedRange : string ='';
  baseUnit : BaseUnit = 'weeks';
  labelFormat : string ='{0:MMM dd}';

  startDate : Date;
  endDate : string;
  today : Date;
  formattedStart : string;
  formattedEnd : string;
  lastSelectedItem : string='';

  firstname = 'Jonathan';
  minDate : Date;
  maxDate : Date;

  isLocationTree : boolean = false;
  isAssessmentTree : boolean = false;
  selectedLocations = [];
  selectedAssessments = [];

  valueChangedLocation : boolean = true;
  valueChangedAssesments : boolean = true;
  isLocationDropdownOpen : boolean  = false;
  isAssesmentsDropdownOpen : boolean  = false;
  dropdownWidth : any;
  defaultRange = {start:null,end:null};
  chartDateTitle = '';
  submitBtnDisabled: boolean = false;

  form = this.fb.group({
    location: [''],
    assessment: [''],
    dates: [''],
  });

  dataLocations: any[] = [
    {
      text: 'Select all',
      items: [
        { text: 'Cedarhurst Villages Cedarhurst Cedarhurst Villages Cedarhurst Cedarhurst Villages Cedarhurst  Cedarhurst Villages Cedarhurst Cedarhurst Villages Cedarhurst'  },
        { text: 'Brightview Bridgewater' },
        { text: 'Fort Mill' },
        { text: 'Highpoint at Cape Coral' },
        { text: 'Belmont Village' },
        { text: 'rightview Meadows' },
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
      count: 0,
      upDowns: {
        status: 'up',
        count: 0,
        percentage: 0,
      },
      prevDays: '',
      rate: '60% start rate',
    },
    {
      title: 'Completes',
      subTitle: 'Assessment completions',
      count: 0,
      upDowns: {
        status: 'up',
        count: 0,
        percentage: 0,
      },
      prevDays: '',
      rate: '60% completion rate',
    },
    {
      title: 'SQLs',
      subTitle: 'Unique sales qualified leads ',
      count: 0,
      upDowns: {
        status: 'up',
        count: 0,
        percentage: 0,
      },
      prevDays: '',
      rate: '50% SQL opt-in rate',
    },
    {
      title: 'MQLs',
      subTitle: 'Marketing qualified leads',
      count: 0,
      upDowns: {
        status: 'up',
        count: 0,
        percentage: 0,
      },
      prevDays: '',
      rate: '60% MQL opt-in rate',
    },
  ];

  engagedUsersData: any = [
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
      value: 2,
      Date: new Date(2023, 10, 18),
    },
    {
      value: 23,
      Date: new Date(2023, 10, 26),
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

  oldEngagedUserCounts : number ;
  oldCompletesCounts : number;
  oldSqlCounts : number ;
  oldMqlCounts : number ;
  yearsDifference : number;
  invalidStartDate: boolean = false;
  invalidEndDate: boolean = false;
  disabledDate = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear() || date > today;
  };

  checkForInvalidDate(date){
    const today = new Date();
    if(date){
      if(date === this.range.start){
        this.invalidStartDate = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear() || date > today;
        return this.invalidStartDate;
      }
      else{
        this.invalidEndDate = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear() || date > today;
        return this.invalidEndDate;
      }
    }
    else{
      return false;
    }
    
  }
  ngOnInit() {
    let homePopupShow = localStorage.getItem('homePopupShow');
    if(homePopupShow === 'true'){
      this.dialogService.open({
        content : TourVideoPopUpComponent,
      });
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 100);
    this.getDefaultDateRange();
    this.setCardCountsValue(this.minDate,this.maxDate);
    this.chartDateTitle = `${this.selectedRangeOption}: ${this.selectedRange}`;
    this.cardData[0].upDowns.count = 0;
    this.cardData[1].upDowns.count = 0;
    this.cardData[2].upDowns.count = 0;
    this.cardData[3].upDowns.count = 0;
  }

  getDefaultDateRange(){
    this.today = new Date();
    this.today.setDate(this.today.getDate()-1);
    this.endDate = this.today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const startRange = new Date(this.today);
    startRange.setDate((this.today.getDate() - 30));
    this.startDate = startRange;
    this.minDate = this.startDate;
    this.maxDate = new Date(this.endDate);
    const formattedStart = startRange.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    this.selectedRange = `${formattedStart} - ${this.endDate}`;
    this.setCardPrevDaysText(this.minDate,this.maxDate);
    this.range.start = this.minDate;
    this.range.end = this.maxDate
  }

  tagMapper(tags: any[]) {
    let newTags = [];

    if(tags.length > this.dataLocations[0].items.length && this.isLocationTree)
      return newTags = ['All locations'];

    if(tags.length > this.dataAssesments[0].items.length && this.isAssessmentTree)
      return newTags = ['All assessments'];

    const elementWidth = document.querySelector('.k-input-md')?.getBoundingClientRect();
    const dropdownWidth = elementWidth?.width - 40; //40 is for cross button

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '12px Helvetica Neue';

    let usedWidth = 0;
    let remainingWidth = dropdownWidth;

    let remainingTags = [];
    let tagLength
    for(const tag of tags) {
      tagLength = context.measureText(tag.text).width + 33;  //33 for padding and cross button
      usedWidth += tagLength;
      if(usedWidth < dropdownWidth) {
        newTags.push(tag);
        remainingWidth = dropdownWidth - usedWidth;
      } else {
        usedWidth -= tagLength;
        remainingTags.push(tag);
      }
    }

    if(remainingTags && remainingTags.length > 0) {
      if(newTags.length && newTags.length > 0) {
        if(remainingWidth < 46) {
          const removedTag = newTags.pop();
          remainingTags.push(removedTag);
        }
        if(remainingTags.length === tags.length) {
          newTags.push(`${remainingTags.length} selected`);
        } else {
          newTags.push(`+${remainingTags.length}`);
        }
      } else {
        newTags.push(`${remainingTags.length} selected`);
      }
    }

    return newTags;
  }

  onDateRangeSelect(e: any) {
    this.range = e;
    const startRange = new Date(this.range.start);
    const endRange = new Date(this.range.end);
    this.startDate = startRange;
    this.formattedStart = startRange.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    this.formattedEnd = endRange.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  onDateRangeSave(){
    const startRange = new Date(this.range.start);
    const endRange = new Date(this.range.end);
    this.startDate = startRange;
    this.formattedStart = startRange.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    this.formattedEnd = endRange.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    this.selectedRange = `${this.formattedStart} - ${this.formattedEnd}`;
    this.selectedRangeOption = '';
    this.defaultRange = this.range;
    this.range = { start: null, end: null };
  }

  getDateRange(day:number,yearsToDate?:string){
    if(yearsToDate){
      const beginningOfYear = new Date(this.today.getFullYear(), 0, 1);
      const yearStartDate = beginningOfYear.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      this.startDate = beginningOfYear;
      this.selectedRange = `${yearStartDate} - ${this.endDate}`;
    }
    else{
      const startRange = new Date(this.today);
      startRange.setDate(this.today.getDate()-day);
      const formattedStart = startRange.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

  setCardCountsValue(minDate : Date,maxDate : Date){
    this.oldEngagedUserCounts = this.cardData[0].count;
    this.oldCompletesCounts = this.cardData[1].count;
    this.oldSqlCounts = this.cardData[2].count;
    this.oldMqlCounts = this.cardData[3].count;

    this.cardData[0].count = 0;
    this.cardData[1].count = 0;
    this.cardData[2].count = 0;
    this.cardData[3].count = 0;

    this.engagedUsersData.map((data) => {
      if(data.Date >= minDate && data.Date <= maxDate) {
        this.cardData[0].count += data.value;
      }
    });

    this.completesData.map((data) => {
      if(data.Date >= minDate && data.Date <= maxDate) {
        this.cardData[1].count += data.value;
      }
    });

    this.sqlsData.map((data) => {
      if(data.Date >= minDate && data.Date <= maxDate) {
        this.cardData[2].count += data.value;
      }
    });

    this.mqlsData.map((data) => {
      if(data.Date >= minDate && data.Date <= maxDate) {
        this.cardData[3].count += data.value;
      }
    });

    this.setChartUpDowns(this.cardData[0].count,this.oldEngagedUserCounts,0);
    this.setChartUpDowns(this.cardData[1].count,this.oldCompletesCounts,1);
    this.setChartUpDowns(this.cardData[2].count,this.oldSqlCounts,2);
    this.setChartUpDowns(this.cardData[3].count,this.oldMqlCounts,3);
  }

  setChartUpDowns(newCardCount : number, oldCardCount : number, index : number){
    const result = newCardCount - oldCardCount;
    this.cardData[index].upDowns.count = result;
    let percentValue = 0;
    if (oldCardCount != 0) {
      percentValue = ((newCardCount - oldCardCount) / oldCardCount) * 100;
    } else {
      percentValue = 0;
    }
    this.cardData[index].upDowns.percentage = Math.abs(+percentValue.toFixed(2));
    if(newCardCount > oldCardCount){
      this.cardData[index].upDowns.status = 'up';
    }
    else if(newCardCount < oldCardCount){
      this.cardData[index].upDowns.status = 'down';
    }
    else if(newCardCount == oldCardCount){
      this.cardData[index].upDowns.status = this.cardData[index].upDowns.status ;
    }
  }

  setCardPrevDaysText(minDate,maxDate){
    minDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);
    const timeDifference = maxDate.getTime() - minDate.getTime();
    const daysDifference = Math.round(timeDifference / (1000 * 3600 * 24));
    this.cardData.forEach(card=>{
      card.prevDays = daysDifference == 1 ? 'yesterday' : `previous ${daysDifference} days`;
    })
  }

  onSubmit(){
    this.minDate = new Date(this.startDate);
    this.maxDate = new Date(this.selectedRange.split('-')[1]);

    if((this.maxDate.getDate()===this.minDate.getDate())&&(this.maxDate.getMonth()===this.minDate.getMonth())&&(this.maxDate.getFullYear()===this.minDate.getFullYear())){
      this.minDate.setDate(this.minDate.getDate() - 1);
      this.maxDate.setDate(this.maxDate.getDate() + 1);
    }

    this.chartDateTitle = `${this.selectedRangeOption === '' ? 'Custom range' : this.selectedRangeOption}: ${this.selectedRange} `;
    this.setCardCountsValue(this.minDate,this.maxDate);
    this.setCardPrevDaysText(this.minDate,this.maxDate)
    this.getBaseUnits(this.selectedRangeOption,this.maxDate,this.minDate);
  }

  getBaseUnits(selectedRangeOption : string,maxDate:Date,minDate:Data){
    switch (selectedRangeOption){
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
        const startYear = minDate.getFullYear();
        const endYear = maxDate.getFullYear();
        const yearsAreDifferent = startYear !== endYear;
        if(yearsAreDifferent){
          this.baseUnit = 'months';
          this.labelFormat ='MMM yyyy';
        }
        else{
          this.baseUnit = 'months';
          this.labelFormat ='MMM';
        }
        break;
      case 'Year to date':
        this.baseUnit = 'months';
        this.labelFormat ='MMM';
        break;
      case '':
        const timeDifference = this.defaultRange.end - this.defaultRange.start;
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24) + 1;
        const yearsDifference = this.defaultRange.end.getFullYear() - this.defaultRange.start.getFullYear();

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
          if(daysDifference <= 15){
            this.baseUnit = 'days';
            this.labelFormat ='{0:MMM dd yyy}';
          }
          else if (daysDifference > 15 && daysDifference <= 31 ){
            this.baseUnit = 'weeks';
            this.labelFormat ='{0:MMM dd yyy }';
          }
          else if( daysDifference > 31 && daysDifference <= 366 ){
            this.baseUnit = 'months';
            this.labelFormat ='MMM yyyy';
          }
          else{
            this.baseUnit = 'years';
            this.labelFormat ='MMM yyyy';
          }
       
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
    this.locationTree.reset();
    this.assessmentTree.reset();
    this.valueChangedLocation = true;
    this.isLocationDropdownOpen = false;
    this.valueChangedAssesments = true;
    this.isLocationDropdownOpen = false;
    this.baseUnit = 'weeks';
    this.labelFormat = '{0:MMM dd}';
    this.chartDateTitle = `${this.selectedRangeOption}: ${this.selectedRange}`;
    this.setCardCountsValue(this.minDate,this.maxDate);
    this.cardData.forEach(card=>{
      card.upDowns.count = 0;
      card.upDowns.percentage = 0;
      card.upDowns.status = 'up'
    })
    this.setCardPrevDaysText(this.minDate,this.maxDate)
  }

  onCancel(){
    this.selectedRangeOption = this.lastSelectedItem;
    this.defaultRange = this.range;
    this.range = { start: null, end: null };
  }

  // FOR DEFAULT STATE OF MULTISELECT TREE //
  valueChange(value : any, type : string): void {
    if(value.length > 0){
      if(type === 'location'){
        this.selectedLocations = value;
        this.valueChangedLocation = false;
        this.isLocationDropdownOpen = false;
      }
      else if(type === 'assessment'){
        this.selectedAssessments = value;
        this.valueChangedAssesments = false;
        this.isAssesmentsDropdownOpen  = false;
      }
    }
    else{
      if(type === 'location'){
        this.valueChangedLocation = true;
        this.isLocationDropdownOpen = true;
      }
      else if(type === 'assessment'){
        this.valueChangedAssesments = true;
        this.isAssesmentsDropdownOpen = true;
      }
    }
  }

  //  Location Dropdown Open-Close
  dropdownOpen(type:string){
      if(type ==='location'){
        this.isLocationTree = true;
        if(this.selectedLocations.length == 0){
          this.isLocationDropdownOpen = true;
        }
        else{
          this.isLocationDropdownOpen = false;
        }
      }
      else if(type === 'assessment'){
        this.isAssessmentTree = true;
        if(this.selectedAssessments.length === 0){
          this.isAssesmentsDropdownOpen = true;
        }
        else{
          this.isAssesmentsDropdownOpen = false;
        }
      } else {
        this.submitBtnDisabled = true;
        this.selectedRangeOption ='';
      }
  }

  dropdownClose(type:string){
    if(type ==='location'){
      this.isLocationDropdownOpen = false;
      this.isLocationTree = false;
          }
    else if(type === 'assessment'){
      this.isAssesmentsDropdownOpen= false;
      this.isAssessmentTree = false;
    } else {
      this.submitBtnDisabled = false;
    }
  }

  isDateMatching(date1: Date, date2: Date): boolean {
    if((date1.getDate() === date2.getDate()) && (date1.getMonth() === date2.getMonth()) && (date1.getFullYear() === date2.getFullYear())){
      return true;
    }
   else{
    return false;
    }
  }
}
