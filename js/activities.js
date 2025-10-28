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

  const completed = tweet_array.filter((t) => t.source === "completed_event");
  const activities = {};

  completed.forEach((t) => {
    const act_type = t.activityType;
    if (act_type && act_type !== "unknown") {
      activities[act_type] = (activities[act_type] || 0) + 1;
    }
  });

  const activities_sorted = Object.entries(activities)
    .map(([activityType, count]) => ({ activityType, count }))
    .sort((a, b) => b.count - a.count);

  document.getElementById("numberActivities").innerText =
    activities_sorted.length;
  document.getElementById("firstMost").innerText =
    activities_sorted[0].activityType;
  document.getElementById("secondMost").innerText =
    activities_sorted[1].activityType;
  document.getElementById("thirdMost").innerText =
    activities_sorted[2].activityType;

  document.getElementById("longestActivityType").innerText =
    activities_sorted[2].activityType;

  const top3 = activities_sorted.slice(0, 3).map((a) => a.activityType);
  console.log("top3:", top3);

  const top3_distances = {};

  completed.forEach((t) => {
    const act_type = t.activityType;
    if (top3.includes(act_type) && t.distance > 0) {
      if (!top3_distances[act_type]) {
        top3_distances[act_type] = {
          total: 0,
          count: 0,
          weekends: 0,
          weekdays: 0,
        };
      }
      top3_distances[act_type].total += t.distance;
      top3_distances[act_type].count++;

      const day = t.time.getDay();
      if (day === 0 || day === 6) {
        top3_distances[act_type].weekends++;
      } else {
        top3_distances[act_type].weekdays++;
      }
    }
  });

  console.log("Top3_distances: ", top3_distances);

  const distance_sorted = Object.entries(top3_distances)
    .map(([activityType, stats]) => ({
      activityType,
      totalDistance: stats.total,
      avgDistance: stats.total / stats.count,
      avgWeekend: stats.weekends / stats.total,
      avgWeekday: stats.weekdays / stats.total,
    }))
    .sort((a, b) => b.totalDistance - a.totalDistance);

  console.log("Distance totals:", distance_sorted);
  console.log("Shortest index:", distance_sorted.length - 1);

  document.getElementById("longestActivityType").innerText =
    distance_sorted[0].activityType;
  document.getElementById("shortestActivityType").innerText =
    distance_sorted[2].activityType;

  const preferred_day =
    distance_sorted[0].avgWeekend > distance_sorted[0].avgWeekday
      ? "weekends"
      : "weekdays";
  document.getElementById("weekdayOrWeekendLonger").innerText = preferred_day;

  //TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

  activity_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph of the number of Tweets containing each type of activity.",
    data: {
      values: activities_sorted,
    },
    //TODO: Add mark and encoding
    mark: "bar",
    encoding: {
      x: { field: "activityType", type: "nominal", title: "Activity Type" },
      y: { field: "count", type: "quantitative", title: "Number of Tweets" },
    },
  };
  vegaEmbed("#activityVis", activity_vis_spec, { actions: false });

  //TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
  //Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
