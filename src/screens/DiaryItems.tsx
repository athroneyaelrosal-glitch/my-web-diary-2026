import Fab from "@mui/material/Fab"
import AddIcon from '@mui/icons-material/Add';

import DiaryList from "../diary/DiaryList"
import { useNavigate } from "react-router";

function DiaryItems() {

    const navigate = useNavigate()

    return (
        <>
            <DiaryList />
            <Fab color="secondary" aria-label="add diary entry" sx={{
                position: 'fixed',
                right: { xs: '16px', md: '28px' },
                bottom: { xs: '16px', md: '28px' },
                boxShadow: '0 14px 32px rgba(245, 158, 11, 0.35)',
            }} onClick={() => navigate('/diaryedit')}>
                <AddIcon />
            </Fab>
        </>
    )
}

export default DiaryItems
