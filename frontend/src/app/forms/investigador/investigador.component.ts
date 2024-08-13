import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Investigador } from 'src/app/services/auth/investigador';
import { InvestigadorService } from 'src/app/services/investigador/investigador.service';

@Component({
  selector: 'app-investigador',
  templateUrl: './investigador.component.html',
  styleUrls: ['./investigador.component.css']
})
export class InvestigadorComponent implements OnInit {

  investigadores: Investigador[] = [];

  constructor(
    private router: Router,
    private investigadorService: InvestigadorService
  ) { }

  ngOnInit(): void {
    this.loadInvestigadores();
  }

  loadInvestigadores(): void{
    this.investigadorService.getInvestigadores().subscribe(
      (data: Investigador[]) => {
        this.investigadores = data;
      },
      (error) => {
        console.error('Error al obtener los investigadores:', error);
      }
    );
  }

  onCreate(): void {
    this.router.navigate(['/registrar-investigador']);
  }

  onEdit(investigador: Investigador): void {
    console.log("Llevando a editar : ", investigador.id); 
    this.router.navigate(['/editar-investigador', investigador.id]);
  }

  onDelete(investigador: Investigador): void {
    if (confirm('¿Estás seguro de que deseas dar de baja a este investigador?')) {
      this.investigadorService.deleteInvestigador(investigador.id).subscribe(
        () => {
          this.investigadores = this.investigadores.filter(i => i.id !== investigador.id);
        },
        (error) => {
          console.error('Error al dar de baja al investigador:', error);
        }
      );
    }
  }
}