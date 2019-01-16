require('dotenv').config();
const TwitchJS = require('twitch-js');
const {createSub, changeBlackList, reSubbed, findSub, findSubByTime, setLastSubbed, logError}  = require('./handlers.js');
const Queue = require('./Queue');

const thirtyDaysInMilliseconds = 2.592e+9;
const oneHourInMilliseconds = 3.6e+6;
const messageBufferLengthInMS = 1500;

//testing times
// const thirtyDaysInMilliseconds = 1000*60;
// const oneHourInMilliseconds = 1000*5;
// me
const myUserName = 'bandswithlegends'

// Channels to connect to TODO: ask more streamers about this bot
const channels = ["#BandsWithLegends", "#tvgbadger", "#gamesdonequick", "#amazonian", "#daughterjudyk"];
const port = process.env.PORT || 80;

// possible messages
const unknownMessage    = "Sorry, couldn't understand your message. Use !info, !contact, !start, !set, or !stop";
const createMessage     = "Thanks for subscribing with Twitch Prime. I'll remind you in 30 days that your free re-subscription is ready. You can stop this service with !stop";
const infoMessage       = "I'm a bot made to help people manage their Twitch Prime subscriptions. Subscribe with Twitch Prime while in a participating channel, or whisper !create to me to start service";
const stopMessage       = "Service Stopped. If you'd like to restart service message me !start";
const setInfoMessage    = "Set up a reminder by using !set. If you just subscribed with Twitch Prime use '!set now' or '!set X' where X is how many days ago you subscribed. Ex: Today is the 9th, but your subscription was used on the 2nd: !set 7";
const contactMessage    = "Contact the maintainer of this bot through http://www.bandswithlegends.com/ , or @BandsWithLegends on Twitch, Twitter, Youtube, or Discord. You can also use !contact {message} to send a message to Bands through the bot!";
const wrongDateMessage  = "Sorry, couldn't understand your date. Use '!set now' or '!set {X}' where X is the number of days since you subscribed";

//connecting to twitch client
const options = {
  options:{
    debug:true
  },
  connection:{
    port,
    secure:false,
    reconnect:true
  },
  identity:{
    username: "primereminderbot1",
    password: process.env.PASSWORD
  },
  channels
};

const client = new TwitchJS.client(options);

client.on("connected", function (address, port) {
  messageQueue.push([myUserName, `Connected on ${address} ${port}`])
});

client.on("subscription", async (channel, username, method, message, user) => {
  // See when someone subscribes with twitch prime
  if(method.prime){
    let foundSub = await findSub(username).catch(logError);
    if(foundSub){
      reSubbed(username, channel)
        .then(sub => !sub.blacklist && messageQueue.push([sub.username, `Thanks, ${sub.username}, for subscribing with Twitch Prime again. Counter reset for 30 days.`]))
        .catch(logError)
    } else {
      createSub(username, channel, Date.now(), false)
        .then(sub => messageQueue.push([sub.username, createMessage]))
        .catch(logError);
    }
  }
})
//

// whisper commands
client.on("whisper", async (from, userstate, message, self) => {
  if(self) return;
  const {username} = userstate;
  if(message === '!info') {
    messageQueue.push([username, infoMessage])
  } else if(message === '!contact'){
    messageQueue.push([username, contactMessage])
  } else if(message === '!stop'){
    changeBlackList(username, true)
      .then(sub => messageQueue.push([sub.username, stopMessage]))
      .catch(logError)
  } else if(message ==='!start'){
    changeBlackList(username, false)
      .then(sub => messageQueue.push([sub.username, "Service started"]))
      .catch(logError)
  } else if(message ==='!set'){
    messageQueue.push([username, setInfoMessage])
  } else if(message.startsWith('!set ')){
    const time = message.slice(5);
    if(time==='now'){
      setLastSubbed(username, 0)
        .then(sub => messageQueue.push([sub.username, `Date set to 0 days ago`]))
        .catch(logError)
    } else if(!isNaN(time) && time<=30){
      setLastSubbed(username, time)
        .then(sub => messageQueue.push([sub.username, `Date set to ${time} days ago`]))
        .catch(logError)
    } else if(!isNaN(time)){
      messageQueue.push([username, `Sorry, can't set time to more than 30 days`])
    } else {
      messageQueue.push([username, wrongDateMessage])
    }
  } else if(message.startsWith('!contact ')){
    const contactMessage = message.slice(8);
    messageQueue.push([myUserName, `${username} says: ${contactMessage}`]);
  } else {
    messageQueue.push([username, unknownMessage])
  }
})

// checks if a date is between 1 month and 1 month + 1 hour old.
const oneMonthOld = dateNumber => (dateNumber + thirtyDaysInMilliseconds) <= Date.now() && Date.now() <= (dateNumber + thirtyDaysInMilliseconds + oneHourInMilliseconds);

// formats channel name in database to channel name in link
const formatChannelName = channel => channel[0] ==="#" ? channel.slice(1) : channel

// every hour check to see whose re-subscription is available
function checkDatabase(){
  console.log("Checking Database: ", Date.now())
  findSubByTime(oneHourInMilliseconds)
    .then(availableSubs => {
      console.log("AvailableSubs:", availableSubs)
      if(availableSubs.length >= 0) {
        availableSubs.forEach(user => {
          const {blacklist, username, channel} = user;
          if (!blacklist) {
            const channelName = formatChannelName(channel);
            client.whisper(username, `Your twitch prime sub is available. To re-sub to ${channelName} go to https://www.twitch.tv/${channelName} . Use the command !set now to reset timer for 30 days`)
          }
        })
      }
    })
    .catch(logError)
}

// Use queue system to buffer whispers in compliance with Twitch ToS
const messageQueue = new Queue();
function checkForMessages(){
  if (messageQueue.length > 0 ){
    console.log("Number of messages in queue:", messageQueue.length)
    const outGoingMessage = messageQueue.shift();
    client.whisper(outGoingMessage[0], outGoingMessage[1]);
  }
}

setInterval(() => checkForMessages(), messageBufferLengthInMS);
setInterval(() => checkDatabase(), oneHourInMilliseconds);

client.connect();

module.exports = {oneHourInMilliseconds, thirtyDaysInMilliseconds, checkDatabase, oneMonthOld, formatChannelName, checkForMessages};




