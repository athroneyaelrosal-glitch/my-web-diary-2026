import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CloudDoneIcon from "@mui/icons-material/CloudDone"
import DesignServicesIcon from "@mui/icons-material/DesignServices"
import GroupsIcon from "@mui/icons-material/Groups"
import MapIcon from "@mui/icons-material/Map"
import SearchIcon from "@mui/icons-material/Search"
import SecurityIcon from "@mui/icons-material/Security"
import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material"

const featureList = [
    { icon: <SearchIcon />, title: "Advanced search", text: "Filter entries by keyword, mood, rating, and sort order." },
    { icon: <MapIcon />, title: "Location memories", text: "Coordinates in diary text become links to an interactive map." },
    { icon: <DesignServicesIcon />, title: "Responsive design", text: "Layouts adapt cleanly across desktop, tablet, and mobile screens." },
    { icon: <CloudDoneIcon />, title: "Database ready", text: "Supabase handles authentication and structured diary records." },
]

const rubricItems = [
    "Clear purpose and consistent diary theme across pages",
    "High contrast colors, readable typography, and neat spacing",
    "Working dashboard, diary list, entry editor, login, register, and map",
    "Git-friendly environment setup with local secrets kept out of commits",
]

const teamMembers = [
    "Athrone Rosal",
    "Kevin Mendoza",
    "Railey Dela Cruz",
]

function About() {
    return (
        <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, border: '1px solid', borderColor: 'divider' }}>
                <Chip label="ITWP01 Web Design Project" color="primary" sx={{ mb: 2 }} />
                <Typography variant="h4" sx={{ mb: 1 }}>About My Diary</Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 760, fontSize: '1.05rem' }}>
                    My Diary is a personal journaling web app for recording daily experiences,
                    tracking emotions, rating important moments, and connecting memories to places.
                    The project focuses on clean design, useful interactions, readable content, and
                    complete user workflows.
                </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <GroupsIcon color="primary" />
                    <Typography variant="h5">Project Members</Typography>
                </Stack>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
                    {teamMembers.map((member) => (
                        <Paper key={member} variant="outlined" sx={{ p: 2, backgroundColor: 'background.default' }}>
                            <Typography fontWeight={800}>{member}</Typography>
                        </Paper>
                    ))}
                </Box>
            </Paper>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                {featureList.map((feature) => (
                    <Paper key={feature.title} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ color: 'primary.main', mb: 1 }}>{feature.icon}</Box>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>{feature.title}</Typography>
                        <Typography color="text.secondary">{feature.text}</Typography>
                    </Paper>
                ))}
            </Box>

            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h5" sx={{ mb: 1 }}>Rubric Coverage</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    This page explains the purpose of the project and documents the design and functionality choices.
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                    {rubricItems.map((item) => (
                        <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                            <CheckCircleIcon color="success" />
                            <Typography>{item}</Typography>
                        </Stack>
                    ))}
                </Stack>
            </Paper>

            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, border: '1px solid', borderColor: 'divider' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <SecurityIcon color="primary" />
                    <Typography variant="h5">Privacy Note</Typography>
                </Stack>
                <Typography color="text.secondary">
                    Supabase project keys are stored in a local environment file, so private setup values do not need
                    to be written directly into the source code.
                </Typography>
            </Paper>
        </Stack>
    )
}

export default About
