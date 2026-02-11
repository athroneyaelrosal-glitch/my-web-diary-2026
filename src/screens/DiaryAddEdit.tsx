import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import type { ReactNode } from "react"

function DiaryAddEdit() {

    function handleChange(event: any, child: ReactNode): void {
        throw new Error("Function not implemented.")
    }

    return (
        <>
            <p>Add/Edit Diary Item Po Ito</p>
            <TextField id="title" label="Title" variant="outlined" />
            <FormControl fullWidth>
                <InputLabel id="starlabel">Star</InputLabel>
                <Select
                    labelId="starlabel"
                    id="star"
                    label="Star"
                >
                    <MenuItem value={1}>★</MenuItem>
                    <MenuItem value={2}>★★</MenuItem>
                    <MenuItem value={3}>★★★</MenuItem>
                    <MenuItem value={4}>★★★★</MenuItem>
                    <MenuItem value={5}>★★★★★</MenuItem>
                </Select>
            </FormControl>
            <TextField id="content" label="Content" variant="outlined" multiline minRows={10} />
            <Button variant="contained">Save</Button>
             <Button variant="outlined">Cancel</Button>

        </>
    )
}

export default DiaryAddEdit
