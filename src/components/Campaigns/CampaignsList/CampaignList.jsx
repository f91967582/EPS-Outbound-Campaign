import React from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";

export default function CampaignList({
  campaigns,
  loading,
  selectedId,
  onSelect,
}) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Listado de Campañas</Typography>
          {loading && <CircularProgress size={20} />}
        </Box>

        <Divider sx={{ my: 2 }} />

        {loading ? (
          <>
            <Skeleton height={60} />
            <Skeleton height={60} />
            <Skeleton height={60} />
          </>
        ) : (
          <List>
            {campaigns.map((c) => (
              <ListItemButton
                key={c.campaignId}
                selected={selectedId === c.campaignId}
                onClick={() => onSelect(c.campaignId)}
                sx={{ mb: 1, borderRadius: 2 }}
              >
                <ListItemText
                  primary={
                    <Typography fontWeight={600}>
                      {c.title || "(Sin título)"}
                    </Typography>
                  }
                  secondary={
                    c.createdAt
                      ? `Iniciada: ${new Date(c.createdAt).toLocaleString()}`
                      : "—"
                  }
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}