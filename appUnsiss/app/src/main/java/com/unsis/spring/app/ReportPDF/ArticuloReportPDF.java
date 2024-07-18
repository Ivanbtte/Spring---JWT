package com.unsis.spring.app.ReportPDF;

import java.awt.Color;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Calendar;
import java.util.Date;
import java.util.stream.Collectors;

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
import com.unsis.spring.app.DTO.AutorDto;
import com.unsis.spring.app.DTO.CitaApaDto;

public class ArticuloReportPDF {
    private List<CitaApaDto> listarArticulos;

    public ArticuloReportPDF(List<CitaApaDto> listarArticulos) {
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
        celda.setPhrase(new Phrase("Tipo publicación", fuente));
        tabla.addCell(celda);
        celda.setPhrase(new Phrase("Fecha de publicación", fuente));
        tabla.addCell(celda);
        celda.setPhrase(new Phrase("Folio", fuente));
        tabla.addCell(celda);
        celda.setPhrase(new Phrase("Cita en norma APA 7ed", fuente));
        tabla.addCell(celda);
        celda.setPhrase(new Phrase("Nombre del producto", fuente));
        tabla.addCell(celda);
        celda.setPhrase(new Phrase("Instituto", fuente));
        tabla.addCell(celda);
        celda.setPhrase(new Phrase("Financiamiento PRODEP (Si/No)", fuente));
        tabla.addCell(celda);
        celda.setPhrase(new Phrase("Trimestre", fuente));
        tabla.addCell(celda);
        celda.setPhrase(new Phrase("Compilado (Si/No)", fuente));
        tabla.addCell(celda);
        celda.setPhrase(new Phrase("Indice MIAR", fuente));
        tabla.addCell(celda);
        celda.setPhrase(new Phrase("Observaciones directores", fuente));
        tabla.addCell(celda);
        celda.setPhrase(new Phrase("Observaciones gestión", fuente));
        tabla.addCell(celda);
    }

    private void escribirDatosTabla(PdfPTable tabla) {
        String articulos = "articulos";
        String capitulo_libro = "capitulo de libro";
        String libro = "libro";

        // Dentro de este for se genera la cita APA
        for (CitaApaDto articuloDTO : listarArticulos) {
            tabla.addCell(String.valueOf(articuloDTO.getIdArticulo()));
            tabla.addCell(String.valueOf(articuloDTO.getTipoPublicacion()));
            tabla.addCell(String.valueOf("Folio"));
            // Obtiene una lista de autores que despues separa con el uso de comas
            List<AutorDto> autoresList = articuloDTO.getAutores();
            String autores = autoresList.stream()
                    .map(AutorDto::getNombre1Autor)
                    .collect(Collectors.joining(", "));

            String tipo_publicacion = String.valueOf(articuloDTO.getTipoPublicacion());
            String instituto = String.valueOf(articuloDTO.getInstituto());

            // Obtiene la fecha
            Date fechaPublicacionDate = articuloDTO.getFechaPublicacion();
            Calendar fechaPublicacion = Calendar.getInstance();
            fechaPublicacion.setTime(fechaPublicacionDate);
            int year = fechaPublicacion.get(Calendar.YEAR);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String fechaCompleta = sdf.format(fechaPublicacion.getTime());
            // La divide en año y en fecha completa
            String anio = String.valueOf(year);
            String fecha_publicacion = fechaCompleta;

            String titulo_revista = String.valueOf(articuloDTO.getTituloRevista());
            String numero_revista = String.valueOf(articuloDTO.getNumeroRevista());
            String volumen_revista = String.valueOf(articuloDTO.getVolumenRevista());
            String paginas = String.valueOf(articuloDTO.getPagInicio()) + "-"
                    + String.valueOf(articuloDTO.getPagFinal());
            String doi = String.valueOf(articuloDTO.getDoi());
            String isbn_impreso = String.valueOf(articuloDTO.getIsbnImpreso());
            String isbn_digital = String.valueOf(articuloDTO.getIsbnDigital());

            if (tipo_publicacion == articulos) {
                String citaAPA_articulo = String.format("%s (%s). %s. *%s*, %s(%s), %s. https://doi.org/%s",
                        autores, fecha_publicacion, "tituloArticulo", titulo_revista,
                        volumen_revista, numero_revista, paginas, doi);
                tabla.addCell(citaAPA_articulo);

            } else if (tipo_publicacion == capitulo_libro) {
                String citaAPA_cap_lib = String.format(
                        "%s (%s). %s. En %s (Ed.), *%s* (pp. %s). %s. https://doi.org/%s",
                        autores, fecha_publicacion, "tituloCapitulo", "editoresList",
                        "tituloLibro", paginas, "editorial", doi);
                tabla.addCell(citaAPA_cap_lib);

            } else if (tipo_publicacion == libro) {
                if (doi == null || doi.isEmpty()) {
                    String citaAPA_libro = String.format("%s (%s). *%s*. %s.",
                            autores, "año", "tituloLibro", "editorial");
                    tabla.addCell(citaAPA_libro);
                } else {
                    String citaAPA_libro = String.format("%s (%s). *%s*. %s. https://doi.org/%s",
                            autores, "año", "tituloLibro", "editorial", doi);
                    tabla.addCell(citaAPA_libro);
                }
            }
            tabla.addCell(String.valueOf(articuloDTO.getTituloRevista()));
            tabla.addCell(String.valueOf(articuloDTO.getInstituto()));
            tabla.addCell(String.valueOf("Si"));
            tabla.addCell(String.valueOf("1er Trimestr"));
            tabla.addCell(String.valueOf("Si"));
            tabla.addCell(String.valueOf("Ninguno"));
            tabla.addCell(String.valueOf("Ninguno"));
            tabla.addCell(String.valueOf("Ninguno"));
        }
    }

    public void exportar(HttpServletResponse response) throws DocumentException, IOException {
        Document documento = new Document(PageSize.A4);
        PdfWriter.getInstance(documento, response.getOutputStream());

        documento.open();

        Font fuente = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fuente.setColor(Color.black);
        fuente.setSize(18);

        Paragraph titulo = new Paragraph("Concentrado de publicaciones", fuente);
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
