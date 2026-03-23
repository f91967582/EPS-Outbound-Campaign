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
  useTheme 
} from "@mui/material";

// Icons for settings
import ReplayIcon from '@mui/icons-material/Replay';
import SpeedIcon from '@mui/icons-material/Speed';
import LayersIcon from '@mui/icons-material/Layers';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

export default function CampaignCallSettings({
  maxAttempts,
  setMaxAttempts,
  callIntervalSeconds,
  setCallIntervalSeconds,
  maxConcurrentCalls,
  setMaxConcurrentCalls,
  processAllSimultaneously,
  setProcessAllSimultaneously,
}) {
  const theme = useTheme();

  // Shared field styles
  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      transition: 'all 0.2s',
      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.light' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '2px solid', borderColor: 'primary.main' },
    },
    '& .MuiInputLabel-root': { fontWeight: 500 }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <SettingsSuggestIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Configuración de llamadas
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
            label="Intervalo (seg)"
            type="number"
            size="small"
            value={callIntervalSeconds}
            onChange={(e) => setCallIntervalSeconds(Number(e.target.value))}
            inputProps={{ min: 1 }}
            sx={fieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SpeedIcon sx={{ fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Simultáneos"
            type="number"
            size="small"
            value={maxConcurrentCalls}
            onChange={(e) => setMaxConcurrentCalls(Number(e.target.value))}
            inputProps={{ min: 1, max: 50 }}
            disabled={processAllSimultaneously}
            sx={fieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LayersIcon sx={{ fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Box 
          sx={{ 
            p: 2, 
            borderRadius: 3, 
            bgcolor: processAllSimultaneously ? alpha(theme.palette.primary.main, 0.04) : alpha(theme.palette.grey[500], 0.04),
            border: '1px solid',
            borderColor: processAllSimultaneously ? alpha(theme.palette.primary.main, 0.1) : 'divider',
            transition: 'all 0.3s ease'
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={processAllSimultaneously}
                onChange={(e) => setProcessAllSimultaneously(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight={700}>
                  Procesar todas las llamadas posibles simultáneamente
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ignora el límite de simultáneos y usa el máximo disponible.
                </Typography>
              </Box>
            }
          />
        </Box>
      </Stack>
    </Box>
  );
}