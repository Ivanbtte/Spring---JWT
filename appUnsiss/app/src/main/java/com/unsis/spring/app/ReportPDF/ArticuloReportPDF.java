package com.unsis.spring.app.ReportPDF;

import java.awt.Color;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
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
        for (CitaApaDto articuloDTO : listarArticulos) {
            tabla.addCell(String.valueOf(articuloDTO.getIdArticulo()));
            tabla.addCell(String.valueOf(articuloDTO.getTipoPublicacion()));
            
            Map<String, String> fechaMap = FechaPublicacionHelper
                    .obtenerFechaPublicacion(articuloDTO.getFechaPublicacion());
            String anio = fechaMap.get("anio");
            tabla.addCell(String.valueOf(anio));
            tabla.addCell(String.valueOf("Folio"));// Pendiente por agregar

            // Llama al método separado para generar la cita APA
            String citaApa = generarCitaApa(articuloDTO);
            tabla.addCell(citaApa);
            tabla.addCell(String.valueOf(articuloDTO.getTituloRevista()));
            tabla.addCell(String.valueOf(articuloDTO.getInstituto()));
            tabla.addCell(String.valueOf(articuloDTO.getFinanciamientoProdep()));
            tabla.addCell(String.valueOf(articuloDTO.getTrimestre().getNombre()));
            tabla.addCell(String.valueOf(articuloDTO.getCompilado()));
            tabla.addCell(String.valueOf(articuloDTO.getIndiceMiar()));
            tabla.addCell(String.valueOf(articuloDTO.getObservacionesDirectores()));
            tabla.addCell(String.valueOf(articuloDTO.getObservacionesGestion()));
        }

    }

    public void exportar(HttpServletResponse response) throws DocumentException, IOException {
        Document documento = new Document(PageSize.A4.rotate());
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
            0.1f, 0.1f, 0.1f, 0.05f, 0.3f, 0.05f, 0.05f, 0.05f, 0.05f, 0.05f, 0.05f, 0.05f, 0.05f
        });
        tabla.setWidthPercentage(100);

        escribirCabeceraTabla(tabla);
        escribirDatosTabla(tabla);

        documento.add(tabla);
        documento.close();
    }

    public String generarCitaApa(CitaApaDto articuloDTO) {
        String articulos = "articulos";
        String capitulo_libro = "capitulo de libro";
        String libro = "libro";

        // Obtiene una lista de autores que después separa con el uso de comas
        List<AutorDto> autoresList = articuloDTO.getAutores();
        String autores = formatearAutores(autoresList);

        String tipoPublicacion = String.valueOf(articuloDTO.getTipoPublicacion());

        Map<String, String> fechaMap = FechaPublicacionHelper
                .obtenerFechaPublicacion(articuloDTO.getFechaPublicacion());
        String anio = fechaMap.get("anio");
        String fechaPublicacionStr = fechaMap.get("fechaCompleta");

        String tituloRevista = String.valueOf(articuloDTO.getTituloRevista());
        String numeroRevista = String.valueOf(articuloDTO.getNumeroRevista());
        String volumenRevista = String.valueOf(articuloDTO.getVolumenRevista());
        String paginas = String.valueOf(articuloDTO.getPagInicio()) + "-"
                + String.valueOf(articuloDTO.getPagFinal());
        String doi = String.valueOf(articuloDTO.getDoi());
        String tituloArticulo = String.valueOf(articuloDTO.getNombreArticulo());
        String tituloCapitulo = String.valueOf(articuloDTO.getNombreCapitulo());
        String tituloLibro = String.valueOf(articuloDTO.getNombreArticulo());
        String editorial = String.valueOf(articuloDTO.getEditorial());
        String isbnImpreso = String.valueOf(articuloDTO.getIsbnImpreso());
        String isbnDigital = String.valueOf(articuloDTO.getIsbnDigital());

        if (tipoPublicacion.equals(articulos)) {
            return String.format("%s (%s). %s. *%s*, %s(%s), %s. https://doi.org/%s",
                    autores, anio, tituloArticulo, tituloRevista,
                    volumenRevista, numeroRevista, paginas, doi);

        } else if (tipoPublicacion.equals(capitulo_libro)) {
            return String.format(
                    "%s (%s). %s. En %s (Ed.), *%s* (pp. %s). %s. https://doi.org/%s",
                    autores, anio, tituloCapitulo, "editoresList",
                    tituloLibro, paginas, editorial, doi);

        } else if (tipoPublicacion.equals(libro)) {
            if (doi == null || doi.isEmpty()) {
                return String.format("%s (%s). *%s*. %s. ISBN Impreso: %s, ISBN Digital: %s.",
                        autores, anio, tituloLibro, editorial, isbnImpreso, isbnDigital);
            } else {
                return String.format("%s (%s). *%s*. %s. https://doi.org/%s. ISBN Impreso: %s, ISBN Digital: %s.",
                        autores, anio, tituloLibro, editorial, doi, isbnImpreso, isbnDigital);
            }
        }
        return "";
    }

    private String formatearAutores(List<AutorDto> autoresList) {
        return autoresList.stream()
                .map(autor -> String.format("%s %s, %s %s",
                        autor.getApellidoPaternoAutor(),
                        autor.getApellidoMaternoAutor(),
                        autor.getNombre1Autor().charAt(0),
                        autor.getNombre2Autor() != null ? autor.getNombre2Autor().charAt(0) + "." : ""))
                .collect(Collectors.joining(", "));
    }

    public class FechaPublicacionHelper {
        public static Map<String, String> obtenerFechaPublicacion(Date fechaPublicacionDate) {
            Calendar fechaPublicacion = Calendar.getInstance();
            fechaPublicacion.setTime(fechaPublicacionDate);

            int year = fechaPublicacion.get(Calendar.YEAR);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String fechaCompleta = sdf.format(fechaPublicacion.getTime());

            Map<String, String> fechaMap = new HashMap<>();
            fechaMap.put("anio", String.valueOf(year));
            fechaMap.put("fechaCompleta", fechaCompleta);

            return fechaMap;
        }
    }

}
