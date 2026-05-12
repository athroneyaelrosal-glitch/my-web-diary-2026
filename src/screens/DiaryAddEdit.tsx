import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SaveIcon from "@mui/icons-material/Save";
import {
    Alert,
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material"
import { Editor } from "@tinymce/tinymce-react";
import { format } from "date-fns/format";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { moodList, type DiaryEntryType } from "../diary/Diary";
import { user } from "../userState";
import { isSupabaseConfigured, supabase, supabaseConfigMessage } from "../supabaseClient";

function createEmptyEntry(): DiaryEntryType {
    return {
        date: new Date(),
        title: '',
        mood: 0,
        content: '',
        star: 1,
    }
}

function DiaryAddEdit() {
    const { id } = useParams();
    const navigate = useNavigate()
    const location = useLocation()
    const initialEntry = id === undefined ? createEmptyEntry() : (location.state as DiaryEntryType | null) ?? createEmptyEntry()
    const [entry, setEntry] = useState(initialEntry)
    const [photoPreview, setPhotoPreview] = useState('')
    const [photoError, setPhotoError] = useState('')

    function resizeImage(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onerror = () => reject(new Error('Unable to read the selected image.'))
            reader.onload = () => {
                const image = new Image()
                image.onerror = () => reject(new Error('Unable to load the selected image.'))
                image.onload = () => {
                    const maxSize = 1200
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
                    resolve(canvas.toDataURL('image/jpeg', 0.82))
                }
                image.src = String(reader.result ?? '')
            }
            reader.readAsDataURL(file)
        })
    }

    async function handlePhotoUpload(file?: File) {
        if (!file) return
        setPhotoError('')

        if (!file.type.startsWith('image/')) {
            setPhotoError('Please choose an image file.')
            return
        }

        try {
            setPhotoPreview(await resizeImage(file))
        } catch (error) {
            setPhotoError(error instanceof Error ? error.message : 'Unable to prepare the image.')
        }
    }

    function getContentForSave() {
        if (!photoPreview) {
            return entry.content
        }

        const photoHtml = `<figure class="diary-photo"><img src="${photoPreview}" alt="Diary upload" /><figcaption>Attached photo</figcaption></figure>`
        return `${entry.content || ''}${photoHtml}`
    }

    async function save() {
        if (!isSupabaseConfigured || !user.session) {
            navigate('/diarylist')
            return
        }

        const contentForSave = getContentForSave()

        try {
            if (entry.id === undefined) {
                const result = await supabase.from('entries').insert({
                    created_at: entry.date.toISOString(),
                    title: entry.title,
                    content: contentForSave,
                    mood: entry.mood,
                    star: entry.star,
                    user_id: user.session.user.id,
                })
                console.log(result)
            } else {
                const result = await supabase.from('entries').update({
                    id: entry.id,
                    created_at: entry.date.toISOString(),
                    title: entry.title,
                    content: contentForSave,
                    mood: entry.mood,
                    star: entry.star,
                    user_id: user.session.user.id,
                }).eq('id', entry.id)
                console.log(result)
            }
            navigate('/diarylist')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="h4">{id === undefined ? 'New diary entry' : 'Edit diary entry'}</Typography>
                    <Typography color="text.secondary">
                        Capture the moment, mood, rating, notes, and optional image preview.
                    </Typography>
                </Box>

                {!isSupabaseConfigured && (
                    <Alert severity="info">
                        {supabaseConfigMessage} Demo entries can still be previewed while you design.
                    </Alert>
                )}

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 180px 180px' }, gap: 2 }}>
                    <TextField
                        id="date"
                        label="Date/time"
                        variant="outlined"
                        value={format(entry.date, 'yyyy-MM-dd\'T\'HH:mm:ss')}
                        type="datetime-local"
                        onChange={event => {
                            const date = new Date(event.target.value)
                            if (isNaN(date.getTime())) return
                            setEntry({ ...entry, date })
                        }}
                    />
                    <FormControl>
                        <InputLabel id="mood-label">Mood</InputLabel>
                        <Select
                            labelId="mood-label"
                            id="mood-select"
                            value={entry.mood ?? 0}
                            label="Mood"
                            onChange={(event) => setEntry({ ...entry, mood: Number(event.target.value) })}
                        >
                            {moodList.map((item) => (
                                <MenuItem value={item.mood} key={item.mood}>
                                    <Box component='span' sx={{ fontSize: '1.6em', mr: 1 }}>
                                        {item.icon}
                                    </Box>
                                    {item.text}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="starlabel">Rating</InputLabel>
                        <Select
                            labelId="starlabel"
                            id="star"
                            label="Rating"
                            value={entry.star}
                            onChange={event => setEntry({ ...entry, star: Number(event.target.value) })}
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <MenuItem value={star} key={star}>{star} {star === 1 ? 'star' : 'stars'}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <TextField
                    fullWidth
                    id="title"
                    label="Title"
                    variant="outlined"
                    value={entry.title}
                    onChange={event => setEntry({ ...entry, title: event.target.value })}
                />

                <Box>
                    <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateIcon />}>
                        Upload picture preview
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(event) => handlePhotoUpload(event.target.files?.[0])}
                        />
                    </Button>
                    {photoError && (
                        <Alert severity="error" sx={{ mt: 1.5 }}>
                            {photoError}
                        </Alert>
                    )}
                    {photoPreview && (
                        <Box
                            component="img"
                            src={photoPreview}
                            alt="Uploaded diary preview"
                            sx={{
                                mt: 2,
                                width: '100%',
                                maxHeight: 280,
                                objectFit: 'cover',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        />
                    )}
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Entry content</Typography>
                    <Editor
                        tinymceScriptSrc={`/tinymce/tinymce.min.js`}
                        value={entry.content}
                        onEditorChange={(content: string) => setEntry({ ...entry, content })}
                        init={{
                            height: 420,
                            menubar: false,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'charmap', 'emoticons'
                            ],
                            toolbar: 'undo redo fullscreen | bold italic underline | link unlink | ' +
                                'forecolor backcolor removeformat | align numlist bullist outdent indent | ' +
                                'table charmap emoticons | code preview help',
                            toolbar_mode: 'sliding',
                            content_style: 'body { font-family: Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.7; }'
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        Tip: type coordinates like [14.6111512, 120.9749947] to create a clickable map link in the diary list.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => navigate('/diarylist')}>Cancel</Button>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={save}>Save</Button>
                </Stack>
            </Stack>
        </Paper>
    )
}

export default DiaryAddEdit
