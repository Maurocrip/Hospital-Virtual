import { Component, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { stream } from 'exceljs';
import { timestamp } from 'rxjs';
import { Especialista } from 'src/app/Clases/Especialista';
import { Fecha } from 'src/app/Clases/Fecha';
import { ErroresService } from 'src/app/servicios/errores.service';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { GlobalService } from 'src/app/servicios/global.service';
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
}


