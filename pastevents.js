import { crearCheckboxes, filtrarEventosPasados } from './modulos.js';


fetch('https://aulamindhub.github.io/amazing-api/events.json')
  .then(response => {
    if (response.ok) {
      return response.json(); 
    }
  })
  .then(data => {
    if (data) {
    
      crearCheckboxes(data);
      filtrarEventosPasados(data);

      document.getElementById('searchInput').addEventListener('input', () => filtrarEventosPasados(data));
      document.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
        checkbox.addEventListener('change', () => filtrarEventosPasados(data));
      });
    }
  })
 


