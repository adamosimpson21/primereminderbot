const tmi = require("tmi.js");

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
    password: "oauth:xmea5famfgp3khmxv6f2ztoywdqus2"
  },
  channels: ["#BandsWithLegends", "#tvgbadger", "#calebdmtg"]
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
    client.whisper("#bandswithlegends", "Hello, You subbed with Twitch Prime. If you'd like, I'll message you in 30 days to remind you to sub with Twitch Prime again. If not, simply message me back !stop and you will not receive any more messages from me.");
    // add to database
    database.write({username, channel, lastSubbed: Date.now(), blacklist: false})
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




