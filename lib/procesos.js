function gcd(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;

  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }

  return x;
}

function simplificar(num, den) {
  if (den === 0n) throw new Error("División entre cero.");
  if (num === 0n) return { num: 0n, den: 1n };

  const g = gcd(num, den);
  let n = num / g;
  let d = den / g;

  if (d < 0n) {
    n = -n;
    d = -d;
  }

  return { num: n, den: d };
}

function formFraccion(num, den) {
  const s = simplificar(num, den);
  if (s.den === 1n) return `${s.num}`;
  return `${s.num}/${s.den}`;
}

function limpiarSigno(texto) {
  return texto.replace(/^[+-]/, "").toUpperCase();
}

function valorDigitoBase36(c) {
  const DIGITOS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const i = DIGITOS.indexOf(c.toUpperCase());
  if (i === -1) throw new Error(`Dígito inválido: ${c}`);
  return i;
}

function rotuloDigito(c, d) {
  return /[A-Z]/i.test(c) ? `${c.toUpperCase()} (${d})` : `${c}`;
}

function normalizarBinarioDesdeGrupos(binEntera, binFrac) {
  let ent = binEntera.replace(/^0+/, "");
  if (!ent) ent = "0";

  let frac = (binFrac || "").replace(/0+$/, "");

  return frac ? `${ent}.${frac}` : ent;
}

export function generarTablaPotencias(valor, bits = 8) {
  const valores = [];
  const marcas = [];
  let restante = valor;

  for (let i = bits - 1; i >= 0; i--) {
    const pot = 2 ** i;
    valores.push(pot);

    if (restante >= pot) {
      marcas.push(1);
      restante -= pot;
    } else {
      marcas.push(0);
    }
  }

  return { valores, marcas };
}

export function construirSumaPotencias(valor, bits = 8) {
  const { valores, marcas } = generarTablaPotencias(valor, bits);
  const usados = valores.filter((_, i) => marcas[i] === 1);

  if (usados.length === 0) return `${valor} = 0`;
  return `${valor} = ${usados.join(" + ")}`;
}

export function detalleValorExactoVisual(texto, base, num, den) {
  const limpio = limpiarSigno(texto);
  const [parteEntera = "0", parteFrac = ""] = limpio.split(".");

  const filasEntera = [];
  const filasFrac = [];
  const filasComun = [];

  let sumaEntera = 0n;

  for (let i = 0; i < parteEntera.length; i++) {
    const c = parteEntera[i];
    const d = valorDigitoBase36(c);
    const exp = parteEntera.length - 1 - i;
    const contrib = BigInt(d) * (BigInt(base) ** BigInt(exp));
    sumaEntera += contrib;

    filasEntera.push([
      rotuloDigito(c, d),
      `${base}^${exp}`,
      `${d} × ${base}^${exp}`,
      `${contrib}`,
    ]);
  }

  const denominadorComun =
    parteFrac.length > 0 ? BigInt(base) ** BigInt(parteFrac.length) : 1n;

  let sumaFracNoSimplificada = 0n;

  for (let i = 0; i < parteFrac.length; i++) {
    const c = parteFrac[i];
    const d = valorDigitoBase36(c);
    const exp = i + 1;

    const denOriginal = BigInt(base) ** BigInt(exp);
    const numOriginal = BigInt(d);

    filasFrac.push([
      rotuloDigito(c, d),
      `${base}^-${exp}`,
      `${d} × ${base}^-${exp}`,
      `${numOriginal}/${denOriginal}`,
    ]);

    const factor = denominadorComun / denOriginal;
    const numEquivalente = numOriginal * factor;

    filasComun.push([
      `${numOriginal}/${denOriginal}`,
      `× ${factor}`,
      `${numEquivalente}/${denominadorComun}`,
    ]);

    sumaFracNoSimplificada += numEquivalente;
  }

  const fraccionSinSimplificar =
    parteFrac.length > 0
      ? `${sumaFracNoSimplificada}/${denominadorComun}`
      : "0/1";

  const fraccionSimplificada =
    parteFrac.length > 0
      ? formFraccion(sumaFracNoSimplificada, denominadorComun)
      : "0";

  const totalSinSimplificarNum =
    sumaEntera * denominadorComun + sumaFracNoSimplificada;

  const totalSinSimplificar =
    parteFrac.length > 0
      ? `${totalSinSimplificarNum}/${denominadorComun}`
      : `${sumaEntera}`;

  const totalSimplificado = `${num}/${den}`;

  const negativo = texto.trim().startsWith("-");
  const absNum = negativo ? -num : num;
  const enteroMixto = absNum / den;
  const restoMixto = absNum % den;

  return {
    tipo: "valorExacto",
    entera: {
      columnas: ["Dígito", "Potencia", "Expresión", "Aporte"],
      filas: filasEntera,
      resultado: `Suma parte entera = ${sumaEntera}`,
    },
    fraccionaria: {
      columnas: ["Dígito", "Potencia", "Expresión", "Aporte exacto"],
      filas: filasFrac,
      resultado:
        parteFrac.length > 0
          ? `Suma fraccionaria sin simplificar todavía = ${fraccionSinSimplificar}`
          : "No hay parte fraccionaria",
    },
    denominadorComun: {
      columnas: ["Fracción original", "Ajuste", "Fracción equivalente"],
      filas: filasComun,
      resultado:
        parteFrac.length > 0
          ? `Suma con denominador común = ${fraccionSinSimplificar}`
          : "No aplica",
    },
    resumen: [
      `Fracción fraccionaria sin simplificar = ${fraccionSinSimplificar}`,
      `Fracción fraccionaria simplificada = ${fraccionSimplificada}`,
      `Fracción total sin simplificar = ${totalSinSimplificar}`,
      `Fracción total simplificada = ${totalSimplificado}`,
      restoMixto === 0n
        ? `Valor mixto = ${negativo ? "-" : ""}${enteroMixto}`
        : `Valor mixto = ${negativo ? "-" : ""}${enteroMixto} ${restoMixto}/${den}`,
    ],
  };
}

export function detalleBinarioDirectoVisual(texto) {
  const limpio = limpiarSigno(texto);
  return {
    tipo: "grupos",
    titulo: "La entrada ya está en binario",
    subtitulo: "No hace falta convertir dígito por dígito.",
    columnas: ["Representación", "Valor"],
    filas: [["Binario", limpio]],
    resultado: limpio,
  };
}

export function detalleOctalABinarioVisual(texto) {
  const limpio = limpiarSigno(texto);
  const filas = [];

  for (const c of limpio) {
    if (c === ".") continue;
    const valor = parseInt(c, 8);
    const bits = valor.toString(2).padStart(3, "0");
    filas.push([c, bits]);
  }

  const [parteEntera = "", parteFrac = ""] = limpio.split(".");
  const binEntera = [...parteEntera]
    .map((c) => parseInt(c, 8).toString(2).padStart(3, "0"))
    .join("");
  const binFrac = [...parteFrac]
    .map((c) => parseInt(c, 8).toString(2).padStart(3, "0"))
    .join("");
  const armado = normalizarBinarioDesdeGrupos(binEntera, binFrac);

  return {
    tipo: "grupos",
    titulo: "Conversión octal → binario",
    subtitulo: "Cada dígito octal equivale a 3 bits.",
    columnas: ["Dígito octal", "Bits"],
    filas,
    resultado: armado,
  };
}

export function detalleHexABinarioVisual(texto) {
  const limpio = limpiarSigno(texto);
  const filas = [];

  for (const c of limpio) {
    if (c === ".") continue;
    const valor = parseInt(c, 16);
    const bits = valor.toString(2).padStart(4, "0");
    filas.push([c, bits]);
  }

  const [parteEntera = "", parteFrac = ""] = limpio.split(".");
  const binEntera = [...parteEntera]
    .map((c) => parseInt(c, 16).toString(2).padStart(4, "0"))
    .join("");
  const binFrac = [...parteFrac]
    .map((c) => parseInt(c, 16).toString(2).padStart(4, "0"))
    .join("");
  const armado = normalizarBinarioDesdeGrupos(binEntera, binFrac);

  return {
    tipo: "grupos",
    titulo: "Conversión hexadecimal → binario",
    subtitulo: "Cada dígito hexadecimal equivale a 4 bits.",
    columnas: ["Dígito hexadecimal", "Bits"],
    filas,
    resultado: armado,
  };
}

export function detalleExpansionBaseADecimalVisual(texto, base) {
  const limpio = limpiarSigno(texto);
  const [parteEntera = "0", parteFrac = ""] = limpio.split(".");

  const filasEntera = [];
  const filasFrac = [];

  for (let i = 0; i < parteEntera.length; i++) {
    const c = parteEntera[i];
    const d = valorDigitoBase36(c);
    const exp = parteEntera.length - 1 - i;
    const contrib = BigInt(d) * (BigInt(base) ** BigInt(exp));

    filasEntera.push([
      rotuloDigito(c, d),
      `${base}^${exp}`,
      `${d} × ${base}^${exp}`,
      `${contrib}`,
    ]);
  }

  for (let i = 0; i < parteFrac.length; i++) {
    const c = parteFrac[i];
    const d = valorDigitoBase36(c);
    const exp = i + 1;
    const den = BigInt(base) ** BigInt(exp);

    filasFrac.push([
      rotuloDigito(c, d),
      `${base}^-${exp}`,
      `${d} × ${base}^-${exp}`,
      formFraccion(BigInt(d), den),
    ]);
  }

  return {
    expansionEntera: {
      columnas: ["Dígito", "Potencia", "Expresión", "Aporte"],
      filas: filasEntera,
      resultado: filasEntera.length ? "Suma de los aportes de la parte entera" : null,
    },
    expansionFrac: {
      columnas: ["Dígito", "Potencia", "Expresión", "Aporte"],
      filas: filasFrac,
      resultado: filasFrac.length ? "Suma de los aportes de la parte fraccionaria" : null,
    },
  };
}

export function detalleDecimalABinarioVisual(num, den, maxPasos = 24) {
  const negativo = num < 0n;
  const absNum = negativo ? -num : num;

  const entero = absNum / den;
  const fracNum = absNum % den;

  const filasEntera = [];
  const filasFrac = [];

  if (entero === 0n) {
    filasEntera.push(["0", "2", "0", "0"]);
  } else {
    let n = entero;
    while (n > 0n) {
      const q = n / 2n;
      const r = n % 2n;
      filasEntera.push([`${n}`, "2", `${q}`, `${r}`]);
      n = q;
    }
  }

  const binEntera = entero === 0n ? "0" : filasEntera.map((f) => f[3]).reverse().join("");

  if (fracNum !== 0n) {
    let resto = fracNum;

    for (let i = 0; i < maxPasos && resto !== 0n; i++) {
      const productoNum = resto * 2n;
      const productoDen = den;

      const parteEntera = productoNum / productoDen;
      const nuevoResto = productoNum % productoDen;

      const productoTexto = `${productoNum}/${productoDen}`;
      const descompTexto =
        nuevoResto === 0n
          ? `${parteEntera}`
          : `${parteEntera} + ${nuevoResto}/${productoDen}`;

      filasFrac.push([
        `${resto}/${den}`,
        "× 2",
        productoTexto,
        descompTexto,
        `${parteEntera}`,
        nuevoResto === 0n ? "0" : `${nuevoResto}/${productoDen}`,
      ]);

      resto = nuevoResto;
    }
  }

  const binFrac = filasFrac.map((f) => f[4]).join("");
  const resultadoFinal = binFrac ? `${binEntera}.${binFrac}` : binEntera;

  return {
    tipo: "decimal",
    entero: {
      columnas: ["Dividendo", "Divisor", "Cociente", "Residuo"],
      filas: filasEntera,
      resultado: `Leyendo los residuos de abajo hacia arriba: ${binEntera}`,
    },
    fraccion: {
      columnas: [
        "Fracción actual",
        "Operación",
        "Producto",
        "Descomposición",
        "Bit",
        "Resto",
      ],
      filas: filasFrac,
      resultado: filasFrac.length
        ? `Bits obtenidos en orden: ${binFrac}`
        : "No hay parte fraccionaria",
    },
    resultadoFinal,
  };
}

export function detalleMantisa(mantisaBase, mantisaBits, bitsMantisa) {
  if (!mantisaBase && /^0+$/.test(mantisaBits)) {
    return [
      "Como el número es cero, la mantisa queda compuesta solo por ceros.",
      `Mantisa almacenada: ${mantisaBits}`,
    ];
  }

  const longitudBase = mantisaBase.length;
  const faltan = bitsMantisa - longitudBase;

  const padded = (mantisaBase + "0".repeat(bitsMantisa)).slice(0, bitsMantisa);

  return [
    "La mantisa se toma de la parte que queda después del 1 implícito de la normalización.",
    `Mantisa base: ${mantisaBase || "(vacía)"}`,
    `Bits actuales en la mantisa base: ${longitudBase}`,
    `Bits requeridos por la precisión: ${bitsMantisa}`,
    faltan > 0
      ? `Faltan ${faltan} bits, por eso se completa con ceros a la derecha.`
      : faltan < 0
      ? `Sobran ${Math.abs(faltan)} bits, por eso se recorta a ${bitsMantisa} bits.`
      : "La mantisa ya tiene exactamente la cantidad de bits requerida.",
    `Mantisa final: ${padded}`,
  ];
}

export function detalleAgrupacionHexVisual(grupos4Bits, hexPorGrupo) {
  const filas = grupos4Bits.map((grupo, i) => [grupo, hexPorGrupo[i]]);

  return {
    tipo: "grupos",
    titulo: "Agrupación nibble → hexadecimal",
    subtitulo: "Cada grupo de 4 bits equivale a 1 dígito hexadecimal.",
    columnas: ["Nibble binario", "Hex"],
    filas,
    resultado: hexPorGrupo.join(""),
  };
}

export function detalleNormalizacionVisual(
  binario,
  movimiento,
  normalizada,
  exponenteReal,
  clasificacion
) {
  if (clasificacion === "cero") {
    return {
      tipo: "normalizacion",
      titulo: "Normalización del valor",
      subtitulo: "El cero no se normaliza en la forma 1.x × 2^n.",
      columnas: ["Concepto", "Valor"],
      filas: [
        ["Binario original", binario],
        ["Clasificación", "Cero"],
        ["Forma normalizada", "No aplica"],
        ["Exponente real", "No aplica"],
      ],
      resultado: "En IEEE 754, para el cero: exponente = 0 y mantisa = 0.",
    };
  }

  return {
    tipo: "normalizacion",
    titulo: "Proceso de normalización",
    subtitulo: "Se mueve el punto binario hasta dejar un solo 1 a la izquierda.",
    columnas: ["Concepto", "Valor"],
    filas: [
      ["Binario original", binario],
      ["Movimiento del punto", movimiento],
      ["Forma normalizada", normalizada],
      ["Exponente real", `${exponenteReal}`],
    ],
    resultado: `Resultado normalizado: ${normalizada}`,
  };
}

export function detalleMantisaVisual(
  normalizada,
  mantisaBase,
  mantisaBits,
  bitsMantisa,
  precision,
  clasificacion
) {
  if (clasificacion === "cero") {
    return {
      tipo: "mantisa",
      titulo: "Construcción de la mantisa",
      subtitulo: "Para el cero, la mantisa se almacena toda en ceros.",
      columnas: ["Concepto", "Valor"],
      filas: [
        ["Forma normalizada", "0"],
        ["1 implícito", "No aplica"],
        ["Mantisa base", "(vacía)"],
        ["Bits requeridos", `${bitsMantisa}`],
        ["Acción", "Llenar con ceros"],
        ["Mantisa final", mantisaBits],
      ],
      resultado: `Mantisa almacenada = ${mantisaBits}`,
    };
  }

  const longitudBase = mantisaBase.length;
  const faltan = bitsMantisa - longitudBase;

  let accion = "No se modifica";
  if (faltan > 0) {
    accion = `Completar con ${faltan} cero(s) a la derecha`;
  } else if (faltan < 0) {
    accion = `Recortar ${Math.abs(faltan)} bit(s) sobrante(s)`;
  }

  return {
    tipo: "mantisa",
    titulo: "Construcción de la mantisa",
    subtitulo: `En precisión ${precision}, la mantisa debe ocupar ${bitsMantisa} bits.`,
    columnas: ["Concepto", "Valor"],
    filas: [
      ["Forma normalizada", normalizada],
      ["Se elimina el 1 implícito", "Sí"],
      ["Mantisa base", mantisaBase || "(vacía)"],
      ["Bits actuales", `${longitudBase}`],
      ["Bits requeridos", `${bitsMantisa}`],
      ["Acción", accion],
      ["Mantisa final", mantisaBits],
    ],
    resultado: `Mantisa almacenada = ${mantisaBits}`,
  };
}