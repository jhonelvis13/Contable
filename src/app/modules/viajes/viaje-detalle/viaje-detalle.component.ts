import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViajeService } from '../../../core/services/viaje.service';

@Component({
  selector: 'app-viaje-detalle',
  templateUrl: './viaje-detalle.component.html',
  styleUrls: ['./viaje-detalle.component.css']
})
export class ViajeDetalleComponent implements OnInit {
  viaje: any = {};
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viajeService: ViajeService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadViajeDetalle(id);
    }
  }

  loadViajeDetalle(id: string) {
    this.loading = true;
    // Simulando carga de datos - reemplazar con servicio real
    setTimeout(() => {
      this.viaje = {
        id: id,
        tipo: 'Nacional',
        cliente: 'Cliente A',
        conductor: 'Conductor A',
        vehiculo: 'Vehículo 1',
        origen: 'Ciudad A',
        destino: 'Ciudad B',
        fechaSalida: '2025-10-01T08:00',
        fechaLlegada: '2025-10-01T16:00',
        monto: 5000,
        anticipo: 2000,
        saldo: 3000,
        estado: 'Completado',
        observaciones: 'Viaje sin inconvenientes'
      };
      this.loading = false;
    }, 1000);
  }

  goBack() {
    this.router.navigate(['/viajes']);
  }

  editViaje() {
    this.router.navigate(['/viajes/edit', this.viaje.id]);
  }

  printViaje() {
    window.print();
  }
}