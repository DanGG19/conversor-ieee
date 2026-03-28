export default function IEEE754ExponentTable({ valores, marcas }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-center font-mono text-sm">
        <tbody>
          <tr>
            {valores.map((v, i) => (
              <td key={i} className="border border-zinc-300 bg-orange-200 px-3 py-2">
                {v}
              </td>
            ))}
          </tr>
          <tr>
            {marcas.map((m, i) => (
              <td key={i} className="border border-zinc-300 bg-white px-3 py-2">
                {m}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}