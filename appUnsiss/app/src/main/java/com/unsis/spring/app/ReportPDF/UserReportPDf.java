package com.unsis.spring.app.ReportPDF;

import java.awt.Color;
import java.io.IOException;
import java.util.List;
import com.unsis.spring.app.User.UserDTO;

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

public class UserReportPDf {

    private List<UserDTO> listarUsuarios;

    public UserReportPDf(List<UserDTO> listarUsuarios) {
        super();
        this.listarUsuarios = listarUsuarios;
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

    private void escribirDatosTabla(PdfPTable tabla) {
        for (UserDTO userDTO : listarUsuarios) {
            tabla.addCell(String.valueOf(userDTO.getId()));
            tabla.addCell(String.valueOf(userDTO.getUsername()));
            tabla.addCell(String.valueOf(userDTO.getRole()));
        }
    }

    public void exportar(HttpServletResponse response) throws DocumentException, IOException {
        Document documento = new Document(PageSize.A4);
        PdfWriter.getInstance(documento, response.getOutputStream());

        documento.open();

        Font fuente = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fuente.setColor(Color.black);
        fuente.setSize(18);

        Paragraph titulo = new Paragraph("Reporte de usuarios", fuente);
        titulo.setAlignment(Paragraph.ALIGN_CENTER);
        documento.add(titulo);

        PdfPTable tabla = new PdfPTable(3);
        tabla.setWidthPercentage(100);
        tabla.setSpacingBefore(15);
        tabla.setWidths(new float[] { 0.18f, 0.41f, 0.41f });
        tabla.setWidthPercentage(110);

        escribirCabeceraTabla(tabla);
        escribirDatosTabla(tabla);

        documento.add(tabla);
        documento.close();
    }
}
