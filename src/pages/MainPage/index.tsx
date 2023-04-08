import { Link } from 'react-router-dom';
import classes from './style.module.scss';
import { useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Typography } from '@mui/material';

const MainPage = () => {
  interface Episode {
    id: number;
    name: string;
    episode: string;
    created: string;
    air_date: string;
  }
  const [episode, setEpisode] = useState<Episode[]>([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const getEpisode = async () => {
      const response = await fetch('https://rickandmortyapi.com/api/episode').then((response) => response.json());
      setEpisode(response.results);
      setIsLoading(false);
    };
    getEpisode();
  }, []);

  return (
    <Box className={classes.episodeBox}>
      {loading ? (
        <CircularProgress />
      ) : (
        episode.map((epi) => (
          <Card className={classes.episodeCard} key={epi.name}>
            <CardContent className={classes.episodeCardContent}>
              <Typography gutterBottom variant="h5" component="div">
                {epi.name}
              </Typography>
            </CardContent>
            <CardContent>
              <Typography color="text.secondary">{epi.episode}</Typography>
              <Typography color="text.secondary">{epi.air_date}</Typography>
              <Typography color="text.secondary">
                {epi.created && new Date(epi.created).toLocaleString('tr-TR', { timeZone: 'UTC' })}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Link to={`/${epi.id}`}>
                <Button size="small">Detaylara Git</Button>
              </Link>
            </CardActions>
          </Card>
        ))
      )}
    </Box>
  );
};

export default MainPage;
