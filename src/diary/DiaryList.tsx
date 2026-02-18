import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import Tooltip from '@mui/material/Tooltip'
import { blue } from "@mui/material/colors"
import { moodList, sampleDiary, type DiaryEntryType } from "./Diary"
import { useState } from "react"
import { useNavigate } from "react-router"
import type { MouseEvent } from "react"

function DiaryList() {

    const diaryList = sampleDiary

    return (
        <>
            {diaryList.map((entry, index) => (
                <DiaryEntry entry={entry} id={index} key={index} show={false} />
            ))}
        </>
    )
}

export function DiaryEntry(prop: { entry: DiaryEntryType, id:number, show?: boolean }) {

    const { entry, id, show } = prop
    
    const navigate = useNavigate()

    const [expand, setExpand] = useState(show)

    function handleEdit(event: MouseEvent<HTMLButtonElement>): void {
        navigate(`/diaryaddedit/${id}`)
    }

    return (
        <Paper elevation={1} sx={{
            display: 'flex',
            p: 1,
            backgroundColor: blue[100],
        }}>

            <Typography sx={{ fontSize: '48px' }}>
                {moodList[entry.mood].icon}
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                pl: 1,
            }}>
                <Typography sx={{ textAlign: 'left' }}>
                    {entry.date.toUTCString()}
                </Typography>
                <Typography onClick={() => setExpand(!expand)} >
                    {entry.title}
                </Typography>
                {expand && (
                    <Typography>
                        {entry.content}
                    </Typography>
                )}
            </Box>
            <Typography sx={{ fontSize: '24px', color: '#cc9d02' }}>
                {"★".repeat(entry.star)}
            </Typography>
            <Tooltip title="Edit">
      <IconButton aria-label="edit" onClick={handleEdit}>
        <EditIcon />
      </IconButton>
    </Tooltip>
        </Paper>
    )
}

export default DiaryList
