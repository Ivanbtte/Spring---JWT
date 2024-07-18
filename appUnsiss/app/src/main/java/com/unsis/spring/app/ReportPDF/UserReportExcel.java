package com.unsis.spring.app.ReportPDF;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.util.List;
import com.unsis.spring.app.User.UserDTO;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;

public class UserReportExcel {
    private XSSFWorkbook libro;
    private XSSFSheet hoja;

    private List<UserDTO> listarUsuarios;

    public UserReportExcel(XSSFWorkbook libro, XSSFSheet hoja, List<UserDTO> listarUsuarios) {
        this.libro = libro != null ? libro : new XSSFWorkbook();
        this.hoja = hoja != null ? hoja : this.libro.createSheet("Usuarios");
        this.listarUsuarios = listarUsuarios;
         
    }

    private void escribirCabeceraDeTabla(){
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
        celda.setCellValue("Nombre");
        celda.setCellStyle(estilo);
        
        celda = fila.createCell(2);
        celda.setCellValue("Rol");
        celda.setCellStyle(estilo);
    }

    private void escribirDatosDeLaTabla(){
        int numeroFilas = 1;
        
        CellStyle estilo = libro.createCellStyle();
        XSSFFont fuente = libro.createFont();
        fuente.setFontHeight(16);
        estilo.setFont(fuente);

        for(UserDTO usuario : listarUsuarios){
            Row fila = hoja.createRow(numeroFilas ++);
            
            Cell celda = fila.createCell(0);
            celda.setCellValue(usuario.getId());
            hoja.autoSizeColumn(0);
            celda.setCellStyle(estilo);

            celda = fila.createCell(1);
            celda.setCellValue(usuario.getUsername());
            hoja.autoSizeColumn(1);
            celda.setCellStyle(estilo);

            celda = fila.createCell(2);
            celda.setCellValue(usuario.getRole());
            hoja.autoSizeColumn(2);
            celda.setCellStyle(estilo);
        }
    }

    public void exportar(HttpServletResponse response) throws IOException{
        escribirCabeceraDeTabla();
        escribirDatosDeLaTabla();

        ServletOutputStream outputStream = response.getOutputStream();
        libro.write(outputStream);

        libro.close();
        outputStream.close();
    }
}
