import { Component, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import html2canvas from 'html2canvas';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
type EChartsOption = echarts.EChartsOption;

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit
{
  @ViewChild('inicioSoli') inicioSoli: any;
  @ViewChild('finSoli') finSoli: any;
  @ViewChild('iniciofina') iniciofina: any;
  @ViewChild('finfina') finfina: any;
  public arrayLogins : Array<any> = []
  constructor(private global : GlobalService, private firebase : FirebaseService) {}
  
  ngOnInit(): void 
  {
    this.GenerarGraficos();
    this.Logis();
  }

  private Logis()
  {

    this.firebase.getAllSnapshot("logins","Fecha").subscribe((res)=>
    {
      this.arrayLogins = [...res];
      for(let a of this.arrayLogins)
      {
        let prueba = a.Fecha.toDate();
        a.Fecha = prueba.getDate()+"/"+prueba.getMonth()+"/"+prueba.getFullYear();
        a.Hora = prueba.getHours()+":"+prueba.getMinutes()+":"+prueba.getSeconds();
      }
    })
  }

  private GenerarGraficos()
  {
    this.firebase.TraerTurnos().subscribe(()=>
    {
      this.GraficoEspecialista();
      this.GraficoTurnosDias();
      this.FiltrarSolicitados();
      this.FiltrarFinalizados();
    });
  }

  private GraficoEspecialista()
  {
    let chartDom = document.getElementById('especialista')!;
    let myChart = echarts.init(chartDom);
    let option: EChartsOption;
    let arrayOpciones : Array<any> = [];
    let valor : number;

    for(let especialidad of this.global.arrayEspecialidades)
    {
      valor = 0;
      for(let turno of this.global.arrayTurnos)
      {
        if(turno.especialidad == especialidad.nombre)
        {
          valor ++;
        }
      }
      arrayOpciones.push({value: valor, name: especialidad.nombre})
    }

    option = {
      title: {
        text: 'Turnos por especialidad',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Especialidad',
          type: 'pie',
          radius: '50%',
          data: arrayOpciones,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    
    option && myChart.setOption(option);
  }

  private GraficoTurnosDias()
  {
    let chartDom = document.getElementById('Semana')!;
    let myChart = echarts.init(chartDom);
    let option: EChartsOption;
    let arrayValores : Array<any> = [0,0,0,0,0,0,0]
    
    for(let turno of this.global.arrayTurnos)
    {
      arrayValores[new Date(turno.fecha.year,turno.fecha.mes-1,turno.fecha.dia).getDay()]++;
    }

    option = {
      xAxis: {
        type: 'category',
        data: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
      },
      yAxis: {
        type: 'value'
      },
      grid:{
        left: "5%",
        right: "5%",
        top: 30
      },
      series: [
        {
          data: arrayValores,
          type: 'bar'
        }
      ]
    };
    
    option && myChart.setOption(option);
  }

  private GraficoTurnosSolicitados(startDate: Date, endDate: Date)
  {
    let chartDom = document.getElementById('Solicitados')!;
    let myChart = echarts.init(chartDom);
    let option: EChartsOption;
    let arrayGeneral : Array<any> = [];
    let arrayTiempo : Array<any> = [];
    let arrayValores : Array<any> = [];

    arrayGeneral = [...this.getDaysBetweenDates(startDate,endDate)];
    
    for(let turno of this.global.arrayTurnos)
    {
      for(let opcion of arrayGeneral)
      {
        if(turno.fecha.FechaToString() == opcion.Fecha && turno.estado != 'cancelado')
        {
          opcion.Valor++;
          break;
        }
      } 
    }

    for(let opcion of arrayGeneral)
    {
      arrayTiempo.push(opcion.Fecha);
      arrayValores.push(opcion.Valor);
    }
    option = {
      xAxis: {
        type: 'category',
        data: arrayTiempo
      },
      yAxis: {
        type: 'value'
      },
      grid:{
        left: "2%",
        right: "1%"
      },
      series: [
        {
          data: arrayValores,
          type: 'bar'
        }
      ]
    };
    
    option && myChart.setOption(option);
  }

  private GraficoTurnosFinalizados(startDate: Date, endDate: Date)
  {
    let chartDom = document.getElementById('Finalizados')!;
    let myChart = echarts.init(chartDom);
    let option: EChartsOption;
    let arrayGeneral : Array<any> = [];
    let arrayTiempo : Array<any> = [];
    let arrayValores : Array<any> = [];

    arrayGeneral = [...this.getDaysBetweenDates(startDate,endDate)];
    
    for(let turno of this.global.arrayTurnos)
    {
      for(let opcion of arrayGeneral)
      {
        if(turno.fecha.FechaToString() == opcion.Fecha && turno.estado == 'fializado')
        {
          opcion.Valor++;
          break;
        }
      } 
    }

    for(let opcion of arrayGeneral)
    {
      arrayTiempo.push(opcion.Fecha);
      arrayValores.push(opcion.Valor);
    }
    option = {
      xAxis: {
        type: 'category',
        data: arrayTiempo
      },
      yAxis: {
        type: 'value'
      },
      grid:{
        left: "2%",
        right: "1%",
      },
      series: [
        {
          data: arrayValores,
          type: 'bar'
        }
      ]
    };
    
    option && myChart.setOption(option);
  }

  FiltrarSolicitados()
  { 
    let fechaInit = this.inicioSoli.nativeElement.value;
    let fechaFin = this.finSoli.nativeElement.value;
    if(fechaInit != "" && fechaFin != "")
    {
      let fechaInicio :  Array<any> = this.TransformarFecha(fechaInit);
      let fechaFinal :  Array<any> = this.TransformarFecha(fechaFin);
      let day1 = new Date(fechaInicio[0], fechaInicio[1]-1, fechaInicio[2]);
      let day2 = new Date(fechaFinal[0], fechaFinal[1]-1, fechaFinal[2]);;
      this.GraficoTurnosSolicitados(day1,day2);
    }
  }

  FiltrarFinalizados()
  {
    let fechaInit = this.iniciofina.nativeElement.value;
    let fechaFin = this.finfina.nativeElement.value;
    if(fechaInit != "" && fechaFin != "")
    {
      let fechaInicio :  Array<any> = this.TransformarFecha(fechaInit);
      let fechaFinal :  Array<any> = this.TransformarFecha(fechaFin);
      let day1 = new Date(fechaInicio[0], fechaInicio[1]-1, fechaInicio[2]);
      let day2 = new Date(fechaFinal[0], fechaFinal[1]-1, fechaFinal[2]);
      this.GraficoTurnosFinalizados(day1,day2);
    }
  }

  private TransformarFecha(fecha : string) :  Array<any>
  {
    let arrayFecha :  Array<any> = fecha.split("-");
    for(let z of arrayFecha)
    {
      z=(Number) (z);
    }
    return arrayFecha;
  }

  getDaysBetweenDates(startDate: Date, endDate: Date): string[] {
    const daysArray: any[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const formattedDate = this.formatDate(currentDate);
      daysArray.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return daysArray;
  }

  private formatDate(date: Date): any {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return {Fecha :`${day}/${month}/${year}`, Valor : 0};
  }

  async convertirGraficoAImagen(id: string) : Promise<string> 
  {
    const chartElement = document.getElementById(id)!;

    return html2canvas(chartElement).then(canvas => 
    {
      const imagenBase64 = canvas.toDataURL('image/png');
      return imagenBase64;
    });
  }

  async Descargar(titulo : string,id: string)
  {
    let toDay = new Date();

    const pdf : any = {
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
   const PDF = pdfMake.createPdf(pdf);
   PDF.open();
  }

  async DescargarLogis()
  {
    let toDay = new Date();
    let tabla : Array<any[]> = [['Usuario', 'Fecha', 'Hora']];

    for(let login of this.arrayLogins) 
    {
      const nuevaFila = [login.Usuario, login.Fecha, login.Hora];
      tabla.push(nuevaFila);
    }

    const pdf : any = {
      pageMargins: [ 5, 10, 10, 10 ],
      watermark: 'Hospital de mauro racioppi',
      content:[
        {image: await this.getBase64ImageFromURL("https://t3.ftcdn.net/jpg/05/14/36/48/360_F_514364850_xLOQX6SOY2qcjAIcTowsi3xYvHmhmvs0.jpg"), width: 50,height: 50,alignment: 'center'},  
        {text: 'Logins hechos', style: 'header'},
        {text: 'Esta tabla muestra los logins de los usuarios: '},
        {table: {body: tabla}},
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

