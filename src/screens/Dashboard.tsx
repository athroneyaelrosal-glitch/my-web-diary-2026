import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import AutoStoriesIcon from "@mui/icons-material/AutoStories"
import InsightsIcon from "@mui/icons-material/Insights"
import MapIcon from "@mui/icons-material/Map"
import SearchIcon from "@mui/icons-material/Search"
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { DiaryEntry } from "../diary/DiaryList"
import { moodList, sampleDiary, type DiaryEntryType } from "../diary/Diary"
import { user } from "../userState"
import { isSupabaseConfigured, supabase } from "../supabaseClient"

function Dashboard() {
    const navigate = useNavigate()
    const [count, setCount] = useState(sampleDiary.length)
    const [entry, setEntry] = useState<DiaryEntryType | null>(sampleDiary[0])

    useEffect(() => {
        if (!isSupabaseConfigured || !user.email) {
            return
        }

        supabase.from('entries').select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .limit(1)
            .then(({ data, error, count }) => {
                if (!error) {
                    setCount(count ?? 0)
                    if ((count ?? 0) > 0 && data?.[0]) {
                        const item = data[0]
                        setEntry({
                            id: item.id,
                            date: item.created_at ? new Date(item.created_at) : new Date(),
                            title: item.title ?? '',
                            mood: item.mood ?? 1,
                            content: item.content ?? '',
                            star: item.star ?? 1,
                        })
                    }
                }
            })
    }, [user.email])

    const moodDist = useMemo(() => {
        const source = user.email ? [entry].filter(Boolean) as DiaryEntryType[] : sampleDiary
        return moodList
            .map((mood) => ({
                name: mood.text,
                value: source.filter((item) => item.mood === mood.mood).length,
            }))
            .filter((item) => item.value > 0)
    }, [entry])

    const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

    const statCards = [
        { label: 'Entries', value: count, icon: <AutoStoriesIcon />, tone: '#4f46e5' },
        { label: 'Top rating', value: `${Math.max(...sampleDiary.map((item) => item.star))}/5`, icon: <InsightsIcon />, tone: '#f59e0b' },
        { label: 'Places', value: 'Map-ready', icon: <MapIcon />, tone: '#06b6d4' },
    ]

    return (
        <Stack spacing={3}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2.5, md: 4 },
                    overflow: 'hidden',
                    position: 'relative',
                    color: 'white',
                    background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 48%, #0f766e 120%)',
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
                    <Chip
                        label={user.email ? 'Connected to Supabase' : 'Guest demo mode'}
                        sx={{ mb: 2, color: 'white', backgroundColor: 'rgba(255,255,255,0.18)' }}
                    />
                    <Typography variant="h4" sx={{ mb: 1 }}>
                        My Diary Dashboard
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.84)', fontSize: '1.05rem', maxWidth: 620 }}>
                        Track memories, moods, ratings, and places in one clean journal workspace.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
                        <Button variant="contained" color="secondary" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate('/diaryedit')}>
                            New entry
                        </Button>
                        <Button variant="outlined" startIcon={<SearchIcon />} onClick={() => navigate('/diarylist')} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                            Browse diary
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: 2,
                }}
            >
                {statCards.map((card) => (
                    <Paper key={card.label} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                display: 'grid',
                                placeItems: 'center',
                                color: card.tone,
                                backgroundColor: `${card.tone}18`,
                            }}>
                                {card.icon}
                            </Box>
                            <Box>
                                <Typography variant="h5">{card.value}</Typography>
                                <Typography color="text.secondary">{card.label}</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                ))}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.15fr .85fr' }, gap: 2 }}>
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Box>
                            <Typography variant="h6">Latest entry</Typography>
                            <Typography color="text.secondary">Your newest memory preview</Typography>
                        </Box>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />
                    {entry && <DiaryEntry entry={entry} id={0} show={true} />}
                </Paper>

                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid', borderColor: 'divider', minHeight: 360 }}>
                    <Typography variant="h6">Mood overview</Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Quick visual summary of current diary moods.
                    </Typography>
                    <Box sx={{ width: '100%', height: 280 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={moodDist}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={95}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {moodDist.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Box>
        </Stack>
    )
}

export default Dashboard
