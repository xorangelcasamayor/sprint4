import { crearCheckboxes, filtrarEventosFuturos } from './modulos.js';


fetch('https://aulamindhub.github.io/amazing-api/events.json')
  .then(response => {
    if (response.ok) {
      return response.json();
    }
  })
  .then(data => {
    if (data) {
     
      crearCheckboxes(data);
      filtrarEventosFuturos(data);

      document.getElementById('searchInput').addEventListener('input', () => filtrarEventosFuturos(data));
      document.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
        checkbox.addEventListener('change', () => filtrarEventosFuturos(data));
      });
    }
  })
 