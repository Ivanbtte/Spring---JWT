import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  selectedOption: string | null = null;
  trimestres: any[] = [];
  ngOnInit(): void {
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.readFile(file);
    }
  }

  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      console.log(content); // Aquí puedes procesar el contenido del archivo CSV
    };
    reader.readAsText(file);
  }
  editarTrimestre(trimestre: any) {
    console.log('Editar trimestre:', trimestre);
  }

  EliminarTrimestre(trimestre: any) {
    console.log('Eliminar trimestre:', trimestre);
  }
}