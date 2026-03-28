export default function ProcesoTabla({
  titulo,
  subtitulo,
  columnas = [],
  filas = [],
  resultado,
}) {
  if (!filas || filas.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-4 py-3">
        <h4 className="text-sm font-semibold text-zinc-900">{titulo}</h4>
        {subtitulo ? (
          <p className="mt-1 text-xs text-zinc-500">{subtitulo}</p>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-zinc-100">
              {columnas.map((col, i) => (
                <th
                  key={i}
                  className="border-b border-zinc-200 px-4 py-3 text-left font-semibold text-zinc-700"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filas.map((fila, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white" : "bg-zinc-50/70"}
              >
                {fila.map((celda, j) => (
                  <td
                    key={j}
                    className="border-b border-zinc-100 px-4 py-3 font-mono text-zinc-800"
                  >
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {resultado ? (
        <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Resultado
          </div>
          <div className="mt-1 font-mono text-sm text-zinc-900">{resultado}</div>
        </div>
      ) : null}
    </div>
  );
}