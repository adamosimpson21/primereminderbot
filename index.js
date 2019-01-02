const tmi = require("tmi.js");
const {password} = require("./password");
const database = require("mongoose");
const {createSub, changeBlackList, reSubbed, findSub} = require('./handlers');

const thirtyDaysInMilliseconds = 2.592e+9;
const oneHourInMilliseconds = 3.6e+6;

//testing times
// const thirtyDaysInMilliseconds = 1000*60;
// const oneHourInMilliseconds = 1000*5;

// const database = {};

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

client.on("chat", async (channel, user, message, self) => {
  if(self) return;
  const {username} = user;
  // if(method==="prime"){
  let foundSub = await findSub(username);
  console.log("FoundSub: ", foundSub);
  let foundSubUserName = foundSub.username;
  console.log("foundSubUserName: ", foundSubUserName);
  if(message==="prime" && foundSub && foundSubUserName==='bandswithlegends'){
    if(foundSubUserName && foundSub.blacklist) return null;
    else if(foundSubUserName && !foundSub.blacklist){
      reSubbed(username, channel)
        .then(sub => {
          console.log("Resubbed :", sub)
          client.whisper(username, `Thanks, ${username}, for subscribing with Twitch Prime again. Counter reset for 30 days.`)
        })
        .catch(err => {
          console.log("Error in Resub: ", err)
        })
    } else {
      createSub(username, channel)
        .then(sub => {
          console.log("new sub:", sub)
          client.whisper(username, "Hello, You subbed with Twitch Prime. If you'd like, I'll message you in 30 days to remind you to sub with Twitch Prime again. If not, simply message me back !stop and you will not receive any more messages from me.");
        })
        .catch(err => console.log("Error in new sub:", err));
      }
  }
})

client.on("whisper", (from, userstate, message, self) => {
  if(self) return;
  const {username} = userstate
  if(!database[username]){
    client.whisper(username, "Sorry, couldn't find you in the database. Subscribe with Twitch Prime to begin service")
  } else {
    if(message === '!stop'){
        database[username].blacklist = true;
        client.whisper(username, "Service Stopped. If you'd like to restart service message me !start ")
    } else if(message ==='!start'){
      if(database[username]){
        database[username].blacklist = false;
        client.whisper(username, "Service started")
      }
    } else {
      client.whisper(username, "Sorry, couldn't understand your message. Use !stop or !start to update service")
    }
  }
})

// checks if a date is between 1 month and 1 month + 1 hour old.
const oneMonthOld = (dateNumber) => (dateNumber + thirtyDaysInMilliseconds) <= Date.now() && Date.now() <= (dateNumber + thirtyDaysInMilliseconds + oneHourInMilliseconds);

// formats channel name in database to channel name in link
const formatChannelName = channel => channel[0] ==="#" ? channel.slice(1) : channel

// every hour check to see whose re-subscription is available
function checkDatabase(){
  Object.entries(database).forEach(users => {
    const {blacklist, username, channel, lastSubbed } = users[1];
    if(!blacklist && oneMonthOld(lastSubbed)){
      const channelName = formatChannelName(channel);
      client.whisper(username, `Hey ${username}, your twitch prime sub is available. Last month you subbed to ${channelName}. If you'd like to sub to them again go to https://www.twitch.tv/${channelName} `)
    }
  })
}

setInterval(() => checkDatabase(), oneHourInMilliseconds);

module.exports = {oneHourInMilliseconds, thirtyDaysInMilliseconds, checkDatabase, oneMonthOld, formatChannelName}




