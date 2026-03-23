import React from "react";
import { 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Stack, 
  InputAdornment, 
  CircularProgress,
  alpha,
  useTheme 
} from "@mui/material";
// Icons to match the SMS form
import LabelIcon from '@mui/icons-material/Label';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export default function CampaignBasicInfo({
  campaignTitle,
  setCampaignTitle,
  flowId,
  setFlowId,
  flows,
  flowsLoading,
}) {
  const theme = useTheme();

  // Shared styles for the input fields
  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      transition: 'all 0.2s ease',
      backgroundColor: alpha(theme.palette.common.white, 0.5),
      '&:hover': {
        backgroundColor: theme.palette.common.white,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'primary.light',
        },
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.common.white,
        boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
      }
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
      '&.Mui-focused': {
        fontWeight: 700,
      }
    }
  };

  return (
    <Stack spacing={3} sx={{ mt: 1 }}>
      {/* Campaign Title Field */}
      <TextField
        label="Título de campaña"
        placeholder="Ej: Cobros Voz - Marzo"
        size="small"
        value={campaignTitle}
        onChange={(e) => setCampaignTitle(e.target.value)}
        fullWidth
        sx={fieldStyles}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LabelIcon 
                sx={{ 
                  fontSize: 18, 
                  color: campaignTitle ? 'primary.main' : 'text.disabled' 
                }} 
              />
            </InputAdornment>
          ),
        }}
      />

      {/* Flow Selection Dropdown */}
      <FormControl fullWidth size="small" disabled={flowsLoading} sx={fieldStyles}>
        <InputLabel id="flow-select-label">Flujo</InputLabel>
        <Select
          labelId="flow-select-label"
          value={flowId}
          label="Flujo"
          onChange={(e) => setFlowId(e.target.value)}
          sx={{ fontWeight: 600 }}
          startAdornment={
            <InputAdornment position="start">
              {flowsLoading ? (
                <CircularProgress size={16} sx={{ ml: 0.5 }} />
              ) : (
                <AccountTreeIcon 
                  sx={{ 
                    fontSize: 18, 
                    color: flowId ? 'primary.main' : 'text.disabled',
                    ml: 0.5
                  }} 
                />
              )}
            </InputAdornment>
          }
        >
          {flows.map((f) => (
            <MenuItem key={f.id} value={f.id} sx={{ fontWeight: 500 }}>
              {f.name}
            </MenuItem>
          ))}
          {flows.length === 0 && !flowsLoading && (
            <MenuItem disabled>No se encontraron flujos</MenuItem>
          )}
        </Select>
      </FormControl>
    </Stack>
  );
}