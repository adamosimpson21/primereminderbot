# primereminderbot
Twitch bot for assisting with managing subscriptions

### Set-up
1. Create your own twitch user to send whispers. Replace this with the current username on line 40 of index.js
2. Create a `.env` file in the root directory
3. In the `.env` file, create a `PASSWORD=` (my twitch oath password, starts with oauth:) and `MONGODB_URI=` (starts with mongodb://) variables for your bot and database
4. `npm install` to install all necessary dependencies
5. Choose your own channels to add this bot to `const channels = [#channelName1, #channelName2]` currently on Line 17 of index.js. Adding a bot to a channel it's already it is redundant and will cause un-necessary spam to twitch prime subscribers.
6. Change line 14 of index.js `const myUserName=` to the username you'd like to receive contact whispers and update messages to. This will help you manage the bot from a far.
7. `npm start` to begin the application

### How it works
Whenever someone subscribes with Twitch Prime in a channel your bot is in, they are sent `createMessage` from the bot.
Their information is stored in your database and 30 days later the bot whispers them that their Twitch Prime subscription is able to be renewed.
Other functions are for managing the database and contacting the admin ( that's you!).