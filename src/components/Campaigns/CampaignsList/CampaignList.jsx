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
  alpha,
  useTheme,
} from "@mui/material";

// Icons
import ListIcon from "@mui/icons-material/FormatListBulleted";
import HistoryIcon from "@mui/icons-material/History";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function CampaignList({
  campaigns,
  loading,
  selectedId,
  onSelect,
}) {
  const theme = useTheme();

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
                width: 32,
                height: 32,
              }}
            >
              <ListIcon fontSize="small" />
            </Avatar>
            <Typography variant="subtitle1" fontWeight={800}>
              Listado de Campañas
            </Typography>
          </Stack>

          {loading && <CircularProgress size={18} thickness={6} />}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Stack spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                    borderColor: isSelected ? "primary.main" : "transparent",
                    bgcolor: isSelected
                      ? alpha(theme.palette.primary.main, 0.05)
                      : "transparent",
                    "&.Mui-selected": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
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
                        color={isSelected ? "primary.main" : "text.primary"}
                      >
                        {c.title || "(Sin título)"}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                        <HistoryIcon sx={{ fontSize: 12, color: "text.disabled" }} />
                        <Typography variant="caption" color="text.secondary">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString()
                            : "—"}
                        </Typography>
                      </Stack>
                    }
                    secondaryTypographyProps={{ component: "div" }}
                  />
                  {isSelected && (
                    <ChevronRightIcon fontSize="small" color="primary" />
                  )}
                </ListItemButton>
              );
            })}

            {campaigns.length === 0 && !loading && (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.disabled">
                  No se encontraron campañas.
                </Typography>
              </Box>
            )}
          </List>
        )}
      </CardContent>
    </Card>
  );
}