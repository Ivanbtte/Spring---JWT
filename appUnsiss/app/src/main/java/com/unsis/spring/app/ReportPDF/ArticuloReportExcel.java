package com.unsis.spring.app.ReportPDF;

import org.apache.poi.ss.usermodel.Row;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.unsis.spring.app.DTO.AutorDto;
import com.unsis.spring.app.DTO.CitaApaDto;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;

public class ArticuloReportExcel {
    private XSSFWorkbook libro;
    private XSSFSheet hoja;

    private List<CitaApaDto> listarArticulos;

    public ArticuloReportExcel(XSSFWorkbook libro, XSSFSheet hoja, List<CitaApaDto> listarArticulos) {
        this.libro = libro != null ? libro : new XSSFWorkbook();
        this.hoja = hoja != null ? hoja : this.libro.createSheet("Articulos");
        this.listarArticulos = listarArticulos;
        
    }

    private void escribirCabeceraDeTabla() {
        Row fila = hoja.createRow(0);

        CellStyle estilo = libro.createCellStyle();
        XSSFFont fuente = libro.createFont();
        fuente.setBold(true);
        fuente.setFontHeight(16);
        estilo.setFont(fuente);

        Cell celda = fila.createCell(0);
        celda.setCellValue("ID");
        celda.setCellStyle(estilo);

        celda = fila.createCell(1);
        celda.setCellValue("Tipo publicación");
        celda.setCellStyle(estilo);

        celda = fila.createCell(2);
        celda.setCellValue("Fecha de publicación");
        celda.setCellStyle(estilo);

        celda = fila.createCell(3);
        celda.setCellValue("Folio");
        celda.setCellStyle(estilo);

        celda = fila.createCell(4);
        celda.setCellValue("Cita en norma APA 7ed");
        celda.setCellStyle(estilo);

        celda = fila.createCell(5);
        celda.setCellValue("Nombre del producto");
        celda.setCellStyle(estilo);

        celda = fila.createCell(6);
        celda.setCellValue("Instituto");
        celda.setCellStyle(estilo);

        celda = fila.createCell(7);
        celda.setCellValue("Financiamiento PRODEP (Si/No)");
        celda.setCellStyle(estilo);

        celda = fila.createCell(8);
        celda.setCellValue("Trimestre");
        celda.setCellStyle(estilo);

        celda = fila.createCell(9);
        celda.setCellValue("Compilado (Si/No)");
        celda.setCellStyle(estilo);

        celda = fila.createCell(10);
        celda.setCellValue("Indice MIAR");
        celda.setCellStyle(estilo);

        celda = fila.createCell(11);
        celda.setCellValue("Observaciones directores");
        celda.setCellStyle(estilo);

        celda = fila.createCell(12);
        celda.setCellValue("Observaciones gestión");
        celda.setCellStyle(estilo);
    }

    private void escribirDatosDeLaTabla() {
        int numeroFilas = 1;

        CellStyle estilo = libro.createCellStyle();
        XSSFFont fuente = libro.createFont();
        fuente.setFontHeight(16);
        estilo.setFont(fuente);

        for (CitaApaDto cita : listarArticulos) {
            Row fila = hoja.createRow(numeroFilas++);

            Cell celda = fila.createCell(0);
            celda.setCellValue(cita.getIdArticulo());
            hoja.autoSizeColumn(0);
            celda.setCellStyle(estilo);

            celda = fila.createCell(1);
            celda.setCellValue(cita.getTipoPublicacion());
            hoja.autoSizeColumn(1);
            celda.setCellStyle(estilo);

            Map<String, String> fechaMap = FechaPublicacionHelper
                    .obtenerFechaPublicacion(cita.getFechaPublicacion());
            String anio = fechaMap.get("anio");

            celda = fila.createCell(2);
            celda.setCellValue(anio);
            hoja.autoSizeColumn(2);
            celda.setCellStyle(estilo);

            celda = fila.createCell(3);
            celda.setCellValue("Folio");
            hoja.autoSizeColumn(3);
            celda.setCellStyle(estilo);

            String citaApa = generarCitaApa(cita);

            celda = fila.createCell(4);
            celda.setCellValue(citaApa);
            hoja.autoSizeColumn(4);
            celda.setCellStyle(estilo);

            celda = fila.createCell(5);
            celda.setCellValue(cita.getTituloRevista());
            hoja.autoSizeColumn(5);
            celda.setCellStyle(estilo);

            celda = fila.createCell(6);
            celda.setCellValue(cita.getInstituto());
            hoja.autoSizeColumn(6);
            celda.setCellStyle(estilo);

            celda = fila.createCell(7);
            celda.setCellValue(cita.getFinanciamientoProdep());
            hoja.autoSizeColumn(7);
            celda.setCellStyle(estilo);

            celda = fila.createCell(8);
            celda.setCellValue(cita.getTrimestre().getNombre());
            hoja.autoSizeColumn(8);
            celda.setCellStyle(estilo);

            celda = fila.createCell(9);
            celda.setCellValue(cita.getCompilado());
            hoja.autoSizeColumn(9);
            celda.setCellStyle(estilo);

            celda = fila.createCell(10);
            celda.setCellValue(cita.getIndiceMiar());
            hoja.autoSizeColumn(10);
            celda.setCellStyle(estilo);

            celda = fila.createCell(11);
            celda.setCellValue(cita.getObservacionesDirectores());
            hoja.autoSizeColumn(11);
            celda.setCellStyle(estilo);

            celda = fila.createCell(12);
            celda.setCellValue(cita.getObservacionesGestion());
            hoja.autoSizeColumn(12);
            celda.setCellStyle(estilo);
        }
    }

    public void exportar(HttpServletResponse response) throws IOException {
        escribirCabeceraDeTabla();
        escribirDatosDeLaTabla();

        ServletOutputStream outputStream = response.getOutputStream();
        libro.write(outputStream);

        libro.close();
        outputStream.close();
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
}
