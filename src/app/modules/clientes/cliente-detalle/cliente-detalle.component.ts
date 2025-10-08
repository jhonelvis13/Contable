import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../../core/models/cliente.model';
import { ClienteService } from '../../../core/services/cliente.service';

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.scss']
})
export class ClienteDetalleComponent implements OnInit {
  cliente: Cliente | null = null;
  isLoading = true;
  showEditModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.loadCliente();
  }

  private loadCliente(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/clientes']);
      return;
    }

    this.isLoading = true;
    this.clienteService.getClienteById(Number(id)).subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar el cliente:', error);
        this.isLoading = false;
        this.router.navigate(['/clientes']);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/clientes']);
  }

  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  onClienteUpdated(cliente: Cliente): void {
    this.cliente = cliente;
    this.closeEditModal();
  }

  hasCliente(): boolean {
    return this.cliente !== null && this.cliente !== undefined;
  }

  get clienteData(): Cliente {
    return this.cliente!;
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount && amount !== 0) return 'Bs 0.00';
    return `Bs ${amount.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
