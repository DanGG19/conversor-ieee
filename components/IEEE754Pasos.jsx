import IEEE754PasoDetalle from "./IEEE754PasoDetalle";
import IEEE754ExponentTable from "./IEEE754ExponentTable";
import ProcesoTabla from "./ProcesoTabla";

function BloqueLinea({ children }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2 font-mono text-sm text-zinc-800 shadow-sm ring-1 ring-zinc-200">
      {children}
    </div>
  );
}

function renderVisual(visual) {
  if (!visual) return null;

  if (visual.tipo === "grupos") {
    return (
      <ProcesoTabla
        titulo={visual.titulo}
        subtitulo={visual.subtitulo}
        columnas={visual.columnas}
        filas={visual.filas}
        resultado={visual.resultado}
      />
    );
  }

  if (visual.tipo === "decimal") {
    return (
      <div className="space-y-5">
        {visual.entero?.filas?.length ? (
          <ProcesoTabla
            titulo="Parte entera por divisiones sucesivas"
            subtitulo="Se divide entre 2 y el residuo es el bit obtenido en cada paso."
            columnas={visual.entero.columnas}
            filas={visual.entero.filas}
            resultado={visual.entero.resultado}
          />
        ) : null}

        {visual.fraccion?.filas?.length ? (
          <ProcesoTabla
            titulo="Parte fraccionaria por multiplicaciones sucesivas"
            subtitulo="Se multiplica por 2 y la parte entera obtenida forma cada bit."
            columnas={visual.fraccion.columnas}
            filas={visual.fraccion.filas}
            resultado={visual.fraccion.resultado}
          />
        ) : null}

        {visual.resultadoFinal ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Binario obtenido
            </div>
            <div className="mt-1 font-mono text-sm text-emerald-900">
              {visual.resultadoFinal}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (visual.tipo === "mixto") {
    return (
      <div className="space-y-6">
        {visual.directo ? (
          <ProcesoTabla
            titulo={visual.directo.titulo}
            subtitulo={visual.directo.subtitulo}
            columnas={visual.directo.columnas}
            filas={visual.directo.filas}
            resultado={visual.directo.resultado}
          />
        ) : null}

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="mb-3 text-sm font-semibold text-zinc-900">
            Método alternativo: pasar primero a decimal y luego a binario
          </div>

          <div className="space-y-5">
            {visual.expansionEntera?.filas?.length ? (
              <ProcesoTabla
                titulo="Expansión posicional de la parte entera"
                columnas={visual.expansionEntera.columnas}
                filas={visual.expansionEntera.filas}
                resultado={visual.expansionEntera.resultado}
              />
            ) : null}

            {visual.expansionFrac?.filas?.length ? (
              <ProcesoTabla
                titulo="Expansión posicional de la parte fraccionaria"
                columnas={visual.expansionFrac.columnas}
                filas={visual.expansionFrac.filas}
                resultado={visual.expansionFrac.resultado}
              />
            ) : null}

            {visual.decimal?.entero?.filas?.length ? (
              <ProcesoTabla
                titulo="Parte entera decimal → binario"
                subtitulo="Divisiones sucesivas entre 2; el residuo es el bit."
                columnas={visual.decimal.entero.columnas}
                filas={visual.decimal.entero.filas}
                resultado={visual.decimal.entero.resultado}
              />
            ) : null}

            {visual.decimal?.fraccion?.filas?.length ? (
              <ProcesoTabla
                titulo="Parte fraccionaria decimal → binario"
                subtitulo="Multiplicaciones sucesivas por 2; la parte entera es el bit."
                columnas={visual.decimal.fraccion.columnas}
                filas={visual.decimal.fraccion.filas}
                resultado={visual.decimal.fraccion.resultado}
              />
            ) : null}

            {visual.resultadoFinal ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Binario obtenido
                </div>
                <div className="mt-1 font-mono text-sm text-emerald-900">
                  {visual.resultadoFinal}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (visual.tipo === "valorExacto") {
    return (
      <div className="space-y-5">
        {visual.entera?.filas?.length ? (
          <ProcesoTabla
            titulo="Construcción de la parte entera"
            columnas={visual.entera.columnas}
            filas={visual.entera.filas}
            resultado={visual.entera.resultado}
          />
        ) : null}

        {visual.fraccionaria?.filas?.length ? (
          <ProcesoTabla
            titulo="Aportes fraccionarios originales"
            subtitulo="Aquí no se simplifica nada todavía."
            columnas={visual.fraccionaria.columnas}
            filas={visual.fraccionaria.filas}
            resultado={visual.fraccionaria.resultado}
          />
        ) : null}

        {visual.denominadorComun?.filas?.length ? (
          <ProcesoTabla
            titulo="Llevar todos los aportes al mismo denominador"
            subtitulo="Así se puede sumar la parte fraccionaria paso a paso."
            columnas={visual.denominadorComun.columnas}
            filas={visual.denominadorComun.filas}
            resultado={visual.denominadorComun.resultado}
          />
        ) : null}

        {visual.resumen?.length ? (
          <div className="space-y-2">
            {visual.resumen.map((linea, i) => (
              <div
                key={i}
                className="rounded-xl bg-emerald-50 px-3 py-2 font-mono text-sm text-emerald-900 ring-1 ring-emerald-200"
              >
                {linea}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

    if (visual.tipo === "normalizacion") {
    return (
      <ProcesoTabla
        titulo={visual.titulo}
        subtitulo={visual.subtitulo}
        columnas={visual.columnas}
        filas={visual.filas}
        resultado={visual.resultado}
      />
    );
  }

    if (visual.tipo === "mantisa") {
    return (
      <ProcesoTabla
        titulo={visual.titulo}
        subtitulo={visual.subtitulo}
        columnas={visual.columnas}
        filas={visual.filas}
        resultado={visual.resultado}
      />
    );
  }

  return null;
}

export default function IEEE754Pasos({ resultado }) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-bold text-zinc-900">
        Procedimiento paso a paso
      </h2>
      <p className="mb-6 text-sm text-zinc-500">
        Cada paso muestra el resultado rápido y también su desarrollo detallado.
      </p>

      <div className="space-y-5">
        {resultado.pasos.map((paso, index) => (
          <div
            key={index}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 md:p-5"
          >
            <h3 className="mb-4 text-lg font-semibold text-zinc-900">
              Paso {index + 1}. {paso.titulo}
            </h3>

            <div className="space-y-2">
              {paso.lineas.map((linea, i) => (
                <BloqueLinea key={i}>{linea}</BloqueLinea>
              ))}
            </div>

            {(paso.detalle?.length > 0 || paso.visual || paso.tablaExponente) && (
              <IEEE754PasoDetalle>
                <div className="space-y-5">
                  {paso.detalle?.length > 0 ? (
                    <div className="space-y-2">
                      {paso.detalle.map((linea, i) => (
                        <BloqueLinea key={i}>{linea}</BloqueLinea>
                      ))}
                    </div>
                  ) : null}

                  {paso.visual ? renderVisual(paso.visual) : null}

                  {paso.tablaExponente ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-zinc-900">
                          Construcción visual del exponente en binario
                        </h4>
                        <p className="mt-1 text-xs text-zinc-500">
                          Se marcan las potencias de 2 que componen el valor del exponente almacenado.
                        </p>
                      </div>

                      <IEEE754ExponentTable
                        valores={paso.tablaExponente.valores}
                        marcas={paso.tablaExponente.marcas}
                      />
                    </div>
                  ) : null}
                </div>
              </IEEE754PasoDetalle>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}