import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import Tooltip from '@mui/material/Tooltip'
import { blue } from "@mui/material/colors"
import { moodList, sampleDiary, type DiaryEntryType } from "./Diary"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useTheme } from "@mui/material/styles"
import { supabase } from "../supabaseClient"
import { user } from "../App"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import type { PostgrestError } from "@supabase/supabase-js"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import AccountBoxIcon from '@mui/icons-material/AccountBox';

function DiaryList() {
    const [diaryList, setDiaryList] = useState<DiaryEntryType[]>([])
    const [filter, setFilter] = useState('')
    const [filterMood, setFilterMood] = useState(-1)

    // ✅ FIXED: Added filterMood to dependency array so it refreshes on change
    useEffect(() => {
        loadEntries()
    }, [user.email, filterMood])

    function loadEntries() {
        let query = supabase
            .from('entries')
            .select()
            .order('created_at', { ascending: false })
            .limit(20)

        if (filter) {
            query = query.textSearch('search_vector', filter, { type: 'websearch' })
        }

        // ✅ REQUIREMENT 4: Mood filter works even when Category is "All" (-1)
        if (filterMood !== -1) {
            query = query.eq('mood', filterMood)
        }

        query.then(({ data, error }) => {
            processEntries(data, error)
        })
    }

    function processEntries(data: any[] | null, error: PostgrestError | null) {
        if (!error && data) {
            const entries = data.map(item => ({
                id: item.id,
                date: item.created_at ? new Date(item.created_at) : new Date(),
                title: item.title ?? '',
                mood: item.mood ?? 1,
                content: item.content ?? '',
                star: item.star ?? 1,
            }))
            setDiaryList(entries)
        } else {
            setDiaryList(sampleDiary)
        }
    }

    const moodListExtra = [{
        mood: -1,
        text: 'All',
        icon: <AccountBoxIcon sx={{ color: '#0099ff', fontSize: 'inherit' }} />,
    }, ...moodList]

    return (
        <>
            <FormControl>
                <InputLabel id="mood-label">Mood</InputLabel>
                <Select
                    labelId="mood-label"
                    id="mood-select"
                    value={filterMood}
                    label="Mood"
                    onChange={(event) => setFilterMood(event.target.value as number)}
                    sx={{ mr: 0.5, mb: 1.5 }}
                >
                    {moodListExtra.map((item, index) => (
                        <MenuItem value={item.mood} key={index}>
                            <Box component='span' sx={{ fontSize: '1.6em' }}>
                                {item.icon}
                            </Box>
                            <span style={{ paddingLeft: '0.7em' }}>{item.text}</span>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                id="filter"
                label="Search"
                size="small"
                value={filter}
                onChange={event => setFilter(event.target.value)}
                sx={{ mt: 1.5, mb: 0.5, mx: 1 }}
            />
            <Button variant="contained" onClick={() => loadEntries()} sx={{ mt: 1.7 }}>Search</Button>
            
            {diaryList.map((entry, index) => (
                <DiaryEntry entry={entry} id={index} key={entry.id || index} />
            ))}
        </>
    )
}

export function DiaryEntry(prop: { entry: DiaryEntryType, id: number, show?: boolean }) {
    const { entry, show } = prop
    const navigate = useNavigate()
    const [expand, setExpand] = useState(show)
    const theme = useTheme()

    // ✅ REQUIREMENT 5: Regex logic to transform [#,#] into Map links
    function processContent(text: string): string {
    const coordRegex = /\[(\-?\d+\.?\d*),\s*(\-?\d+\.?\d*)\]/g;

    return text.replace(coordRegex, (match, lat, lon) => {
        // This creates the format: /map/14.59,120.98,19
        // This matches exactly what your Map.tsx 'split' logic expects
        return `<a href="/map/${lat},${lon},19" 
                   style="color: #1976d2; text-decoration: underline; font-weight: bold;">
                   📍 [${lat}, ${lon}]
                </a>`;
    });
}

    return (
        <Paper elevation={1} sx={{
            display: 'flex', p: 1, m: 1,
            backgroundColor: blue[theme.palette.mode === 'dark' ? 800 : 100],
        }}>
            <Typography sx={{ fontSize: '48px' }}>
                {moodList[entry.mood]?.icon || "😐"}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, pl: 1, textAlign: 'left' }}>
                <Typography variant="caption">{entry.date.toUTCString()}</Typography>
                <Typography onClick={() => setExpand(!expand)} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                    {entry.title}
                </Typography>
                {expand && (
                    <Box sx={{ mt: 1 }}>
                        {/* ✅ Renders the text with the clickable link */}
                        <div dangerouslySetInnerHTML={{ __html: processContent(entry.content) }} />
                    </Box>
                )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '20px', color: '#cc9d02', mr: 1 }}>
                    {"★".repeat(entry.star)}
                </Typography>
                <Tooltip title="Edit">
                    <IconButton onClick={() => navigate(`/diaryedit/${entry.id}`, { state: entry })}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Paper>
    )
}

export default DiaryList