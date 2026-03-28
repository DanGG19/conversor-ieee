"use client";

import { useState } from "react";

export default function IEEE754HexViewer({ grupos4Bits, hexPorGrupo }) {
  const [activo, setActivo] = useState(null);

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-zinc-900">
          Conversión a hexadecimal por grupos de 4 bits
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Pasa el cursor sobre un grupo binario o sobre su dígito hexadecimal.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Binario agrupado
        </div>

        <div className="flex flex-wrap gap-2">
          {grupos4Bits.map((grupo, i) => (
            <button
              key={`bin-${i}`}
              type="button"
              onMouseEnter={() => setActivo(i)}
              onMouseLeave={() => setActivo(null)}
              className={`rounded-xl border px-3 py-2 font-mono text-sm transition ${
                activo === i
                  ? "border-indigo-700 bg-indigo-700 text-white shadow-sm"
                  : "border-zinc-300 bg-white text-zinc-800"
              }`}
            >
              {grupo}
            </button>
          ))}
        </div>

        <div className="mt-5 mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Hexadecimal equivalente
        </div>

        <div className="flex flex-wrap gap-2">
          {hexPorGrupo.map((hex, i) => (
            <button
              key={`hex-${i}`}
              type="button"
              onMouseEnter={() => setActivo(i)}
              onMouseLeave={() => setActivo(null)}
              className={`rounded-xl border px-4 py-2 font-mono text-sm transition ${
                activo === i
                  ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
                  : "border-zinc-300 bg-white text-zinc-800"
              }`}
            >
              {hex}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}