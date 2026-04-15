import React from "react";
import {
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
  Box,
  InputAdornment,
  alpha,
  useTheme,
} from "@mui/material";

// Icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PublicIcon from "@mui/icons-material/Public";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export default function CampaignSchedule({
  scheduleEnabled,
  setScheduleEnabled,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  timezone,
}) {
  const theme = useTheme();

  const fieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      bgcolor: "background.paper",
      transition: "all 0.2s",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.light",
      },
    },
    "& .MuiInputLabel-root": { fontWeight: 600 },
  };

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
          px: 2,
          borderRadius: 3,
          bgcolor: scheduleEnabled
            ? alpha(theme.palette.primary.main, 0.04)
            : "transparent",
          border: "1px solid",
          borderColor: scheduleEnabled
            ? alpha(theme.palette.primary.main, 0.1)
            : "divider",
          transition: "all 0.3s ease",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <EventAvailableIcon
            color={scheduleEnabled ? "primary" : "disabled"}
          />
          <Typography variant="body2" fontWeight={700}>
            Programar inicio de campaña
          </Typography>
        </Stack>

        <Switch
          checked={scheduleEnabled}
          onChange={(e) => {
            const on = e.target.checked;
            setScheduleEnabled(on);
            if (!on) {
              setStartDate("");
              setStartTime("");
            }
          }}
        />
      </Box>

      {scheduleEnabled && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="flex-start"
          sx={{
            p: 2,
            pt: 1,
            animation: "fadeIn 0.3s ease-out",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(-10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <TextField
            label="Fecha de inicio"
            type="date"
            size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={fieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonthIcon fontSize="small" color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Hora de inicio"
            type="time"
            size="small"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={fieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTimeIcon fontSize="small" color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              minWidth: 180,
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.grey[500], 0.05),
              border: "1px dashed",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PublicIcon
              sx={{ fontSize: 16, color: "text.secondary" }}
            />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", lineHeight: 1, mb: 0.5 }}
              >
                Zona Horaria
              </Typography>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.primary"
              >
                {timezone}
              </Typography>
            </Box>
          </Box>
        </Stack>
      )}
    </Stack>
  );
}