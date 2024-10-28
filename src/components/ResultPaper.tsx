import { Grid, Paper, Typography } from "@mui/material";
import React from "react";

interface ResultPaperProps {
  result: string;
  totalCount: number;
  serialNumber: string;
  ready: number;
  passAndIgnore: number;
}

const ResultPaper: React.FC<ResultPaperProps> = ({
  result,
  totalCount,
  serialNumber,
  ready,
  passAndIgnore,
}) => {
  const totalTest = ready - passAndIgnore;

  const getStatusInfo = () => {
    switch (result) {
      case "PENDING":
        return { text: "Pending", color: "blue" };
      case "WAITING":
        return { color: "blue", text: "Waiting" };
      case "PASS":
        return { text: "Pass", color: "green" };
      case "FAIL":
        return { text: "Fail", color: "red" };
      case "PARTIAL - PASS":
        return { text: "Partial Pass", color: "green" };
      case null:
        return { text: "Not Tested", color: "orange" };
      default:
        return { text: "Unknown", color: "black" };
    }
  };

  return (
    <Paper
      elevation={3}
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
        gap: 2,
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight={"bold"}>
        {serialNumber}
      </Typography>
      <Typography
        variant="h5"
        gutterBottom
        style={{
          color: getStatusInfo().color,
        }}
      >
        <span style={{ color: "black", fontWeight: "bold" }}>Result: </span>
        {getStatusInfo().text}
      </Typography>

      <Grid
        container
        spacing={2}
        justifyContent="space-around"
        style={{ width: "100%" }}
      >
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>
            <span style={{ fontWeight: "bold" }}>Total</span>: {totalCount}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>
            <span style={{ fontWeight: "bold" }}>Read</span>: {ready}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>
            <span style={{ fontWeight: "bold" }}>Pass/Ignore</span>:
            {passAndIgnore}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" gutterBottom>
            <span style={{ fontWeight: "bold" }}>Retest</span>: {totalTest}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ResultPaper;
