import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router";
import { moodList, sampleDiary } from "../diary/Diary";
import { useState } from "react";
import { format } from "date-fns/format";
import { parse } from "date-fns";

function DiaryAddEdit() {

    const { id } = useParams();
    const Navigate = useNavigate()
    console.log(id)
    const [entry, setEntry] = useState(id === undefined ? {
        date: new Date(),
        title: '',
        mood: 0,
        content: '',
        star: 1,
    } : sampleDiary[parseInt(id)])

    function save() {
        const index = id === undefined ? sampleDiary.length : parseInt
            (id)
        sampleDiary[index] = entry
        Navigate('/diarylist')
    }

    return (
        <Box sx={{ padding: 1 }}>
            <Typography variant="h5" component="h4" sx={{ pb: 2 }}>{id === undefined ? 'Add' : 'Edit'} Diary Item {id}</Typography>
            <TextField
                id="date"
                label="Date/time"
                variant="outlined"
                value={format(entry.date, "yyyy-MM-dd\'T\'HH:mm:ss")}
                type="datetime-local"
                onChange={event => {
                    const date = new Date(event.target.value)
                    if (isNaN(date.getTime()))
                        return
                    setEntry({
                        ...entry, date: date
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


            <FormControl >
                <InputLabel id="mood-label">Mood</InputLabel>
                <Select
                    labelId="mood-label"
                    id="mood-select"
                    value={entry.mood ?? 0}
                    label="Mood"
                    onChange={(event) => {
                        entry.mood = event.target.value as number
                        setEntry({ ...entry })
                    }}
                    sx={{
                        mr: 0.5,
                        mb: 1.5,
                    }}
                >
                    {moodList.map((item, index) => (
                        <MenuItem value={item.mood} key={index}>
                            <Box component='span' sx={{ fontSize: '1.6em' }}>
                                {moodList[item.mood].icon}
                            </Box>
                            <span style={{ paddingLeft: '0.7em' }}>{item.text}</span>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel id="starlabel">Star</InputLabel>
                <Select
                    labelId="starlabel"
                    id="star"
                    label="Star"
                    value={entry.star}
                    onChange={event => setEntry({
                        ...entry, star: event.target.value
                    })}
                    sx={{
                        height: '65px',
                        mb: 1.5,
                    }}
                >
                    <MenuItem value={1}>★</MenuItem>
                    <MenuItem value={2}>★★</MenuItem>
                    <MenuItem value={3}>★★★</MenuItem>
                    <MenuItem value={4}>★★★★</MenuItem>
                    <MenuItem value={5}>★★★★★</MenuItem>
                </Select>
            </FormControl>
            <TextField
                fullWidth
                id="title"
                label="Title"
                variant="outlined"
                value={entry.title}
                onChange={event => setEntry({
                    ...entry, title: event.target.value
                })}
                sx={{ 
                    mb: 1.5 
                }}
            />

            <TextField

                fullWidth
                id="content"
                label="Content"
                variant="outlined"
                multiline
                minRows={10}
                value={entry.content}
                onChange={event => setEntry({
                    ...entry, content: event.target.value
                })}
                sx={{
                        mb: 2
                }}
                />
            <Button variant="outlined" onClick={() => Navigate('/')}>
                Cancel</Button>
            <Button variant="contained" onClick={() => save()} sx={{
                ml: 1}}>Save</Button>
        </Box>
    )
}

export default DiaryAddEdit
