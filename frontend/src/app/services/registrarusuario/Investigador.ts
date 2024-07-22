export interface Investigador {
    num_empleado: number;
    nombre_1_investigador: string;
    nombre_2_investigador: string;
    apellido_paterno_1_investigador: string;
    apellido_materno_2_investigador: string;
    user: {
      id: number;
      username: string;
      role: string;
    };
    instituto: {
      id: number;
      nombre: string;
    };
    autor: {
      id_autor: number;
      nombre1Autor: string;
      nombre2Autor: string;
      apellidoPaternoAutor: string;
      apellidoMaternoAutor: string;
      autorUnsis: boolean;
    };
  }