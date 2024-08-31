import { actualizarTablaEstadisticas } from './modulos.js';

const apiUrl = 'https://aulamindhub.github.io/amazing-api/events.json';

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const eventos = data.events;
    const fechaActual = new Date(data.currentDate);

    if (eventos.length === 0) {
      console.error('No hay eventos disponibles');
      return;
    }

   
    actualizarTablaEstadisticas(eventos, fechaActual);
  })
  .catch(error => console.error('Error al cargar los eventos:', error));

 
