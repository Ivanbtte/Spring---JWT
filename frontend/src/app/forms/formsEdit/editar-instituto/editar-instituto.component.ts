import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InstitutoService } from 'src/app/services/instituto/instituto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-instituto',
  templateUrl: './editar-instituto.component.html',
  styleUrls: ['./editar-instituto.component.css']
})

export class EditarInstitutoComponent implements OnInit {
  instituto: any = { nombre: '' }; // Variable simple para almacenar los datos del instituto
  selectedForm: string = 'instituto'; // Esto puede ser dinámico según tu lógica

  constructor(
    private route: ActivatedRoute,
    private institutoService: InstitutoService,
    private fb: FormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.institutoService.getInstituto(+id).subscribe(data => {
        // Pre-carga el nombre en la variable
        this.instituto.nombre = data.nombre;
      });
    }
  }

  guardarCambios(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.institutoService.updateInstituto(+id, this.instituto).subscribe(
        updatedInstituto => {
          Swal.fire('Éxito', 'Instituto actualizado exitosamente', 'success');
          this.router.navigate(['/catalogo']);
        },
        error => {
          console.error('Error al actualizar el instituto:', error);
        }
      );
    }
  }

  cancelar(): void {
    this.router.navigate(['/catalogo']);
  }
}
