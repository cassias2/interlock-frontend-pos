import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid, TextField, Typography } from "@mui/material";
import { AuthContext, AuthData } from "@/context/AuthContext";

interface DialogLoginProps {
  open: boolean;
  onClose: () => void;
  handleUserLogin: (matricula: string, password: string) => void;
}

const DialogLogin: React.FC<DialogLoginProps> = ({ open, handleUserLogin }) => {
  const { error, setError }: AuthData = useContext(AuthContext);
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");

  const handleMatriculaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMatricula(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab" || event.key === "Enter") {
      handleUserSubmit();
    }
  };

  const handleUserSubmit = () => {
    if (!matricula || !password) {
      setError("Usuário ou senha vazios");
      return;
    }
    handleUserLogin(matricula, password);
    setMatricula("");
    setPassword("");
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Login</DialogTitle>
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
        Acessar
      </Button>
    </Dialog>
  );
};

export default DialogLogin;
