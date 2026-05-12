import AccountBoxIcon from '@mui/icons-material/AccountBox'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import MicIcon from '@mui/icons-material/Mic'
import SearchIcon from '@mui/icons-material/Search'
import StarIcon from '@mui/icons-material/Star'
import {
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Rating,
    Select,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material"
import type { PostgrestError } from "@supabase/supabase-js"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@mui/material/styles"
import { moodList, sampleDiary, type DiaryEntryType } from "./Diary"
import { user } from "../userState"
import { isSupabaseConfigured, supabase } from "../supabaseClient"

type EntryRow = {
    id?: string,
    created_at?: string | null,
    title?: string | null,
    mood?: number | null,
    content?: string | null,
    star?: number | null,
}

function stripHtml(text: string) {
    return text.replace(/<[^>]*>/g, ' ')
}

function DiaryList() {
    const [diaryList, setDiaryList] = useState<DiaryEntryType[]>([])
    const [filter, setFilter] = useState('')
    const [filterMood, setFilterMood] = useState(-1)
    const [minimumStar, setMinimumStar] = useState(0)
    const [sort, setSort] = useState('newest')

    const moodListExtra = useMemo(() => [{
        mood: -1,
        text: 'All moods',
        icon: <AccountBoxIcon sx={{ color: '#0099ff', fontSize: 'inherit' }} />,
    }, ...moodList], [])

    function applyLocalFilters(entries: DiaryEntryType[]) {
        const search = filter.trim().toLowerCase()
        const filtered = entries.filter((entry) => {
            const matchesSearch = !search ||
                entry.title.toLowerCase().includes(search) ||
                stripHtml(entry.content).toLowerCase().includes(search)
            const matchesMood = filterMood === -1 || entry.mood === filterMood
            const matchesStars = minimumStar === 0 || entry.star === minimumStar
            return matchesSearch && matchesMood && matchesStars
        })

        return [...filtered].sort((a, b) => {
            if (sort === 'highest') return b.star - a.star
            if (sort === 'lowest') return a.star - b.star
            if (sort === 'oldest') return a.date.getTime() - b.date.getTime()
            return b.date.getTime() - a.date.getTime()
        })
    }

    function loadEntries() {
        if (!isSupabaseConfigured || !user.email) {
            setDiaryList(applyLocalFilters(sampleDiary))
            return
        }

        let query = supabase
            .from('entries')
            .select()
            .order('created_at', { ascending: sort === 'oldest' })
            .limit(50)

        if (filter) {
            query = query.textSearch('search_vector', filter, { type: 'websearch' })
        }

        if (filterMood !== -1) {
            query = query.eq('mood', filterMood)
        }

        query.then(({ data, error }) => {
            processEntries(data, error)
        })
    }

    function processEntries(data: EntryRow[] | null, error: PostgrestError | null) {
        if (!error && data) {
            const entries = data.map(item => ({
                id: item.id,
                date: item.created_at ? new Date(item.created_at) : new Date(),
                title: item.title ?? '',
                mood: item.mood ?? 1,
                content: item.content ?? '',
                star: item.star ?? 1,
            }))
            setDiaryList(applyLocalFilters(entries))
        } else {
            setDiaryList(applyLocalFilters(sampleDiary))
        }
    }

    function clearFilters() {
        setFilter('')
        setFilterMood(-1)
        setMinimumStar(0)
        setSort('newest')
        setDiaryList([...sampleDiary].sort((a, b) => b.date.getTime() - a.date.getTime()))
    }

    useEffect(() => {
        loadEntries()
    }, [filterMood, minimumStar, sort])

    return (
        <Stack spacing={2.5}>
            <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, border: '1px solid', borderColor: 'divider' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', md: 'center' }}>
                    <TextField
                        id="filter"
                        label="Search diary"
                        size="small"
                        value={filter}
                        onChange={event => setFilter(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') loadEntries()
                        }}
                        sx={{ flexGrow: 1 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="mood-label">Mood</InputLabel>
                        <Select
                            labelId="mood-label"
                            id="mood-select"
                            value={filterMood}
                            label="Mood"
                            onChange={(event) => setFilterMood(Number(event.target.value))}
                        >
                            {moodListExtra.map((item) => (
                                <MenuItem value={item.mood} key={item.mood}>
                                    <Box component='span' sx={{ fontSize: '1.4em', mr: 1 }}>
                                        {item.icon}
                                    </Box>
                                    {item.text}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel id="rating-label">Rating</InputLabel>
                        <Select
                            labelId="rating-label"
                            id="rating-select"
                            value={minimumStar}
                            label="Rating"
                            onChange={(event) => setMinimumStar(Number(event.target.value))}
                        >
                            <MenuItem value={0}>Any rating</MenuItem>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <MenuItem value={star} key={star}>{star} {star === 1 ? 'star' : 'stars'}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel id="sort-label">Sort</InputLabel>
                        <Select
                            labelId="sort-label"
                            id="sort-select"
                            value={sort}
                            label="Sort"
                            onChange={(event) => setSort(event.target.value)}
                        >
                            <MenuItem value="newest">Any sort</MenuItem>
                            <MenuItem value="newest">Newest first</MenuItem>
                            <MenuItem value="oldest">Oldest first</MenuItem>
                            <MenuItem value="highest">Highest rated</MenuItem>
                            <MenuItem value="lowest">Lowest rated</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" startIcon={<SearchIcon />} onClick={loadEntries}>
                        Search
                    </Button>
                    <Tooltip title="Clear filters">
                        <IconButton onClick={clearFilters} aria-label="clear filters">
                            <FilterAltOffIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                    Showing {diaryList.length} {diaryList.length === 1 ? 'entry' : 'entries'}
                </Typography>
            </Paper>

            <Stack spacing={1.5}>
                {diaryList.map((entry, index) => (
                    <DiaryEntry entry={entry} id={index} key={entry.id || `${entry.title}-${index}`} />
                ))}
            </Stack>
        </Stack>
    )
}

export function DiaryEntry(prop: { entry: DiaryEntryType, id: number, show?: boolean }) {
    const { entry, show } = prop
    const navigate = useNavigate()
    const [expand, setExpand] = useState(Boolean(show))
    const [photoModalOpen, setPhotoModalOpen] = useState(false)
    const [photoModalSrc, setPhotoModalSrc] = useState('')
    const theme = useTheme()
    const mood = moodList[entry.mood]
    
    const hasLocation = /\[(-?\d+\.?\d*),\s*(-?\d+\.?\d*)\]/.test(entry.content)
    const hasAudio = /<audio[^>]*>/i.test(entry.content)
    const locationMatch = entry.content.match(/\[(-?\d+\.?\d*),\s*(-?\d+\.?\d*)\]/)
    const audioMatch = entry.content.match(/<audio[^>]*src=["\']([^"\']+)["\'][^>]*><\/audio>/i)
    const photoMatches = Array.from(entry.content.matchAll(/<figure class="diary-photo">[\s\S]*?<img\s+src="([^"]+)"[^>]*>[\s\S]*?<\/figure>/gi)).map((match) => match[1])

    function stripMediaFromContent(text: string): string {
        return text
            .replace(/<audio[^>]*>.*?<\/audio>/gi, '')
            .replace(/<figure class="diary-photo">.*?<\/figure>/gi, '')
            .replace(/\[(-?\d+\.?\d*),\s*(-?\d+\.?\d*)\]/g, '')
            .replace(/<p>\s*<\/p>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')

            .trim()
    }

    function openPhotoModal(src: string) {
        setPhotoModalSrc(src)
        setPhotoModalOpen(true)
    }

    const cleanContent = stripMediaFromContent(entry.content)

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    border: '1px solid',
                    borderColor: expand ? 'primary.light' : 'divider',
                    backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : '#ffffff',
                }}
            >
                <Box sx={{ p: { xs: 2, md: 2.5 } }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'flex-start' }}>
                        <Box
                            sx={{
                                width: 58,
                                height: 58,
                                borderRadius: 2,
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: 32,
                                flexShrink: 0,
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(129,140,248,0.18)' : 'rgba(79,70,229,0.10)',
                            }}
                        >
                            {mood?.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {entry.date.toLocaleString()}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        onClick={() => setExpand(!expand)}
                                        sx={{ cursor: 'pointer', lineHeight: 1.25 }}
                                    >
                                        {entry.title || 'Untitled entry'}
                                    </Typography>
                                </Box>
                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                    {mood && <Chip size="small" label={mood.text} color="primary" variant="outlined" />}
                                    {hasLocation && <Chip size="small" icon={<LocationOnIcon />} label="Map link" variant="outlined" />}
                                    {hasAudio && <Chip size="small" icon={<MicIcon />} label="Voice memo" variant="outlined" />}
                                    <Rating value={entry.star} max={5} readOnly size="small" icon={<StarIcon fontSize="inherit" />} emptyIcon={<StarIcon fontSize="inherit" />} />
                                    <Tooltip title="Edit entry">
                                        <IconButton onClick={() => navigate(`/diaryedit/${entry.id}`, { state: entry })} aria-label="edit entry">
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>

                    {expand && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Stack spacing={2.5}>
                                {cleanContent && (
                                    <Box>
                                        <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary' }}>
                                            {cleanContent.replace(/<[^>]*>/g, '')}
                                        </Typography>
                                    </Box>
                                )}

                                {hasAudio && audioMatch && (
                                    <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                            Voice memo
                                        </Typography>
                                        <audio
                                            controls
                                            src={audioMatch[1]}
                                            style={{
                                                width: '100%',
                                                maxWidth: 400,
                                            }}
                                        />
                                    </Box>
                                )}

                                {photoMatches.length > 0 && (
                                    <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                                            Photos
                                        </Typography>
                                        <Stack spacing={2}>
                                            {photoMatches.map((src, index) => (
                                                <Box
                                                    key={`${src}-${index}`}
                                                    component="img"
                                                    src={src}
                                                    alt={`Diary photo ${index + 1}`}
                                                    onClick={() => openPhotoModal(src)}
                                                    sx={{
                                                        width: '100%',
                                                        maxHeight: 280,
                                                        objectFit: 'contain',
                                                        borderRadius: 2,
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                                        backgroundColor: 'background.default',
                                                        '&:hover': {
                                                            transform: 'scale(1.02)',
                                                            boxShadow: 2,
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                )}

                                {locationMatch && (
                                    <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                            Location
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<LocationOnIcon />}
                                            onClick={() => navigate(`/map/${locationMatch[1]},${locationMatch[2]},16`)}
                                        >
                                            View on map: [{locationMatch[1]}, {locationMatch[2]}]
                                        </Button>
                                    </Box>
                                )}
                            </Stack>
                        </>
                    )}
                </Box>
            </Paper>

            <Modal
                open={photoModalOpen}
                onClose={() => setPhotoModalOpen(false)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        component="img"
                        src={photoModalSrc}
                        alt="Fullscreen photo"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                        }}
                    />
                    <IconButton
                        onClick={() => setPhotoModalOpen(false)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Modal>
        </>
    )
}

export default DiaryList
