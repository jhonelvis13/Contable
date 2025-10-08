import { Component, Input } from '@angular/core';

export interface StatsCardData {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  textColor?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

@Component({
  selector: 'app-stats-card',
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-600 mb-1">{{ data.title }}</p>
          <p class="text-2xl font-bold" [class]="data.textColor || 'text-gray-900'">
            {{ data.value }}
          </p>
          <p *ngIf="data.subtitle" class="text-xs text-gray-500 mt-1">
            {{ data.subtitle }}
          </p>
          <div *ngIf="data.trend" class="flex items-center mt-2">
            <i [class]="'fas ' + (data.trend!.isPositive ? 'fa-arrow-up text-green-500' : 'fa-arrow-down text-red-500')" 
               class="text-xs mr-1"></i>
            <span [class]="'text-xs font-medium ' + (data.trend!.isPositive ? 'text-green-600' : 'text-red-600')">
              {{ data.trend!.value }}%
            </span>
          </div>
        </div>
        <div [class]="'p-3 rounded-full ' + data.iconBgColor">
          <i [class]="data.icon + ' text-xl'"></i>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent {
  @Input() data!: StatsCardData;
}