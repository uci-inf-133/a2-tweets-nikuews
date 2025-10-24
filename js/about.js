//editable
function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  //This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
  //It works correctly, your task is to update the text of the other tags in the HTML file!
  document.getElementById("numberTweets").innerText = tweet_array.length;

  //do the times here
  const tweet_times = tweet_array.map((t) => t.time);
  const firstDate = new Date(Math.min(...tweet_times));
  const lastDate = new Date(Math.max(...tweet_times));

  // going into the tweet categories
  const total_events = tweet_array.length;
  const completed = tweet_array.filter((t) => t.source === "completed_event");
  const achieved = tweet_array.filter((t) => t.source === "achievement").length;
  const live = tweet_array.filter((t) => t.source === "live_event").length;
  const misc = tweet_array.filter((t) => t.source === "miscellaneous").length;
  const written = completed.filter((t) => t.written);

  document.getElementById("firstDate").innerText = firstDate.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  document.getElementById("lastDate").innerText = lastDate.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  document
    .querySelectorAll(".completedEvents")
    .forEach((e) => (e.innerText = completed.length));

  document
    .querySelectorAll(".completedEventsPct")
    .forEach(
      (e) =>
        (e.innerText = `${((completed.length / total_events) * 100).toFixed(2)}%`)
    );

  document.querySelectorAll(".liveEvents").forEach((e) => (e.innerText = live));

  document
    .querySelectorAll(".liveEventsPct")
    .forEach(
      (e) => (e.innerText = `${((live / total_events) * 100).toFixed(2)}%`)
    );

  document
    .querySelectorAll(".achievements")
    .forEach((e) => (e.innerText = achieved));

  document
    .querySelectorAll(".achievementsPct")
    .forEach(
      (e) => (e.innerText = `${((achieved / total_events) * 100).toFixed(2)}%`)
    );

  document
    .querySelectorAll(".miscellaneous")
    .forEach((e) => (e.innerText = misc));

  document
    .querySelectorAll(".miscellaneousPct")
    .forEach(
      (e) => (e.innerText = `${((misc / total_events) * 100).toFixed(2)}%`)
    );

  document
    .querySelectorAll(".written")
    .forEach((e) => (e.innerText = written.length));
  document
    .querySelectorAll(".writtenPct")
    .forEach(
      (e) =>
        (e.innerText = `${((written.length / completed.length) * 100).toFixed(2)}%`)
    );
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
