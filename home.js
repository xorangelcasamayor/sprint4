
import { crearCheckboxes, renderEvents, aplicarFiltros } from './modulos.js';


fetch('https://aulamindhub.github.io/amazing-api/events.json')
    .then(response => response.json())
    .then(data => {
    
        crearCheckboxes(data);
        renderEvents(data.events);

      
        document.getElementById('searchInput').addEventListener('input', () => aplicarFiltros(data));
        document.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
            checkbox.addEventListener('change', () => aplicarFiltros(data));
        });
    })
