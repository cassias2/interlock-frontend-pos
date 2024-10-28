import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid, TextField, Typography } from "@mui/material";

interface ByPassModalProps {
  open: boolean;
  onClose: () => void;
  handleByPass: (matricula: string, password: string) => void;
  validateCloseLot: boolean;
}

const ByPassModal: React.FC<ByPassModalProps> = ({
  open,
  onClose,
  handleByPass,
  validateCloseLot,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");

  const handleUserSubmit = async () => {
    setError("");

    if (!matricula || !password) {
      setError("Usuário ou senha vazios");
      return;
    }

    const response: any = await handleByPass(matricula, password);

    if (response.status) {
      setMatricula("");
      setPassword("");
      setError(response.message);
    } else {
      setMatricula("");
      setPassword("");
      onClose();
    }
  };

  const handleMatriculaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMatricula(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleUserSubmit();
    }
  };

  return (
    <Dialog open={open && validateCloseLot}>
      <DialogTitle>Fechar Lote</DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={1}>
          <Grid item xs={12}>
            <TextField
              sx={{ marginTop: 2 }}
              fullWidth
              tabIndex={1}
              label="Matricula"
              variant="outlined"
              value={matricula}
              onChange={handleMatriculaChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Senha"
              tabIndex={2}
              variant="outlined"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyDown}
            />
          </Grid>
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
        </Grid>
      </DialogContent>
      <Button
        variant="contained"
        tabIndex={3}
        color="success"
        onClick={handleUserSubmit}
      >
        Confirmar
      </Button>
    </Dialog>
  );
};

export default ByPassModal;
