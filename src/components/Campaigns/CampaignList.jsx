// components/CampaignsView.jsx
import React, { useState } from "react";
import { useCampaignsList, useCampaignDetail } from "../../services/useCampaignsApi";

export default function CampaignsView() {
  const [selectedId, setSelectedId] = useState(null);

  const { campaigns, loading: loadingList, error: listError } = useCampaignsList();
  const {
    campaign,
    rows,
    nextToken,
    loading: loadingDetail,
    error: detailError,
    loadMore,
  } = useCampaignDetail(selectedId);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <h2>Outbound Campaigns</h2>

      {(listError || detailError) && (
        <div style={{ color: "crimson", marginBottom: 12 }}>
          {listError || detailError}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 16 }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0 }}>Campaigns</h3>
            {loadingList && <span>Loading…</span>}
          </div>

          <div style={{ marginTop: 8 }}>
            {campaigns.map((c) => (
              <button
                key={c.campaignId}
                onClick={() => setSelectedId(c.campaignId)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: 10,
                  marginBottom: 8,
                  borderRadius: 8,
                  border: selectedId === c.campaignId ? "2px solid #000" : "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 700 }}>{c.title || "(no title)"}</div>
                <div style={{ fontSize: 12, color: "#555" }}>
                  Iniciada: {c.createdAt ? new Date(c.createdAt).toLocaleString() : "—"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Campaign Detail</h3>

          {!selectedId && <div>Select a campaign.</div>}
          {selectedId && loadingDetail && <div>Loading…</div>}

          {campaign && (
            <>
              <div style={{ padding: 10, border: "1px solid #eee", borderRadius: 8 }}>
                <div><b>Title:</b> {campaign.title}</div>
                <div><b>CampaignId:</b> {campaign.campaignId}</div>
                <div><b>FlowId:</b> {campaign.flowId}</div>
                <div><b>Created:</b> {campaign.createdAt}</div>
              </div>

              <h4 style={{ marginTop: 12 }}>Results</h4>

              <div style={{ overflowX: "auto" }}>
                <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                      <th>Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, idx) => (
                      <tr key={(r.phoneNumber || "") + idx} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td>{r.phoneNumber || "—"}</td>
                        <td>{r.outboundCallStatus || r.status || "—"}</td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr><td colSpan={3} style={{ color: "#666" }}>No results yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 12 }}>
                {nextToken ? (
                  <button onClick={loadMore}>Load more</button>
                ) : (
                  <span style={{ color: "#666" }}>No more pages</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
