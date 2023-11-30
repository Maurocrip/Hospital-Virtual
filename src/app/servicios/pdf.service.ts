import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'; 
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService 
{
  constructor() { }

  async DescargarGrafico(titulo : string, id: string)
  {
    let toDay = new Date();

    let pdf : any = {
      pageMargins: [ 5, 10, 10, 10 ],
      watermark: 'Hospital de mauro racioppi',
      content:[ 
        {text: titulo, style: 'header'},
        {image: await this.convertirGraficoAImagen(id), fit: [600, 600],alignment: 'center'},
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
   let PDF = pdfMake.createPdf(pdf);
   PDF.open();
  }

  async DescargarTabla(tabla : Array<any>, titulo : string, texto : string)
  {
    let toDay = new Date();

    let pdf : any = 
    {
      pageMargins: [ 5, 10, 10, 10 ],
      watermark: 'Hospital de mauro racioppi',
      content:
      [
        {image: await this.TransformarAImagen("https://t3.ftcdn.net/jpg/05/14/36/48/360_F_514364850_xLOQX6SOY2qcjAIcTowsi3xYvHmhmvs0.jpg"), width: 50,height: 50,alignment: 'center'},  
        {text: titulo, style: 'header'},
        {text: texto},
        {table: {body: tabla}},
        {text: 'Fecha de emisión: '+ toDay.toDateString()}
      ],
      styles: 
      {
        header: 
        {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },
      }
    }
   let PDF = pdfMake.createPdf(pdf);
   PDF.open();
  }

  private async convertirGraficoAImagen(id: string) : Promise<string> 
  {
    let chartElement = document.getElementById(id)!;

    return html2canvas(chartElement).then(canvas => 
    {
      let imagenBase64 = canvas.toDataURL('image/png');
      return imagenBase64;
    });
  }


  private TransformarAImagen(url) 
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
