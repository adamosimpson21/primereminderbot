const tmi = require("tmi.js");
const {password} = require("./password");

// const thirtyDaysInMilliseconds = 2.592e+9;
const thirtyDaysInMilliseconds = 1000*60;
const oneHourInMilliseconds = 1000*5;
// const oneHourInMilliseconds = 3.6e+6;
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

// See when someone subscribes with twitch prime
// client.on("subscription", (channel, username, method, message, user) => {

client.on("chat", (channel, user, message, self) => {
  if(self) return;
  const {username} = user
  if(message==="prime" && username==='bandswithlegends'){
    if(database[username] && database[username].blacklist) return null;
    else if(database[username] && !database[username].blacklist){
      client.whisper(database[username].username, `Thanks, ${database[username].username}, for subscribing with Twitch Prime again. Counter reset for 30 days.`)
      database[username].lastSubbed = Date.now();
      database[username].channel = channel;
    } else {
      database[username] = {username, channel, lastSubbed: Date.now(), blacklist: false}
      console.log("database:", database)
      client.whisper(database[username].username, "Hello, You subbed with Twitch Prime. If you'd like, I'll message you in 30 days to remind you to sub with Twitch Prime again. If not, simply message me back !stop and you will not receive any more messages from me.");
    }
  }
})

client.on("whisper", (from, userstate, message, self) => {
  if(self) return;
  const {username} = userstate
  if(message === '!stop'){
    if(database[username]){
      database[username].blacklist = true;
      client.whisper(username, "Service Stopped. If you'd like to restart service message me !start ")
    } else {
      client.whisper(username, "Sorry, couldn't find you in the database. Subscribe with Twitch Prime to begin service")
    }
  } else if(message ==='!start'){
    if(database[username]){
      database[username].blacklist = false;
      client.whisper(username, "Service started")
    } else {
      client.whisper(username, "Sorry, couldn't find you in the database. Subscribe with Twitch Prime to begin service")
    }
  } else {
    client.whisper(username, "Sorry, couldn't understand your message. Use !stop or !start to update service")
  }
})

// checks if a date is between 1 month and 1 month + 1 hour old.
const oneMonthOld = (dateNumber) => (dateNumber + thirtyDaysInMilliseconds) <= Date.now() && Date.now() <= (dateNumber + thirtyDaysInMilliseconds + oneHourInMilliseconds);

// formats channel name in database to channel name in link
const formatChannelName = channel => channel[0] ==="#" ? channel.slice(1) : channel

// every hour check to see whose re-subscription is available
function checkDatabase(){
  console.log("checking database:", database)
  Object.entries(database).forEach(users => {
    console.log("users: ", users)
    const {blacklist, username, channel, lastSubbed } = users[1];
    console.log("info:", blacklist, username, channel, lastSubbed)
    if(!blacklist && oneMonthOld(lastSubbed)){
      const channelName = formatChannelName(channel);
      client.whisper(username, `Hey ${username}, your twitch prime sub is available. Last month you subbed to ${channelName}. If you'd like to sub to them again go to https://www.twitch.tv/${channelName} `)
    }
  })
}

setInterval(() => checkDatabase(), oneHourInMilliseconds);

module.exports = {oneHourInMilliseconds, thirtyDaysInMilliseconds, checkDatabase, oneMonthOld, formatChannelName}




