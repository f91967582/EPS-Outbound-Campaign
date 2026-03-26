import { useMemo, useState } from "react";
import DataTable from "../Tables/DataTable";
import { downloadCsv } from "../../utils/downloadCsv";

export default function ContactList({ data, loading, error }) {
  const [clienteFilter, setClienteFilter] = useState("");
  const [asesorFilter, setAsesorFilter] = useState("");
  const [telefonoFilter, setTelefonoFilter] = useState("");
  const [contactIdFilter, setContactIdFilter] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [tipificacionFilter, setTipificacionFilter] = useState("");
  const [llamadaFilter, setLlamadaFilter] = useState("");

  const getTipificacionLabel = (row) => {
    const raw = row?.tipificacion ?? row?.Tipificacion;
    return String(raw ?? "").trim() || "Sin tipificación";
  };

  const rows = useMemo(() => {
    return (data?.data ?? []).slice().sort(
      (a, b) => new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
    );
  }, [data]);

  const tipificacionOptions = useMemo(() => {
    const set = new Set();

    for (const r of rows) {
      set.add(getTipificacionLabel(r));
    }

    return Array.from(set).sort();
  }, [rows]);

  const llamadaOptions = useMemo(() => {
    const set = new Set();

    for (const r of rows) {
      if (r.llamadas) set.add(String(r.llamadas).toLowerCase());
    }

    return Array.from(set).sort();
  }, [rows]);

  const fromDate = fechaDesde ? new Date(fechaDesde) : null;
  const toDate = fechaHasta ? new Date(fechaHasta + "T23:59:59") : null;

  const filteredRows = useMemo(() => {
    if (
      !clienteFilter &&
      !asesorFilter &&
      !telefonoFilter &&
      !contactIdFilter &&
      !fechaDesde &&
      !fechaHasta &&
      !tipificacionFilter &&
      !llamadaFilter
    ) {
      return rows;
    }

    const qCliente = clienteFilter.toLowerCase().trim();
    const qAsesor = asesorFilter.toLowerCase().trim();
    const qTelefono = telefonoFilter.toLowerCase().trim();
    const qContactId = contactIdFilter.toLowerCase().trim();

    return rows.filter((r) => {
      const tipValue = getTipificacionLabel(r);

      if (tipificacionFilter && tipValue !== tipificacionFilter) {
        return false;
      }

      const llamadaValue = String(r.llamadas ?? "").toLowerCase();
      if (llamadaFilter && llamadaValue !== llamadaFilter) {
        return false;
      }

      const rowDate = new Date(r.fechaRegistro);

      if (qCliente && !r.nombreCliente?.toLowerCase().includes(qCliente)) {
        return false;
      }

      if (qAsesor && !r.asesorCobro?.toLowerCase().includes(qAsesor)) {
        return false;
      }

      if (qTelefono && !r.telefonoCliente?.toLowerCase().includes(qTelefono)) {
        return false;
      }

      if (
        qContactId &&
        !String(r.contactId ?? "").toLowerCase().includes(qContactId)
      ) {
        return false;
      }

      if (fromDate && rowDate < fromDate) {
        return false;
      }

      if (toDate && rowDate > toDate) {
        return false;
      }

      return true;
    });
  }, [
    rows,
    clienteFilter,
    asesorFilter,
    telefonoFilter,
    contactIdFilter,
    fechaDesde,
    fechaHasta,
    tipificacionFilter,
    llamadaFilter,
  ]);

  const columns = [
    { label: "#", key: "__index" },

    {
      label: "Teléfono",
      key: "telefonoCliente",
      filter: {
        type: "text",
        value: telefonoFilter,
        onChange: setTelefonoFilter,
        placeholder: "Buscar teléfono...",
      },
    },

    {
      label: "Fecha",
      key: "fechaRegistro",
      filter: {
        type: "date-range",
        from: fechaDesde,
        to: fechaHasta,
        onChangeFrom: setFechaDesde,
        onChangeTo: setFechaHasta,
      },
    },

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

    {
      label: "Tipificación",
      key: "tipificacion",
      filter: {
        type: "select",
        value: tipificacionFilter,
        onChange: setTipificacionFilter,
        options: tipificacionOptions,
        placeholder: "Todas",
      },
    },

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

    {
      label: "Llamada",
      key: "llamadas",
      filter: {
        type: "select",
        value: llamadaFilter,
        onChange: setLlamadaFilter,
        options: llamadaOptions,
        placeholder: "Todas",
      },
    },

    {
      label: "Contact ID",
      key: "contactId",
      filter: {
        type: "text",
        value: contactIdFilter,
        onChange: setContactIdFilter,
        placeholder: "Buscar contact ID...",
      },
    },
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
        downloadCsv(`detalle-llamadas-${stamp}.csv`, columns, filteredRows)
      }
    />
  );
}