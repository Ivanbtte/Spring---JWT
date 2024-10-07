export interface Observaciones {
    id_articulo: number;
    compilado: boolean;
    observaciones_directores?: string;
    observaciones_gestion?: string;
    observaciones_investigador?: string;
    aceptado_director: boolean;
    aceptado_gestion: boolean;
    estatus: number;
  }