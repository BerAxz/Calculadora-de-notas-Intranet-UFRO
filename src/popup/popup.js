chrome.storage.local.get("escenarios", (data) => {
  if (!data.escenarios) return;

  renderSeccion("teorica", data.escenarios.teorica);
  renderSeccion("practica", data.escenarios.practica);
});

function renderSeccion(id, datos) {
  const bloque = document.getElementById(id);
  const estadoDiv = bloque.querySelector(".estado");
  const contenedor = bloque.querySelector(".resultados");

  estadoDiv.textContent = "";
  contenedor.innerHTML = "";

  if (!datos) {
    estadoDiv.textContent = "Sin información";
    return;
  }

  estadoDiv.textContent = textoEstado(datos);
  estadoDiv.className = `estado ${datos.estado}`;

  if (datos.estado === "completo") {
    const li = document.createElement("li");
    li.textContent = `Promedio final: ${datos.promedioActual}`;
    contenedor.appendChild(li);
    return;
  }

  if (Array.isArray(datos.pendientesDetalles) && datos.pendientesDetalles.length) {
    datos.pendientesDetalles.forEach((ev) => {
      const li = document.createElement("li");
      li.textContent = `Falta evaluación ${ev.indice} (${ev.ponderacion}%)`;
      contenedor.appendChild(li);
    });
  }

  if (datos.pendientes >= 3) {
    const li = document.createElement("li");
    li.textContent = `Faltan ${datos.pendientes} evaluaciones. El cálculo detallado se mostrará cuando queden 2 o menos.`;
    contenedor.appendChild(li);
    return;
  }

  if (datos.pendientes === 1) {
    const li = document.createElement("li");
    li.textContent = `Nota necesaria: ${datos.notaNecesaria}`;
    contenedor.appendChild(li);
    return;
  }

  if (datos.pendientes === 2) {
    datos.combinaciones.forEach((c) => {
      const li = document.createElement("li");
      li.textContent = `Notas ${c.nota1} / ${c.nota2} → Promedio ${c.promedio}`;
      contenedor.appendChild(li);
    });

    if (datos.notaMinimaSiPrimeraEs4 !== null) {
      const li = document.createElement("li");
      li.textContent = `Si una es 4.0, la otra debe ser ≥ ${datos.notaMinimaSiPrimeraEs4}`;
      contenedor.appendChild(li);
    }
  }
}

function textoEstado(datos) {
  if (datos.estado === "completo")
    return `Aprobado · Promedio ${datos.promedioActual}`;

  if (datos.estado === "pendiente")
    return `Pendiente · ${datos.pendientes} evaluación(es) restante(s)`;

  return "Estado desconocido";
}
