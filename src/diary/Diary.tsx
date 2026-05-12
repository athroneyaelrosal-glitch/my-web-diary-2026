import BlockIcon from '@mui/icons-material/Block';
import BoltIcon from '@mui/icons-material/Bolt';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import CloudIcon from '@mui/icons-material/Cloud';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SpaIcon from '@mui/icons-material/Spa';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import type { ReactNode } from 'react';

export type MoodType = {
    mood: number,
    text: string,
    icon?: ReactNode,
}

export type DiaryEntryType = {
    id?: string,
    date: Date,
    title: string,
    mood: number,
    content: string,
    star: number,
}

export const moodList: MoodType[] = [
    {
        mood: 0,
        text: 'Happy',
        icon: <SentimentSatisfiedAltIcon sx={{ color: '#d4a302', fontSize: 'inherit' }} />,
    }, {
        mood: 1,
        text: 'Excited',
        icon: <SentimentVerySatisfiedIcon sx={{ color: '#109900', fontSize: 'inherit' }} />,
    }, {
        mood: 2,
        text: 'Love',
        icon: <FavoriteIcon sx={{ color: '#ee0000', fontSize: 'inherit' }} />,
    }, {
        mood: 3,
        text: 'Hungry',
        icon: <RamenDiningIcon sx={{ color: '#fc7b03', fontSize: 'inherit' }} />,
    }, {
        mood: 4,
        text: 'Angry',
        icon: <SentimentDissatisfiedIcon sx={{ color: '#ff0000', fontSize: 'inherit' }} />,
    }, {
        mood: 5,
        text: 'Furious',
        icon: <SentimentVeryDissatisfiedIcon sx={{ color: '#ee00ee', fontSize: 'inherit' }} />,
    }, {
        mood: 6,
        text: 'Sleepy',
        icon: <SentimentVeryDissatisfiedIcon sx={{ color: '#0468bf', fontSize: 'inherit' }} />,
    }, {
        mood: 7,
        text: 'Sad',
        icon: <MoodBadIcon sx={{ color: '#5a5ae8', fontSize: 'inherit' }} />,
    }, {
        mood: 8,
        text: 'Gloomy',
        icon: <CloudIcon sx={{ color: '#888888', fontSize: 'inherit' }} />,
    }, {
        mood: 9,
        text: 'Overwhelmed',
        icon: <BlockIcon sx={{ color: '#dd0000', fontSize: 'inherit' }} />,
    }, {
        mood: 10,
        text: 'Calm',
        icon: <SelfImprovementIcon sx={{ color: '#0f766e', fontSize: 'inherit' }} />,
    }, {
        mood: 11,
        text: 'Grateful',
        icon: <SpaIcon sx={{ color: '#16a34a', fontSize: 'inherit' }} />,
    }, {
        mood: 12,
        text: 'Proud',
        icon: <EmojiEventsIcon sx={{ color: '#ca8a04', fontSize: 'inherit' }} />,
    }, {
        mood: 13,
        text: 'Focused',
        icon: <PsychologyIcon sx={{ color: '#4f46e5', fontSize: 'inherit' }} />,
    }, {
        mood: 14,
        text: 'Inspired',
        icon: <LightbulbIcon sx={{ color: '#f59e0b', fontSize: 'inherit' }} />,
    }, {
        mood: 15,
        text: 'Anxious',
        icon: <BoltIcon sx={{ color: '#dc2626', fontSize: 'inherit' }} />,
    }, {
        mood: 16,
        text: 'Relaxed',
        icon: <LocalCafeIcon sx={{ color: '#8b5cf6', fontSize: 'inherit' }} />,
    }, {
        mood: 17,
        text: 'Hopeful',
        icon: <EmojiNatureIcon sx={{ color: '#059669', fontSize: 'inherit' }} />,
    }, {
        mood: 18,
        text: 'Celebrating',
        icon: <CelebrationIcon sx={{ color: '#db2777', fontSize: 'inherit' }} />,
    }, {
        mood: 19,
        text: 'Nostalgic',
        icon: <WbTwilightIcon sx={{ color: '#7c3aed', fontSize: 'inherit' }} />,
    }
]

export const sampleDiary: DiaryEntryType[] = [
    {
        mood: 1,
        date: new Date('2026-05-12T09:15:00'),
        title: 'Project dashboard cleanup',
        star: 5,
        content: '<p>Finished the first polished version of my diary dashboard. The new layout feels easier to scan and the mood chart makes the data more meaningful.</p><p>Added a location note for school: [14.6111512, 120.9749947]</p>'
    },
    {
        mood: 2,
        date: new Date('2026-05-10T18:40:00'),
        title: 'A good memory after class',
        star: 4,
        content: '<p>Had a calm walk and took notes for the About page. The project finally feels like it has a clear theme: memories, mood, and meaningful places.</p>'
    },
    {
        mood: 0,
        date: new Date('2026-05-09T14:05:00'),
        title: 'Search filters are working',
        star: 4,
        content: '<p>Tested keyword search, mood filtering, rating filtering, and sort order. It is much easier to find older entries now.</p>'
    },
    {
        mood: 3,
        date: new Date('2026-05-08T12:30:00'),
        title: 'Lunch break idea',
        star: 3,
        content: '<p>Thought about adding photos and better map previews during lunch. Small features can make the diary feel more personal and complete.</p>'
    },
    {
        mood: 6,
        date: new Date('2026-05-07T22:10:00'),
        title: 'Late night testing',
        star: 3,
        content: '<p>Checked the app on a smaller screen. The responsive layout needs to keep buttons, cards, and text readable without crowding.</p>'
    },
]
