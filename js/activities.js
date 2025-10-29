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

  // only use completed events for the activities !!
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

  console.log("Activities Sorted: ", activities_sorted);
  console.log("I AM HERE IN ACTIVITIES.");

  document.getElementById("numberActivities").innerText =
    activities_sorted.length;
  document.getElementById("firstMost").innerText =
    activities_sorted[0].activityType;
  document.getElementById("secondMost").innerText =
    activities_sorted[1].activityType;
  document.getElementById("thirdMost").innerText =
    activities_sorted[2].activityType;

  const top3 = activities_sorted.slice(0, 3).map((a) => a.activityType);
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

  // HARD CODED VALUES THAT PROF MENTIONED WAS OKAY TO PUT DOWN.
  document.getElementById("longestActivityType").innerText = "bike";
  document.getElementById("shortestActivityType").innerText = "walk";
  document.getElementById("weekdayOrWeekendLonger").innerText = "weekends";

  const distance_data = completed
    .filter((t) => top3.includes(t.activityType) && t.distance > 0)
    .map((t) => ({
      activityType: t.activityType,
      distance: parseFloat(t.distance.toFixed(2)),
      day: t.time.toLocaleDateString("en-US", { weekday: "long" }),
    }));

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
  activity_day_graph = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph that shows the mean of the top 3 activities on the day of the week.",
    data: {
      values: distance_data,
    },
    //TODO: Add mark and encoding
    mark: "point",
    fill: true,
    opacity: 0.75,
    encoding: {
      x: {
        field: "day",
        type: "nominal",
        title: "Days of the Week",
        sort: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
      y: {
        field: "distance",
        type: "quantitative",
        title: "Distance (miles)",
      },
      color: {
        field: "activityType",
        type: "nominal",
        title: "Activity Type",
      },
    },
  };

  activity_mean_graph = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph that shows the mean of the top 3 activities on the day of the week.",
    data: {
      values: distance_data,
    },
    //TODO: Add mark and encoding
    mark: "point",
    fill: true,
    opacity: 0.75,
    encoding: {
      x: {
        field: "day",
        type: "nominal",
        title: "Days of the Week",
        sort: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
      y: {
        aggregate: "mean",
        field: "distance",
        type: "quantitative",
        title: "Average Distance (miles)",
      },
      color: {
        field: "activityType",
        type: "nominal",
        title: "Activity Type",
      },
    },
  };

  let showAggregate = false;

  document.getElementById("aggregate").addEventListener("click", () => {
    showAggregate = !showAggregate;

    if (showAggregate) {
      vegaEmbed("#distanceVisAggregated", activity_mean_graph, {
        actions: false,
      });
      document.getElementById("aggregate").innerText = "Show Mean";
      document.getElementById("distanceVis").innerHTML = "";
    } else {
      vegaEmbed("#distanceVis", activity_day_graph, { actions: false });
      document.getElementById("aggregate").innerText = "Show all activites";
      document.getElementById("distanceVisAggregated").innerHTML = "";
    }
  });
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
