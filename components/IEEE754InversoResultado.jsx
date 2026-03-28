import Campo from "./Campo";
import IEEE754HexViewer from "./IEEE754HexViewer";
import IEEE754ExponentTable from "./IEEE754ExponentTable";

function BloqueLinea({ children }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2 font-mono text-sm text-zinc-800 shadow-sm ring-1 ring-zinc-200">
      {children}
    </div>
  );
}

function SegmentoBits({ titulo, valor, color }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${color}`}>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-80">
        {titulo}
      </div>
      <div className="break-all font-mono text-sm">{valor}</div>
    </div>
  );
}

function construirTablaPotencias(valor, bits) {
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

function Paso({ titulo, lineas, extra }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:p-5">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900">{titulo}</h3>
      <div className="space-y-2">
        {lineas.map((linea, i) => (
          <BloqueLinea key={i}>{linea}</BloqueLinea>
        ))}
      </div>
      {extra ? <div className="mt-5">{extra}</div> : null}
    </div>
  );
}

export default function IEEE754InversoResultado({ resultado }) {
  const bitsExp = resultado.precision === "simple" ? 8 : 11;
  const tablaExp = construirTablaPotencias(
    resultado.exponenteAlmacenadoDecimal,
    bitsExp
  );

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Campo label="Entrada original" value={resultado.entradaOriginal} mono />
        <Campo label="Formato de entrada" value={resultado.formatoEntrada} />
        <Campo label="Precisión" value={resultado.precision} />
        <Campo label="Clasificación IEEE" value={resultado.clasificacion} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Campo label="Bits completos" value={resultado.bits} mono />
        <Campo label="Hexadecimal normalizado" value={`0x${resultado.hex}`} mono />
        <Campo
          label="Valor decimal aproximado"
          value={resultado.valorDecimalAprox}
          mono
        />
        <Campo
          label="Fracción exacta"
          value={resultado.fraccionExacta ?? "No aplica"}
          mono
        />
      </div>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Campos IEEE 754</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <SegmentoBits
            titulo="Signo"
            valor={resultado.signoBit}
            color="border-rose-200 bg-rose-50 text-rose-900"
          />
          <SegmentoBits
            titulo="Exponente"
            valor={resultado.exponenteBits}
            color="border-amber-200 bg-amber-50 text-amber-900"
          />
          <SegmentoBits
            titulo="Mantisa"
            valor={resultado.mantisaBits}
            color="border-sky-200 bg-sky-50 text-sky-900"
          />
        </div>

        <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Unión final
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
            <span className="rounded-lg bg-rose-100 px-3 py-2 text-rose-900">
              {resultado.signoBit}
            </span>
            <span className="text-zinc-400">|</span>
            <span className="rounded-lg bg-amber-100 px-3 py-2 text-amber-900">
              {resultado.exponenteBits}
            </span>
            <span className="text-zinc-400">|</span>
            <span className="break-all rounded-lg bg-sky-100 px-3 py-2 text-sky-900">
              {resultado.mantisaBits}
            </span>
          </div>
        </div>
      </section>

      <IEEE754HexViewer
        grupos4Bits={resultado.grupos4Bits}
        hexPorGrupo={resultado.hexPorGrupo}
      />

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-zinc-900">
          Procedimiento paso a paso
        </h2>
        <p className="mb-6 text-sm text-zinc-500">
          Aquí se reconstruye el valor normal a partir del patrón IEEE 754.
        </p>

        <div className="space-y-5">
          <Paso
            titulo="Paso 1. Normalizar la entrada"
            lineas={[
              `Entrada original: ${resultado.entradaOriginal}`,
              `Formato recibido: ${resultado.formatoEntrada}`,
              `Bits completos: ${resultado.bits}`,
              `Hexadecimal equivalente: 0x${resultado.hex}`,
            ]}
          />

          <Paso
            titulo="Paso 2. Separar signo, exponente y mantisa"
            lineas={[
              `Signo = ${resultado.signoBit}`,
              `Exponente = ${resultado.exponenteBits}`,
              `Mantisa = ${resultado.mantisaBits}`,
            ]}
          />

          <Paso
            titulo="Paso 3. Interpretar el signo"
            lineas={[
              resultado.signoBit === "0"
                ? "Como el bit de signo es 0, el número es positivo."
                : "Como el bit de signo es 1, el número es negativo.",
              `Signo interpretado: ${resultado.signoInterpretado}`,
            ]}
          />

          <Paso
            titulo="Paso 4. Interpretar el exponente"
            lineas={[
              `Exponente almacenado en binario: ${resultado.exponenteBits}`,
              `Exponente almacenado en decimal: ${resultado.exponenteAlmacenadoDecimal}`,
              `Sesgo usado: ${resultado.sesgo}`,
              `Exponente real: ${
                resultado.exponenteReal === null
                  ? "No aplica"
                  : resultado.exponenteReal
              }`,
            ]}
            extra={
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-zinc-900">
                    Construcción visual del exponente almacenado
                  </h4>
                  <p className="mt-1 text-xs text-zinc-500">
                    Se marcan las potencias de 2 que componen el exponente almacenado.
                  </p>
                </div>

                <IEEE754ExponentTable
                  valores={tablaExp.valores}
                  marcas={tablaExp.marcas}
                />
              </div>
            }
          />

          <Paso
            titulo="Paso 5. Reconstruir el significando"
            lineas={[
              `Clasificación: ${resultado.clasificacion}`,
              `Significando binario: ${resultado.significandoBinario}`,
              resultado.clasificacion === "normal"
                ? "Como es un número normal, el significando empieza con 1."
                : resultado.clasificacion === "subnormal"
                ? "Como es subnormal, el significando empieza con 0."
                : "El significando no se interpreta de forma normal en este caso.",
            ]}
          />

          <Paso
            titulo="Paso 6. Reconstruir el valor"
            lineas={[
              `Fórmula: ${resultado.formula}`,
              `Fracción exacta: ${resultado.fraccionExacta ?? "No aplica"}`,
              `Valor mixto: ${resultado.fraccionMixta ?? "No aplica"}`,
              `Valor decimal aproximado: ${resultado.valorDecimalAprox}`,
            ]}
          />
        </div>
      </section>
    </section>
  );
}