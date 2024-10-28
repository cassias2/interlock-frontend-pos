import React from "react";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import { InterlockData } from "@/interface";

interface ListComponentProps {
  interlockDataArray: InterlockData[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.common.black,
  position: "sticky",
  top: 0,
  zIndex: 1,
  fontSize: 14,
  fontWeight: "bold",
}));

const ListComponent: React.FC<ListComponentProps> = ({
  interlockDataArray,
}) => {
  const getResultColor = (result: string | null): string => {
    if (result === "PASS") {
      return "green";
    } else if (result === "FAIL") {
      return "red";
    } else {
      return "blue";
    }
  };

  const getStatusColor = (status: string | null, result: string | null) => {
    let statusColor;
    if (status === "0" && result === "PASS") {
      statusColor = "green";
    } else if (status === "0" && result != "PASS") {
      statusColor = "blue";
    } else if (status === "1" || status === "2" || status === "3") {
      statusColor = "blue";
    } else if (status === "4") {
      statusColor = "red";
    } else {
      statusColor = "orange";
    }
    return statusColor;
  };

  return (
    <Grid container>
      <TableContainer
        component={Paper}
        style={{ maxHeight: 400, overflow: "auto" }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">SN_HE</StyledTableCell>
              <StyledTableCell align="center">Result</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interlockDataArray
              .filter((item) => !!item.status)
              .sort((a, b) => {
                if (a.updatedAt < b.updatedAt) {
                  return 1;
                }
                if (a.updatedAt > b.updatedAt) {
                  return -1;
                }
                return 0;
              })
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{item.sn_he}</TableCell>
                  <TableCell align="center">
                    <span
                      style={{
                        color: getResultColor(item.result),
                        fontWeight: "bold",
                      }}
                    >
                      {item.result == null ? "NOT TESTED" : item.result}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <span
                      style={{
                        color: getStatusColor(item.status, item.result),
                        fontWeight: "bold",
                      }}
                    >
                      {item.status === "0" && item.result === "PASS"
                        ? "Pass"
                        : item.status === "0" && item.result !== "PASS"
                        ? "Retest 1"
                        : item.status === "1" && item.result !== "PASS"
                        ? "Retest 1"
                        : item.status === "2" && item.result !== "PASS"
                        ? "Retest 2"
                        : item.status === "3" && item.result !== "PASS"
                        ? "Retest 3"
                        : item.status === "4" && item.result !== "PASS"
                        ? "Ignore"
                        : "Not tested"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default ListComponent;
