import BlockIcon from '@mui/icons-material/Block';
import CloudIcon from '@mui/icons-material/Cloud';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

export type moodType = {
  mood: number,
  text: string,
  icon?: any,
}

export const moodList: moodType[] = [
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
        text: 'Block',
        icon: <BlockIcon sx={{ color: '#dd0000', fontSize: 'inherit' }} />,
    }
]

export type DiaryEntryType = {
    date: Date,
    title: string,
    mood: number,
    content: string,
}

export const sampleDiary: DiaryEntryType[] = [
  {
    mood: 0,
    date: new Date(),
    title: "My first entry",
    content: "My first entry din. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    mood: 1,
    date: new Date(),
    title: "My first sad entry",
    content: "My first sad entry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.",
  },
  {
    mood: 2,
    date: new Date(),
    title: "My first angry entry",
    content: "My first angry entry. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    mood: 3,
    date: new Date(),
    title: "My first hunger entry",
    content: "My first hunger din. But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"


  },
  {
    mood: 4,
    date: new Date(),
    title: "My first blocked entry",
    content: "Blocked moment. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
  },
];