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
  }
  const { episodeId } = useParams();
  const [details, setDetails] = useState<Detail>({
    created: '',
    name: '',
    air_date: '',
  });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterState, setFilterState] = useState('default');
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

  const filterMethods = {
    default: { method: (a) => a },
    type: { method: (a) => a.type.length > 0 },
    deadStatus: { method: (a) => a.status.length > 0 && a.status == 'Dead' },
    aliveStatus: { method: (a) => a.status.length > 0 && a.status == 'Alive' },
    maleGender: { method: (a) => a.gender.length > 0 && a.gender == 'Male' },
    femaleGender: { method: (a) => a.gender.length > 0 && a.gender == 'Female' },
  };

  const filterCharacters = characters.filter(({ name }) => name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <Box className={classes.episodeBox}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ minWidth: 120 }} className={classes.filterHeader}>
            <TextField
              sx={{ m: 1 }}
              label="Search Name"
              variant="standard"
              value={searchText}
              onChange={({ target }) => setSearchText(target.value)}
            />
            <FormControl sx={{ m: 1 }}>
              <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{ minWidth: 150 }}
                value={filterState}
                label="Filter by"
                onChange={(e) => setFilterState(e.target.value)}
              >
                <MenuItem value={'default'}>default</MenuItem>
                <MenuItem value={'type'}>According to: Exist Type</MenuItem>
                <MenuItem value={'aliveStatus'}>According to: Alive Status</MenuItem>
                <MenuItem value={'deadStatus'}>According to: Dead Status</MenuItem>
                <MenuItem value={'maleGender'}>According to : Male Gender</MenuItem>
                <MenuItem value={'femaleGender'}>According to : Female Gender</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1 }}>
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
              {filterCharacters
                .sort(sortMethods[sortState].method)
                .filter(filterMethods[filterState].method)
                .map((character) => (
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
              {filterCharacters.filter(filterMethods[filterState].method).length < 1 && (
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
