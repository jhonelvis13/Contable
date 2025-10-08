import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  isMobile = false;

  menuItems = [
    { path: '/dashboard', icon: 'dashboard', name: 'Dashboard' },
    { path: '/viajes', icon: 'local_shipping', name: 'Viajes' },
    { path: '/socios', icon: 'group', name: 'Socios' },
    { path: '/anticipos', icon: 'request_quote', name: 'Anticipos' },
    { path: '/clientes', icon: 'business', name: 'Clientes' },
    { path: '/vehiculos', icon: 'directions_car', name: 'Vehículos' },
    { path: '/conductores', icon: 'person', name: 'Conductores' },
    { path: '/reportes', icon: 'assessment', name: 'Reportes' },
    { path: '/configuracion', icon: 'settings', name: 'Configuración' }
  ];

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 1024;
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
