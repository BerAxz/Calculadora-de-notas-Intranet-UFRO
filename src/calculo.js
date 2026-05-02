function separarPorTipo(evaluaciones) {
  return {
    teorica: evaluaciones.filter(ev => ev.tipo === 'teorica'),
    practica: evaluaciones.filter(ev => ev.tipo === 'practica')
  };
}

function analizarTipo(evaluaciones, notaObjetivo = 4.0) {
  let sumaActual = 0;
  let ponderacionUsada = 0;
  let pendientes = [];
  let pendientesDetalles = [];

  evaluaciones.forEach(ev => {
    if (ev.nota !== null) {
      sumaActual += ev.nota * ev.ponderacion;
      ponderacionUsada += ev.ponderacion;
    } else {
      pendientes.push(ev);
    }
  });

  pendientesDetalles = pendientes.map((ev, index) => ({
    indice: index + 1,
    ponderacion: ev.ponderacion
  }));

  const ponderacionTotal = ponderacionUsada +
    pendientes.reduce((s, ev) => s + ev.ponderacion, 0);

  if (ponderacionTotal > 100) {
    return { estado: 'invalido' };
  }

  if (pendientes.length === 0) {
    return {
      estado: 'completo',
      promedioActual: +(sumaActual / 100).toFixed(2),
      ponderacionTotal
    };
  }

  if (pendientes.length > 2) {
    return {
      estado: 'pendiente',
      pendientes: pendientes.length,
      pendientesDetalles,
      mensaje: 'Demasiadas evaluaciones pendientes'
    };
  }

  let notaNecesaria = null;
  if (pendientes.length === 1) {
    const ev = pendientes[0];
    for (let nota = 1.0; nota <= 7.0; nota += 0.1) {
      const promedio = (sumaActual + nota * ev.ponderacion) / 100;
      if (promedio >= notaObjetivo) {
        notaNecesaria = +nota.toFixed(1);
        break;
      }
    }

    if (notaNecesaria === null) {
      notaNecesaria = 'Imposible';
    }
  }

  const combinaciones = calcularCombinacionesLimitadas(
    sumaActual,
    pendientes,
    notaObjetivo
  );

  const notaMinimaSiPrimeraEs4 =
    pendientes.length === 2
      ? calcularNotaMinimaConOtraFija(sumaActual, pendientes, 0, 4.0, notaObjetivo)
      : null;

  return {
    estado: 'pendiente',
    promedioActual: +(sumaActual / 100).toFixed(2),
    ponderacionTotal,
    pendientes: pendientes.length,
    pendientesDetalles,
    notaNecesaria,
    combinaciones,
    notaMinimaSiPrimeraEs4
  };
}

function calcularCombinacionesLimitadas(
  sumaActual,
  pendientes,
  notaObjetivo,
  paso = 0.1,
  maxResultados = 10
) {
  if (pendientes.length !== 2) return [];

  const [ev1, ev2] = pendientes;
  const resultados = [];

  for (let n1 = 1.0; n1 <= 7.0; n1 += paso) {
    for (let n2 = 1.0; n2 <= 7.0; n2 += paso) {
      const promedio =
        (sumaActual +
          n1 * ev1.ponderacion +
          n2 * ev2.ponderacion) / 100;

      if (promedio >= notaObjetivo) {
        resultados.push({
          nota1: +n1.toFixed(1),
          nota2: +n2.toFixed(1),
          promedio: +promedio.toFixed(2)
        });
      }
    }
  }

  resultados.sort((a, b) =>
    (a.nota1 + a.nota2) - (b.nota1 + b.nota2)
  );

  return resultados.slice(0, maxResultados);
}

function calcularNotaMinimaConOtraFija(
  sumaActual,
  pendientes,
  indiceFija,
  notaFija,
  notaObjetivo
) {
  if (pendientes.length !== 2) return null;

  const evFija = pendientes[indiceFija];
  const evVariable = pendientes[indiceFija === 0 ? 1 : 0];

  for (let nota = 1.0; nota <= 7.0; nota += 0.1) {
    const promedio =
      (sumaActual +
        notaFija * evFija.ponderacion +
        nota * evVariable.ponderacion) / 100;

    if (promedio >= notaObjetivo) {
      return +nota.toFixed(1);
    }
  }

  return null;
}

function calcularEscenariosPorTipo(evaluaciones) {
  const { teorica, practica } = separarPorTipo(evaluaciones);

  return {
    teorica: analizarTipo(teorica),
    practica: analizarTipo(practica)
  };
}
