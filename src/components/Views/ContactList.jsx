import { useMemo, useState } from "react";
import DataTable from "../Tables/DataTable";
import { downloadCsv } from "../../utils/csv";

export default function ContactList({ data, loading, error }) {
  const [clienteFilter, setClienteFilter] = useState("");
  const [asesorFilter, setAsesorFilter] = useState("");
  

  // 1) rows MUST be defined before filteredRows
  const rows = useMemo(() => {
    return (data?.data ?? []).slice().sort(
      (a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
    );
  }, [data]);

  // 2) filteredRows can safely use rows
  const filteredRows = useMemo(() => {
    // if both empty, return all
    if (!clienteFilter && !asesorFilter) return rows;

    const qCliente = clienteFilter.toLowerCase().trim();
    const qAsesor = asesorFilter.toLowerCase().trim();

    return rows.filter((r) => {
      if (qCliente && !r.nombreCliente?.toLowerCase().includes(qCliente)) {
        return false;
      }

      if (qAsesor && !r.asesorCobro?.toLowerCase().includes(qAsesor)) {
        return false;
      }

      return true;
    });
  }, [rows, clienteFilter, asesorFilter]);

  const columns = [
    { label: "#", key: "__index" },
    { label: "Teléfono", key: "telefonoCliente" },
    { label: "Fecha", key: "fechaRegistro" },

    {
      label: "Cliente",
      key: "nombreCliente",
      filter: {
        type: "text",
        value: clienteFilter,
        onChange: setClienteFilter,
        placeholder: "Buscar cliente...",
      },
    },

    { label: "Tipificación", key: "tipificacion" },

    {
      label: "Asesor",
      key: "asesorCobro",
      filter: {
        type: "text",
        value: asesorFilter,
        onChange: setAsesorFilter,
        placeholder: "Buscar asesor...",
      },
    },

    { label: "Llamada", key: "llamadas" },
    { label: "Contact ID", key: "contactId" },
  ];

  const stamp = new Date().toISOString().slice(0, 10);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{String(error)}</p>;

  return (
    <DataTable
      title={`Llamadas (${filteredRows.length})`}
      rows={filteredRows}
      columns={columns}
      onDownloadCsv={() =>
        downloadCsv(
          `detalle-llamadas-${stamp}.csv`,
          columns,
          filteredRows
        )
      }
    />
  );
}
