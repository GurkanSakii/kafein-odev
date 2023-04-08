import MainPage from 'pages/MainPage';
import './styles/🌍.scss';
import { Route, Routes } from 'react-router-dom';
import EpisodeDetailPage from 'pages/EpisodeDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/:episodeId" element={<EpisodeDetailPage />} />
    </Routes>
  );
}

export default App;
