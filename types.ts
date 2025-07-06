
export enum PingStatus {
  Success = 'Success',
  Failure = 'Failure',
  Pinging = 'Pinging',
}

export interface PingLog {
  id: string;
  timestamp: Date;
  server: string;
  responseTime: number | null;
  status: PingStatus;
}
