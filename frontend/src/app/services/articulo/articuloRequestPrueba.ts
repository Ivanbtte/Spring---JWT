import { Data } from "@angular/router";

export interface articulo{
    fechaFin: Data;
    fechaInicio: Data;
    institutoId: number;
    investigadorId: number,
    tipoPublicacionId: number;
}