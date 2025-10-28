class Tweet {
  private text: string;
  time: Date;

  constructor(tweet_text: string, tweet_time: string) {
    this.text = tweet_text;
    this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
  }

  //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
  get source(): string {
    const event_type = this.text.toLowerCase();
    if (event_type.startsWith("just completed")) return "completed_event";
    if (event_type.startsWith("just posted")) return "completed_event";
    if (event_type.includes("right now")) return "live_event";
    if (event_type.startsWith("achieved")) return "achievement";

    return "miscellaneous";
  }

  //returns a boolean, whether the text includes any content written by the person tweeting.
  get written(): boolean {
    //TODO: identify whether the tweet is written
    const text = this.text.toLowerCase();

    const text_w_no_link = text.replace(/https:\/\/t\.co\/\S+/g, "");

    const text_w_no_hashtag = text_w_no_link.replace(/#runKeeper/g, "");
    const text_w_filler = text_w_no_hashtag
      .replace(/https:\/\/t\.co\/\S+/g, "")
      .replace(/#runkeeper/g, "")
      .replace(/just (completed|posted|finished|did)/g, "")
      .replace(
        /an?\s[\d.]+\s?(mi|km)\s(run|walk|ride|bike|hike|workout|activity)/g,
        ""
      )
      .replace(/(with|via)\s@runkeeper/g, "")
      .replace(/check (it )?out!?/g, "")
      .replace(/achieved a new personal record!?/g, "")
      .replace(/watch it here:?/g, "")
      .replace(/[-–—]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (text_w_filler === "" || text_w_filler.length < 10) {
      return false;
    }
    return true;
  }

  get writtenText(): string {
    if (!this.written) {
      return "";
    } else {
      return this.text;
    }
  }

  get activityType(): string {
    if (this.source != "completed_event") {
      return "unknown";
    }
    //TODO: parse the activity type from the text of the tweet
    const text = this.text.toLowerCase();

    const text_w_no_filler = text
      .replace(/#runkeeper/g, "")
      .replace(/@runkeeper/g, "")
      .trim();

    if (text_w_no_filler.includes("run")) return "run";
    if (text_w_no_filler.includes("hike")) return "hike";
    if (text_w_no_filler.includes("ride")) return "bike";
    if (text_w_no_filler.includes("bike")) return "bike";
    if (text_w_no_filler.includes("walk")) return "walk";
    if (text_w_no_filler.includes("swim")) return "swim";
    if (text_w_no_filler.includes("yoga")) return "yoga";
    if (text_w_no_filler.includes("elliptical")) return "elliptical";
    if (text_w_no_filler.includes("row")) return "row";

    return "unknown";
  }

  get distance(): number {
    if (this.source != "completed_event") {
      return 0;
    }
    // const text_distance = this.text.match(/[\d.]+\s?(km|mi)/i);
    const text_distance = this.text.match(/([\d.]+)\s?(km|mi)/i);

    if (!text_distance) {
      return 0;
    }

    let distance = parseFloat(text_distance[1]);
    const unit = text_distance[2].toLowerCase();

    if (unit === "km") {
      distance *= 0.621;
    }

    return distance;
  }

  getHTMLTableRow(rowNumber: number): string {
    //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
    return "<tr></tr>";
  }
}
