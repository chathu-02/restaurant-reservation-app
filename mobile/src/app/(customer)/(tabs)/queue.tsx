import React, { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JoinQueueScreen from '../../join-queue';
import QueueTrackerScreen from '../../queue';

export default function QueueTab() {
  const [hasActiveQueue, setHasActiveQueue] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const checkActiveQueue = async () => {
        try {
          const raw = await AsyncStorage.getItem('@active_customer_queue');
          if (raw && isMounted) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.status !== 'LEFT' && parsed.status !== 'cancelled') {
              setHasActiveQueue(true);
              return;
            }
          }
          if (isMounted) setHasActiveQueue(false);
        } catch {
          if (isMounted) setHasActiveQueue(false);
        }
      };

      checkActiveQueue();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  if (hasActiveQueue) {
    return <QueueTrackerScreen />;
  }

  return <JoinQueueScreen />;
}