"use client";

import { useState } from "react";

export default function IEEE754PasoDetalle({
  titulo = "Ver proceso detallado",
  children,
  defaultOpen = false,
}) {
  const [abierto, setAbierto] = useState(defaultOpen);

  return (
    <div className="mt-4">
      <button
        onClick={() => setAbierto(!abierto)}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
      >
        <span
          className={`inline-block transition-transform ${
            abierto ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>
        {abierto ? "Ocultar proceso detallado" : titulo}
      </button>

      {abierto ? (
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}