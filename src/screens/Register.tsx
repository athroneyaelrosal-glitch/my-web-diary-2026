import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useState } from "react";

function Register() {

  const navigate = useNavigate();

  const emptyEntry = {
    name: "",
    email: "",
    password: "",
    retypePassword: "",
    course: "",
    year: "",
  };

  const [entry, setEntry] = useState(emptyEntry);
  const [error, setError] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);

  function save() {

    let newError: any = {};

    if (!entry.email) newError.email = "Email is required";
    if (!entry.password) newError.password = "Password is required";
    if (!entry.course) newError.course = "Course is required";
    if (!entry.year) newError.year = "Year is required";

    if (entry.password !== entry.retypePassword) {
      newError.password = "Passwords did not match";
      newError.retypePassword = "Passwords did not match";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) return;

    navigate("/login");
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ pb: 2 }}>Register</Typography>

      <TextField
        fullWidth
        label="Name"
        value={entry.name}
        onChange={e => setEntry({ ...entry, name: e.target.value })}
        sx={{ mb: 2 }}
      />

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
        label="Course"
        error={!!error.course}
        helperText={error.course}
        value={entry.course}
        onChange={e => setEntry({ ...entry, course: e.target.value })}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }} error={!!error.year}>
        <InputLabel>Year</InputLabel>
        <Select
          value={entry.year}
          label="Year"
          onChange={(e) => setEntry({ ...entry, year: e.target.value })}
        >
          {[1,2,3,4].map(y => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        error={!!error.password}
        helperText={error.password}
        value={entry.password}
        onChange={e => setEntry({ ...entry, password: e.target.value })}
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <TextField
        fullWidth
        label="Retype Password"
        type={showPassword ? "text" : "password"}
        error={!!error.retypePassword}
        helperText={error.retypePassword}
        value={entry.retypePassword}
        onChange={e => setEntry({ ...entry, retypePassword: e.target.value })}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button variant="contained" onClick={save}>
          Register
        </Button>
      </Box>
    </Box>
  );
}

export default Register;