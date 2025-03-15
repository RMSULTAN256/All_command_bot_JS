import { GetDataSeasons } from "./Bot/bitch.js";
import { GetDataEvents } from "./Bot/whoore.js";
import { getTimeEvents } from "./scrap/eventMeg.js";
import { getTimeSeasons } from "./scrap/Seasons.js";
import { GetDataFisch } from "./scrap/Fisch_data.js";
import { CaclLevel } from "./Bot/Interaction.js";
import { CheckRole } from "./Bot/CheckingRoles.js";
import { app_ai } from "./gemini.js";
import { fish } from "./fish.js";

// List of functions for getting data from the web
if (!getTimeEvents || !getTimeSeasons || !GetDataFisch) {
  throw new Error('One or more functions are not defined');
} else {
  console.log('Getting Data!')
  setTimeout(() => {
  getTimeSeasons();
  getTimeEvents();
  GetDataFisch();
  },5000
)};


if (!GetDataEvents || !GetDataSeasons || !CheckRole()) {
  throw new Error('One or more functions are not defined');
} else {
  console.log('Turning On the bot')
  GetDataEvents();
  GetDataSeasons();
  CheckRole();
}

if (CaclLevel || app_ai || fish ) {
  CaclLevel();
  app_ai();
  fish();
} else {
  console.log('Can`t run the code')
}

