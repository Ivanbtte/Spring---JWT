import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrimestreService } from 'src/app/services/trimestre/trimestre.service'; // Asegúrate de que la ruta sea correcta
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-trimestre',
  templateUrl: './editar-trimestre.component.html',
  styleUrls: ['./editar-trimestre.component.css']
})
export class EditarTrimestreComponent implements OnInit {
  trimestre: any = {};
  fechasValidas: boolean = true; // Controla si las fechas son válidas

  // Inyectar ActivatedRoute y TrimestreService
  constructor(
    private route: ActivatedRoute,
    private trimestreService: TrimestreService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trimestreService.getTrimestre(+id).subscribe(data => {
        this.trimestre = data;

        // Convierte las fechas al formato YYYY-MM-DD para el input de tipo date
        this.trimestre.fecha_inicio = this.formatDateForInput(data.fecha_inicio);
        this.trimestre.fecha_fin = this.formatDateForInput(data.fecha_fin);

        console.log('Trimestre cargado:', this.trimestre);
      });
    }
  }

  // Función para formatear la fecha en yyyy-MM-dd
  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);

    // Ajustar fecha solo si el desfase de zona horaria es necesario
    if (dateString.includes("T")) {
      date.setDate(date.getDate() - 1); // Resta 1 día si es necesario
    }

    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  guardarCambios(): void {
    // Validar si las fechas son válidas
    if (!this.sonFechasValidas(this.trimestre.fecha_inicio, this.trimestre.fecha_fin)) {
      console.error('Las fechas del trimestre no son válidas.');
      alert('Las fechas del trimestre no son válidas. La fecha de inicio debe ser antes de la fecha de fin.');
      return;
    }

    const trimestreActualizado = {
      ...this.trimestre,
      fecha_inicio: this.formatDateForBackend(this.trimestre.fecha_inicio),
      fecha_fin: this.formatDateForBackend(this.trimestre.fecha_fin),
    };

    this.trimestreService.updateTrimestre(this.trimestre.id_trimestre, trimestreActualizado).subscribe(
      response => {
        Swal.fire('Éxito', 'Trimestre actualizado exitosamente', 'success');
        this.router.navigate(['/catalogo']);
      },
      error => {
        console.error('Error al actualizar el trimestre:', error);
      }
    );
  }

  // Método para validar que las fechas de inicio y fin sean correctas
  private sonFechasValidas(fechaInicio: string, fechaFin: string): boolean {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Validar que la fecha de inicio sea antes que la fecha de fin
    if (inicio >= fin) {
      return false;
    }

    // Validar que las fechas sean del mismo año
    if (inicio.getFullYear() !== fin.getFullYear()) {
      return false;
    }

    return true;
  }


  // Convierte la fecha de vuelta al formato ISO completo
  private formatDateForBackend(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Resta 1 día si es necesario
    return date.toISOString(); // Devuelve la fecha en formato ISO
  }

  cancelar(): void {
    this.router.navigate(['/catalogo']);
  }
}
