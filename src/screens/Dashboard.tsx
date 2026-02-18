import { Typography } from "@mui/material"
import { sampleDiary } from "../diary/Diary"
import { DiaryEntry } from "../diary/DiaryList"

function Dashboard() {

    return (
        <><Typography variant="h4" component="h1" gutterBottom>
        </Typography><Typography variant="h6" component="h2" gutterBottom>
            Ito yung dashboard, dito makikita yung mga summary ng diary entries mo.
        </Typography>
            Number of entries: {sampleDiary.length}
            <DiaryEntry entry={sampleDiary[0]} id={0} show={true} />

            <Typography>Latest entry: {sampleDiary[0].title}</Typography>
        </>
    )
}

export default Dashboard
