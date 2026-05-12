import { Button, Paper, TextField, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { isSupabaseConfigured, supabase, supabaseConfigMessage } from "../supabaseClient";
import { user } from "../userState";

function Register() {

    const navigate = useNavigate()
    const emptyEntry = {
        name: '',
        email: '',
        password: '',
        retypePassword: '',
    }
    const [entry, setEntry] = useState(emptyEntry)
    const [error, setError] = useState(emptyEntry)
    const [otherError, setOtherError] = useState('')

    function save() {
        if (!isSupabaseConfigured) {
            setOtherError(supabaseConfigMessage)
            return
        }

        // validate
        setError(emptyEntry)
        if (entry.password !== entry.retypePassword) {
            setError({
                ...error, password: 'Paswords did not match', retypePassword: 'Paswords did not match'
            })
            return
        }
        // register to Supabase
        supabase.auth.signUp({
            email: entry.email,
            password: entry.password.trim(),
            options: {
                data: {
                    full_name: entry.name,
                },
            },
        }).then(({ data, error }) => {
            //Log.d(data)
            if (error) {
                console.log(error.message)
                setOtherError(error.message)
            } else {
                console.log(data)
                user.session = data.session
                user.email = data.user?.email ?? null
                navigate('/')
            }
        }).catch((error) => {
            console.log(error)
            setOtherError(error.error_description || error.message)
        }).finally(() => {
            //setLoading(false)
        })
    }

    return (
        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, border: '1px solid', borderColor: 'divider', maxWidth: 560, mx: 'auto' }}>
            <Typography variant="h4" component="h4" sx={{ pb: 1 }}>Register</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>Create an account to connect your diary to Supabase.</Typography>
            <TextField
                fullWidth
                id="name"
                label="Name"
                variant="outlined"
                value={entry.name}
                onChange={event => {
                    setEntry({
                        ...entry, name: event.target.value
                    })
                }}
                sx={{
                    "& .MuiInputBase-root": {
                        height: '65px'
                    },
                    mr: 0.5,
                    mb: 1.5
                }}
            />
            <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                value={entry.email}
                onChange={event => {
                    setEntry({
                        ...entry, email: event.target.value
                    })
                }}
                sx={{
                    "& .MuiInputBase-root": {
                        height: '65px'
                    },
                    mr: 0.5,
                    mb: 1.5
                }}
            />
            <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                error={error.password.length > 0}
                helperText={error.password}
                variant="outlined"
                value={entry.password}
                onChange={event => setEntry({
                    ...entry, password: event.target.value
                })}
                sx={{
                    mb: 1.5
                }}
            />
            <TextField
                fullWidth
                id="retypePassword"
                label="Retype Password"
                type="password"
                error={error.retypePassword.length > 0}
                helperText={error.retypePassword}
                variant="outlined"
                value={entry.retypePassword}
                onChange={event => setEntry({
                    ...entry, retypePassword: event.target.value
                })}
                sx={{
                    mb: 1.5
                }}
            />
            <Typography color='error'>{otherError}</Typography>
            <Button variant="outlined" onClick={() => navigate('/')}>Cancel</Button>
            <Button variant="contained" onClick={() => save()} sx={{ ml: 1 }}>Register</Button>
        </Paper>
    )
}

export default Register
