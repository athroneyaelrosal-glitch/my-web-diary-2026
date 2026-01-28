import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { blue, red } from "@mui/material/colors";

function DiaryList() {
  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        p: 1,
        backgroundColor: blue[50],
      }}
    >
      <SentimentSatisfiedAltIcon sx={{ fontSize: "48px",
        color: red[300]
       }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          pl: 1,
        }}
      >
        <Typography sx={{ textAlign: "left" }}>
          Jan 28, 2026
        </Typography>

        <Typography>
          Hello, my Diary, whatever!
        </Typography>
      </Box>
    </Paper>
  );
}

export default DiaryList;
