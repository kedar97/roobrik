interface DateRange {
    startDate: Date;
    endDate: Date;
}

export interface PaginationOption {
    title: string;
    value: number;
}

export interface StandardReportsRowData {
    reportName: string[],
    reportFrequency: string,
    addedOn: Date
}

export interface CustomReportRowData {
    reportName: string;
    description? : string,
    reportPeriod: DateRange;
    addedOn: Date;
}

