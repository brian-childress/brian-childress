const dotenv = require("dotenv");
const Parser = require("rss-parser");
const Twitter = require("twitter");

dotenv.config();

const client = new Twitter({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET_KEY,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});
console.log(client.consumer_key);

// get RSS feed
const parser = new Parser();

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

// Inspired by: https://www.geeksforgeeks.org/get-the-relative-timestamp-difference-between-dates-in-javascript/
const timeDiff = (prev) => {
  if (!prev) {
    return null;
  }
  const curr = new Date();
  const ms_Min = 60 * 1000; // milliseconds in Minute
  const ms_Hour = ms_Min * 60; // milliseconds in Hour
  const ms_Day = ms_Hour * 24; // milliseconds in day
  const ms_Mon = ms_Day * 30; // milliseconds in Month
  const ms_Yr = ms_Day * 365; // milliseconds in Year
  const diff = curr - prev; //difference between dates.

  if (diff < ms_Min) {
    // If the diff is less then milliseconds in a minute
    return "A few seconds ago";
  } else if (diff < ms_Hour) {
    // If the diff is less then milliseconds in a Hour
    return "A few minutes ago";
  } else if (diff < ms_Day) {
    // If the diff is less then milliseconds in a day
    return "A few hours ago";
  } else if (diff < ms_Mon) {
    // If the diff is less then milliseconds in a Month
    return "A few days ago";
  } else if (diff < ms_Yr) {
    // If the diff is less then milliseconds in a year
    return "A few months ago";
  } else {
    return "A while back";
  }
};

(async () => {
  let feed = await parser.parseURL("https://brianchildress.co/atom.xml");

  // Select a post
  const postNumber = getRandomInt(feed.items.length);
  const selectedPost = feed.items[postNumber];

  // Determine what the time stamp is
  const postDate = Date.parse(selectedPost.pubDate);
  const timeSincePost = timeDiff(postDate);
  // Generate and send post
  const postLink = selectedPost.link;
  const status = `${timeSincePost} I wrote an article called, "${selectedPost.title}". ${postLink}`;

  client.post(
    "statuses/update",
    {
      status: status,
    },
    function (error, tweet, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(tweet);
      }
    }
  );
})();
