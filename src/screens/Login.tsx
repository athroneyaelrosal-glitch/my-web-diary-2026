import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { isSupabaseConfigured, supabase, supabaseConfigMessage } from "../supabaseClient";
import { user } from "../userState";

function Login() {

    const navigate = useNavigate()
    const emptyEntry = {
        email: '',
        password: '',
    }
    const [entry, setEntry] = useState(emptyEntry)
    const [error, setError] = useState(emptyEntry)
    const [otherError, setOtherError] = useState('')
    const [resetMessage, setResetMessage] = useState('')
    const [resetLoading, setResetLoading] = useState(false)

    async function forgotPassword() {
        setOtherError('')
        setResetMessage('')

        if (!isSupabaseConfigured) {
            setOtherError(supabaseConfigMessage)
            return
        }

        const email = entry.email.trim()
        if (!email) {
            setOtherError('Please enter your email address to reset your password.')
            return
        }

        setResetLoading(true)
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email)
            if (error) {
                setOtherError(error.message)
            } else {
                setResetMessage('Password reset email sent. Check your inbox.')
            }
        } catch (error) {
            setOtherError(error instanceof Error ? error.message : 'Unable to send password reset email.')
        } finally {
            setResetLoading(false)
        }
    }

    function login() {
        if (!isSupabaseConfigured) {
            setOtherError(supabaseConfigMessage)
            return
        }

        // validate
        setError(emptyEntry)
        if (entry.email === '' || entry.password === '') {
            const err = { ...error }
            if (entry.email === '') {
                err.email = 'Email is required'
            }
            if (entry.password === '') {
                err.password = 'Password is required'
            }
            setError(err)
            return
        }
        // login to Supabase
        supabase.auth.signInWithPassword({
            email: entry.email,
            password: entry.password.trim()
        }).then(({ data, error }) => {
            //Log.d(data)
            if (error) {
                console.log(error.message)
                setOtherError(error.message)
            } else {
                console.log(data)
                user.session = data.session
                user.email = data.user.email ?? null
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
        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, border: '1px solid', borderColor: 'divider', maxWidth: 520, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box component="img" src="/logo.svg" alt="My Diary logo" sx={{ width: 72, height: 72 }} />
            </Box>
            <Typography variant="h4" component="h4" sx={{ pb: 1 }}>Login</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>Sign in to save and sync your diary entries.</Typography>
            <TextField
                fullWidth
                id="email"
                label="Email"
                error={error.email.length > 0}
                helperText={error.email}
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
            {resetMessage && (
                <Alert severity="success" sx={{ mb: 1 }}>
                    {resetMessage}
                </Alert>
            )}
            <Typography color='error'>{otherError}</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                <Button disabled={resetLoading} variant="text" onClick={forgotPassword}>
                    Forgot password?
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="outlined" onClick={() => navigate('/')}>Cancel</Button>
                <Button variant="contained" onClick={() => login()} sx={{ ml: 1 }}>
                    Login
                </Button>
            </Stack>
        </Paper>
    )
}

export default Login
