import {
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

export default function CampaignSchedule({
  scheduleEnabled,
  setScheduleEnabled,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  timezone,
}) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
      <FormControlLabel
        control={
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
        }
        label="Programar inicio"
      />

      {scheduleEnabled && (
        <>
          <TextField
            label="Fecha de inicio"
            type="date"
            size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Hora de inicio"
            type="time"
            size="small"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <Typography variant="caption" color="text.secondary">
            Zona horaria: {timezone}
          </Typography>
        </>
      )}
    </Stack>
  );
}