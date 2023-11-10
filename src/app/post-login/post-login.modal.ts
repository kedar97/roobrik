interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PaginationOption {
  title: string;
  value: number;
}

export interface StandardReportsRowData {
  reportName: string[];
  reportFrequency: string;
  addedOn: Date;
  assessmentName?: string,
  reportPeriod? : string,
  fileType?: string,
  createBy? : string
}

export interface CustomReportRowData {
  reportName: string;
  description?: string;
  reportPeriod: DateRange;
  addedOn: Date;
  assessmentName?: string,
  fileType?: string,
  createBy? : string
}

export interface LeadRoutingRowData {
  email: string;
  firstName: string;
  lastName: string;
  locations: string;
  status: string;
}

export interface UserData {
  email: string;
  firstName: string,
  lastName: string,
  listName: string
  locations: { name: string }[];
}