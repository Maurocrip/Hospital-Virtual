import { Injectable } from '@angular/core';
import { Workbook, Worksheet } from 'exceljs';
import { Turno } from '../Clases/Turno';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExelService 
{
  private worbook: Workbook;
  constructor() {}

  descargarExel(arrayTurno : Array<Turno>, nombre : string)
  {
    this.worbook = new Workbook();
    this.worbook.creator='Hospital Mauro Racioppi';
    let hoja : Worksheet = this.CrearHoja();
  
    for (let i = 0; i < arrayTurno.length; i++) 
    {
      this.GenerarLinea(arrayTurno[i],i+4,hoja);
    }

    this.worbook.xlsx.writeBuffer().then((data)=>
    {
      const blob = new Blob([data]);
      fs.saveAs(blob, 'Turnos'+nombre+'.xlsx');
    })
  }

  private CrearHoja() : Worksheet
  {
    let hoja : Worksheet = this.worbook.addWorksheet("Turnos");

    hoja.mergeCells('B2:G2');
    hoja.getCell('B2').value = "TURNOS";
    hoja.getCell('B2').font = {size: 20};
    hoja.getCell('B2').alignment= {horizontal:'center', vertical: 'middle'};
    hoja.getCell('B2').fill = {type : 'pattern', pattern:'solid' ,fgColor: {argb: '008000'}};
    hoja.getCell('B2').border = {top:{style: 'thin'},left:{style: 'thin'},right:{style: 'thin'}};

    ['B','C','D','E','F','G'].forEach((letra)=>
    {
      hoja.getColumn(letra).width = 20;
    })
    hoja.getRow(3).values=['','Paciente','Especialista','Especialidad','Fecha','Estado','Reseña']; 
    hoja.getRow(3).alignment= {horizontal:'center', wrapText:true};
    ['B3','C3','D3','E3','F3','G3'].forEach((letra)=>
    {
      hoja.getCell(letra).fill = {type : 'pattern', pattern:'solid' ,fgColor: {argb: 'b1cdff'}};
      hoja.getCell(letra).font = {bold:true, size:14};
      hoja.getCell(letra).border = {top:{style: 'thin'},left:{style: 'thin'},bottom:{style: 'thin'},right:{style: 'thin'}};
    })
    return hoja;
  } 

  private GenerarLinea(turno : Turno, linea : number, hoja: Worksheet)
  {
    ['B'+linea,'C'+linea,'D'+linea,'E'+linea,'F'+linea,'G'+linea].forEach((letra)=>
    {
      hoja.getCell(letra).fill = {type : 'pattern', pattern:'solid' ,fgColor: {argb: 'ffdfab'}};
      hoja.getCell(letra).border = {top:{style: 'thin'},left:{style: 'thin'},bottom:{style: 'thin'},right:{style: 'thin'}};
    })
    hoja.getRow(linea).alignment= {horizontal:'center', wrapText:true}; 

    hoja.getCell("B"+linea).value = turno.nombrePas;
    hoja.getCell("C"+linea).value = turno.especialidad;
    hoja.getCell("D"+linea).value = turno.nombreEsp;
    hoja.getCell("E"+linea).value = turno.fecha.FechaToString() + " " + turno.fecha.hora;
    hoja.getCell("F"+linea).value = turno.estado;
    if( turno.estado == "fializado" || turno.estado == "cancelado")
    {
      hoja.getCell("G"+linea).value = turno.comentario;
    }
  }
}
