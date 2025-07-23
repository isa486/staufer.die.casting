function cargarEmpresasYMaquinas() {
  fetch("data/empresas.json")
    .then(res => res.json())
    .then(empresas => {
      const listado = document.getElementById("empresas-listado");
      listado.innerHTML = "";
      empresas.forEach(empresa => {
        listado.innerHTML += `
          <div class="empresa-item">
            <h2>${empresa.nombre}</h2>
            <form class="buscador-maquina" onsubmit="return buscarMaquina(event, '${empresa.id}')">
              <label>Serie de máquina: <input type="text" name="serie" required></label>
              <button type="submit">Ver historial</button>
            </form>
          </div>
        `;
      });
    });
}

function buscarMaquina(event, empresaId) {
  event.preventDefault();
  const serie = event.target.serie.value.trim();
  if (!serie) return false;
  window.location.href = `maquina-historial-detalle.html?empresa=${empresaId}&serie=${encodeURIComponent(serie)}`;
  return false;
}

document.addEventListener("DOMContentLoaded", cargarEmpresasYMaquinas);