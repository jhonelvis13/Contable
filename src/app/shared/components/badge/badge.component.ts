import { Component, Input } from '@angular/core';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-badge',
  template: `
    <span [class]="badgeClasses">
      <i [class]="icon" *ngIf="icon" class="mr-1"></i>
      <ng-content></ng-content>
      <button *ngIf="removable" 
              (click)="onRemove()" 
              class="ml-1 hover:bg-black hover:bg-opacity-20 rounded-full p-0.5 transition-colors">
        <i class="fas fa-times text-xs"></i>
      </button>
    </span>
  `,
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: BadgeSize = 'md';
  @Input() icon?: string;
  @Input() removable = false;

  get badgeClasses(): string {
    const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors';
    
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base'
    };
    
    const variantClasses = {
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800'
    };
    
    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  onRemove(): void {
    // Emit remove event if needed
  }
}