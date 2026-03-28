export default function IEEE754InversoForm({
  patron,
  setPatron,
  formatoEntrada,
  setFormatoEntrada,
  precision,
  setPrecision,
  onInterpretar,
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Entradas IEEE 754</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="md:col-span-3">
          <div className="mb-2 text-sm font-medium">Patrón IEEE</div>
          <input
            value={patron}
            onChange={(e) => setPatron(e.target.value)}
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 font-mono text-sm outline-none"
            placeholder="Ejemplo binario: 00111101010101100000000000000000 | Ejemplo hex: 3D560000"
          />
        </label>

        <label>
          <div className="mb-2 text-sm font-medium">Formato de entrada</div>
          <select
            value={formatoEntrada}
            onChange={(e) => setFormatoEntrada(e.target.value)}
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none"
          >
            <option value="binario">Binario</option>
            <option value="hexadecimal">Hexadecimal</option>
          </select>
        </label>

        <label>
          <div className="mb-2 text-sm font-medium">Precisión</div>
          <select
            value={precision}
            onChange={(e) => setPrecision(e.target.value)}
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none"
          >
            <option value="simple">Simple (32 bits)</option>
            <option value="doble">Doble (64 bits)</option>
          </select>
        </label>

        <div className="flex items-end">
          <button
            onClick={onInterpretar}
            className="w-full rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Interpretar IEEE
          </button>
        </div>
      </div>
    </section>
  );
}