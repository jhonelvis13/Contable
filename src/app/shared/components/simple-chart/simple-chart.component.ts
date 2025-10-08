import { Component, Input } from '@angular/core';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface ChartOptions {
  type: 'bar' | 'line' | 'pie' | 'donut';
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  animate?: boolean;
}

@Component({
  selector: 'app-simple-chart',
  template: `
    <div class="chart-container" [style.height.px]="options.height || 300">
      <!-- Bar Chart -->
      <div *ngIf="options.type === 'bar'" class="flex items-end justify-center space-x-2 h-full p-4">
        <div *ngFor="let item of data" class="flex flex-col items-center flex-1 max-w-20">
          <div class="relative w-full flex flex-col justify-end" [style.height.px]="(options.height || 300) - 80">
            <div 
              class="bg-blue-500 rounded-t-lg transition-all duration-700 ease-out hover:bg-blue-600 cursor-pointer relative"
              [style.height.%]="getPercentage(item.value)"
              [style.background-color]="item.color || '#3B82F6'"
              [title]="item.label + ': ' + item.value">
              <span *ngIf="options.showValues" 
                    class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                {{ item.value }}
              </span>
            </div>
          </div>
          <span *ngIf="options.showLabels" 
                class="text-xs text-gray-600 mt-2 text-center truncate w-full">
            {{ item.label }}
          </span>
        </div>
      </div>

      <!-- Pie Chart -->
      <div *ngIf="options.type === 'pie'" class="flex items-center justify-center h-full">
        <div class="relative">
          <svg [attr.width]="pieSize" [attr.height]="pieSize" class="transform -rotate-90">
            <circle
              *ngFor="let segment of pieSegments; let i = index"
              [attr.cx]="pieSize / 2"
              [attr.cy]="pieSize / 2"
              [attr.r]="pieRadius"
              fill="transparent"
              [attr.stroke]="segment.color"
              [attr.stroke-width]="pieStrokeWidth"
              [attr.stroke-dasharray]="segment.dashArray"
              [attr.stroke-dashoffset]="segment.dashOffset"
              class="transition-all duration-700 hover:stroke-width-[25]">
            </circle>
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-2xl font-bold text-gray-900">{{ getTotalValue() }}</div>
              <div class="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
        
        <!-- Legend -->
        <div class="ml-8 space-y-2">
          <div *ngFor="let item of data" class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-2" [style.background-color]="item.color || '#3B82F6'"></div>
            <span class="text-sm text-gray-700">{{ item.label }}</span>
            <span class="text-sm text-gray-500 ml-2">({{ item.value }})</span>
          </div>
        </div>
      </div>

      <!-- Line Chart -->
      <div *ngIf="options.type === 'line'" class="relative h-full p-4">
        <svg class="w-full h-full">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:0" />
            </linearGradient>
          </defs>
          
          <!-- Grid lines -->
          <g class="grid-lines">
            <line *ngFor="let line of gridLines" 
                  [attr.x1]="line.x1" [attr.y1]="line.y1" 
                  [attr.x2]="line.x2" [attr.y2]="line.y2"
                  stroke="#E5E7EB" stroke-width="1" opacity="0.5"/>
          </g>
          
          <!-- Line path -->
          <path 
            [attr.d]="linePath" 
            fill="url(#lineGradient)" 
            stroke="#3B82F6" 
            stroke-width="3" 
            class="transition-all duration-700"/>
          
          <!-- Data points -->
          <circle *ngFor="let point of linePoints; let i = index"
                  [attr.cx]="point.x" [attr.cy]="point.y" 
                  r="4" fill="#3B82F6" 
                  class="hover:r-6 transition-all cursor-pointer"
                  [title]="data[i].label + ': ' + data[i].value">
          </circle>
        </svg>
      </div>
    </div>
  `,
  styleUrls: ['./simple-chart.component.scss']
})
export class SimpleChartComponent {
  @Input() data: ChartData[] = [];
  @Input() options: ChartOptions = { type: 'bar' };

  pieSize = 200;
  pieRadius = 80;
  pieStrokeWidth = 20;

  get maxValue(): number {
    return Math.max(...this.data.map(item => item.value), 1);
  }

  get pieSegments() {
    const total = this.getTotalValue();
    const circumference = 2 * Math.PI * this.pieRadius;
    let currentOffset = 0;

    return this.data.map((item, index) => {
      const percentage = item.value / total;
      const dashLength = percentage * circumference;
      const dashArray = `${dashLength} ${circumference}`;
      const dashOffset = -currentOffset;
      
      currentOffset += dashLength;
      
      return {
        color: item.color || this.getDefaultColor(index),
        dashArray,
        dashOffset
      };
    });
  }

  get gridLines() {
    // Simplified grid for demo
    return [
      { x1: 0, y1: 50, x2: 400, y2: 50 },
      { x1: 0, y1: 100, x2: 400, y2: 100 },
      { x1: 0, y1: 150, x2: 400, y2: 150 },
      { x1: 0, y1: 200, x2: 400, y2: 200 }
    ];
  }

  get linePath(): string {
    if (this.data.length === 0) return '';
    
    const points = this.linePoints;
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    
    // Close the path for area fill
    path += ` L ${points[points.length - 1].x} 250 L ${points[0].x} 250 Z`;
    
    return path;
  }

  get linePoints() {
    const width = 400;
    const height = 200;
    const padding = 40;
    
    return this.data.map((item, index) => ({
      x: padding + (index * (width - 2 * padding)) / (this.data.length - 1),
      y: height - padding - ((item.value / this.maxValue) * (height - 2 * padding))
    }));
  }

  getPercentage(value: number): number {
    return (value / this.maxValue) * 100;
  }

  getTotalValue(): number {
    return this.data.reduce((sum, item) => sum + item.value, 0);
  }

  getDefaultColor(index: number): string {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
      '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
    ];
    return colors[index % colors.length];
  }
}