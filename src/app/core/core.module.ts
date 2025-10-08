import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Services
import { UserPreferencesService } from './services/user-preferences.service';
import { AdvancedApiService } from './services/advanced-api.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    UserPreferencesService,
    AdvancedApiService
  ]
})
export class CoreModule { }