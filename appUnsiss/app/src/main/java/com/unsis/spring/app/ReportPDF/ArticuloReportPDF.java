package com.unsis.spring.app.ReportPDF;

import java.awt.Color;
import java.io.IOException;
import java.util.List;

import jakarta.servlet.http.HttpServletResponse;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.unsis.spring.app.DTO.ArticuloDto;


public class ArticuloReportPDF {
 private List<ArticuloDto> listarArticulos;

    public ArticuloReportPDF(List<ArticuloDto> listarArticulos) {
        super();
        this.listarArticulos = listarArticulos;
    }

    private void escribirCabeceraTabla(PdfPTable tabla) {
        PdfPCell celda = new PdfPCell();
        celda.setBackgroundColor(Color.BLACK);
        celda.setPadding(5);

        Font fuente = FontFactory.getFont(FontFactory.HELVETICA);
        fuente.setColor(Color.WHITE);

        celda.setPhrase(new Phrase("ID", fuente));
        tabla.addCell(celda);

        celda.setPhrase(new Phrase("Nombre", fuente));
        tabla.addCell(celda);
 
        celda.setPhrase(new Phrase("Rol", fuente));
        tabla.addCell(celda);
    }
//articulos, articulo de revista indexada, capitulo del libro, libro, libro online
    private void escribirDatosTabla(PdfPTable tabla) {
        String articulos="articulos";
        String articulos_r_i="articulos revista indexada";
        String capitulo_libro="capitulo de libro";
        String libro="libro";
        String libro_online="libro online";
        for (ArticuloDto articuloDTO : listarArticulos) {
            tabla.addCell(String.valueOf(articuloDTO.getTipoPublicacion()));
            tabla.addCell(String.valueOf(articuloDTO.getInstituto()));
            List<String> autoresList = "articuloDTO.getAutores()";
            String autores = String.join(", ", autoresList); // Une los autores en una cadena separada por comas
            String tipo_publicacion = String.valueOf(articuloDTO.getTipoPublicacion());
            String instituto = String.valueOf(articuloDTO.getInstituto());
            String fecha_publicacion = String.valueOf(articuloDTO.getFecha_publicacion());
            String titulo_revista = String.valueOf(articuloDTO.getTitulo_revista());
            String numero_revista = String.valueOf(articuloDTO.getNumero_revista());
            String volumen_revista = String.valueOf(articuloDTO.getVolumen_revista());
            String paginas =  String.valueOf(articuloDTO.getPag_inicio()) + "-" + String.valueOf(articuloDTO.getPag_final());
            String doi = String.valueOf(articuloDTO.getDoi());
            String isbn_impreso = String.valueOf(articuloDTO.getIsbn_impreso());
            String isbn_digital = String.valueOf(articuloDTO.getIsbn_digital());
            if(tipo_publicacion==articulos)
            {
                String citaAPA_articulo = String.format("%s (%s). %s. *%s*, %s(%s), %s. https://doi.org/%s",
                autores, fecha_publicacion, "tituloArticulo", titulo_revista, 
                volumen_revista, numero_revista, paginas, doi);
                tabla.addCell(citaAPA_articulo);
            } else if(tipo_publicacion==articulos_r_i)
            {
                String citaAPA_art_ind = String.format("%s (%s). %s. *%s, %s*(%s), %s. https://doi.org/%s",
                    autores, fecha_publicacion, "tituloArticulo", titulo_revista, 
                    volumen_revista, numero_revista, paginas, doi);
                tabla.addCell(citaAPA_art_ind);
            } else if(tipo_publicacion==capitulo_libro)
            {
                /*String citaAPA_cap_lib = String.format("%s (%s). %s. En %s (Ed.), *%s* (pp. %s). %s. https://doi.org/%s",
                                                        autores, fecha_publicacion, "tituloCapitulo", editoresList, 
                                                        tituloLibro, paginas, editorial, doi);
                tabla.addCell(citaAPA_cap_lib);*/
            } else if(tipo_publicacion==libro)
            {
               /* if (doi == null || doi.isEmpty()) {
                    String citaAPA_libro = String.format("%s (%s). *%s*. %s.",
                                            autores, "año", "tituloLibro", "editorial");
                    tabla.addCell(citaAPA_libro);
                } else {
                    String citaAPA_libro = String.format("%s (%s). *%s*. %s. https://doi.org/%s",
                                            autores, "año", "tituloLibro", "editorial", doi);
                    tabla.addCell(citaAPA_libro);
                }*/
            } else if(tipo_publicacion==libro_online)
            {
               /* if (doi == null || doi.isEmpty()) {
                    String citaAPA_libro_on = String.format("%s (%s). *%s*. %s. %s",
                                            autores, "año", "tituloLibro", "editorial", "url");
                    tabla.addCell(citaAPA_libro_on);
                } else {
                    String citaAPA_libro_on  = String.format("%s (%s). *%s*. %s. https://doi.org/%s",
                                            autores, "año", "tituloLibro", "editorial", doi);
                    tabla.addCell(citaAPA_libro_on);
                }*/
            }
            
            
        }
    }

    public void exportar(HttpServletResponse response) throws DocumentException, IOException {
        Document documento = new Document(PageSize.A4);
        PdfWriter.getInstance(documento, response.getOutputStream());

        documento.open();

        Font fuente = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fuente.setColor(Color.black);
        fuente.setSize(18);

        Paragraph titulo = new Paragraph("Reporte de articulos", fuente);
        titulo.setAlignment(Paragraph.ALIGN_CENTER);
        documento.add(titulo);

        PdfPTable tabla = new PdfPTable(13);
        tabla.setWidthPercentage(100);
        tabla.setSpacingBefore(15);
        tabla.setWidths(new float[] {
            0.2f, 0.2f, 0.2f, 0.05f, 0.05f, 0.05f, 0.05f, 0.05f, 0.05f, 0.05f, 0.05f, 0.05f, 0.05f
        });
        tabla.setWidthPercentage(100);

        escribirCabeceraTabla(tabla);
        escribirDatosTabla(tabla);

        documento.add(tabla);
        documento.close();
    }
}
