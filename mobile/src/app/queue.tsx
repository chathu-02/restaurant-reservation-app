import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';
import StatusBadge from '@/components/StatusBadge';
import BottomNavBar, { TabKey } from '@/components/BottomNavBar';
import { useReservations } from '@/hooks/useReservations';

export default function QueueScreen() {
  const router = useRouter();
  const { queue, overview } = useReservations();
  const [seatedQueueIds, setSeatedQueueIds] = useState<string[]>([]);

  const handleSeatWalkIn = (guestName: string, id: string) => {
    setSeatedQueueIds((prev) => [...prev, id]);
    Alert.alert('Guest Seated', `${guestName} seated at bar / available table.`);
  };

  const handleNotifyGuest = (guestName: string) => {
    Alert.alert('SMS Sent', `Notification SMS sent to ${guestName}: "Your table is ready!"`);
  };

  const activeQueue = queue.filter((q) => !seatedQueueIds.includes(q.id));

  const handleTabChange = (tab: TabKey) => {
    if (tab === 'dashboard') {
      router.push('/');
    } else if (tab === 'bookings') {
      router.push('/explore');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F9F8" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
            <Icon name="arrow-back" size={20} color="#111827" />
          </Pressable>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Waitlist & Queue</Text>
            <Text style={styles.headerSubtitle}>
              {activeQueue.length} groups waiting • ~{overview?.queueWaitMinutes ?? 12}m avg wait
            </Text>
          </View>
          <StatusBadge label="DINNER" variant="amber" dot />
        </View>

        {/* Queue List */}
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {activeQueue.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="users" size={40} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Queue is Clear</Text>
              <Text style={styles.emptySub}>No guests currently waiting for a table.</Text>
            </View>
          ) : (
            activeQueue.map((item, index) => (
              <View key={item.id} style={styles.queueCard}>
                <View style={styles.positionBadge}>
                  <Text style={styles.positionText}>#{index + 1}</Text>
                </View>

                <View style={styles.queueDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.guestName}>{item.guestName}</Text>
                    <StatusBadge
                      label={`~${item.estimatedWaitMinutes}m wait`}
                      variant="amber"
                    />
                  </View>

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Icon name="users" size={14} color="#6B7280" />
                      <Text style={styles.metaText}>{item.partySize} guests</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Icon name="clock" size={14} color="#6B7280" />
                      <Text style={styles.metaText}>Joined {item.joinedAt}</Text>
                    </View>
                  </View>

                  <View style={styles.actionButtonsRow}>
                    <Pressable
                      onPress={() => handleNotifyGuest(item.guestName)}
                      style={({ pressed }) => [styles.notifyBtn, pressed && styles.pressed]}>
                      <Icon name="bell" size={13} color="#D97706" />
                      <Text style={styles.notifyText}>Notify</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleSeatWalkIn(item.guestName, item.id)}
                      style={({ pressed }) => [styles.seatBtn, pressed && styles.pressed]}>
                      <Icon name="check" size={13} color="#FFFFFF" />
                      <Text style={styles.seatText}>Seat Now</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Bottom Nav */}
        <BottomNavBar
          activeTab="waitlist"
          onSelectTab={handleTabChange}
          waitlistCount={activeQueue.length}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F9F8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F9F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  queueCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    alignItems: 'flex-start',
    gap: 12,
  },
  positionBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B45309',
  },
  queueDetails: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guestName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
  },
  notifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  notifyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  seatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#009669',
    gap: 4,
  },
  seatText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  emptySub: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
