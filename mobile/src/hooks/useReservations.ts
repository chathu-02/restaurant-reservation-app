import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { dateValue, postKitchenAlert, LARGE_GROUP } from '@/lib/booking';
import { ShiftOverviewData, Reservation, QueueGuest } from '@/services/reservation.service';

export type FloorTableItem = {
  id: string;
  name: string;
  seats: number;
  status: string;
  area: string;
  row?: number;
  col?: number;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  category?: string;
  read?: boolean;
  readBy?: string[];
  recipientId?: string;
  recipientRole?: string;
  targetScreen?: string;
  createdAt?: any;
};

export type KitchenAlertItem = {
  id: string;
  type: string;
  message: string;
  acknowledged: boolean;
  createdAt?: any;
};

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 1170; // Default 7:30 PM
  const cleaned = timeStr.trim();
  const match = cleaned.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return 1170;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function useReservations() {
  const [overview, setOverview] = useState<ShiftOverviewData | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [queue, setQueue] = useState<QueueGuest[]>([]);
  const [tables, setTables] = useState<FloorTableItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [kitchenAlerts, setKitchenAlerts] = useState<KitchenAlertItem[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to re-calculate ShiftOverviewData dynamically from snapshots
  const calculateOverview = useCallback(
    (resList: Reservation[], queueList: QueueGuest[], tableList: FloorTableItem[], staffCount: number): ShiftOverviewData => {
      const todayStr = dateValue(new Date());
      const now = new Date();

      // Today's reservations
      const todayRes = resList.filter((r) => r.date === todayStr || !r.date);

      const reservationsToday = todayRes.length;
      const newReservations = todayRes.filter((r) => r.status === 'pending' || r.status === 'deposit-due').length;
      const noShowsToday = todayRes.filter((r) => (r.status as string) === 'no_show' || (r.status as string) === 'no-show').length;

      // Active queue
      const activeQueue = queueList.filter((q) => q.status !== 'seated' && q.status !== 'cancelled');
      const guestsInQueue = activeQueue.reduce((acc, curr) => acc + (curr.partySize || 0), 0);
      const totalWait = activeQueue.reduce((acc, curr) => acc + (curr.estimatedWaitMinutes || 0), 0);
      const queueWaitMinutes = activeQueue.length > 0 ? Math.round(totalWait / activeQueue.length) : 0;

      // Occupied tables
      const occupiedFromTables = tableList.filter((t) => t.status === 'busy' || t.status === 'occupied').length;
      const seatedRes = todayRes.filter((r) => r.status === 'seated').length;
      const occupiedTables = Math.max(occupiedFromTables, seatedRes);
      const totalTables = tableList.length || 20;
      const tablesOccupancyRate = Math.min(100, Math.round((occupiedTables / totalTables) * 100));

      const noShowRateLabel =
        reservationsToday > 0 ? `${Math.round((noShowsToday / reservationsToday) * 100)}% rate` : 'Low rate';

      // Formatting pretty date
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
      const formattedDate = now.toLocaleDateString('en-US', options).toUpperCase();

      // Dynamic Rush Hour calculation from actual reservations
      const activeTodayRes = todayRes.filter((r) => r.status !== 'cancelled' && (r.status as string) !== 'no_show');

      let peakRushTime = '7:30 PM';
      let peakExpectedGuests = 18;
      let peakWithinMinutes = 45;

      if (activeTodayRes.length > 0) {
        const timeSlotMap: Record<string, { guests: number; count: number; timeMinutes: number }> = {};

        activeTodayRes.forEach((res) => {
          const rawTime = res.time || '7:30 PM';
          const tMinutes = res.timeMinutes ?? parseTimeToMinutes(rawTime);
          if (!timeSlotMap[rawTime]) {
            timeSlotMap[rawTime] = { guests: 0, count: 0, timeMinutes: tMinutes };
          }
          timeSlotMap[rawTime].guests += res.partySize || 2;
          timeSlotMap[rawTime].count += 1;
        });

        let maxGuests = 0;
        let peakMinutes = 1170;

        Object.entries(timeSlotMap).forEach(([timeSlot, data]) => {
          if (data.guests > maxGuests) {
            maxGuests = data.guests;
            peakRushTime = timeSlot;
            peakMinutes = data.timeMinutes;
          }
        });

        peakExpectedGuests = maxGuests;

        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        let diffMinutes = peakMinutes - nowMinutes;
        if (diffMinutes < 0) {
          diffMinutes = Math.max(0, 1440 + diffMinutes);
        }
        peakWithinMinutes = diffMinutes;
      }

      return {
        date: formattedDate,
        service: 'DINNER SERVICE',
        dutyRole: 'Shift Lead on Duty',
        reservationsToday: reservationsToday || 42,
        newReservations: newReservations || 4,
        guestsInQueue: guestsInQueue || 6,
        queueWaitMinutes: queueWaitMinutes || 12,
        occupiedTables: occupiedTables || 14,
        totalTables: totalTables || 20,
        tablesOccupancyRate: tablesOccupancyRate || 70,
        noShowsToday,
        noShowRateLabel,
        rushAlert: {
          time: peakRushTime,
          expectedGuests: peakExpectedGuests,
          withinMinutes: peakWithinMinutes,
        },
        managerTools: {
          staffOnShift: staffCount || 8,
          settingsSubtitle: 'Hours, kitchen pacing, notifications',
          floorPlanSubtitle: 'Main room, Patio & Private bar',
          analyticsSubtitle: 'Pacing, table turns & revenue pace',
        },
      };
    },
    []
  );

  useEffect(() => {
    setLoading(true);
    setError(null);

    // 1. Reservations snapshot
    const resRef = collection(db, 'reservations');
    const unsubRes = onSnapshot(
      resRef,
      (snap) => {
        const list: Reservation[] = snap.docs.map((d) => {
          const data = d.data();
          const tableNames = Array.isArray(data.tableNames) && data.tableNames.length
            ? data.tableNames.join(', ')
            : data.tableNumber || 'Unassigned';

          return {
            id: d.id,
            guestName: data.userName || data.guestName || 'Guest',
            partySize: Number(data.partySize ?? 2),
            time: data.time || '7:00 PM',
            timeMinutes: data.timeMinutes,
            date: data.date,
            tableNumber: tableNames,
            tableArea: data.tableArea || (data.tableNames?.length ? 'Main Dining' : ''),
            status: data.status || 'confirmed',
            phone: data.phone || '',
            notes: data.notes || '',
            vipBadge: data.vipBadge || (data.partySize >= 10 ? 'VIP' : undefined),
            tags: data.tags || [],
            seatedInfo: data.seatedInfo || (data.checkedIn ? 'Checked-In' : undefined),
            actionType: data.actionType || (data.status === 'pending' ? 'assign' : data.status === 'confirmed' ? 'seat' : undefined),
            checkedIn: !!data.checkedIn,
            depositStatus: data.depositStatus,
            depositAmount: data.depositAmount,
            tableIds: data.tableIds || [],
            avatarUrl: data.avatarUrl || data.userAvatar || data.imageUrl || data.photoURL || undefined,
          };
        });
        setReservations(list);
        setLoading(false);
      },
      (err) => {
        console.warn('Reservations onSnapshot warning:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // 2. Queue snapshot
    const queueRef = collection(db, 'queue');
    const unsubQueue = onSnapshot(
      queueRef,
      (snap) => {
        const list: QueueGuest[] = snap.docs.map((d) => {
          const data = d.data();
          let timeStr = 'Just now';
          if (data.joinedAt) {
            if (typeof data.joinedAt === 'string') {
              timeStr = data.joinedAt;
            } else if (data.joinedAt.toDate) {
              timeStr = data.joinedAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
          }

          return {
            id: d.id,
            guestName: data.guestName || data.name || 'Guest',
            partySize: Number(data.partySize ?? data.guests ?? 2),
            joinedAt: timeStr,
            estimatedWaitMinutes: Number(data.estimatedWaitMinutes ?? 12),
            phone: data.phone || '',
            notes: data.notes || '',
            status: data.status || 'waiting',
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
          };
        });

        // Sort ascending by creation time: oldest guests at top (#1, #2...), newest guests at bottom
        list.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));

        setQueue(list);
      },
      (err) => {
        console.warn('Queue onSnapshot warning:', err);
      }
    );

    // 3. Tables snapshot
    const tablesRef = collection(db, 'tables');
    const unsubTables = onSnapshot(
      tablesRef,
      (snap) => {
        const list: FloorTableItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || d.id,
            seats: Number(data.seats ?? 4),
            status: data.status || 'free',
            area: data.area || 'main',
            row: data.row,
            col: data.col,
          };
        });
        setTables(list);
      },
      (err) => {
        console.warn('Tables onSnapshot warning:', err);
      }
    );

    // 4. Users snapshot (for staff on shift count)
    const usersRef = collection(db, 'users');
    const unsubUsers = onSnapshot(
      usersRef,
      (snap) => {
        setUsersCount(snap.size);
      },
      (err) => {
        console.warn('Users onSnapshot warning:', err);
      }
    );

    // 5. Notifications snapshot
    const notificationsRef = collection(db, 'notifications');
    const unsubNotifications = onSnapshot(
      notificationsRef,
      (snap) => {
        const list: NotificationItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || 'Notification',
            message: data.message || data.body || '',
            type: data.type || 'info',
            category: data.category || 'booking',
            read: !!data.read,
            readBy: data.readBy || [],
            recipientId: data.recipientId,
            recipientRole: data.recipientRole || data.role,
            targetScreen: data.targetScreen || data.route,
            createdAt: data.createdAt,
          };
        });
        setNotifications(list);
      },
      (err) => {
        console.warn('Notifications onSnapshot warning:', err);
      }
    );

    // 6. KitchenAlerts snapshot
    const kitchenRef = collection(db, 'kitchenAlerts');
    const unsubKitchen = onSnapshot(
      kitchenRef,
      (snap) => {
        const list: KitchenAlertItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            type: data.type || 'alert',
            message: data.message || '',
            acknowledged: !!data.acknowledged,
            createdAt: data.createdAt,
          };
        });
        setKitchenAlerts(list);
      },
      (err) => {
        console.warn('KitchenAlerts onSnapshot warning:', err);
      }
    );

    return () => {
      unsubRes();
      unsubQueue();
      unsubTables();
      unsubUsers();
      unsubNotifications();
      unsubKitchen();
    };
  }, []);

  // Update Overview when underlying data changes
  useEffect(() => {
    const updatedOverview = calculateOverview(reservations, queue, tables, usersCount);
    setOverview(updatedOverview);
  }, [reservations, queue, tables, usersCount, calculateOverview]);

  // Auto-trigger Rush Hour Imminent Alert notification ONLY when real peak rush time arrives (within 5 mins)
  useEffect(() => {
    if (!overview?.rushAlert) return;
    const { time, expectedGuests, withinMinutes } = overview.rushAlert;

    // Only trigger when real time is within 5 minutes of peak rush hour time
    if (expectedGuests >= 8 && withinMinutes <= 5 && withinMinutes >= 0) {
      const alertTitle = `⚡ RUSH HOUR IMMINENT ALERT (${time})`;

      const alreadyAlerted = notifications.some(
        (n) => n.title.includes('RUSH HOUR IMMINENT') && n.message.includes(time)
      );

      if (!alreadyAlerted) {
        addDoc(collection(db, 'notifications'), {
          title: alertTitle,
          message: `Rush Hour starting now at ${time}! ${expectedGuests} guests expected. Prepare host stand & kitchen pacing.`,
          type: 'critical',
          category: 'critical',
          recipientRole: 'staff',
          targetScreen: '/(staff)/manager',
          read: false,
          createdAt: serverTimestamp(),
        }).catch((err) => console.warn('Failed to auto-trigger rush hour notification:', err));
      }
    }
  }, [overview?.rushAlert, notifications]);

  // Unread notification count for current user
  const currentUid = auth.currentUser?.uid;
  const unreadNotificationsCount = notifications.filter((n) => {
    if (n.read) return false;
    if (currentUid && n.readBy && n.readBy.includes(currentUid)) return false;
    return true;
  }).length;

  // Actions
  const addBooking = async (newRes: {
    guestName: string;
    partySize: number;
    time: string;
    tableNumber?: string;
    tableArea?: string;
    status?: string;
    notes?: string;
    phone?: string;
    date?: string;
    avatarUrl?: string;
  }) => {
    const todayStr = dateValue(new Date());
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const docData = {
      bookingId,
      guestName: newRes.guestName.trim(),
      userName: newRes.guestName.trim(),
      partySize: Number(newRes.partySize),
      time: newRes.time,
      tableNumber: newRes.tableNumber || 'Table 5',
      tableNames: [newRes.tableNumber || 'Table 5'],
      tableArea: newRes.tableArea || 'Main Room',
      status: newRes.status || 'confirmed',
      notes: newRes.notes || '',
      phone: newRes.phone || '',
      date: newRes.date || todayStr,
      avatarUrl: newRes.avatarUrl || '',
      depositRequired: false,
      depositStatus: 'none',
      depositAmount: 0,
      checkedIn: false,
      createdAt: serverTimestamp(),
    };

    const ref = await addDoc(collection(db, 'reservations'), docData);

    // Send new booking notification
    try {
      await addDoc(collection(db, 'notifications'), {
        title: 'New Booking Created 📅',
        message: `New reservation #${bookingId} by ${docData.guestName} (${docData.partySize} guests) for ${docData.date} at ${docData.time} assigned to ${docData.tableNumber}.`,
        type: 'booking',
        category: 'booking',
        recipientRole: 'staff',
        targetScreen: '/explore',
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Failed to post booking notification:', err);
    }

    if (newRes.partySize >= LARGE_GROUP) {
      await postKitchenAlert(
        'large_group',
        `Large party: ${newRes.partySize} guests (${newRes.guestName}) at ${newRes.time}.`
      );
    }

    return { id: ref.id, ...docData };
  };

  const notifyNextGuest = async (guestName: string, phone?: string, recipientId?: string) => {
    try {
      await addDoc(collection(db, 'notifications'), {
        title: 'Table Ready Soon! 🍽️',
        message: `Hello ${guestName}, your table is next! Please head towards the host stand.`,
        type: 'queue',
        category: 'queue',
        recipientRole: 'customer',
        recipientId: recipientId || '',
        phone: phone || '',
        targetScreen: '/(customer)/(tabs)/queue',
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Failed to send customer notification:', err);
    }
  };

  const addWalkIn = async (guest: { guestName: string; partySize: number; phone?: string; notes?: string }) => {
    const isNext = queue.length === 0;

    const queueData = {
      guestName: guest.guestName.trim(),
      partySize: Number(guest.partySize),
      phone: guest.phone || '',
      notes: guest.notes || '',
      joinedAt: serverTimestamp(),
      estimatedWaitMinutes: isNext ? 0 : 12,
      status: isNext ? 'next' : 'waiting',
      createdAt: serverTimestamp(),
    };

    const ref = await addDoc(collection(db, 'queue'), queueData);

    // If this guest is next in line, send 'Table Ready Soon' notification
    if (isNext) {
      await notifyNextGuest(guest.guestName.trim(), guest.phone);
    }

    return { id: ref.id, ...queueData, joinedAt: 'Just now' };
  };

  const updateReservationStatus = async (id: string, updates: Record<string, any>) => {
    await updateDoc(doc(db, 'reservations', id), updates);
  };

  const seatReservation = async (id: string, tableNumber?: string) => {
    const updates: Record<string, any> = {
      status: 'seated',
      checkedIn: true,
      seatedInfo: 'Seated just now',
    };
    if (tableNumber) {
      updates.tableNumber = tableNumber;
      updates.tableNames = [tableNumber];
    }
    await updateDoc(doc(db, 'reservations', id), updates);
  };

  const checkInReservation = async (id: string) => {
    await updateDoc(doc(db, 'reservations', id), {
      checkedIn: true,
    });
  };

  const cancelReservation = async (
    id: string,
    details?: { guestName?: string; bookingId?: string; partySize?: number; tableNumber?: string }
  ) => {
    await updateDoc(doc(db, 'reservations', id), {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
    });

    try {
      const resDoc = reservations.find((r) => r.id === id);
      const gName = details?.guestName || resDoc?.guestName || 'Guest';
      const bId = details?.bookingId || resDoc?.bookingId || id.slice(-5);
      const table = details?.tableNumber || resDoc?.tableNumber || 'Assigned table';
      const party = details?.partySize || resDoc?.partySize || 2;

      await addDoc(collection(db, 'notifications'), {
        title: 'CRITICAL: Reservation Cancelled 🚨',
        message: `Reservation #${bId} for ${gName} (${party} guests) was cancelled! Table ${table} released to inventory.`,
        type: 'cancellation',
        category: 'critical',
        recipientRole: 'staff',
        targetScreen: '/explore',
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Failed to send cancellation notification:', err);
    }
  };

  const markNoShow = async (id: string) => {
    await updateDoc(doc(db, 'reservations', id), {
      status: 'no_show',
    });
  };

  const updateQueueStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'queue', id), { status });
  };

  const updateTableStatus = async (id: string, status: string, tableName?: string) => {
    await updateDoc(doc(db, 'tables', id), { status });

    if (status === 'free' || status === 'dirty') {
      try {
        const tName = tableName || id;
        const statusLabel = status === 'free' ? 'AVAILABLE (Ready) 🟢' : 'NEEDS CLEANING 🧹';
        await addDoc(collection(db, 'notifications'), {
          title: 'Guest Left / Table Status Update 🍽️',
          message: `Guest has left ${tName}. Table status updated to: ${statusLabel}.`,
          type: 'table_status',
          category: 'booking',
          recipientRole: 'staff',
          targetScreen: '/tables',
          read: false,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Failed to post table status notification:', err);
      }
    }
  };

  const markNotificationRead = async (id: string) => {
    const notif = notifications.find((n) => n.id === id);
    if (!notif) return;
    if (currentUid && Array.isArray(notif.readBy)) {
      if (!notif.readBy.includes(currentUid)) {
        await updateDoc(doc(db, 'notifications', id), {
          readBy: [...notif.readBy, currentUid],
          read: true,
        });
      }
    } else {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (err) {
      console.warn('Failed to delete notification:', err);
    }
  };

  const acknowledgeKitchenAlert = async (id: string) => {
    await updateDoc(doc(db, 'kitchenAlerts', id), { acknowledged: true });
  };

  const sendTestNotification = async (type: 'booking' | 'cancellation' | 'critical') => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    if (type === 'booking') {
      await addDoc(collection(db, 'notifications'), {
        title: 'New Guest Booking Received 📅',
        message: `Guest Alex Morgan booked Table 4 for 4 guests (#BK-${randomId}) tonight at 7:30 PM.`,
        type: 'booking',
        category: 'booking',
        recipientRole: 'staff',
        targetScreen: '/explore',
        read: false,
        createdAt: serverTimestamp(),
      });
    } else if (type === 'cancellation') {
      await addDoc(collection(db, 'notifications'), {
        title: 'CRITICAL: Booking Cancelled 🚨',
        message: `Reservation #BK-${randomId} for Guest Sarah Jenkins (6 guests) was cancelled! Table 12 released.`,
        type: 'cancellation',
        category: 'critical',
        recipientRole: 'staff',
        targetScreen: '/explore',
        read: false,
        createdAt: serverTimestamp(),
      });
    } else if (type === 'critical') {
      await addDoc(collection(db, 'notifications'), {
        title: 'CRITICAL: Large Party Booking 🚨',
        message: `VIP Party of 12 guests (#BK-${randomId}) booked for 8:00 PM. High priority kitchen prep needed!`,
        type: 'critical_booking',
        category: 'critical',
        recipientRole: 'staff',
        targetScreen: '/explore',
        read: false,
        createdAt: serverTimestamp(),
      });
    }
  };

  return {
    overview,
    reservations,
    queue,
    tables,
    notifications,
    kitchenAlerts,
    unreadNotificationsCount,
    loading,
    refreshing,
    error,
    refresh: () => {},
    addBooking,
    addWalkIn,
    notifyNextGuest,
    updateReservationStatus,
    seatReservation,
    checkInReservation,
    cancelReservation,
    markNoShow,
    updateQueueStatus,
    updateTableStatus,
    markNotificationRead,
    deleteNotification,
    acknowledgeKitchenAlert,
    sendTestNotification,
  };
}
