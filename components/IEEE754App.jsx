"use client";

import { useState } from "react";
import IEEE754Form from "./IEEE754Form";
import IEEE754Resumen from "./IEEE754Resumen";
import IEEE754Pasos from "./IEEE754Pasos";
import IEEE754InversoForm from "./IEEE754InversoForm";
import IEEE754InversoResultado from "./IEEE754InversoResultado";
import { convertirIEEE754, interpretarIEEE754 } from "@/lib/ieee754";

export default function IEEE754App() {
  const [modo, setModo] = useState("directo");

  const [numero, setNumero] = useState("8d.f4");
  const [base, setBase] = useState("16");
  const [precision, setPrecision] = useState("simple");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const [patron, setPatron] = useState("3D560000");
  const [formatoEntrada, setFormatoEntrada] = useState("hexadecimal");
  const [precisionInversa, setPrecisionInversa] = useState("simple");
  const [resultadoInverso, setResultadoInverso] = useState(null);
  const [errorInverso, setErrorInverso] = useState("");

  const manejarConvertir = () => {
    try {
      setError("");
      const res = convertirIEEE754(numero, Number(base), precision);
      setResultado(res);
    } catch (e) {
      setResultado(null);
      setError(e.message || "Ocurrió un error.");
    }
  };

  const manejarInterpretar = () => {
    try {
      setErrorInverso("");
      const res = interpretarIEEE754(patron, formatoEntrada, precisionInversa);
      setResultadoInverso(res);
    } catch (e) {
      setResultadoInverso(null);
      setErrorInverso(e.message || "Ocurrió un error.");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold md:text-3xl">Conversor IEEE 754</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Conversor didáctico con procedimiento paso a paso, detalle visual,
            agrupación hexadecimal y modo inverso.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setModo("directo")}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                modo === "directo"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 bg-white text-zinc-700"
              }`}
            >
              Normal → IEEE 754
            </button>

            <button
              onClick={() => setModo("inverso")}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                modo === "inverso"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-300 bg-white text-zinc-700"
              }`}
            >
              IEEE 754 → Normal
            </button>
          </div>
        </section>

        {modo === "directo" ? (
          <>
            <IEEE754Form
              numero={numero}
              setNumero={setNumero}
              base={base}
              setBase={setBase}
              precision={precision}
              setPrecision={setPrecision}
              onConvertir={manejarConvertir}
            />

            {error && (
              <section className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">
                {error}
              </section>
            )}

            {resultado && (
              <>
                <IEEE754Resumen resultado={resultado} />
                <IEEE754Pasos resultado={resultado} />
              </>
            )}
          </>
        ) : (
          <>
            <IEEE754InversoForm
              patron={patron}
              setPatron={setPatron}
              formatoEntrada={formatoEntrada}
              setFormatoEntrada={setFormatoEntrada}
              precision={precisionInversa}
              setPrecision={setPrecisionInversa}
              onInterpretar={manejarInterpretar}
            />

            {errorInverso && (
              <section className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">
                {errorInverso}
              </section>
            )}

            {resultadoInverso && (
              <IEEE754InversoResultado resultado={resultadoInverso} />
            )}
          </>
        )}
      </div>
    </main>
  );
}