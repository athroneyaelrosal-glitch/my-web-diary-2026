import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { blue } from "@mui/material/colors";
import { moodList, sampleDiary, type DiaryEntryType } from "./Diary";

function DiaryList() {
  const diaryList = sampleDiary;

  return (
    <>
      {diaryList.map((entry, index) => (
        <DiaryEntry entry={entry} key={index} />
      ))}
    </>
  );
}

function DiaryEntry({ entry }: { entry: DiaryEntryType }) {

  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        p: 1,
        backgroundColor: blue[100],
      }}
    >
      {/* Mood Icon */}
      <Typography sx={{ fontSize: "48px" }}>
        {moodList[entry.mood].icon}
      </Typography>

      {/* Entry Info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          pl: 1,
        }}
      >
        <Typography sx={{ textAlign: "left" }}>
          {entry.date.toUTCString()}
        </Typography>

        <Typography>
          {entry.title}
        </Typography>
      </Box>
    </Paper>
  );
}

export default DiaryList;