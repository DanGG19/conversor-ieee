import {
  generarTablaPotencias,
  construirSumaPotencias,
  detalleValorExactoVisual,
  detalleBinarioDirectoVisual,
  detalleOctalABinarioVisual,
  detalleHexABinarioVisual,
  detalleExpansionBaseADecimalVisual,
  detalleDecimalABinarioVisual,
  detalleMantisa,
  detalleMantisaVisual,
  detalleAgrupacionHexVisual,
  detalleNormalizacionVisual,
} from "./procesos";

const DIGITOS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function valorDigito(c) {
  const i = DIGITOS.indexOf(c.toUpperCase());
  if (i === -1) throw new Error(`Dígito inválido: ${c}`);
  return i;
}

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

function parsearNumeroBase(cadena, base) {
  if (!(base >= 2 && base <= 36)) {
    throw new Error("La base debe estar entre 2 y 36.");
  }

  let s = cadena.trim().toUpperCase();
  if (!s) throw new Error("Ingresa un número.");

  let signo = 1n;
  if (s.startsWith("-")) {
    signo = -1n;
    s = s.slice(1);
  } else if (s.startsWith("+")) {
    s = s.slice(1);
  }

  if ((s.match(/\./g) || []).length > 1) {
    throw new Error("El número tiene más de un punto decimal.");
  }

  const [parteEntera = "0", parteFrac = ""] = s.split(".");
  const baseBig = BigInt(base);

  let entero = 0n;
  for (const c of parteEntera || "0") {
    const d = valorDigito(c);
    if (d >= base) throw new Error(`El dígito '${c}' no es válido para base ${base}.`);
    entero = entero * baseBig + BigInt(d);
  }

  let fracNum = 0n;
  let fracDen = 1n;
  for (const c of parteFrac) {
    const d = valorDigito(c);
    if (d >= base) throw new Error(`El dígito '${c}' no es válido para base ${base}.`);
    fracNum = fracNum * baseBig + BigInt(d);
    fracDen *= baseBig;
  }

  return simplificar(signo * (entero * fracDen + fracNum), fracDen);
}

function fraccionAMixto(num, den) {
  const negativo = num < 0n;
  const absNum = negativo ? -num : num;

  const entero = absNum / den;
  const resto = absNum % den;

  if (resto === 0n) return `${negativo ? "-" : ""}${entero}`;
  return `${negativo ? "-" : ""}${entero} ${resto}/${den}`;
}

function fraccionADecimal(num, den, max = 25) {
  const negativo = num < 0n;
  const absNum = negativo ? -num : num;

  const entero = absNum / den;
  let resto = absNum % den;

  if (resto === 0n) return `${negativo ? "-" : ""}${entero}`;

  let dec = "";
  for (let i = 0; i < max && resto !== 0n; i++) {
    resto *= 10n;
    dec += (resto / den).toString();
    resto %= den;
  }

  return `${negativo ? "-" : ""}${entero}.${dec}`;
}

function fraccionABinario(num, den, maxBits = 64) {
  const negativo = num < 0n;
  const absNum = negativo ? -num : num;

  const entero = absNum / den;
  let resto = absNum % den;
  let frac = "";

  for (let i = 0; i < maxBits && resto !== 0n; i++) {
    resto *= 2n;
    if (resto >= den) {
      frac += "1";
      resto -= den;
    } else {
      frac += "0";
    }
  }

  return `${negativo ? "-" : ""}${entero.toString(2)}${frac ? "." + frac : ""}`;
}

function normalizarBinario(binario) {
  const negativo = binario.startsWith("-");
  const limpio = negativo ? binario.slice(1) : binario;
  const [entera, frac = ""] = limpio.split(".");

  if (/^0+$/.test(entera)) {
    const firstOne = frac.indexOf("1");

    if (firstOne === -1) {
      return {
        movimiento: "No hay normalización porque el valor es cero.",
        normalizada: "0",
        exponenteReal: null,
        mantisaBase: "",
      };
    }

    const exp = -(firstOne + 1);
    const mantisaBase = frac.slice(firstOne + 1);

    return {
      movimiento: `Se movió el punto ${firstOne + 1} lugar(es) a la derecha.`,
      normalizada: `${negativo ? "-" : ""}1.${mantisaBase} × 2^${exp}`,
      exponenteReal: exp,
      mantisaBase,
    };
  }

  const exp = entera.length - 1;
  const mantisaBase = entera.slice(1) + frac;

  return {
    movimiento: `Se movió el punto ${exp} lugar(es) a la izquierda.`,
    normalizada: `${negativo ? "-" : ""}1.${mantisaBase} × 2^${exp}`,
    exponenteReal: exp,
    mantisaBase,
  };
}

function empaquetarIEEE(valor, precision) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  if (precision === "simple") {
    view.setFloat32(0, valor, false);
    const u32 = view.getUint32(0, false);

    return {
      bits: u32.toString(2).padStart(32, "0"),
      hex: u32.toString(16).toUpperCase().padStart(8, "0"),
      sesgo: 127,
      bitsExponente: 8,
      bitsMantisa: 23,
    };
  }

  view.setFloat64(0, valor, false);
  const hi = view.getUint32(0, false);
  const lo = view.getUint32(4, false);

  return {
    bits: hi.toString(2).padStart(32, "0") + lo.toString(2).padStart(32, "0"),
    hex:
      hi.toString(16).toUpperCase().padStart(8, "0") +
      lo.toString(16).toUpperCase().padStart(8, "0"),
    sesgo: 1023,
    bitsExponente: 11,
    bitsMantisa: 52,
  };
}

function agruparBitsDe4(bits) {
  return bits.match(/.{1,4}/g) ?? [];
}

function analizarClasificacion(bits, bitsExponente) {
  const exponenteBits = bits.slice(1, 1 + bitsExponente);
  const mantisaBits = bits.slice(1 + bitsExponente);
  const exponenteDecimal = parseInt(exponenteBits, 2);
  const maxExp = 2 ** bitsExponente - 1;

  if (exponenteDecimal === 0 && /^0+$/.test(mantisaBits)) return "cero";
  if (exponenteDecimal === 0) return "subnormal";
  if (exponenteDecimal === maxExp && /^0+$/.test(mantisaBits)) return "infinito";
  if (exponenteDecimal === maxExp) return "NaN";
  return "normal";
}

function construirVisualValorExacto(entradaOriginal, base, num, den) {
  return detalleValorExactoVisual(entradaOriginal, base, num, den);
}

function construirVisualConversion(entradaOriginal, base, num, den) {
  if (base === 2) {
    return detalleBinarioDirectoVisual(entradaOriginal);
  }

  if (base === 10) {
    return detalleDecimalABinarioVisual(num, den, 24);
  }

  if (base === 8) {
    const directo = detalleOctalABinarioVisual(entradaOriginal);
    const expansion = detalleExpansionBaseADecimalVisual(entradaOriginal, base);
    const decimal = detalleDecimalABinarioVisual(num, den, 24);

    return {
      tipo: "mixto",
      directo,
      ...expansion,
      decimal,
      resultadoFinal: decimal.resultadoFinal,
    };
  }

  if (base === 16) {
    const directo = detalleHexABinarioVisual(entradaOriginal);
    const expansion = detalleExpansionBaseADecimalVisual(entradaOriginal, base);
    const decimal = detalleDecimalABinarioVisual(num, den, 24);

    return {
      tipo: "mixto",
      directo,
      ...expansion,
      decimal,
      resultadoFinal: decimal.resultadoFinal,
    };
  }

  const expansion = detalleExpansionBaseADecimalVisual(entradaOriginal, base);
  const decimal = detalleDecimalABinarioVisual(num, den, 24);

  return {
    tipo: "mixto",
    ...expansion,
    decimal,
    resultadoFinal: decimal.resultadoFinal,
  };
}

function construirDetalleNormalizacion(data) {
  if (data.clasificacion === "cero") {
    return [
      "El valor es cero.",
      "No se normaliza como 1.x × 2^n.",
      "En IEEE 754: exponente = 0 y mantisa = 0.",
    ];
  }

  return [
    `Se parte de: ${data.binario}`,
    data.movimiento,
    `Forma normalizada: ${data.normalizada}`,
    `Exponente real: ${data.exponenteReal}`,
  ];
}

function construirDetalleExponente(data) {
  if (data.clasificacion === "cero") {
    return [
      "Para el cero, el exponente almacenado se guarda todo en ceros.",
      `Exponente en binario: ${data.exponenteBits}`,
    ];
  }

  return [
    `Sesgo de la precisión ${data.precision}: ${data.sesgo}`,
    `Exponente real: ${data.exponenteReal}`,
    `Exponente almacenado = ${data.exponenteReal} + ${data.sesgo} = ${data.exponenteDecimal}`,
    construirSumaPotencias(
      data.exponenteDecimal,
      data.precision === "simple" ? 8 : 11
    ),
    `Exponente en binario: ${data.exponenteBits}`,
  ];
}

function construirDetalleUnionFinal(data) {
  return [
    `Signo: ${data.signo}`,
    `Exponente: ${data.exponenteBits}`,
    `Mantisa: ${data.mantisaBits}`,
    `Bits completos: ${data.bits}`,
  ];
}

function construirPasos(data, bitsMantisa) {
  return [
    {
      titulo: "Entrada",
      lineas: [
        `Número ingresado: ${data.entradaOriginal}`,
        `Base: ${data.base}`,
        `Precisión: ${data.precision}`,
      ],
    },
    {
      titulo: "Valor exacto",
      lineas: [
        `Fracción exacta: ${data.valorExacto}`,
        `Valor mixto: ${data.valorMixto}`,
        `Valor decimal: ${data.valorDecimal}`,
      ],
      visual: construirVisualValorExacto(data.entradaOriginal, data.base, data.num, data.den),
    },
    {
      titulo: "Conversión a binario",
      lineas: [`Forma binaria: ${data.binario}`],
      visual: construirVisualConversion(
        data.entradaOriginal,
        data.base,
        data.num,
        data.den
      ),
    },
     {
      titulo: "Normalización",
      lineas: [
        data.movimiento,
        `Forma normalizada: ${data.normalizada}`,
        `Exponente real: ${data.exponenteReal ?? "No aplica"}`,
      ],
      detalle: construirDetalleNormalizacion(data),
      visual: detalleNormalizacionVisual(
        data.binario,
        data.movimiento,
        data.normalizada,
        data.exponenteReal,
        data.clasificacion
      ),
    },
    {
      titulo: "Signo",
      lineas: [
        data.signo === "0"
          ? "El número es positivo, por lo tanto signo = 0."
          : "El número es negativo, por lo tanto signo = 1.",
      ],
      detalle: [
        "IEEE 754 no usa complemento a dos para formar el patrón final completo.",
        "Solo se usa un bit de signo.",
        "0 = positivo",
        "1 = negativo",
      ],
    },
    {
      titulo: "Exponente",
      lineas: [
        `Sesgo usado: ${data.sesgo}`,
        `Exponente almacenado (decimal): ${data.exponenteDecimal}`,
        `Exponente en binario: ${data.exponenteBits}`,
      ],
      detalle: construirDetalleExponente(data),
      tablaExponente: {
        valores: generarTablaPotencias(
          data.exponenteDecimal,
          data.precision === "simple" ? 8 : 11
        ).valores,
        marcas: generarTablaPotencias(
          data.exponenteDecimal,
          data.precision === "simple" ? 8 : 11
        ).marcas,
      },
    },
    {
      titulo: "Mantisa",
      lineas: [
        `Mantisa base: ${data.mantisaBase || "(vacía)"}`,
        `Mantisa almacenada: ${data.mantisaBits}`,
      ],
      detalle: detalleMantisa(data.mantisaBase, data.mantisaBits, bitsMantisa),
      visual: detalleMantisaVisual(
        data.normalizada,
        data.mantisaBase,
        data.mantisaBits,
        bitsMantisa,
        data.precision,
        data.clasificacion
      ),
    },
    {
      titulo: "Unión final",
      lineas: [`${data.signo} | ${data.exponenteBits} | ${data.mantisaBits}`],
      detalle: construirDetalleUnionFinal(data),
    },
    {
      titulo: "Conversión a hexadecimal",
      lineas: [
        `Bits agrupados: ${data.grupos4Bits.join(" | ")}`,
        `Equivalencia hex: ${data.hexPorGrupo.join(" | ")}`,
        `Resultado final: 0x${data.hex}`,
      ],
      visual: detalleAgrupacionHexVisual(data.grupos4Bits, data.hexPorGrupo),
    },
  ];
}

export function convertirIEEE754(entradaOriginal, base, precision) {
  const { num, den } = parsearNumeroBase(entradaOriginal, base);

  const valorExacto = `${num}/${den}`;
  const valorMixto = fraccionAMixto(num, den);
  const valorDecimal = fraccionADecimal(num, den);
  const binario = fraccionABinario(num, den, 64);
  const normal = normalizarBinario(binario);

  const valorJS = Number(num) / Number(den);
  const ieee = empaquetarIEEE(valorJS, precision);

  const bits = ieee.bits;
  const signo = bits[0];
  const exponenteBits = bits.slice(1, 1 + ieee.bitsExponente);
  const mantisaBits = bits.slice(1 + ieee.bitsExponente);
  const exponenteDecimal = parseInt(exponenteBits, 2);
  const grupos4Bits = agruparBitsDe4(bits);
  const hexPorGrupo = grupos4Bits.map((n) => parseInt(n, 2).toString(16).toUpperCase());
  const clasificacion = analizarClasificacion(bits, ieee.bitsExponente);

  const data = {
    entradaOriginal,
    base,
    precision,
    num,
    den,
    valorExacto,
    valorMixto,
    valorDecimal,
    binario,
    movimiento: normal.movimiento,
    normalizada: normal.normalizada,
    exponenteReal: normal.exponenteReal,
    mantisaBase: normal.mantisaBase,
    bits,
    signo,
    exponenteBits,
    exponenteDecimal,
    mantisaBits,
    sesgo: ieee.sesgo,
    hex: ieee.hex,
    grupos4Bits,
    hexPorGrupo,
    clasificacion,
  };

  return {
    ...data,
    pasos: construirPasos(data, ieee.bitsMantisa),
  };
}

function limpiarEntradaIEEE(texto, formatoEntrada) {
  let s = texto.trim().toUpperCase();

  s = s.replace(/\s+/g, "");
  s = s.replace(/\|/g, "");
  s = s.replace(/_/g, "");

  if (formatoEntrada === "hexadecimal") {
    s = s.replace(/^0X/, "");
  }

  return s;
}

function bitsAHex(bits) {
  const totalHex = bits.length / 4;
  const valor = BigInt(`0b${bits}`);
  return valor.toString(16).toUpperCase().padStart(totalHex, "0");
}

function hexABits(hex, totalBits) {
  const valor = BigInt(`0x${hex}`);
  return valor.toString(2).padStart(totalBits, "0");
}

function bitsANumber(bits, precision) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);

  if (precision === "simple") {
    const u32 = parseInt(bits, 2);
    view.setUint32(0, u32, false);
    return view.getFloat32(0, false);
  }

  const hi = parseInt(bits.slice(0, 32), 2);
  const lo = parseInt(bits.slice(32), 2);

  view.setUint32(0, hi, false);
  view.setUint32(4, lo, false);

  return view.getFloat64(0, false);
}

function formatearNumeroJS(valor) {
  if (Number.isNaN(valor)) return "NaN";
  if (valor === Infinity) return "Infinity";
  if (valor === -Infinity) return "-Infinity";
  return valor.toString();
}

function fraccionExactaDesdeIEEE(signoBit, mantisaBits, exponenteReal, clasificacion) {
  const bitsMantisa = mantisaBits.length;
  const mantisaInt =
    mantisaBits.length > 0 ? BigInt(`0b${mantisaBits}`) : 0n;

  if (clasificacion === "cero") {
    return { num: 0n, den: 1n };
  }

  if (clasificacion === "infinito" || clasificacion === "NaN") {
    return null;
  }

  let num;
  let den = 1n << BigInt(bitsMantisa);

  if (clasificacion === "normal") {
    num = (1n << BigInt(bitsMantisa)) + mantisaInt;
  } else {
    num = mantisaInt;
  }

  if (exponenteReal > 0) {
    num = num << BigInt(exponenteReal);
  } else if (exponenteReal < 0) {
    den = den << BigInt(-exponenteReal);
  }

  if (signoBit === "1") {
    num = -num;
  }

  return simplificar(num, den);
}

export function interpretarIEEE754(
  entradaOriginal,
  formatoEntrada,
  precision
) {
  const totalBits = precision === "simple" ? 32 : 64;
  const totalHex = totalBits / 4;
  const bitsExponente = precision === "simple" ? 8 : 11;
  const bitsMantisa = precision === "simple" ? 23 : 52;
  const sesgo = precision === "simple" ? 127 : 1023;

  const limpia = limpiarEntradaIEEE(entradaOriginal, formatoEntrada);

  let bits;
  let hex;

  if (formatoEntrada === "binario") {
    if (!/^[01]+$/.test(limpia)) {
      throw new Error("La entrada binaria solo puede contener 0 y 1.");
    }
    if (limpia.length !== totalBits) {
      throw new Error(
        `Para precisión ${precision}, la entrada binaria debe tener exactamente ${totalBits} bits.`
      );
    }
    bits = limpia;
    hex = bitsAHex(bits);
  } else {
    if (!/^[0-9A-F]+$/.test(limpia)) {
      throw new Error("La entrada hexadecimal solo puede contener 0-9 y A-F.");
    }
    if (limpia.length !== totalHex) {
      throw new Error(
        `Para precisión ${precision}, la entrada hexadecimal debe tener exactamente ${totalHex} dígitos.`
      );
    }
    hex = limpia;
    bits = hexABits(hex, totalBits);
  }

  const signoBit = bits[0];
  const exponenteBits = bits.slice(1, 1 + bitsExponente);
  const mantisaBits = bits.slice(1 + bitsExponente);

  const exponenteAlmacenadoDecimal = parseInt(exponenteBits, 2);
  const maxExp = 2 ** bitsExponente - 1;

  let clasificacion = "normal";
  let exponenteReal = null;
  let significandoBinario = null;
  let formula = null;

  if (exponenteAlmacenadoDecimal === 0 && /^0+$/.test(mantisaBits)) {
    clasificacion = "cero";
    significandoBinario = "0";
    formula = "0";
  } else if (exponenteAlmacenadoDecimal === 0) {
    clasificacion = "subnormal";
    exponenteReal = 1 - sesgo;
    significandoBinario = `0.${mantisaBits}`;
    formula = `(-1)^${signoBit} × 0.${mantisaBits} × 2^(${exponenteReal})`;
  } else if (exponenteAlmacenadoDecimal === maxExp && /^0+$/.test(mantisaBits)) {
    clasificacion = "infinito";
    formula = signoBit === "1" ? "-Infinity" : "Infinity";
  } else if (exponenteAlmacenadoDecimal === maxExp) {
    clasificacion = "NaN";
    formula = "NaN";
  } else {
    clasificacion = "normal";
    exponenteReal = exponenteAlmacenadoDecimal - sesgo;
    significandoBinario = `1.${mantisaBits}`;
    formula = `(-1)^${signoBit} × 1.${mantisaBits} × 2^(${exponenteReal})`;
  }

  const valorNumber = bitsANumber(bits, precision);
  const valorDecimalAprox = formatearNumeroJS(valorNumber);

  const fraccion = fraccionExactaDesdeIEEE(
    signoBit,
    mantisaBits,
    exponenteReal ?? 0,
    clasificacion
  );

  const fraccionExacta = fraccion ? `${fraccion.num}/${fraccion.den}` : null;
  const fraccionMixta = fraccion ? fraccionAMixto(fraccion.num, fraccion.den) : null;

  const grupos4Bits = agruparBitsDe4(bits);
  const hexPorGrupo = grupos4Bits.map((grupo) =>
    parseInt(grupo, 2).toString(16).toUpperCase()
  );

  return {
    entradaOriginal,
    formatoEntrada,
    precision,
    bits,
    hex,
    grupos4Bits,
    hexPorGrupo,
    signoBit,
    exponenteBits,
    mantisaBits,
    signoInterpretado: signoBit === "0" ? "Positivo" : "Negativo",
    exponenteAlmacenadoDecimal,
    exponenteReal,
    sesgo,
    clasificacion,
    significandoBinario,
    formula,
    fraccionExacta,
    fraccionMixta,
    valorDecimalAprox,
  };
}