import KpiCard from "../KPIs/KpiCard";
import DoughnutChart from "../Charts/DoughnutChart";
import SummaryTable from "../Tables/SummaryTable";
import { useMetrics } from "../../hooks/useMetrics";

function MainView() {
  const { data, loading, error } = useMetrics();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Total de llamadas
  const totalGestion = data?.total_registros ?? 0;

  // Llamadas entrantes o salientes
  const { entrantes, salientes } = (data?.data ?? []).reduce(
    (acc, row) => {
      const t = String(row.llamadas ?? "").toLowerCase().trim();
      if (t === "entrante") acc.entrantes += 1;
      if (t === "saliente") acc.salientes += 1;
      return acc;
    },
    { entrantes: 0, salientes: 0 }
  );

  const totalDir = entrantes + salientes;
  const pctDir = (n) => (totalDir ? Math.round((n / totalDir) * 100) : 0);

  const entrantesPct = pctDir(entrantes);
  const salientesPct = pctDir(salientes);

  // --- Efectividad Cobro ---
  const registros = Array.isArray(data?.data) ? data.data : [];

  const normalize = (s) =>
    String(s ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const isCobradoTip = (tip) => {
    const t = normalize(tip);
    return t === "llamada para pago" || t === "pago realizado";
  };

  const getCount = (item) =>
    Number(item?.total ?? item?.count ?? item?.cantidad ?? 1) || 0;

  const totalCalls =
    Number(data?.total_registros ?? 0) ||
    registros.reduce((sum, item) => sum + getCount(item), 0);

  const cobrados = registros.reduce((sum, item) => {
    const tip = item?.Tipificacion ?? item?.tipificacion ?? item?.TIPIFICACION;
    return sum + (isCobradoTip(tip) ? getCount(item) : 0);
  }, 0);

  const noCobrados = Math.max(totalCalls - cobrados, 0);
  const efectividadCobroPct = totalCalls
    ? Math.round((cobrados / totalCalls) * 100)
    : 0;

  // --- Contactabilidad ---
  const noContactSet = new Set(
    [
      "Buzón de Voz",
      "Sale IVR de Empresa",
      "Prospecto No Contesta",
      "Prospecto No Localizado",
      "Número Desconectado",
      "Número Ocupado",
      "Posible Contacto",
      "",
    ].map(normalize)
  );

  const noContactados = registros.reduce((sum, item) => {
    const tip = item?.Tipificacion ?? item?.tipificacion ?? item?.TIPIFICACION;
    return sum + (noContactSet.has(normalize(tip)) ? getCount(item) : 0);
  }, 0);

  const contactados = Math.max(totalCalls - noContactados, 0);
  const contactabilidadPct = totalCalls
    ? Math.round((contactados / totalCalls) * 100)
    : 0;

  // --- TOP 5 Tipificacion ---
  const getTipLabel = (item) => {
    const raw = item?.Tipificacion ?? item?.tipificacion ?? item?.TIPIFICACION;
    return String(raw ?? "").trim() || "Sin tipificación";
  };

  const buildTop5Rows = (direction) => {
    const filtered = registros.filter(
      (r) => String(r?.llamadas ?? "").toLowerCase().trim() === direction
    );

    const total = filtered.length;

    const grouped = filtered.reduce((acc, r) => {
      const label = getTipLabel(r);
      const key = normalize(label);
      acc[key] = acc[key] || { label, count: 0 };
      acc[key].count += 1;
      return acc;
    }, {});

    const rows = Object.values(grouped)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(({ label, count }) => [
        label,
        count,
        total ? `${Math.round((count / total) * 100)}%` : "0%",
      ]);

    return { total, rows };
  };

  const entrantesTop = buildTop5Rows("entrante");
  const salientesTop = buildTop5Rows("saliente");

  return (
    <div>
      <section className="kpi-grid">
        <KpiCard label="Total de Llamadas" value={totalGestion}>
          <span className="badge badge-neutral">Gestión Global</span>
        </KpiCard>

        <KpiCard label="Distribución">
          <div className="dist-row">
            <span className="dist-label" style={{ color: "var(--primary)" }}>
              Entrantes:
            </span>
            <span>
              <b>{entrantes}</b>
              <span className="dist-percent">({entrantesPct}%)</span>
            </span>
          </div>

          <div className="dist-row">
            <span className="dist-label" style={{ color: "var(--warning)" }}>
              Salientes:
            </span>
            <span>
              <b>{salientes}</b>
              <span className="dist-percent">({salientesPct}%)</span>
            </span>
          </div>
        </KpiCard>

        <KpiCard
          label="Contactabilidad"
          value={`${contactabilidadPct}%`}
          valueColor={contactabilidadPct ? "var(--primary)" : "var(--danger)"}
        >
          <span className="badge badge-success">
            {contactados}{" "}Contactados
          </span>
          <span className="badge badge-danger">
            {noContactados}{" "}No Contactados
          </span>
        </KpiCard>

        <KpiCard
          label="Efectividad Cobro"
          value={`${efectividadCobroPct}%`}
          valueColor={efectividadCobroPct ? "var(--primary)" : "var(--danger)"}
        >
          <span className="badge badge-success">
            {cobrados}{" "}Cobrado
          </span>
          <span className="badge badge-danger">
            {noCobrados}{" "}No Cobrados
          </span>
        </KpiCard>
      </section>

      <section className="charts-grid">
        <DoughnutChart
          title="Distribución (Entrantes vs Salientes)"
          labels={["Entrantes", "Salientes"]}
          data={[entrantes, salientes]}
          colors={["#2563eb", "#f59e0b"]}
        />
        <DoughnutChart
          title="Resumen de Contactabilidad"
          labels={["Contactados", "No Contactados"]}
          data={[contactados, noContactados]}
          colors={["#10b981", "#94a3b8"]}
        />
      </section>

      <section className="main-grid">
        <SummaryTable
          title="Llamadas Entrantes (Top 5)"
          total={entrantesTop.total}
          rows={entrantesTop.rows}
        />

        <SummaryTable
          title="Llamadas Salientes (Top 5)"
          total={salientesTop.total}
          rows={salientesTop.rows}
        />
      </section>
    </div>
  );
}

export default MainView;
