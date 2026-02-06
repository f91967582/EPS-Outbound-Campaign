import { useState } from "react";
import { useSirWeb } from "../../hooks/useApiSirWeb";

function EmailCampaign() {
  const { data, error, loading, run } = useSirWeb();

  const [action, setAction] = useState("getClient");
  const [nuDocumento, setNuDocumento] = useState("00107974057");
  const [tpDocumento, setTpDocumento] = useState("CED");

  const onSearch = async () => {
    await run({ action, nuDocumento, tpDocumento });
  };

  return (
    <div style={{ padding: 12, maxWidth: 520 }}>
      <h3>SirWeb Search</h3>

      <div style={{ display: "grid", gap: 10 }}>
        <label>
          Action
          <input
            value={action}
            onChange={(e) => setAction(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            placeholder="e.g. getClient"
          />
        </label>

        <label>
          nuDocumento
          <input
            value={nuDocumento}
            onChange={(e) => setNuDocumento(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            placeholder="e.g. 00107974057"
          />
        </label>

        <label>
          tpDocumento
          <input
            value={tpDocumento}
            onChange={(e) => setTpDocumento(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            placeholder="e.g. CED"
          />
        </label>

        <button
          onClick={onSearch}
          disabled={loading || !action || !nuDocumento || !tpDocumento}
          style={{ padding: 10, cursor: "pointer" }}
        >
          {loading ? "Buscando..." : "Search"}
        </button>
      </div>

      {error ? (
        <p style={{ color: "red", marginTop: 12 }}>Error: {error}</p>
      ) : null}

      {data ? (
        <pre
          style={{
            marginTop: 12,
            whiteSpace: "pre-wrap",
            background: "#111",
            color: "#0f0",
            padding: 12,
            borderRadius: 8,
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}

export default EmailCampaign;
