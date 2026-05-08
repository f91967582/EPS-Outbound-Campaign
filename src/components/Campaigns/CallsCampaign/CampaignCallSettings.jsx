import React from "react";
import {
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
  InputAdornment,
  Box,
  alpha,
  useTheme,
  Chip,
} from "@mui/material";

// Icons
import ReplayIcon from "@mui/icons-material/Replay";
import SpeedIcon from "@mui/icons-material/Speed";
import LayersIcon from "@mui/icons-material/Layers";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function CampaignCallSettings({
  maxAttempts,
  setMaxAttempts,
  setCallIntervalSeconds,
  maxConcurrentCalls,
  setMaxConcurrentCalls,
  processAllSimultaneously,
  setProcessAllSimultaneously,
}) {
  const theme = useTheme();

  const isBotMode = processAllSimultaneously;

  const fieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      transition: "all 0.2s",
      bgcolor: "background.paper",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.light",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: "2px solid",
        borderColor: "primary.main",
      },
    },
    "& .MuiInputLabel-root": { fontWeight: 500 },
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <SettingsSuggestIcon sx={{ color: "text.secondary", fontSize: 20 }} />
        <Typography
          variant="subtitle2"
          fontWeight={700}
          color="text.secondary"
          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Configuracion de marcacion
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Intentos"
            type="number"
            size="small"
            value={maxAttempts}
            onChange={(e) => setMaxAttempts(Number(e.target.value))}
            inputProps={{ min: 1, max: 10 }}
            sx={fieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ReplayIcon sx={{ fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Espera entre intentos"
            type="number"
            size="small"
            value={setCallIntervalSeconds}
            onChange={(e) => setCallIntervalSeconds(Number(e.target.value))}
            inputProps={{ min: 1 }}
            sx={fieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SpeedIcon sx={{ fontSize: 18 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" color="text.secondary">
                    min
                  </Typography>
                </InputAdornment>
              ),
            }}
          />

          {!isBotMode && (
            <TextField
              label="Llamadas simultaneas"
              type="number"
              size="small"
              value={maxConcurrentCalls}
              onChange={(e) => setMaxConcurrentCalls(Number(e.target.value))}
              inputProps={{ min: 1, max: 50 }}
              sx={fieldStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LayersIcon sx={{ fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
        </Stack>

        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: isBotMode
              ? alpha(theme.palette.primary.main, 0.06)
              : alpha(theme.palette.warning.main, 0.06),
            border: "1px solid",
            borderColor: isBotMode
              ? alpha(theme.palette.primary.main, 0.18)
              : alpha(theme.palette.warning.main, 0.2),
            transition: "all 0.3s ease",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <FormControlLabel
              sx={{ m: 0 }}
              control={
                <Switch
                  checked={isBotMode}
                  onChange={(e) =>
                    setProcessAllSimultaneously(e.target.checked)
                  }
                  color="primary"
                />
              }
              label={
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: isBotMode
                        ? alpha(theme.palette.primary.main, 0.12)
                        : alpha(theme.palette.warning.main, 0.14),
                      color: isBotMode ? "primary.main" : "warning.main",
                    }}
                  >
                    {isBotMode ? (
                      <SmartToyIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <SupportAgentIcon sx={{ fontSize: 20 }} />
                    )}
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight={800}>
                      {isBotMode ? "Modo bot" : "Modo agente"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {isBotMode
                        ? "Todas las llamadas se procesaran al mismo tiempo."
                        : "Usa el limite de llamadas simultaneas configurado."}
                    </Typography>
                  </Box>
                </Stack>
              }
            />

            <Chip
              size="small"
              label={isBotMode ? "Marcación masiva" : "Marcación controlada"}
              color={isBotMode ? "primary" : "warning"}
              variant="outlined"
              sx={{
                fontWeight: 700,
                borderRadius: 2,
              }}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}