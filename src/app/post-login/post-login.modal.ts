interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PaginationOption {
  title: string;
  value: number | string;
}

export interface StandardReportsRowData {
  reportName: string[];
  reportFrequency: string;
  addedOn: Date;
  assessmentName?: string;
  reportPeriod?: string;
  fileType?: string;
  createBy?: string;
}

export interface CustomReportRowData {
  reportName: string;
  description?: string;
  reportPeriod: DateRange;
  addedOn: Date;
  assessmentName?: string;
  fileType?: string;
  createBy?: string;
}

export interface LeadRoutingRowData {
  email: string;
  firstName: string;
  lastName: string;
  locations: string;
  status: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  listName: string;
  locations: { name: string }[];
}

export interface DashboardCard {
  title: string;
  subTitle: string;
  count: number;
  upDowns: {
    status: string,
    count: number;
    percentage: number;
  };
  prevDays: number | string;
  rate: string;
}