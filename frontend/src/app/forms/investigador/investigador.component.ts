import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Investigador } from 'src/app/services/auth/investigador';
import { InvestigadorService } from 'src/app/services/investigador/investigador.service';
import { InstitutoService } from 'src/app/services/instituto/instituto.service'; // Importa el servicio del Instituto

@Component({
  selector: 'app-investigador',
  templateUrl: './investigador.component.html',
  styleUrls: ['./investigador.component.css']
})
export class InvestigadorComponent implements OnInit {

  investigadores: Investigador[] = [];
  selectedInstituto: number | null = null;
  institutos: any[] = [];

  constructor(
    private router: Router,
    private investigadorService: InvestigadorService,
    private institutoService: InstitutoService
  ) { }

  ngOnInit(): void {
    this.loadInstitutos();
    this.loadInvestigadores();
  }

  loadInstitutos(): void {
    this.institutoService.getList().subscribe(
      (data: any[]) => {
        this.institutos = data;
      },
      (error) => {
        console.error('Error al obtener los institutos:', error);
      }
    );
  }

  onInstitutoChange(event: any): void {
    const institutoId = event.target.value; // Obtener el ID del instituto seleccionado
    this.loadInvestigadores(institutoId); // Pasar el ID del instituto
  }

  loadInvestigadores(institutoId?: number): void {
    if (institutoId) {
      // Llamar al servicio para obtener investigadores habilitados por instituto
      this.investigadorService.getInvestigadorByInstitute(institutoId).subscribe(
        (data: Investigador[]) => {
          // Ordenar los investigadores alfabéticamente
          this.investigadores = this.sortInvestigadores(data);
        },
        (error) => {
          console.error('Error al obtener los investigadores filtrados por instituto y habilitados:', error);
        }
      );
    } else {
      this.investigadorService.getInvestigadores().subscribe(
        (data: Investigador[]) => {
          // Filtrar investigadores habilitados y ordenar alfabéticamente
          const investigadoresHabilitados = data.filter(investigador => investigador); // Aquí podrías agregar la lógica de filtro por habilitado si es necesario
          this.investigadores = this.sortInvestigadores(investigadoresHabilitados);
          console.log("Investigadores habilitados: ", this.investigadores);
        },
        (error) => {
          console.error('Error al obtener los investigadores habilitados:', error);
        }
      );
    }
  }

  private sortInvestigadores(investigadores: Investigador[]): Investigador[] {
    return investigadores.sort((a, b) => {
      const apellidoPaternoComparison = (a.apellido_paterno_1_investigador ?? '').localeCompare(b.apellido_paterno_1_investigador ?? '');
      if (apellidoPaternoComparison !== 0) return apellidoPaternoComparison;
  
      const apellidoMaternoComparison = (a.apellido_materno_2_investigador ?? '').localeCompare(b.apellido_materno_2_investigador ?? '');
      if (apellidoMaternoComparison !== 0) return apellidoMaternoComparison;
  
      const nombre1Comparison = (a.nombre_1_investigador ?? '').localeCompare(b.nombre_1_investigador ?? '');
      if (nombre1Comparison !== 0) return nombre1Comparison;
  
      return (a.nombre_2_investigador ?? '').localeCompare(b.nombre_2_investigador ?? '');
    });
  }

  onCreate(): void {
    this.router.navigate(['/registrar-investigador']);
  }

  onEdit(investigador: Investigador): void {
    console.log("Llevando a editar : ", investigador.id);
    this.router.navigate(['/editar-investigador', investigador.id]);
  }

}