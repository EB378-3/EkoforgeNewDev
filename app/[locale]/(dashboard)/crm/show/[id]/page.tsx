"use client";

import { Stack, Typography } from "@mui/material";
import { useShow } from "@refinedev/core";
import {
  DateField,
  Show,
  TextFieldComponent as TextField,
  MarkdownField,
} from "@refinedev/mui";

// Define the shape of your logbook record.
interface LogbookRecord {
  id: string;
  uid: string;
  resource: string;
  date: string;
  pic: string;
  pax: number;
  departure: string;
  arrival: string;
  offblock: string;
  takeoff: string;
  landing: string;
  onblock: string;
  landings: number;
  flightrules: string;
  fuel: number;
  flight_type: string;
  details: string;
  billing_details: string;
  created_at: string;
}


export default function LogbookShow() {
    const { query } = useShow({
      meta: {
        select: "*",
      },
    });
  
    const { data, isLoading } = query;
  
    const record = data?.data;

  console.log("Fetched logbook record:", record);

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1} sx={{ p: 2 }}>
        <Typography variant="body1" fontWeight="bold">
          Log ID
        </Typography>
        <TextField value={record?.id} />

        <Typography variant="body1" fontWeight="bold">
          UUID
        </Typography>
        <TextField value={record?.uid} />

        <Typography variant="body1" fontWeight="bold">
          Resource
        </Typography>
        <TextField value={record?.resource} />

        <Typography variant="body1" fontWeight="bold">
          Date
        </Typography>
        <DateField value={record?.date} />

        <Typography variant="body1" fontWeight="bold">
          Pilot in Command
        </Typography>
        <TextField value={record?.pic} />

        <Typography variant="body1" fontWeight="bold">
          Passengers
        </Typography>
        <TextField value={record?.pax} />

        <Typography variant="body1" fontWeight="bold">
          Departure
        </Typography>
        <TextField value={record?.departure} />

        <Typography variant="body1" fontWeight="bold">
          Arrival
        </Typography>
        <TextField value={record?.arrival} />

        <Typography variant="body1" fontWeight="bold">
          Offblock
        </Typography>
        <DateField value={record?.offblock} />

        <Typography variant="body1" fontWeight="bold">
          Takeoff
        </Typography>
        <DateField value={record?.takeoff} />

        <Typography variant="body1" fontWeight="bold">
          Landing
        </Typography>
        <DateField value={record?.landing} />

        <Typography variant="body1" fontWeight="bold">
          Onblock
        </Typography>
        <DateField value={record?.onblock} />

        <Typography variant="body1" fontWeight="bold">
          Landings
        </Typography>
        <TextField value={record?.landings} />

        <Typography variant="body1" fontWeight="bold">
          Flight Rules
        </Typography>
        <TextField value={record?.flightrules} />

        <Typography variant="body1" fontWeight="bold">
          Fuel
        </Typography>
        <TextField value={record?.fuel} />

        <Typography variant="body1" fontWeight="bold">
          Flight Type
        </Typography>
        <TextField value={record?.flight_type} />

        <Typography variant="body1" fontWeight="bold">
          Details
        </Typography>
        <MarkdownField value={record?.details} />

        <Typography variant="body1" fontWeight="bold">
          Billing Details
        </Typography>
        <TextField value={record?.billing_details} />

        <Typography variant="body1" fontWeight="bold">
          Created At
        </Typography>
        <DateField value={record?.created_at} />
      </Stack>
    </Show>
  );
}
