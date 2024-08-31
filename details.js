
import { mostrarDetallesEvento } from './modulos.js';


let urldetalle = new URLSearchParams(window.location.search);
let idEvento = urldetalle.get('event');


fetch('https://aulamindhub.github.io/amazing-api/events.json')
  .then(response => {
    if (response.ok) {
      return response.json();
    } 
  })
  .then(data => {
    mostrarDetallesEvento(data, idEvento);
  })
  