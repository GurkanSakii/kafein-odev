import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import classes from './style.module.scss';
import { useParams } from 'react-router-dom';

const EpisodeDetailPage = () => {
  interface Detail {
    name: string;
    created: string;
    air_date: string;
  }
  interface Character {
    id: number;
    name: string;
    image: string;
    type: string;
    status: string;
    gender: string;
  }
  const { episodeId } = useParams();
  const [details, setDetails] = useState<Detail>({
    created: '',
    name: '',
    air_date: '',
  });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortState, setSortState] = useState('id');
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDetail = async () => {
      const responseDetails = await fetch(`https://rickandmortyapi.com/api/episode/${episodeId}`).then((response) =>
        response.json()
      );
      const responseCharacters = await Promise.all(
        responseDetails.characters.map((characters) => fetch(characters).then((res) => res.json()))
      );
      setCharacters(responseCharacters);
      setDetails(responseDetails);
      setIsLoading(false);
    };
    getDetail();
  }, [episodeId]);

  const sortMethods = {
    id: { method: (a, b) => (a.id > b.id ? 1 : -1) },
    type: { method: (a, b) => (a.type < b.type ? -1 : 1) },
    name: { method: (a, b) => (a.name > b.name ? 1 : -1) },
    status: { method: (a, b) => (a.status < b.status ? -1 : 1) },
  };

  const filterCharacters = characters.filter(
    ({ type, status, gender, name }) =>
      type.toLowerCase().includes(searchText.toLowerCase()) ||
      status.toLowerCase().includes(searchText.toLowerCase()) ||
      gender.toLowerCase().includes(searchText.toLowerCase()) ||
      name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box className={classes.episodeBox}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ minWidth: 120 }} className={classes.filterHeader}>
            <TextField
              label="Search"
              variant="standard"
              value={searchText}
              onChange={({ target }) => setSearchText(target.value)}
            />
            <FormControl>
              <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{ minWidth: 150 }}
                value={sortState}
                label="Sort by"
                onChange={(e) => setSortState(e.target.value)}
              >
                <MenuItem value={'id'}>id</MenuItem>
                <MenuItem value={'type'}>type</MenuItem>
                <MenuItem value={'name'}>name</MenuItem>
                <MenuItem value={'status'}>status</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Card className={classes.episodeCard}>
            <CardContent className={classes.episodeCardContent}>
              <Typography gutterBottom variant="h5" component="div">
                {details.name}
              </Typography>
            </CardContent>
            <CardContent>
              <Typography color="text.secondary">
                {details.created && new Date(details.created).toLocaleString('tr-TR', { timeZone: 'UTC' })}
              </Typography>

              <Typography color="text.secondary">{details.air_date}</Typography>
            </CardContent>
            <Box className={classes.characterContent}>
              {filterCharacters.sort(sortMethods[sortState].method).map((character) => (
                <Box
                  key={character.id}
                  sx={{ height: 300, width: 300, m: 1 }}
                  component="img"
                  alt={`${character.name}`}
                  height="140"
                  src={`${character.image}`}
                  title={`${character.name}`}
                />
              ))}
              {filterCharacters.length < 1 && (
                <Typography component="h5" variant="h5" sx={{ mb: 3 }}>
                  Data Not Found
                </Typography>
              )}
            </Box>
          </Card>
        </>
      )}
    </Box>
  );
};

export default EpisodeDetailPage;
