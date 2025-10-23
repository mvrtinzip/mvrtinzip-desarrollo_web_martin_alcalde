document.addEventListener("DOMContentLoaded", () => {
  cargarGraficoLineas();
  cargarGraficoTorta();
  cargarGraficoBarras();
});

function cargarGraficoLineas() {
  fetch('/api/estadisticas/avisos-por-dia')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const fechas = data.datos.map(item => item.fecha);
        const cantidades = data.datos.map(item => item.cantidad);

        Highcharts.chart('grafico-lineas', {
          chart: {
            type: 'line'
          },
          title: {
            text: 'Avisos de Adopción por Día'
          },
          subtitle: {
            text: 'Últimos 30 días'
          },
          xAxis: {
            categories: fechas,
            title: {
              text: 'Fecha'
            }
          },
          yAxis: {
            title: {
              text: 'Cantidad de Avisos'
            },
            min: 0
          },
          series: [{
            name: 'Avisos',
            data: cantidades,
            color: '#5a9a6d'
          }],
          credits: {
            enabled: false
          }
        });
      } else {
        console.error('Error al cargar datos:', data.error);
        document.getElementById('grafico-lineas').innerHTML = 
          '<p style="color: red;">Error al cargar el gráfico</p>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('grafico-lineas').innerHTML = 
        '<p style="color: red;">Error de conexión</p>';
    });
}

function cargarGraficoTorta() {
  fetch('/api/estadisticas/avisos-por-tipo')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Highcharts.chart('grafico-torta', {
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Avisos por Tipo de Mascota'
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
            }
          },
          series: [{
            name: 'Avisos',
            colorByPoint: true,
            data: data.datos
          }],
          credits: {
            enabled: false
          }
        });
      } else {
        console.error('Error al cargar datos:', data.error);
        document.getElementById('grafico-torta').innerHTML = 
          '<p style="color: red;">Error al cargar el gráfico</p>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('grafico-torta').innerHTML = 
        '<p style="color: red;">Error de conexión</p>';
    });
}

function cargarGraficoBarras() {
  fetch('/api/estadisticas/avisos-por-mes-tipo')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const datos = data.datos;

        Highcharts.chart('grafico-barras', {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Avisos de Adopción por Mes y Tipo'
          },
          subtitle: {
            text: 'Últimos 12 meses'
          },
          xAxis: {
            categories: datos.meses,
            title: {
              text: 'Mes'
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Cantidad de Avisos'
            }
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0
            }
          },
          series: [
            {
              name: 'Gatos',
              data: datos.gatos,
              color: '#FF6B6B'
            },
            {
              name: 'Perros',
              data: datos.perros,
              color: '#4ECDC4'
            }
          ],
          credits: {
            enabled: false
          }
        });
      } else {
        console.error('Error al cargar datos:', data.error);
        document.getElementById('grafico-barras').innerHTML = 
          '<p style="color: red;">Error al cargar el gráfico</p>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('grafico-barras').innerHTML = 
        '<p style="color: red;">Error de conexión</p>';
    });
}