import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Avatar, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { isSupabaseConfigured, supabase, supabaseConfigMessage } from '../supabaseClient'
import { user } from '../userState'

function resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('Unable to read the selected image.'))
        reader.onload = () => {
            const image = new Image()
            image.onerror = () => reject(new Error('Unable to load the selected image.'))
            image.onload = () => {
                const maxSize = 320
                const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
                const canvas = document.createElement('canvas')
                canvas.width = Math.round(image.width * scale)
                canvas.height = Math.round(image.height * scale)
                const context = canvas.getContext('2d')
                if (!context) {
                    reject(new Error('Image processing is not available in this browser.'))
                    return
                }
                context.drawImage(image, 0, 0, canvas.width, canvas.height)
                resolve(canvas.toDataURL('image/jpeg', 0.8))
            }
            image.src = String(reader.result ?? '')
        }
        reader.readAsDataURL(file)
    })
}

function Profile() {
    const navigate = useNavigate()
    const currentAvatar = (user.session?.user.user_metadata as any)?.avatar_url as string | undefined
    const [avatarPreview, setAvatarPreview] = useState<string>(currentAvatar ?? '')
    const [avatarError, setAvatarError] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [statusMessage, setStatusMessage] = useState('')
    const [otherError, setOtherError] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        return () => {
            if (avatarPreview.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview)
            }
        }
    }, [avatarPreview])

    async function handleAvatarUpload(file?: File) {
        if (!file) return
        setAvatarError('')
        if (!file.type.startsWith('image/')) {
            setAvatarError('Please choose an image file.')
            return
        }

        try {
            setAvatarPreview(await resizeImage(file))
        } catch (error) {
            setAvatarError(error instanceof Error ? error.message : 'Unable to prepare the image.')
        }
    }

    async function saveProfile() {
        setOtherError('')
        setStatusMessage('')

        if (!isSupabaseConfigured || !user.session) {
            setOtherError(supabaseConfigMessage)
            return
        }

        const trimmedPassword = newPassword.trim()
        if (trimmedPassword || confirmPassword.trim()) {
            if (trimmedPassword !== confirmPassword.trim()) {
                setOtherError('New password and confirmation must match.')
                return
            }
            if (trimmedPassword.length < 6) {
                setOtherError('Password must be at least 6 characters.')
                return
            }
        }

        setIsSaving(true)

        try {
            const updatePayload: any = {}
            if (trimmedPassword) {
                updatePayload.password = trimmedPassword
            }
            if (avatarPreview) {
                updatePayload.data = { avatar_url: avatarPreview }
            }

            if (!updatePayload.password && !updatePayload.data) {
                setOtherError('Make a change before saving.')
                return
            }

            const { data, error } = await supabase.auth.updateUser(updatePayload)
            if (error) {
                throw error
            }

            const sessionResult = await supabase.auth.getSession()
            if (sessionResult.data?.session) {
                user.session = sessionResult.data.session
                user.email = sessionResult.data.session.user.email ?? null
            }

            setNewPassword('')
            setConfirmPassword('')
            setStatusMessage('Profile updated successfully.')
        } catch (error) {
            setOtherError(error instanceof Error ? error.message : 'Unable to update profile.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, border: '1px solid', borderColor: 'divider', maxWidth: 560, mx: 'auto' }}>
            <Typography variant="h4" component="h4" sx={{ pb: 1 }}>Edit profile</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
                Update your profile picture and change your account password.
            </Typography>
            <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Avatar
                        sx={{ width: 84, height: 84 }}
                        src={avatarPreview || '/static/images/avatar/2.jpg'}
                        alt={user.email ?? 'Profile'}
                    />
                    <Button component="label" variant="outlined">
                        Upload photo
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={event => handleAvatarUpload(event.target.files?.[0])}
                        />
                    </Button>
                </Box>
                {avatarError && <Alert severity="error">{avatarError}</Alert>}
                <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    value={user.email ?? ''}
                    disabled
                />
                <TextField
                    fullWidth
                    id="new-password"
                    label="New password"
                    type="password"
                    value={newPassword}
                    onChange={event => setNewPassword(event.target.value)}
                />
                <TextField
                    fullWidth
                    id="confirm-password"
                    label="Confirm new password"
                    type="password"
                    value={confirmPassword}
                    onChange={event => setConfirmPassword(event.target.value)}
                />
                {otherError && <Alert severity="error">{otherError}</Alert>}
                {statusMessage && <Alert severity="success">{statusMessage}</Alert>}
                <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => navigate('/')}>Cancel</Button>
                    <Button variant="contained" onClick={saveProfile} disabled={isSaving}>
                        Save profile
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    )
}

export default Profile
