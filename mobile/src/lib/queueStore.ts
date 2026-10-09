import {
  QueueEntry as ServiceQueueEntry,
  getActiveQueueEntrySync,
  joinQueue as serviceJoinQueue,
  leaveQueue as serviceLeaveQueue,
  SeatingPreference,
} from './queueService';

export interface LegacyQueueEntry {
  id?: string;
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

export type QueueEntry = LegacyQueueEntry;

export const getQueueEntry = (): LegacyQueueEntry => {
  const active = getActiveQueueEntrySync();
  if (active) {
    return {
      id: active.id,
      fullName: active.customerName,
      phone: active.phoneNumber,
      partySize: active.partySize,
      seatingPref: active.seatingPreference,
      specialReq: active.specialRequests,
      joinedTime: active.joinedTimeFormatted,
      position: active.queuePosition,
      tablesAhead: active.tablesAhead,
      waitMin: active.estimatedWaitMinutes,
    };
  }
  return {
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

export const setQueueEntry = (entry: Partial<LegacyQueueEntry>) => {
  // Syncs to legacy store if needed
};

export const clearQueueEntry = () => {
  serviceLeaveQueue();
};
