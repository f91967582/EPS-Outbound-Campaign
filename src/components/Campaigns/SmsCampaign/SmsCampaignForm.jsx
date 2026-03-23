import React from "react";
import { TextField, InputAdornment, alpha, useTheme } from "@mui/material";
import LabelIcon from '@mui/icons-material/Label';

export default function SmsCampaignForm({
  campaignTitle,
  setCampaignTitle,
}) {
  const theme = useTheme();

  return (
    <TextField
      label="Título de campaña"
      placeholder="Ej: Cobros Marzo 2026"
      size="small"
      value={campaignTitle}
      onChange={(e) => setCampaignTitle(e.target.value)}
      fullWidth
      // Subtle UI enhancements to match the rest of the dashboard
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LabelIcon 
              sx={{ 
                fontSize: 18, 
                color: campaignTitle ? 'primary.main' : 'text.disabled',
                transition: 'color 0.2s'
              }} 
            />
          </InputAdornment>
        ),
      }}
      sx={{
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
      }}
    />
  );
}