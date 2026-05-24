import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";

// Icons
import ListIcon from "@mui/icons-material/FormatListBulleted";
import HistoryIcon from "@mui/icons-material/History";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CampaignIcon from "@mui/icons-material/Campaign";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SearchIcon from "@mui/icons-material/Search";

export default function CallsCampaignList({
  campaigns = [],
  whatsappCampaigns = [],
  loading = false,
  loadingWhatsapp = false,
  selectedId,
  selectedSource,
  onSelect,
  onChannelChange,
}) {
  const theme = useTheme();
  const [campaignType, setCampaignType] = useState("voice");
  const [searchTerm, setSearchTerm] = useState("");

  const isVoice = campaignType === "voice";

  const visibleCampaigns = isVoice ? campaigns : whatsappCampaigns;
  const visibleLoading = isVoice ? loading : loadingWhatsapp;

  const filteredCampaigns = visibleCampaigns.filter((campaign) => {
    const campaignName = campaign.title || campaign.name || "";

    return campaignName
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
  });

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    const dateA = a.createdAt
      ? new Date(a.createdAt).getTime()
      : Number.MIN_SAFE_INTEGER;

    const dateB = b.createdAt
      ? new Date(b.createdAt).getTime()
      : Number.MIN_SAFE_INTEGER;

    return dateB - dateA;
  });

  const handleCampaignTypeChange = (event) => {
    const nextType = event.target.value;

    setCampaignType(nextType);

    if (onChannelChange) {
      onChannelChange(nextType);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",

        // Bloque fijo: no crece infinitamente hacia abajo
        height: {
          xs: "auto",
          lg: "calc(100vh - 180px)",
        },
        maxHeight: {
          xs: "70vh",
          lg: "calc(100vh - 180px)",
        },
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          p: 2,
          height: "100%",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header fijo */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{ flexShrink: 0 }}
        >
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
              Campañas
            </Typography>
          </Stack>

          {visibleLoading && <CircularProgress size={18} thickness={6} />}
        </Stack>

        {/* Dropdown fijo */}
        <FormControl
          fullWidth
          size="small"
          sx={{
            mb: 2,
            flexShrink: 0,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "background.paper",
              boxShadow: `0 2px 8px ${alpha(
                theme.palette.common.black,
                0.05
              )}`,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
              },
            },
            "& .MuiInputLabel-root": {
              fontWeight: 600,
            },
          }}
        >
          <InputLabel id="campaign-list-type-label">Canal</InputLabel>

          <Select
            labelId="campaign-list-type-label"
            value={campaignType}
            label="Canal"
            onChange={handleCampaignTypeChange}
            sx={{ fontWeight: 600 }}
          >
            <MenuItem value="voice">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CampaignIcon fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight={600}>
                  Voz ({campaigns.length})
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem value="whatsapp">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <WhatsAppIcon fontSize="small" sx={{ color: "#25D366" }} />
                <Typography variant="body2" fontWeight={600}>
                  WhatsApp ({whatsappCampaigns.length})
                </Typography>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar campaña por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 2,
            flexShrink: 0,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "background.paper",
              boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
        <Divider sx={{ mb: 1.5, flexShrink: 0 }} />

        {/* Contenido con scroll interno */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            pr: 0.5,

            "&::-webkit-scrollbar": {
              width: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: 999,
              bgcolor: alpha(theme.palette.text.primary, 0.18),
            },
            "&::-webkit-scrollbar-thumb:hover": {
              bgcolor: alpha(theme.palette.text.primary, 0.28),
            },
          }}
        >
          {visibleLoading ? (
            <Stack spacing={1.5}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Skeleton variant="circular" width={34} height={34} />

                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={18} />
                    <Skeleton variant="text" width="45%" height={14} />
                  </Box>
                </Box>
              ))}
            </Stack>
          ) : (
            <List sx={{ p: 0 }}>
              {sortedCampaigns.map((c) => {
                const isSelected =
                  selectedSource === campaignType &&
                  selectedId === c.campaignId;

                return (
                  <ListItemButton
                    key={c.campaignId}
                    selected={isSelected}
                    onClick={() => onSelect(c.campaignId, campaignType, c)}
                    sx={{
                      mb: 0.75,
                      px: 1.25,
                      py: 0.9,
                      borderRadius: 2.5,
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
                        transform: "translateX(3px)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          fontWeight={isSelected ? 700 : 600}
                          color={isSelected ? "primary.main" : "text.primary"}
                          noWrap
                          title={c.title || c.name || "(Sin título)"}
                        >
                          {c.title || c.name || "(Sin título)"}
                        </Typography>
                      }
                      secondary={
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          mt={0.25}
                        >
                          <HistoryIcon
                            sx={{ fontSize: 12, color: "text.disabled" }}
                          />

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
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

              {sortedCampaigns.length === 0 && !visibleLoading && (
                <Box textAlign="center" py={4}>
                  <Typography variant="body2" color="text.disabled">
                    {searchTerm
                      ? "No se encontraron campañas con ese nombre."
                      : `No se encontraron campañas de ${campaignType === "voice" ? "voz" : "WhatsApp"
                      }.`}
                  </Typography>
                </Box>
              )}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}