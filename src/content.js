const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length === 0) continue;
    const tablas = document.querySelectorAll("table");
    let tablaTeorica = null;
    let tablaPractica = null;

    tablas.forEach((tabla) => {
      const th = tabla.querySelector("th.titulo");
      if (!th) return;

      const texto = th.textContent.trim();
      if (texto === "Teórica") tablaTeorica = tabla;
      if (texto === "Práctica") tablaPractica = tabla;
    });

    if (tablaTeorica || tablaPractica) {
      console.log("Se encontraron tablas de Teórica o Práctica.");

      let evaluaciones = [];

      if (tablaTeorica) {
        evaluaciones = evaluaciones.concat(
          extraerEvaluaciones(tablaTeorica, "teorica")
        );
      }

      if (tablaPractica) {
        evaluaciones = evaluaciones.concat(
          extraerEvaluaciones(tablaPractica, "practica")
        );
      }

      console.log("Evaluaciones extraídas:", evaluaciones);

      const escenarios = calcularEscenariosPorTipo(evaluaciones);
      chrome.storage.local.set({ escenarios });

      observer.disconnect();
      break;
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

function extraerEvaluaciones(tabla, tipo) {
  const evaluaciones = [];
  const filas = tabla.querySelectorAll("tr");

  filas.forEach((fila) => {
    const celdas = fila.querySelectorAll("td");
    if (celdas.length < 6) return;

    const textoPonderacion = celdas[5].textContent.trim();
    if (!textoPonderacion.endsWith("%")) return;

    const textoNota = celdas[4].textContent.trim();
    let nota = parseFloat(textoNota);
    if (isNaN(nota)) {
      nota = null;
    }

    const ponderacion = parseFloat(textoPonderacion.replace("%", ""));
    evaluaciones.push({ tipo, nota, ponderacion });
  });
  return evaluaciones;
}
