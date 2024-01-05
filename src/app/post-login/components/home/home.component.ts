import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DashboardCard } from '../../post-login.modal';
import { BaseUnit, ChartComponent } from '@progress/kendo-angular-charts';
import { MultiSelectTreeComponent } from '@progress/kendo-angular-dropdowns';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private fb: FormBuilder) {}

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
  storedRange = {start:null,end:null};
  chartDateTitle ='';
  cardPrevDaysText = `previous ${this.selectedRangeOption.substring(5)}`;
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
        { text: 'Cedarhurst Villages' },
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
      prevDays: this.cardPrevDaysText,
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
      prevDays: this.cardPrevDaysText,
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
      prevDays: this.cardPrevDaysText,
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
      prevDays: this.cardPrevDaysText,
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

  ngOnInit() {
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
    this.endDate = this.today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const startRange = new Date(this.today);
    startRange.setDate(this.today.getDate() - 30);
    this.startDate = startRange;
    const formattedStart = startRange.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    this.selectedRange = `${formattedStart} - ${this.endDate}`;
    this.minDate = this.startDate;
    this.maxDate = new Date(this.endDate);
  }

  tagMapper(tags:any[]){

    let newTags = [];

    if(tags.length > this.dataLocations[0].items.length && this.isLocationTree)
      return newTags = ['All locations'];

   if(tags.length > this.dataAssesments[0].items.length && this.isAssessmentTree)
      return newTags = ['All assessments'];

    let allChipsLength = 0;
    const elementWidth = document.querySelector('.k-input-md')?.getBoundingClientRect();
    const dropdownWidth = elementWidth?.width - 40; //40 is for cross button

    for(let i = 0; i < tags.length; i++) {


      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');

      context.font = '12px Helvetica Neue';
      allChipsLength += context.measureText(tags[i]?.text).width + 33;  //33 for padding and cross button

      if(dropdownWidth > allChipsLength) {
        newTags.push(tags[i]);
      }
      else {
        console.log("tags.length", tags.length);
        console.log("newTags.length", newTags.length);

        let usedWidth = 0;
        let kChipMDList: NodeList = document.querySelectorAll('.k-chip-md');
        kChipMDList.forEach((chip: HTMLElement) => {
          console.log("chip", chip)
          console.log("chip.style.width", chip.style.width)
          usedWidth += chip.offsetWidth;
          console.log("uuu", usedWidth);
        });

        const remainingWidth = dropdownWidth - usedWidth;
        console.log("remainingWidth", remainingWidth);

        if(remainingWidth < 46) {
          console.log("tags", tags);
          if(tags.length <= 2) {
            newTags = [(`${tags.length} selected`)];
            break;
          } else {
              newTags.pop();
              newTags.push(`+${tags.length - i + 1}`);
          }
        } else {
          newTags.push(`+${tags.length - i}`);
        }
        break;
      }
    }

    return newTags;
  }

  onDateRangeSelect(e: any) {
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
      const beginningOfYear = new Date(this.today.getFullYear(), 0, 1);
      const yearStartDate = beginningOfYear.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      this.startDate = beginningOfYear;
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

  onSubmit(){
    this.minDate = new Date(this.startDate);
    this.maxDate = new Date(this.selectedRange.split('-')[1]);
    this.chartDateTitle = `${this.selectedRangeOption === '' ? 'Custom range' : this.selectedRangeOption}: ${this.selectedRange} `;

    this.setCardCountsValue(this.minDate,this.maxDate);

    this.cardData.forEach(card =>{
      if(this.selectedRangeOption === ''){
        card.prevDays = this.selectedRange
      }
      else if(this.selectedRangeOption === 'Year to date'){
        card.prevDays = this.selectedRange
      }
      else if(this.selectedRangeOption === 'Yesterday'){
        card.prevDays = 'yesterday'
      }
      else{
        const startIndex = this.selectedRangeOption.indexOf(' ') + 1;
        card.prevDays = ` previous ${this.selectedRangeOption.substring(startIndex)}`;
      }
    })

    this.getBaseUnits(this.selectedRangeOption);
  }

  getBaseUnits(selectedRangeOption : string){
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
    this.locationTree.reset();
    this.assessmentTree.reset();
    this.valueChangedLocation = true;
    this.isLocationDropdownOpen = false;
    this.valueChangedAssesments = true;
    this.isLocationDropdownOpen = false;
    this.baseUnit = 'weeks';
    this.labelFormat = '{0:MMM dd}';
    this.chartDateTitle = `${this.selectedRangeOption}: ${this.selectedRange}`;
    this.cardPrevDaysText = `previous ${this.selectedRangeOption.substring(5)}`;
    this.setCardCountsValue(this.minDate,this.maxDate);
    this.cardData.forEach(card=>{
      card.prevDays = this.cardPrevDaysText;
      card.upDowns.count = 0;
      card.upDowns.percentage = 0;
      card.upDowns.status = 'up'
    })
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
}
