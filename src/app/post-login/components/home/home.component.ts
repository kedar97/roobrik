import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  cardList = [
    {
      imgSrc: 'assets/images/roobrik_icon_03.png',
      heading: 'Standard Reports',
      content: 'Roobrik’s standard reporting includes monthly, quarterly, semi-annual, and annual performance reports per assessment, as well as monthly SQL and MQL lead reports.',
      btnTitle: 'View Standard Reports'
    },
    {
      imgSrc: 'assets/images/roobrik_icon_04.png',
      heading: 'Custom Reports',
      content: 'Roobrik’s custom reporting contains non-standard reports that your client success manager creates on your behalf. Each report contains a description of the data, assessment(s), and time period.',
      btnTitle: 'View Custom Reports'
    },
    {
      imgSrc: 'assets/images/roobrik_icon_05.png',
      heading: 'Lead Routing',
      content: 'View the email addresses where your Roobrik leads are delivered for each of your locations. Account Admins can update the email addresses here as well.',
      btnTitle: 'View Lead Routing'
    },
    
  ]
 
}
