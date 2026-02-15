import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Stack,
} from "@mui/material";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([
    {
      campaignId: "1",
      campaignTitle: "Outbound Feb",
      campaignType: "VOICE",
      status: "RUNNING",
      createdAt: "2026-02-12 10:00 AM",
    },
    {
      campaignId: "2",
      campaignTitle: "Email Promo",
      campaignType: "EMAIL",
      status: "PAUSED",
      createdAt: "2026-02-11 02:30 PM",
    },
    {
      campaignId: "3",
      campaignTitle: "SMS Reminder",
      campaignType: "SMS",
      status: "CREATED",
      createdAt: "2026-02-10 09:15 AM",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "RUNNING":
        return "success";
      case "PAUSED":
        return "warning";
      case "COMPLETED":
        return "default";
      case "FAILED":
        return "error";
      case "CREATED":
      default:
        return "info";
    }
  };

  const toggleCampaign = (id) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.campaignId === id
          ? {
              ...c,
              status: c.status === "RUNNING" ? "PAUSED" : "RUNNING",
            }
          : c
      )
    );
  };

  return (
    <Card sx={{ borderRadius: 3, p: 2 }}>
      <CardHeader
        title="Campaign Management"
        subheader="Monitor and control all campaigns"
      />

      <CardContent>
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography fontWeight="bold">Title</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Type</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Status</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Created</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight="bold">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {campaigns.map((c) => (
                <TableRow key={c.campaignId} hover>
                  <TableCell>{c.campaignTitle}</TableCell>

                  <TableCell>
                    <Chip
                      label={c.campaignType}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={c.status}
                      size="small"
                      color={getStatusColor(c.status)}
                    />
                  </TableCell>

                  <TableCell>{c.createdAt}</TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="contained"
                        color={
                          c.status === "RUNNING" ? "warning" : "primary"
                        }
                        onClick={() => toggleCampaign(c.campaignId)}
                      >
                        {c.status === "RUNNING"
                          ? "Pause"
                          : "Start"}
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                      >
                        Stop
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
}
