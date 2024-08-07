export interface Articulo {
  tipoPublicacion: {
    id_publicacion_tipo: number;
    nombre: string;
  };
  instituto: {
    id: number | undefined;
    nombre: string;
  };
  trimestre: {
    id_trimestre: number;
    nombre: string;
    fecha_inicio: Date;
    fecha_fin: Date;
  };
  fileMetadata: {
    id: number;
    fileName: string;
    filePath: string;
    fileType: string;
  };
  fecha_publicacion: Date | undefined;
  titulo_revista?: string;
  numero_revista?: number;
  volumen_revista?: string;
  pag_inicio?: number;
  pag_final?: number;
  doi?: string;
  isbn_impreso?: string;
  isbn_digital?: string;
  nombre_articulo?: string;
  editorial?: string;
  nombre_capitulo?: string;
  observaciones_directores?: string;
  observaciones_gestion?: string;
  indice_miar?: string;
  compilado: boolean;
  financiamiento_prodep: boolean;
}