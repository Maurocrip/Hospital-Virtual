import { Component, Input } from '@angular/core';
import { Diagnostico } from 'src/app/Clases/Diagnostico';
import { Fecha } from 'src/app/Clases/Fecha';
import { Turno } from 'src/app/Clases/Turno';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-perfil-paciente',
  templateUrl: './perfil-paciente.component.html',
  styleUrls: ['./perfil-paciente.component.css']
})
export class PerfilPacienteComponent 
{
  @Input() mailPaciente :string ="";
  public arrayTurnos : Array<Turno> = [];
  constructor(private firebase : FirebaseService, public global : GlobalService)
  {
    this.firebase.TraerTurnos()
    .subscribe((res)=>
    {
      this.arrayTurnos =[];
      for(let element of res)
      {
        if(element["EmailPaciente"] == this.global.usuario.email || element["EmailPaciente"] == this.mailPaciente)
        {
          this.arrayTurnos.push(new Turno( new Fecha(element["Dia"],element["Mes"],element["Año"],element["Hora"]),element["Especialista"],
          element["Paciente"],element["EmailEspecialista"],element["EmailPaciente"],element["Especialidad"],element["Estado"], element["Id"],
          element["Comentario"], new Diagnostico(element["Diagnostico"].peso,element["Diagnostico"].altura,element["Diagnostico"].diagnostico,
          element["Diagnostico"].temperatura,element["Diagnostico"].presion,element["Diagnostico"].extras), element["Calificacion"]));
        }
      }
    })
  }

  async Descargar()
  {
    let toDay = new Date();
    let hola : string = "";
    let string : Array<any[]> = [['Paciente', 'Especialista', 'Fecha','Peso', 'Altura', 'Temperatura','Precion', 'Diagnostico', 'Otros problemas']];
    for(let turno of this.arrayTurnos) 
    {
      for(let problema of turno.diagnostico.extras)
      {
        hola +=problema.clave + ":" + problema.valor + "\n";
      }
      const nuevaFila = [turno.nombrePas, turno.nombreEsp, turno.fecha.year+'/'+ turno.fecha.mes+'/'+turno.fecha.dia,turno.diagnostico.peso, 
      turno.diagnostico.altura, turno.diagnostico.temperatura,turno.diagnostico.presion, turno.diagnostico.diagnostico, hola];
      string.push(nuevaFila);
    }

    const pdf : any = {
      pageMargins: [ 5, 10, 10, 10 ],
      watermark: 'Hospital de mauro racioppi',
      content:[
        {image: await this.getBase64ImageFromURL("https://t3.ftcdn.net/jpg/05/14/36/48/360_F_514364850_xLOQX6SOY2qcjAIcTowsi3xYvHmhmvs0.jpg"), width: 50,height: 50,alignment: 'center'},  
        {text: 'Historial Clinico', style: 'header'},
        {text: 'Este es el historial clinico del paciente: '+this.global.usuario.nombre},
        {table: {body: string}},
        {text: 'Fecha de emisión: '+ toDay.toDateString()}
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },

      }
    }
   const PDF = pdfMake.createPdf(pdf);
   PDF.open();
  }

  getBase64ImageFromURL(url) 
  {
    return new Promise((resolve, reject) => 
    {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => 
      {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => 
      {
        reject(error);
      };
      img.src = url;
    });
  }
}
