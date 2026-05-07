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
  Stack,
  Avatar,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import HistoryIcon from "@mui/icons-material/History";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function WhatsappCampaignList({
  campaigns,
  loading,
  selectedId,
  onSelect,
}) {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "COMPLETED":
        return "success";
      case "FAILED":
        return "error";
      case "RUNNING":
        return "info";
      case "QUEUED":
        return "warning";
      case "PAUSED":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatCreatedAt = (value) => {
    if (value === null || value === undefined || value === "") return "—";

    if (typeof value === "number") {
      const ms = value < 1000000000000 ? value * 1000 : value;
      const date = new Date(ms);
      return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: "success.main",
                width: 32,
                height: 32,
              }}
            >
              <WhatsAppIcon fontSize="small" />
            </Avatar>

            <Typography variant="subtitle1" fontWeight={800}>
              Listado de Campañas WhatsApp
            </Typography>
          </Stack>

          {loading && <CircularProgress size={18} thickness={6} />}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Stack spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={15} />
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <List sx={{ p: 0 }}>
            {campaigns.map((c) => {
              const isSelected = selectedId === c.campaignId;
              const status = c.status || "UNKNOWN";

              return (
                <ListItemButton
                  key={c.campaignId}
                  selected={isSelected}
                  onClick={() => onSelect(c.campaignId)}
                  sx={{
                    mb: 1,
                    borderRadius: 3,
                    transition: "all 0.2s ease",
                    border: "1px solid",
                    borderColor: isSelected ? "success.main" : "transparent",
                    bgcolor: isSelected
                      ? alpha(theme.palette.success.main, 0.06)
                      : "transparent",
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.success.main, 0.14),
                      },
                    },
                    "&:hover": {
                      bgcolor: alpha(theme.palette.action.hover, 0.04),
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        fontWeight={isSelected ? 700 : 600}
                        color={isSelected ? "success.main" : "text.primary"}
                      >
                        {c.title || "(Sin título)"}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={0.75} mt={0.75}>
                        <Stack direction="row" spacing={0.75} flexWrap="wrap">
                          <Chip
                            label="WhatsApp"
                            size="small"
                            variant="outlined"
                            color="success"
                            sx={{ height: 20, fontSize: "0.7rem" }}
                          />
                          <Chip
                            label={status}
                            size="small"
                            color={getStatusColor(status)}
                            sx={{ height: 20, fontSize: "0.7rem" }}
                          />
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <HistoryIcon
                            sx={{ fontSize: 12, color: "text.disabled" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatCreatedAt(c.createdAt)}
                          </Typography>
                        </Stack>
                      </Stack>
                    }
                    secondaryTypographyProps={{ component: "div" }}
                  />

                  {isSelected && (
                    <ChevronRightIcon fontSize="small" color="success" />
                  )}
                </ListItemButton>
              );
            })}

            {campaigns.length === 0 && !loading && (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.disabled">
                  No se encontraron campañas de WhatsApp.
                </Typography>
              </Box>
            )}
          </List>
        )}
      </CardContent>
    </Card>
  );
}