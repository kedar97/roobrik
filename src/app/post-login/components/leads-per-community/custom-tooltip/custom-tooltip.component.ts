import { Component } from '@angular/core';
import { ITooltipParams } from "@ag-grid-community/core";
import { ITooltipAngularComp } from 'ag-grid-angular';


@Component({
    standalone: true,
    template: `
        <div class="custom-tooltip" style="
            background-color: #cbd0d3;
            padding: 5px;
            border-radius: 3px;
        ">
          This is a benchmark comparison <br>
          of leads per client/franchise where: <br>
          Above  >= 2.8.1 <br>
          Average  2-2.8 <br>
          Below  &lt;2
        </div>
        `,
    styles: []
})
export class CustomTooltip implements ITooltipAngularComp {
    public params!: { any } & ITooltipParams;

    agInit(params: any): void {
        this.params = params;
    }
}
