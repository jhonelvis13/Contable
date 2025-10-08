import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})
export class DashboardCardComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() value!: string | number;
  @Input() detail!: string;
}
