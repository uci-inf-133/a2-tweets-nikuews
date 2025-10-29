//editable
let written_t = [];

function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  //TODO: Filter to just the written tweets
  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  written_t = tweet_array.filter((t) => t.written);
}

function addEventHandlerForSearch() {
  //TODO: Search the written tweets as text is entered into the search box, and add them to the table

  // initializing my variables so it's easier for use in my code!
  const textFilter = document.getElementById("textFilter");
  const tweet_table = document.getElementById("tweetTable");
  const searchCount = document.getElementById("searchCount");
  const searchText = document.getElementById("searchText");

  // setting the defaults so that the user does not see the ???.
  searchCount.innerText = 0;
  tweet_table.innerHTML = "";
  searchText.innerText = "";

  textFilter.addEventListener("input", (e) => {
    const user_input = e.target.value.toLowerCase();
    const filtered_text = written_t.filter((t) =>
      t.text.toLowerCase().includes(user_input)
    );

    searchCount.innerText = filtered_text.length;
    searchText.innerText = user_input;

    tweet_table.innerHTML = filtered_text
      .map((t, i) => t.getHTMLTableRow(i + 1))
      .join("");
  });
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  addEventHandlerForSearch();
  loadSavedRunkeeperTweets().then(parseTweets);
});
