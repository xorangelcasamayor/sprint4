
export function crearNuevaCard(event) {
  let card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img class="imagen42" src="${event.image}" alt="${event.name}">
    <div class="card-body d-flex flex-wrap justify-content-center">
        <h5 class="card-title">${event.name}</h5>
        <p class="card-text">${event.description}</p>
    </div>
    <div class="d-flex justify-content-around">
        <a href="#" class="btn">PRICE: ${event.price}</a>
        <a href="details.html?event=${event._id}" class="btn btn-primary">DETAILS</a>
    </div>
  `;
  return card;
}


export function renderEvents(events) {
  let container = document.getElementById("contenedor");
 
  container.innerHTML = '';

  if (events.length === 0) {
    container.innerHTML = '<p>No se encontraron resultados.</p>';
  } else {
    events.forEach(event => container.appendChild(crearNuevaCard(event)));
  }
}

// eventos pasados
export function filtrarEventosPasados(data) {
  let currentDateObj = new Date(data.currentDate);
  let eventosPasados = data.events.filter(event => new Date(event.date) < currentDateObj);

  aplicarFiltros(eventosPasados);
}

//eventos futuros
export function filtrarEventosFuturos(data) {
  let currentDateObj = new Date(data.currentDate);
  let eventosFuturos = data.events.filter(event => new Date(event.date) > currentDateObj);

  aplicarFiltros(eventosFuturos);
}

//  filtros de categoría y búsqueda
export function aplicarFiltros(events) {
  let checkboxes = document.querySelectorAll('input[type=checkbox]');
  let categoriasSeleccionadas = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.id);

  let searchInput = document.querySelector('#searchInput').value.toLowerCase().trim();
  
  let eventosFiltrados = events.filter(event => {
    let matchesCategory = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(event.category.replace(/\s+/g, ''));
    let matchesSearch = event.name.toLowerCase().includes(searchInput) || event.description.toLowerCase().includes(searchInput);
    return matchesCategory && matchesSearch;
  });

  renderEvents(eventosFiltrados);
}

//  checkboxes para categorías
export function crearCheckboxes(data) {
  let categorias = new Set(data.events.map(event => event.category));
  let container = document.getElementById('checkbox-container');
  
  
  container.innerHTML = '';

  categorias.forEach(categoria => {
    let id = categoria.replace(/\s+/g, '');
    container.innerHTML += `
      <div class="form-check form-check-inline">   
        <label class="form-check-label" for="${id}">${categoria}</label>
         <input class="form-check-input" type="checkbox" id="${id}">
      </div>
    `;
  });

  document.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
    checkbox.addEventListener('change', () => aplicarFiltros(data.events));
  });

  document.querySelector('#searchInput').addEventListener('input', () => aplicarFiltros(data.events));
}

// Función para calcular el porcentaje de asistencia
export function calcularPorcentajeAsistencia(evento) {
  if (evento.assistance && evento.capacity) {
    return (evento.assistance / evento.capacity) * 100;
  } else if (evento.estimate && evento.capacity) {
    return (evento.estimate / evento.capacity) * 100;
  }
  return 0;
}

// Función para obtener estadísticas de eventos futuros
export function obtenerEstadisticasEventosFuturos(eventos, fechaActual) {
  let eventosFuturos = eventos.filter(evento => new Date(evento.date) >= fechaActual);
  let categorias = [...new Set(eventosFuturos.map(evento => evento.category))];
  let filas = '';

  categorias.forEach(categoria => {
    let eventosCategoria = eventosFuturos.filter(evento => evento.category === categoria);
    let ingresosTotales = 0;
    let asistenciaTotal = 0;
    let cantidadEventos = 0;

    eventosCategoria.forEach(evento => {
      ingresosTotales += (evento.price || 0);
      asistenciaTotal += calcularPorcentajeAsistencia(evento);
      cantidadEventos++;
    });

    let asistenciaPromedio = cantidadEventos > 0 ? asistenciaTotal / cantidadEventos : 0;

    filas += `
      <tr>
        <td>${categoria}</td>
        <td>${ingresosTotales.toFixed(2)}</td>
        <td>${asistenciaPromedio.toFixed(2)}%</td>
      </tr>
    `;
  });

  return filas;
}

// estadísticas de eventos pasados
export function obtenerEstadisticasEventosPasados(eventos, fechaActual) {
  let eventosPasados = eventos.filter(evento => new Date(evento.date) < fechaActual);
  let categorias = [...new Set(eventosPasados.map(evento => evento.category))];
  let filas = '';

  categorias.forEach(categoria => {
    let eventosCategoria = eventosPasados.filter(evento => evento.category === categoria);
    let ingresosTotales = 0;
    let asistenciaTotal = 0;
    let cantidadEventos = 0;

    eventosCategoria.forEach(evento => {
      ingresosTotales += (evento.price || 0);
      asistenciaTotal += calcularPorcentajeAsistencia(evento);
      cantidadEventos++;
    });

    let asistenciaPromedio = cantidadEventos > 0 ? asistenciaTotal / cantidadEventos : 0;

    filas += `
      <tr>
        <td>${categoria}</td>
        <td>${ingresosTotales.toFixed(2)}</td>
        <td>${asistenciaPromedio.toFixed(2)}%</td>
      </tr>
    `;
  });

  return filas;
}

//  detalles del evento
export function mostrarDetallesEvento(data, idEvento) {
  if (data) {
    const event = data.events.find(e => e._id === parseInt(idEvento));
    const detailsDiv = document.getElementById('details');
    
    if (event) {
      detailsDiv.innerHTML = `
        <img src="${event.image}" alt="${event.name}">
        <h3 class="fs-3">${event.name}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Description:</strong> ${event.description}</p>
        <p><strong>Category:</strong> ${event.category}</p>
        <p><strong>Place:</strong> ${event.place}</p>
        <p><strong>Capacity:</strong> ${event.capacity}</p>
        <p><strong>Assistance:</strong> ${event.assistance}</p>
        <p><strong>Price:</strong> $${event.price}</p>
      `;
    } else {
      detailsDiv.innerHTML = '<p>Selecciona la tarjeta que quieras detallar</p>';
    }
  }
}

// actualizar la tabla de estadísticas
export function actualizarTablaEstadisticas(eventos, fechaActual) {
  const eventosPasados = eventos.filter(evento => new Date(evento.date) < fechaActual);

  let eventoMayorAsistencia = null;
  let eventoMenorAsistencia = null;
  let eventoMayorAforo = null;
  let eventoMenorAforo = null; 
  let menorAforo = Infinity;

  let mayorPorcentajeAsistencia = -Infinity;
  let menorPorcentajeAsistencia = Infinity;

  for (const evento of eventosPasados) {
    const porcentaje = calcularPorcentajeAsistencia(evento);

    if (porcentaje > mayorPorcentajeAsistencia || 
        (porcentaje === mayorPorcentajeAsistencia && evento.capacity > (eventoMayorAsistencia ? eventoMayorAsistencia.capacity : 0))) {
      mayorPorcentajeAsistencia = porcentaje;
      eventoMayorAsistencia = evento;
    }

    if (porcentaje < menorPorcentajeAsistencia) {
      menorPorcentajeAsistencia = porcentaje;
      eventoMenorAsistencia = evento;
    }

    if (!eventoMayorAforo || evento.capacity > eventoMayorAforo.capacity) {
      eventoMayorAforo = evento;
    }

    if (evento.capacity < menorAforo) {
      menorAforo = evento.capacity;
      eventoMenorAforo = evento; 
    }
  }

  document.querySelector('table').innerHTML = `
    <thead>
      <tr>
        <th class="bg-dark" colspan="3" scope="col">Estadísticas de eventos</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">Evento con mayor % de asistencia: ${eventoMayorAsistencia ? eventoMayorAsistencia.name : 'N/A'} (${mayorPorcentajeAsistencia.toFixed(2)}%)</td>
        <td class="text-center">Evento con menor % de asistencia: ${eventoMenorAsistencia ? eventoMenorAsistencia.name : 'N/A'} (${menorPorcentajeAsistencia.toFixed(2)}%)</td>
        <td class="text-center">Evento con mayor aforo: ${eventoMayorAforo ? eventoMayorAforo.name : 'N/A'} (${eventoMayorAforo ? eventoMayorAforo.capacity : 'N/A'})</td>
      </tr>
      <tr>
        <th class="bg-dark" colspan="3" scope="col">Estadísticas de eventos futuros por categoría</th>
      </tr>
      <tr>
        <td>Categorías</td>
        <td>Ingresos</td>
        <td>Porcentaje de asistencia</td>
      </tr>
      ${obtenerEstadisticasEventosFuturos(eventos, fechaActual)}
      <tr>
        <th class="bg-dark" colspan="3" scope="col">Estadísticas de eventos pasados por categoría</th>
      </tr>
      <tr>
        <td>Categorías</td>
        <td>Ingresos</td>
        <td>Porcentaje de asistencia</td>
      </tr>
      ${obtenerEstadisticasEventosPasados(eventos, fechaActual)}
    </tbody>
  `;
}
