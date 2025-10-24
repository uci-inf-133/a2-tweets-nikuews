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
      .replace("just completed", "")
      .replace("just posted", "")
      .replace("achieved a new personal", "")
      .replace("check it out!", "")
      .replace(/[-–—]/g, "")
      .replace("watch it here:", "")
      .replace("with @runkeeper", "")
      .replace(/#runkeeper/g, "")
      .replace(/a\s[\d.]+\s(?:mi|km)\srun/g, "")
      .replace(".", "")
      .trim();

    return text_w_filler.length > 0;
  }

  get writtenText(): string {
    if (!this.written) {
      return "";
    }
    const text = this.text.toLowerCase();

    const text_w_no_link = text.replace(/https:\/\/t\.co\/\S+/g, "");

    const text_w_no_hashtag = text_w_no_link.replace(/#runKeeper/g, "");
    const text_w_no_filler = text_w_no_hashtag
      .replace("just completed", "")
      .replace("just posted", "")
      .replace("achieved a new personal", "")
      .replace("check it out!", "")
      .replace(/[-–—]/g, "")
      .replace("watch it here:", "")
      .replace("with @runkeeper", "")
      .replace(/#runkeeper/g, "")
      .replace(/a\s[\d.]+\s(?:mi|km)\srun/g, "")
      .replace(".", "")
      .trim();

    //TODO: parse the written text from the tweet
    return text_w_no_filler;
  }

  get activityType(): string {
    if (this.source != "completed_event") {
      return "unknown";
    }
    //TODO: parse the activity type from the text of the tweet
    return "";
  }

  get distance(): number {
    if (this.source != "completed_event") {
      return 0;
    }
    //TODO: prase the distance from the text of the tweet
    return 0;
  }

  getHTMLTableRow(rowNumber: number): string {
    //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
    return "<tr></tr>";
  }
}
