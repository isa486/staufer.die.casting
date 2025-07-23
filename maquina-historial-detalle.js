function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function crearFila(campo, valor) {
  return `<tr><td><strong>${campo}</strong></td><td>${valor || ""}</td></tr>`;
}

function mostrarTablaHistorial(mtto, serie) {
  let html = `
    <h3>Mantenimiento del ${mtto.fecha}</h3>
    <table class="tabla-historial">
      <caption>Detalle de Mantenimiento</caption>
      <tr>
        <th>Campo</th>
        <th>info</th>
      </tr>
      ${crearFila("Trabajo", mtto.trabajo)}
      ${crearFila("Empresa", mtto.empresa)}
      ${crearFila("Contacto", mtto.contacto)}
      ${crearFila("Ubicación", mtto.ubicacion)}
      ${crearFila("Tel", mtto.tel)}
      ${crearFila("Estado", mtto.estado)}
      ${crearFila("Puesto", mtto.puesto)}
      ${crearFila("Fecha de compra", mtto.fecha_compra)}
      ${crearFila("Quién realiza", mtto.quien_realiza)}
      ${crearFila("Fecha instalación", mtto.fecha_instalacion)}
      ${crearFila("Modelo", mtto.modelo)}
      ${crearFila("Tipo", mtto.tipo)}
      ${crearFila("Serie", serie)}
      ${crearFila("Temp. máx", mtto.temp_max)}
      ${crearFila("Fase motor", mtto.fase)}
      ${crearFila("Voltios", mtto.voltios)}
      ${crearFila("Amperaje máx", mtto.amperaje)}
    </table>
  `;

  // Tabla de lecturas, si existe
  if (mtto.lecturas) {
    html += `
      <table class="tabla-historial">
        <caption>Lecturas</caption>
        <tr>
          <th>Campo</th>
          <th>Valor</th>
        </tr>
        ${Object.entries(mtto.lecturas)
          .map(
            ([key, value]) =>
              crearFila(
                key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase()),
                value
              )
          )
          .join("")}
      </table>
    `;
  }

  if (mtto.material_utilizado) {
    html += `
      <table class="tabla-historial">
        <caption>Material Utilizado</caption>
        <tr>
          <td>${mtto.material_utilizado}</td>
        </tr>
      </table>
    `;
  }

  html += `
    <table class="tabla-historial">
      <caption>Comentarios</caption>
      <tr>
        <td>${mtto.comentarios || ""}</td>
      </tr>
      <tr>
        <td><strong>Realizó:</strong> ${mtto.realizo || ""} &nbsp; <strong>Recibió:</strong> ${mtto.recibio || ""}</td>
      </tr>
    </table>
    <div class="acciones-historial">
      <button onclick="window.print()">Imprimir historial</button>
      <button onclick="window.location.href='index.html'">Volver al listado</button>
    </div>
  `;
  return html;
}

function cargarHistorialMaquina() {
  const empresa = getQueryParam('empresa');
  const serie = getQueryParam('serie');
  if (!empresa || !serie) return;

  fetch(`data/historiales/${empresa}/${serie}.json`)
    .then(res => {
      if (!res.ok) throw new Error("No se encontró el historial");
      return res.json();
    })
    .then(historialArr => {
      const maquina = historialArr[0];
      if (!maquina) {
        document.getElementById('detalle-mantenimiento').innerHTML = '<p>No se encontró la máquina.</p>';
        return;
      }
      document.getElementById('nombre-maquina').innerHTML =
        `<h2>${maquina.nombre} (Serie: ${maquina.serie})</h2>` +
        (maquina.qr ? `<img src="qr/${maquina.qr}" alt="QR" class="qr-img">` : '');

      const tabsDiv = document.getElementById('tabs-mantenimientos');
      tabsDiv.innerHTML = '';
      if (Array.isArray(maquina.mantenimientos) && maquina.mantenimientos.length > 0) {
        maquina.mantenimientos.forEach((mtto, idx) => {
          tabsDiv.innerHTML += `<button class="tab-mtto" data-idx="${idx}" ${idx === 0 ? "style='font-weight:bold'" : ""}>${mtto.fecha} - ${mtto.trabajo}</button>`;
        });

        function mostrarDetalle(idx) {
          const mtto = maquina.mantenimientos[idx];
          document.getElementById('detalle-mantenimiento').innerHTML = mostrarTablaHistorial(mtto, maquina.serie);
          document.querySelectorAll('.tab-mtto').forEach((btn, i) => {
            btn.style.fontWeight = i === idx ? 'bold' : 'normal';
          });
        }
        document.querySelectorAll('.tab-mtto').forEach(tab => {
          tab.onclick = () => mostrarDetalle(Number(tab.dataset.idx));
        });
        mostrarDetalle(0);
      } else {
        document.getElementById('detalle-mantenimiento').innerHTML = '<p>No hay mantenimientos registrados para esta máquina.</p>';
      }
    })
    .catch(() => {
      document.getElementById('detalle-mantenimiento').innerHTML = '<p>No se encontró el historial o hubo un error de carga.</p>';
    });
}

document.addEventListener('DOMContentLoaded', cargarHistorialMaquina);
