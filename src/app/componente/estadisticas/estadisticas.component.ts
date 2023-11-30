import { Component, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';
import { PdfService } from 'src/app/servicios/pdf.service';
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
  constructor(private global : GlobalService, private firebase : FirebaseService, private pdf : PdfService) {}
  
  ngOnInit(): void 
  {
    this.GenerarGraficos();
  }

  private GenerarGraficos()
  {
    this.firebase.getAllSnapshot("logins","Fecha").subscribe((res)=>
    {
      this.arrayLogins = [...res];
    })

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
        data: ['Domigo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        axisLabel: { interval: 0, rotate: 0 }
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

  private GraficoEntreFechas(id: string, startDate: Date, endDate: Date, estado: string): void 
  {
    let chartDom = document.getElementById(id);
    if (!chartDom) return;
  
    let myChart = echarts.init(chartDom);
    let arrayFechas = this.RellenarFechas(startDate, endDate);
    let arrayEspecialistas = this.global.arrayEspecialista.map(especialista => `${especialista.nombre} ${especialista.apellido}`);
    let arrayEspecialistasEmail = this.global.arrayEspecialista.map(especialista => especialista.email);
    let arrayData = Array(arrayFechas.length).fill(0);
  
    let arraySerie = this.global.arrayEspecialista.map(especialista => 
    ({
      name: `${especialista.nombre} ${especialista.apellido}`,
      type: 'line',
      step: 'middle',
      data: [...arrayData]
    }));
  
    for (let turno of this.global.arrayTurnos) 
    {
      let fechaString = turno.fecha.FechaToString();
      let indexFecha = arrayFechas.indexOf(fechaString);
      
      if (indexFecha !== -1 && turno.estado === estado) 
      {
        arraySerie[arrayEspecialistasEmail.indexOf(turno.emailEsp)].data[indexFecha]++;
      }
    }
  
    let option = 
    {
      tooltip: 
      { 
        trigger: 'axis' 
      },
      legend: 
      { 
        data: arrayEspecialistas 
      },
      grid: 
      { 
        left: '1%', 
        right: '1%', 
        bottom: '3%', 
        containLabel: true 
      },
      xAxis: 
      { 
        type: 'category', 
        data: arrayFechas, 
        axisLabel: 
        { interval: 0, 
          rotate: 30 
        } 
      },
      yAxis: 
      { 
        type: 'value' 
      },
      series: arraySerie
    } as echarts.EChartsOption;
  
    myChart.setOption(option);
  }

  FiltrarSolicitados()
  { 
    let fechaInit = this.inicioSoli.nativeElement.value;
    let fechaFin = this.finSoli.nativeElement.value;
    this.CrearGraficos(fechaInit,fechaFin,'Esperando','Solicitados');
  }

  private CrearGraficos(fechaInit : any, fechaFin : any, estado : string , id : string)
  {
    if(fechaInit && fechaFin)
    {
      this.GraficoEntreFechas(id,this.generarFechas(fechaInit),this.generarFechas(fechaFin),estado);
    }
  }

  private generarFechas(fecha : any) : Date
  {
    let fechaPartida :  Array<any> = this.TransformarFecha(fecha);
    return new Date(fechaPartida[0], fechaPartida[1]-1, fechaPartida[2]);
  }

  FiltrarFinalizados()
  {
    let fechaInit = this.iniciofina.nativeElement.value;
    let fechaFin = this.finfina.nativeElement.value;
    this.CrearGraficos(fechaInit,fechaFin,'fializado','Finalizados');
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

  private RellenarFechas(startDate: Date, endDate: Date): string[] 
  {
    let daysArray: any[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) 
    {
      let formattedDate = this.FormatoFecha(currentDate);
      daysArray.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return daysArray;
  }

  private FormatoFecha(date: Date): any 
  {
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  async Descargar(titulo : string, id: string)
  {
    this.pdf.DescargarGrafico(titulo,id);
  }

  async DescargarLogis()
  {
    let tabla : Array<any[]> = [['Usuario', 'Fecha', 'Hora']];

    for(let login of this.arrayLogins) 
    {
      let prueba = login.Fecha.toDate();
      let fecha = prueba.getDate()+"/"+prueba.getMonth()+"/"+prueba.getFullYear();
      let hora = prueba.getHours()+":"+prueba.getMinutes()+":"+prueba.getSeconds();
      let nuevaFila = [login.Usuario, fecha, hora];
      tabla.push(nuevaFila);
    }
    this.pdf.DescargarTabla(tabla,"LOGINS","Esta tabla muestra los logis que se hicieron: ");
  }
}

