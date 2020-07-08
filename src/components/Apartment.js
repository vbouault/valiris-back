import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../API';
import '../styles/apartments.css'
import '../styles/Contact.css';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: 40
  },
  media: {
    height: 100,
  },
  input: {
    display: 'none',
  }
}));

const Apartment = (props) => {
  const classes = useStyles();

  const id = props.match.params.id;
  const [apartment, setApartment] = useState();
  const [messageForm, setMessageForm] = useState(false);
  const [msgAlert, setMsgAlert] = useState('');
  const [errorForm, setErrorForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mainPicture, setMainPicture] = useState(null);
  const [secondaryPictures, setSecondaryPictures] = useState([]);
  const [state, setstate] = useState([])


  useEffect(() => {
    API.get(`/apartments/${id}/back`)
      .then(res => res.data)
      .then(data => {
        setApartment({
          id: data.id,
          name: data.name,
          details_fr: data.details_fr,
          details_en: data.details_en,
          title_fr: data.title_fr,
          title_en: data.title_en,
          weekPrice: data.week_price,
          monthPrice: data.month_price,
        })
        setMainPicture(data.main_picture_url)
        setSecondaryPictures(data.urlSecondaryPictures)
      });
  }, [id]);

  function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
  }

  const handleCloseMui = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessageForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorForm(false);
    API.patch(`/apartments/${id}`, { ...apartment, mainPicture, secondaryPictures })
      .then(res => res.data)
      .then(data => {
        setMessageForm(true);
        setLoading(false);
        setMsgAlert(`L'appartement ${data.name} a bien été mis à jour.`);
      })
      .catch(err => {
        console.log(err);
        setMsgAlert('Une erreur est survenue, veuillez essayer à nouveau !');
        setErrorForm(true);
        setLoading(false);
        setMessageForm(true);
      })
  }

  const uploadCurrentImage = (e) => {
    e.preventDefault();
    const image = e.target.files[0]
    setLoading(true);
    setErrorForm(false);
    const formData = new FormData();
    formData.append('currentPicture', image);
    if (e.target.name === 'main-picture') {
      API.post('/apartments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => res.data)
        .then(data => {
          setMainPicture(data);
          setLoading(false);
        })
    } else {
      API.post('/apartments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => res.data)
        .then(data => {
          setSecondaryPictures([...secondaryPictures, data]);
          setLoading(false);
        })
    }
  }

  if (!apartment) {
    return <CircularProgress className='loader' style={{ width: '70px', height: '70px' }} />
  } else {
    return (
      <div >
        {console.log(secondaryPictures)}
        <form className='contact-container' noValidate autoComplete='off' onSubmit={(e) => handleSubmit(e)}>
          <TextField
            className='input-contact'
            label='Nom'
            variant='outlined'
            value={apartment.name}
            onChange={(e) => setApartment({ ...apartment, name: e.target.value })}
            name='name'
          />
          <TextField
            className='input-contact'
            label='Prix à la semaine'
            variant='outlined'
            value={apartment.weekPrice}
            onChange={(e) => setApartment({ ...apartment, weekPrice: e.target.value })}
            name='weekPrice'
          />
          <TextField
            className='input-contact'
            label='Prix au mois'
            variant='outlined'
            value={apartment.monthPrice}
            onChange={(e) => setApartment({ ...apartment, monthPrice: e.target.value })}
            name='monthPrice'
          />
          <TextField
            className='input-contact'
            label='Intitulé (français)'
            variant='outlined'
            value={apartment.title_fr}
            onChange={(e) => setApartment({ ...apartment, title_fr: e.target.value })}
            name='title_fr'
          />
          <TextField
            className='input-contact'
            label='Intitulé (anglais)'
            variant='outlined'
            value={apartment.title_en}
            onChange={(e) => setApartment({ ...apartment, title_en: e.target.value })}
            name='title_en'
          />
          <TextField
            className='input-contact'
            label='Détails (français)'
            variant='outlined'
            value={apartment.details_fr}
            onChange={(e) => setApartment({ ...apartment, details_fr: e.target.value })}
            name='details_fr'
          />
          <TextField
            className='input-contact'
            label='Détails (anglais)'
            variant='outlined'
            value={apartment.details_en}
            onChange={(e) => setApartment({ ...apartment, details_en: e.target.value })}
            name='details_en'
          />
          <div className='photo-container'>
            <Card className={classes.root}>
              <CardActionArea>
                {mainPicture ?
                  <CardMedia
                    className={classes.media}
                    image={'http://localhost:3000/' + mainPicture}
                    title="Contemplative Reptile"
                  />
                  :
                  <p>Pas de photo principal</p>
                }
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h5">
                    Photo principal
                </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <input
                  accept="image/*"
                  className={classes.input}
                  id="contained-button-file"
                  type="file"
                  onChange={e => uploadCurrentImage(e)}
                />
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color="primary" component="span">
                    Modifier
                </Button>
                </label>
              </CardActions>
            </Card>
            <input
              name='secondary-picture'
              accept="image/*"
              className={classes.input}
              id="secondary-picture-button"
              type="file"
              onChange={e => {
                uploadCurrentImage(e)
              }}
            />
            <p>Photo secondaire :</p>
            <label htmlFor="secondary-picture-button">
              <Button variant="contained" color="primary" component="span">
                Ajouter
              </Button>
            </label>
            {secondaryPictures.map(sp => {
              return (
                <Card className={classes.root}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={sp.url}
                      title="Contemplative Reptile"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h5">
                        Photo secondaire
                          </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <input
                      accept="image/*"
                      className={classes.input}
                      id="contained-button-file"
                      multiple
                      type="file"
                      onChange={e => uploadCurrentImage(e)}
                    />
                    <label htmlFor="contained-button-file">
                      <Button variant="contained" color="primary" component="span">
                        Modifier
                </Button>
                    </label>
                    <Button size="small" color="primary">
                      Supprimer
                        </Button>
                  </CardActions>
                </Card>
              )
            })}
          </div>
          {loading ? <CircularProgress style={{ width: '50px', height: '50px' }} /> : <Button variant="contained" className='contact-valid-button' type='submit'>Valider</Button>}
          <Button variant="contained">
            <Link to={`/appartements`}>Retour</Link>
          </Button>
          <Snackbar open={messageForm} autoHideDuration={6000} onClose={handleCloseMui}>
            <Alert onClose={handleCloseMui} severity={!errorForm ? 'success' : 'error'}>
              {msgAlert}
            </Alert>
          </Snackbar>
        </form>
      </div>
    )
  }
}

export default Apartment;
