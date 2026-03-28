export default function IEEE754Form({
  numero,
  setNumero,
  base,
  setBase,
  precision,
  setPrecision,
  onConvertir,
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Entradas</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <div className="mb-2 text-sm font-medium">Número</div>
          <input
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 font-mono text-sm outline-none"
            placeholder="Ejemplo: 8d.f4"
          />
        </label>

        <label>
          <div className="mb-2 text-sm font-medium">Base de entrada</div>
          <input
            value={base}
            onChange={(e) => setBase(e.target.value)}
            type="number"
            min="2"
            max="36"
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none"
          />
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
      </div>

      <button
        onClick={onConvertir}
        className="mt-5 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white"
      >
        Convertir
      </button>
    </section>
  );
}