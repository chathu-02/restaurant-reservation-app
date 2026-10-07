import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Vibration,
  Platform,
} from 'react-native';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { db } from '@/lib/firebase';
import Icon from './ui/Icon';

export interface ToastAlertData {
  id: string;
  title: string;
  message: string;
  type: string;
  category?: string;
  targetScreen?: string;
}

export function NotificationToast() {
  const router = useRouter();
  const [activeToast, setActiveToast] = useState<ToastAlertData | null>(null);
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const seenIds = useRef<Set<string>>(new Set());
  const isFirstLoad = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Listen for the latest notification added to Firestore
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(1));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          isFirstLoad.current = false;
          return;
        }

        const docSnap = snap.docs[0];
        const data = docSnap.data();
        const alertId = docSnap.id;

        // Skip during initial load to prevent showing old notifications as popups
        if (isFirstLoad.current) {
          seenIds.current.add(alertId);
          isFirstLoad.current = false;
          return;
        }

        // If this is a newly arrived notification that hasn't been shown in toast
        if (!seenIds.current.has(alertId)) {
          seenIds.current.add(alertId);
          const toastData: ToastAlertData = {
            id: alertId,
            title: data.title || 'Alert Notification',
            message: data.message || data.body || '',
            type: data.type || 'booking',
            category: data.category || (data.type === 'cancellation' ? 'critical' : 'booking'),
            targetScreen: data.targetScreen || '/alerts',
          };
          triggerToast(toastData);
        }
      },
      (err) => {
        console.warn('NotificationToast snapshot error:', err);
        isFirstLoad.current = false;
      }
    );

    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const triggerToast = (alert: ToastAlertData) => {
    setActiveToast(alert);

    // Haptic / Vibration feedback
    try {
      if (Platform.OS !== 'web') {
        Vibration.vibrate([0, 200, 80, 200]);
      }
    } catch (e) {
      // ignore web vibration limitation
    }

    // Animate Toast In
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 12,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 6.5 seconds
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dismissToast();
    }, 6500);
  };

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveToast(null);
    });
  };

  const handlePressView = () => {
    const screen = activeToast?.targetScreen || '/alerts';
    dismissToast();
    router.push(screen as any);
  };

  if (!activeToast) return null;

  const isCritical = activeToast.category === 'critical' || activeToast.type === 'cancellation';
  const isBooking = activeToast.type === 'booking' || activeToast.category === 'booking';

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}>
      <Pressable
        onPress={handlePressView}
        style={({ pressed }) => [
          styles.toastCard,
          isCritical && styles.toastCritical,
          isBooking && !isCritical && styles.toastBooking,
          pressed && styles.pressed,
        ]}>
        {/* Left Status Bar */}
        <View style={[styles.leftAccent, isCritical ? styles.accentRed : styles.accentGreen]} />

        <View style={styles.cardInner}>
          {/* Header Row */}
          <View style={styles.topRow}>
            <View style={styles.badgeRow}>
              <View style={[styles.iconWrapper, isCritical ? styles.iconRed : styles.iconGreen]}>
                <Icon name={isCritical ? 'alert-triangle' : 'calendar'} size={15} color="#FFFFFF" />
              </View>
              <Text style={[styles.categoryBadge, isCritical ? styles.badgeTextRed : styles.badgeTextGreen]}>
                {isCritical ? 'CRITICAL ALERT 🚨' : 'NEW BOOKING 📅'}
              </Text>
            </View>

            {/* Close Button */}
            <Pressable
              hitSlop={12}
              onPress={(e) => {
                e.stopPropagation();
                dismissToast();
              }}
              style={styles.closeBtn}>
              <Icon name="close" size={16} color="#94A3B8" />
            </Pressable>
          </View>

          {/* Title & Message */}
          <Text style={styles.toastTitle} numberOfLines={1}>
            {activeToast.title}
          </Text>
          <Text style={styles.toastMessage} numberOfLines={2}>
            {activeToast.message}
          </Text>

          {/* Bottom Action Footer */}
          <View style={styles.bottomRow}>
            <Text style={styles.tapToViewText}>Tap to open details →</Text>
            <View style={[styles.actionBtn, isCritical ? styles.btnRed : styles.btnGreen]}>
              <Text style={styles.actionBtnText}>View Alert</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    zIndex: 99999,
    elevation: 999,
  },
  toastCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#334155',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  toastCritical: {
    borderColor: '#EF4444',
    backgroundColor: '#1E1B2E',
  },
  toastBooking: {
    borderColor: '#10B981',
    backgroundColor: '#06201B',
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  leftAccent: {
    width: 6,
  },
  accentRed: {
    backgroundColor: '#EF4444',
  },
  accentGreen: {
    backgroundColor: '#10B981',
  },
  cardInner: {
    flex: 1,
    padding: 12,
    paddingLeft: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRed: {
    backgroundColor: '#EF4444',
  },
  iconGreen: {
    backgroundColor: '#10B981',
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  badgeTextRed: {
    color: '#FCA5A5',
  },
  badgeTextGreen: {
    color: '#6EE7B7',
  },
  closeBtn: {
    padding: 2,
  },
  toastTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  toastMessage: {
    fontSize: 12.5,
    color: '#CBD5E1',
    lineHeight: 17,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  tapToViewText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  btnRed: {
    backgroundColor: '#EF4444',
  },
  btnGreen: {
    backgroundColor: '#10B981',
  },
  actionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default NotificationToast;
