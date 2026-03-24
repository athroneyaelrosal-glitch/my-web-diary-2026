import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useState } from "react";

function Login() {

  const navigate = useNavigate();

  const [entry, setEntry] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState<any>({});

  function login() {

    let newError: any = {};

    if (!entry.email) newError.email = "Email is required";
    if (!entry.password) newError.password = "Password is required";

    setError(newError);

    if (Object.keys(newError).length > 0) return;

    navigate("/dashboard");
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ pb: 2 }}>Login</Typography>

      <TextField
        fullWidth
        label="Email"
        error={!!error.email}
        helperText={error.email}
        value={entry.email}
        onChange={e => setEntry({ ...entry, email: e.target.value })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        error={!!error.password}
        helperText={error.password}
        value={entry.password}
        onChange={e => setEntry({ ...entry, password: e.target.value })}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button variant="contained" onClick={login}>
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default Login;