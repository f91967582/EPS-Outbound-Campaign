import { Stack, TextField, Typography } from "@mui/material";

export default function CampaignCallSettings({
  maxAttempts,
  setMaxAttempts,
  callIntervalSeconds,
  setCallIntervalSeconds,
  maxConcurrentCalls,
  setMaxConcurrentCalls,
}) {
  return (
    <>
      <Typography variant="subtitle2">Configuración de llamadas</Typography>

      <Stack direction="row" spacing={2}>
        <TextField
          label="Intentos"
          type="number"
          size="small"
          value={maxAttempts}
          onChange={(e) => setMaxAttempts(Number(e.target.value))}
          inputProps={{ min: 1, max: 10 }}
        />

        <TextField
          label="Intervalo entre llamadas (segundos)"
          type="number"
          size="small"
          value={callIntervalSeconds}
          onChange={(e) => setCallIntervalSeconds(Number(e.target.value))}
          inputProps={{ min: 1 }}
        />

        <TextField
          label="Simultáneos"
          type="number"
          size="small"
          value={maxConcurrentCalls}
          onChange={(e) => setMaxConcurrentCalls(Number(e.target.value))}
          inputProps={{ min: 1, max: 50 }}
        />
      </Stack>
    </>
  );
}