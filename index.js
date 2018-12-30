const tmi = require("tmi.js");
const password = require("password");

const thirtyDaysInMilliseconds = 2.592e+9;
const oneHourInMilliseconds = 3.6e+6;
const database = {};

const options = {
  options:{
    debug:true
  },
  connection:{
    reconnect:true
  },
  identity:{
    username: "primereminderbot1",
    password: password
  },
  channels: ["#BandsWithLegends"]
};

const client = new tmi.client(options);

client.connect();

client.on("chat", function(channel, user, message, self){
  if(self) return;
  if(user.username==='bandswithlegends'){
    client.whisper("#bandswithlegends", "You sent a message")
  }
})

// See when someone subscribes with twitch prime
client.on("subscription", (channel, username, method, message, user) => {
  if(method.prime){
    console.log("user info: ", channel, username, method, message, user);
    console.log("database[username]: ", database[username]);
    if(database[username] && database[username].blacklist) return null;
    else if(database[username] && !database[username].blacklist){
      client.whisper(database[username].username, `Thanks, ${database[username].username}, for subscribing with Twitch Prime again. Counter reset for 30 days.`)
      database[username].lastSubbed = Date.now();
    } else {
      client.whisper(database[username].username, "Hello, You subbed with Twitch Prime. If you'd like, I'll message you in 30 days to remind you to sub with Twitch Prime again. If not, simply message me back !stop and you will not receive any more messages from me.");
      database.username = {username, channel, lastSubbed: Date.now(), blacklist: false}
    }
  }
})

client.on("whisper", (from, userstate, message, self) => {
  if(self) return;
  if(message === '!stop'){
    if(database[from]){
      database[from].blacklist = true;
      client.whisper(from, "Service Stopped. If you'd like to restart service message me !start ")
    } else {
      client.whisper(from, "Sorry, couldn't find you in the database. Subscribe with Twitch Prime to begin service")
    }
  } else if(message ==='!start'){
    if(database[from]){
      database[from].blacklist = false;
      client.whisper(from, "Service started")
    } else {
      client.whisper(from, "Sorry, couldn't find you in the database. Subscribe with Twitch Prime to begin service")
    }
  } else {
    client.whisper(from, "Sorry, couldn't understand your message. Use !stop or !start to update service")
  }
})

// checks if a date is between 1 month and 1 month + 1 hour old.
const oneMonthOld = (dateNumber) => (dateNumber + thirtyDaysInMilliseconds) <= Date.now() && Date.now() <= (dateNumber + thirtyDaysInMilliseconds + oneHourInMilliseconds);

// every hour check to see whose re-subscription is available
function checkDatabase(){
  for(let entry in database){
    const {blacklist, username, channel, lastSubbed } = entry;
    if(!blacklist && oneMonthOld(lastSubbed)){
      client.whisper(username, `Hey ${username}, your twitch prime sub is available. Last month you subbed to ${channel}. If you'd like to sub to them again go to https://www.twitch.tv/${channel} `)
    }
  }
}

setInterval(checkDatabase, oneHourInMilliseconds)

module.exports = {oneHourInMilliseconds, thirtyDaysInMilliseconds, checkDatabase, oneMonthOld}




