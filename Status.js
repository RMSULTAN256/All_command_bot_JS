import axios from 'axios';

const url = 'https://fischipedia.org/wiki/Fisch_Wiki';

const status = axios.get(url)
    .then((response) => {
        console.log(response.status);
    })
    .catch((error) => {
        console.error(error);
    });