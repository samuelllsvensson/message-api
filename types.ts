export type Message = {
  message: string;
  timestamp: Date;
};

export type Messages = {
  [recipient: string]: Message[];
};

export type LastFetchedTimes = {
  [recipient: string]: Date;
};
