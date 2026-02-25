import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import DiaryList from "../diary/DiaryList";

function DiaryItems() {
    return (
        <>
            <DiaryList />
            <Fab color="secondary" aria-label="add" sx={{
                position: 'fixed',
                bottom: 16,
                right: 16
            }}>
                <AddIcon />
            </Fab>
        </>
    );
}

export default DiaryItems;