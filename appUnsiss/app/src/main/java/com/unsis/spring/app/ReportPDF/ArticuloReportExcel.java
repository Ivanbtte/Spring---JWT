package com.unsis.spring.app.ReportPDF;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
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
        fuente.setFontHeightInPoints((short) 12);
        fuente.setFontName("Arial");
        estilo.setFont(fuente);

        estilo.setBorderTop(BorderStyle.THIN);
        estilo.setBorderBottom(BorderStyle.THIN);
        estilo.setBorderLeft(BorderStyle.THIN);
        estilo.setBorderRight(BorderStyle.THIN);

        estilo.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        estilo.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        estilo.setAlignment(HorizontalAlignment.CENTER);
        estilo.setVerticalAlignment(VerticalAlignment.CENTER);

        estilo.setWrapText(true);

        String[] cabeceras = { "ID", "Tipo publicación", "Fecha de publicación", "Folio", "Cita en norma APA 7ed",
                "Nombre del producto", "Instituto", "Financiamiento PRODEP (Si/No)", "Trimestre", "Compilado (Si/No)",
                "Indice MIAR", "Observaciones directores", "Observaciones gestión" };

        for (int i = 0; i < cabeceras.length; i++) {
            Cell celda = fila.createCell(i);
            celda.setCellValue(cabeceras[i]);
            celda.setCellStyle(estilo);
            hoja.autoSizeColumn(i);
        }
    }

    private void escribirDatosDeLaTabla() {
        int numeroFilas = 1;

        CellStyle estilo = libro.createCellStyle();
        XSSFFont fuente = libro.createFont();
        fuente.setFontHeightInPoints((short) 12);
        fuente.setFontName("Arial");

        // Aplicar la fuente al estilo
        estilo.setFont(fuente);
        estilo.setBorderTop(BorderStyle.THIN);
        estilo.setBorderBottom(BorderStyle.THIN);
        estilo.setBorderLeft(BorderStyle.THIN);
        estilo.setBorderRight(BorderStyle.THIN);

        estilo.setAlignment(HorizontalAlignment.CENTER);
        estilo.setVerticalAlignment(VerticalAlignment.CENTER);

        estilo.setWrapText(true);

        for (CitaApaDto cita : listarArticulos) {
            Row fila = hoja.createRow(numeroFilas++);

            Cell celda = fila.createCell(0);
            celda.setCellValue(numeroFilas - 1);
            hoja.autoSizeColumn(0);
            celda.setCellStyle(estilo);

            celda = fila.createCell(1);
            celda.setCellValue(cita.getTipoPublicacion());
            hoja.autoSizeColumn(1);
            celda.setCellStyle(estilo);

            Map<String, String> fechaMap = FechaPublicacionHelper
                    .obtenerFechaPublicacion(cita.getFechaPublicacion());
            String anio = fechaMap.get("fechaCompleta");

            celda = fila.createCell(2);
            celda.setCellValue(anio);
            hoja.autoSizeColumn(2);
            celda.setCellStyle(estilo);

            celda = fila.createCell(3);
            celda.setCellValue("Folio");
            hoja.autoSizeColumn(3);
            celda.setCellStyle(estilo);

            RichTextString citaApa = generarCitaApa(cita, libro);

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
            boolean financiamientoProdep = cita.getFinanciamientoProdep();
            String financiamientoProdepStr = financiamientoProdep ? "Sí" : "No";
            celda.setCellValue(financiamientoProdepStr);
            hoja.autoSizeColumn(7);
            celda.setCellStyle(estilo);

            celda = fila.createCell(8);
            celda.setCellValue(cita.getTrimestre().getNombre());
            hoja.autoSizeColumn(8);
            celda.setCellStyle(estilo);

            celda = fila.createCell(9);
            boolean compilado = cita.getCompilado();
            String compiladoStr = compilado ? "Sí" : "No";
            celda.setCellValue(compiladoStr);
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

    public XSSFRichTextString generarCitaApa(CitaApaDto articuloDTO, XSSFWorkbook workbook) {
        String articulos = "Articulos";
        String capitulo_libro = "Capitulo Libro";
        String libro = "Libro";

        // Obtiene una lista de autores que después separa con el uso de comas
        List<AutorDto> autoresList = articuloDTO.getAutores();
        String autores = formatearAutores(autoresList);

        String tipoPublicacion = String.valueOf(articuloDTO.getTipoPublicacion());

        Map<String, String> fechaMap = FechaPublicacionHelper
                .obtenerFechaPublicacion(articuloDTO.getFechaPublicacion());
        String anio = fechaMap.get("anio");

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

        // Crear una fuente en cursiva
        XSSFFont italicFont = workbook.createFont();
        italicFont.setItalic(true);
        italicFont.setFontHeightInPoints((short) 12);
        italicFont.setFontName("Arial");

        // Crear una fuente normal
        XSSFFont normalFont = workbook.createFont();
        normalFont.setFontHeightInPoints((short) 12);
        normalFont.setFontName("Arial");

        // Crear una fuente en negrita
        XSSFFont boldFont = workbook.createFont();
        boldFont.setBold(true);
        boldFont.setFontHeightInPoints((short) 12);
        boldFont.setFontName("Arial");

        String cita = "";

        // Generar la cita en formato APA según el tipo de publicación
        if (tipoPublicacion.equals(articulos)) {
            cita = String.format("%s (%s). %s. %s, %s(%s), %s. https://doi.org/%s",
                    autores, anio, tituloArticulo, tituloRevista,
                    volumenRevista, numeroRevista, paginas, doi);

        } else if (tipoPublicacion.equals(capitulo_libro)) {
            cita = String.format(
                    "%s (%s). %s. En %s (Ed.), %s (pp. %s). %s. https://doi.org/%s",
                    autores, anio, tituloCapitulo, "editoresList",
                    tituloLibro, paginas, editorial, doi);

        } else if (tipoPublicacion.equals(libro)) {
            if (doi == null || doi.isEmpty()) {
                cita = String.format("%s (%s). %s. %s. ISBN Impreso: %s, ISBN Digital: %s.",
                        autores, anio, tituloLibro, editorial, isbnImpreso, isbnDigital);
            } else {
                cita = String.format("%s (%s). %s. %s. https://doi.org/%s. ISBN Impreso: %s, ISBN Digital: %s.",
                        autores, anio, tituloLibro, editorial, doi, isbnImpreso, isbnDigital);
            }
        }

        XSSFRichTextString richTextString = new XSSFRichTextString(cita);

        // Aplicar la fuente normal a todo el texto
        richTextString.applyFont(normalFont);

        // Aplicar negrita a los apellidos y las iniciales de los autores UNSIS
        for (AutorDto autor : autoresList) {
            if (autor.getAutorUnsis()) {
                String apellidoPaterno = autor.getApellidoPaternoAutor() != null
                        && !autor.getApellidoPaternoAutor().isEmpty()
                                ? autor.getApellidoPaternoAutor()
                                : ""; // Verifica si el apellido paterno existe

                String apellidoMaterno = autor.getApellidoMaternoAutor() != null
                        && !autor.getApellidoMaternoAutor().isEmpty()
                                ? autor.getApellidoMaternoAutor()
                                : ""; // Verifica si el apellido materno existe

                String inicialNombre1 = autor.getNombre1Autor() != null && !autor.getNombre1Autor().isEmpty()
                        ? autor.getNombre1Autor().substring(0, 1) + "."
                        : ""; // Inicial del primer nombre, si existe

                String inicialNombre2 = autor.getNombre2Autor() != null && !autor.getNombre2Autor().isEmpty()
                        ? autor.getNombre2Autor().substring(0, 1) + "."
                        : ""; // Inicial del segundo nombre, si existe

                // Aplicar negrita al apellido paterno
                int startApellidoPaterno = cita.indexOf(apellidoPaterno);
                int endApellidoPaterno = startApellidoPaterno + apellidoPaterno.length();
                if (startApellidoPaterno >= 0 && endApellidoPaterno <= cita.length()) {
                    richTextString.applyFont(startApellidoPaterno, endApellidoPaterno, boldFont);
                }

                // Aplicar negrita al apellido materno
                int startApellidoMaterno = cita.indexOf(apellidoMaterno);
                int endApellidoMaterno = startApellidoMaterno + apellidoMaterno.length();
                if (startApellidoMaterno >= 0 && endApellidoMaterno <= cita.length()) {
                    richTextString.applyFont(startApellidoMaterno, endApellidoMaterno, boldFont);
                }

                // Aplicar negrita a la inicial del primer nombre
                int startInicialNombre1 = cita.indexOf(inicialNombre1);
                int endInicialNombre1 = startInicialNombre1 + inicialNombre1.length();
                if (startInicialNombre1 >= 0 && endInicialNombre1 <= cita.length()) {
                    richTextString.applyFont(startInicialNombre1, endInicialNombre1, boldFont);
                }

                // Aplicar negrita a la inicial del segundo nombre, si existe
                if (!inicialNombre2.isEmpty()) {
                    int startInicialNombre2 = cita.indexOf(inicialNombre2);
                    int endInicialNombre2 = startInicialNombre2 + inicialNombre2.length();
                    if (startInicialNombre2 >= 0 && endInicialNombre2 <= cita.length()) {
                        richTextString.applyFont(startInicialNombre2, endInicialNombre2, boldFont);
                    }
                }
            }
        }

        // Aplicar cursiva a las partes correspondientes
        if (tipoPublicacion.equals(articulos)) {
            // Cursiva en el título del artículo
            int startItalic = cita.indexOf(tituloArticulo);
            int endItalic = startItalic + tituloArticulo.length();
            if (startItalic >= 0 && endItalic <= cita.length()) {
                richTextString.applyFont(startItalic, endItalic, italicFont);
            }
        }

        if (tipoPublicacion.equals(capitulo_libro)) {
            // Cursiva en el título del capítulo y del libro
            int startItalicCapitulo = cita.indexOf(tituloCapitulo);
            int endItalicCapitulo = startItalicCapitulo + tituloCapitulo.length();
            if (startItalicCapitulo >= 0 && endItalicCapitulo <= cita.length()) {
                richTextString.applyFont(startItalicCapitulo, endItalicCapitulo, italicFont);
            }

            int startItalicLibro = cita.indexOf(tituloLibro);
            int endItalicLibro = startItalicLibro + tituloLibro.length();
            if (startItalicLibro >= 0 && endItalicLibro <= cita.length()) {
                richTextString.applyFont(startItalicLibro, endItalicLibro, italicFont);
            }
        }

        if (tipoPublicacion.equals(libro)) {
            // Cursiva en el título del libro
            int startItalic = cita.indexOf(tituloLibro);
            int endItalic = startItalic + tituloLibro.length();
            if (startItalic >= 0 && endItalic <= cita.length()) {
                richTextString.applyFont(startItalic, endItalic, italicFont);
            }
        }

        return richTextString;
    }

    private String formatearAutores(List<AutorDto> autoresList) {
        return autoresList.stream()
                .map(autor -> {
                    String apellidoPaterno = autor.getApellidoPaternoAutor() != null ? autor.getApellidoPaternoAutor()
                            : "";
                    String apellidoMaterno = autor.getApellidoMaternoAutor() != null ? autor.getApellidoMaternoAutor()
                            : "";
                    String inicialNombre1 = autor.getNombre1Autor() != null
                            ? autor.getNombre1Autor().substring(0, 1) + "."
                            : "";
                    String inicialNombre2 = autor.getNombre2Autor() != null
                            ? autor.getNombre2Autor().substring(0, 1) + "."
                            : "";
                    return String.format("%s %s, %s. %s.", apellidoPaterno, apellidoMaterno, inicialNombre1,
                            inicialNombre2);
                })
                .collect(Collectors.joining(", "));
    }
}
