// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Material Modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

// Reusable Components
import { AlertBoxComponent } from './components/alert-box/alert-box.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ModalFormComponent } from './components/modal-form/modal-form.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { FormModalComponent } from './components/universal-form-modal/universal-form-modal.component';
import { BadgeComponent } from './components/badge/badge.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';
import { SimpleChartComponent } from './components/simple-chart/simple-chart.component';
import { AdvancedDataTableComponent } from './components/advanced-data-table/advanced-data-table.component';
import { SavedFiltersManagerComponent } from './components/saved-filters-manager/saved-filters-manager.component';
import { ResizableColumnsManagerComponent } from './components/resizable-columns-manager/resizable-columns-manager.component';
import { MobileOptimizedTableComponent } from './components/mobile-optimized-table/mobile-optimized-table.component';

// CDK Modules
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    AlertBoxComponent,
    DashboardCardComponent,
    DataTableComponent,
    FormInputComponent,
    FormSelectComponent,
    LoadingSpinnerComponent,
    ModalFormComponent,
    StatsCardComponent,
    FormModalComponent,
    BadgeComponent,
    ToastComponent,
    ToastContainerComponent,
    SkeletonComponent,
    LoadingOverlayComponent,
    SimpleChartComponent,
    AdvancedDataTableComponent,
    SavedFiltersManagerComponent,
    ResizableColumnsManagerComponent,
    MobileOptimizedTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    OverlayModule
  ],
  exports: [
    // Components
    AlertBoxComponent,
    DashboardCardComponent,
    DataTableComponent,
    FormInputComponent,
    FormSelectComponent,
    LoadingSpinnerComponent,
    ModalFormComponent,
    StatsCardComponent,
    FormModalComponent,
    BadgeComponent,
    ToastComponent,
    ToastContainerComponent,
    SkeletonComponent,
    LoadingOverlayComponent,
    SimpleChartComponent,
    AdvancedDataTableComponent,
    SavedFiltersManagerComponent,
    ResizableColumnsManagerComponent,
    MobileOptimizedTableComponent,
    
    // Modules
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    OverlayModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ]
})
export class SharedModule { }