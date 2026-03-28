import Campo from "./Campo";
import IEEE754HexViewer from "./IEEE754HexViewer";

function SegmentoBits({ titulo, valor, color }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${color}`}>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-80">
        {titulo}
      </div>
      <div className="font-mono text-sm break-all">{valor}</div>
    </div>
  );
}

export default function IEEE754Resumen({ resultado }) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Campo label="Entrada original" value={resultado.entradaOriginal} mono />
        <Campo label="Base" value={String(resultado.base)} />
        <Campo label="Precisión" value={resultado.precision} />
        <Campo label="Clasificación IEEE" value={resultado.clasificacion} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Campo label="Valor exacto" value={resultado.valorExacto} mono />
        <Campo label="Valor mixto" value={resultado.valorMixto} mono />
        <Campo label="Valor decimal" value={resultado.valorDecimal} mono />
        <Campo label="Hexadecimal final" value={`0x${resultado.hex}`} mono />
      </div>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Campos IEEE 754</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <SegmentoBits
            titulo="Signo"
            valor={resultado.signo}
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
              {resultado.signo}
            </span>
            <span className="text-zinc-400">|</span>
            <span className="rounded-lg bg-amber-100 px-3 py-2 text-amber-900">
              {resultado.exponenteBits}
            </span>
            <span className="text-zinc-400">|</span>
            <span className="rounded-lg bg-sky-100 px-3 py-2 text-sky-900 break-all">
              {resultado.mantisaBits}
            </span>
          </div>
        </div>
      </section>

      <IEEE754HexViewer
        grupos4Bits={resultado.grupos4Bits}
        hexPorGrupo={resultado.hexPorGrupo}
      />
    </section>
  );
}