import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Checkbox,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import ProductInfo from "./ProductInfo";
import { AdminInterlockRequest, InterlockData } from "@/interface";

interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  data: InterlockData;
  handleLoginAdm: (formData: AdminInterlockRequest) => void;
}

const DialogComponent: React.FC<ModalComponentProps> = ({
  open,
  onClose,
  data,
  handleLoginAdm,
}) => {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ignoreChecked, setIgnoreChecked] = useState<boolean>(false);
  const [disableChecked, setDisableChecked] = useState<boolean>(false);

  useEffect(() => {
    if (data.status === "4") {
      setIgnoreChecked(true);
      setDisableChecked(true);
    }
  }, [data.status]);

  const handleConfirmClick = async () => {
    setError("");

    const status = ignoreChecked ? "4" : "";

    const loginData = {
      sn_he: data.snValue,
      lote: data.lotValue,
      part_number: data.partNumberValue,
      matricula: matricula,
      password: password,
      status: status,
    };

    const response: any = await handleLoginAdm(loginData);

    if (response.status) {
      setError(response.message);
    } else {
      setMatricula("");
      setPassword("");
      setIgnoreChecked(false);
      onClose();
    }
  };

  const handleIgnoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIgnoreChecked(event.target.checked);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleConfirmClick();
    }
  };

  const getStatusInfo = (result: string | null) => {
    switch (result) {
      case "PENDING":
        return { color: "blue", text: "Pending" };
      case "WAITING":
        return { color: "blue", text: "Waiting" };
      case "PASS":
        return { color: "green", text: "Pass" };
      case "FAIL":
        return { color: "red", text: "Fail" };
      case "PARTIAL - PASS":
        return { color: "green", text: "Partial Pass" };
      case null:
        return { color: "orange", text: "Not Tested" };
      default:
        return { color: "black", text: "Unknown" };
    }
  };
  const statusInfo = getStatusInfo(data.result);

  const getStatusRealInfo = (result: string | null) => {
    let statusText;
    let statusColor;
    switch (result) {
      case "0":
        statusText = "Pass";
        statusColor = "green";
        break;
      case "1":
        statusText = "Retest 1";
        statusColor = "blue";
        break;
      case "2":
        statusText = "Retest 2";
        statusColor = "blue";
        break;
      case "3":
        statusText = "Retest 3";
        statusColor = "blue";
        break;
      case "4":
        statusText = "Ignore";
        statusColor = "red";
        break;
      default:
        statusText = "Waiting status";
        statusColor = "orange";
    }

    return { color: statusColor, text: statusText };
  };
  const statusRealInfo = getStatusRealInfo(data.status);

  return (
    <Dialog id={"dialog"} open={open} onKeyDown={handleKeyDown}>
      {open && (
        <>
          <DialogTitle>Falha Interlock</DialogTitle>
          <DialogContent>
            <Grid container direction="column">
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Serial Number</TableCell>
                      <TableCell align="center">Result</TableCell>
                      <TableCell align="center">Lote</TableCell>
                      <TableCell align="center">Part Number</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow
                      key={data.snValue}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">{data.snValue}</TableCell>
                      <TableCell>
                        <ProductInfo
                          label={statusInfo.text}
                          color={statusInfo.color}
                        />
                      </TableCell>
                      <TableCell align="center">{data.lotValue}</TableCell>
                      <TableCell align="center">
                        {data.partNumberValue}
                      </TableCell>
                      <TableCell align="center">
                        <ProductInfo
                          label={statusRealInfo.text}
                          color={statusRealInfo.color}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                component="form"
                sx={{
                  "& .MuiTextField-root": {
                    margin: "2ch 1ch 0ch 0ch",
                    width: "100%",
                  },
                }}
                noValidate
                autoComplete="off"
              >
                {"Ignorar Interlock e continuar?"}
                <Checkbox
                  checked={ignoreChecked ?? false}
                  onChange={handleIgnoreChange}
                  disabled={disableChecked}
                />
                {ignoreChecked && (
                  <>
                    <TextField
                      label="Matricula"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                    />
                    <TextField
                      label="Senha"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </>
                )}
              </Box>
              {error && (
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleConfirmClick}
              color="success"
              variant="contained"
            >
              Confirmar
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default DialogComponent;
