export interface QueueEntry {
  fullName: string;
  phone: string;
  partySize: number;
  seatingPref: string;
  specialReq?: string;
  joinedTime: string;
  position: number;
  tablesAhead: number;
  waitMin: number;
}

let activeQueue: QueueEntry = {
  fullName: '',
  phone: '',
  partySize: 2,
  seatingPref: 'Indoor',
  specialReq: '',
  joinedTime: '6:40 PM',
  position: 3,
  tablesAhead: 2,
  waitMin: 15,
};

export const getQueueEntry = (): QueueEntry => activeQueue;

export const setQueueEntry = (entry: Partial<QueueEntry>): QueueEntry => {
  activeQueue = { ...activeQueue, ...entry };
  return activeQueue;
};

export const clearQueueEntry = () => {
  activeQueue = {
    fullName: '',
    phone: '',
    partySize: 2,
    seatingPref: 'Indoor',
    specialReq: '',
    joinedTime: '6:40 PM',
    position: 3,
    tablesAhead: 2,
    waitMin: 15,
  };
};
