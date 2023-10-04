import { Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

 public  clientList:any[]=[{
      imgSrc:"assets/images/arrow-senior-living-logo.png",
      clientName:"Client Name",
  },
  {
    imgSrc:"assets/images/galloway-senior-living-logo.png"
    ,
    clientName:"Client Name",
},
{
  imgSrc:"assets/images/sunrise-logo.svg"
  ,
  clientName:"Client Name",
},
]
}
