import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, DimensionValue } from 'react-native';

interface SkeletonItemProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: any;
}

export function SkeletonItem({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonItemProps) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeletonBase,
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      {/* Hero Header Skeleton */}
      <View style={styles.heroSkeleton}>
        <View style={styles.topBarSkeleton}>
          <SkeletonItem width={120} height={32} borderRadius={16} />
          <SkeletonItem width={70} height={28} borderRadius={14} />
          <SkeletonItem width={38} height={38} borderRadius={19} />
        </View>
        <SkeletonItem width={140} height={14} borderRadius={6} style={{ marginTop: 14, marginBottom: 8 }} />
        <SkeletonItem width={220} height={28} borderRadius={8} style={{ marginBottom: 8 }} />
        <SkeletonItem width={'85%'} height={16} borderRadius={6} style={{ marginBottom: 18 }} />
        <SkeletonItem width={'100%'} height={40} borderRadius={12} />
      </View>

      {/* 2x2 Metrics Grid Skeleton */}
      <View style={styles.metricsGridSkeleton}>
        <View style={styles.metricsRowSkeleton}>
          <SkeletonItem width={'48%'} height={110} borderRadius={16} />
          <SkeletonItem width={'48%'} height={110} borderRadius={16} />
        </View>
        <View style={styles.metricsRowSkeleton}>
          <SkeletonItem width={'48%'} height={110} borderRadius={16} />
          <SkeletonItem width={'48%'} height={110} borderRadius={16} />
        </View>
      </View>

      {/* Rush Alert Card Skeleton */}
      <SkeletonItem width={'100%'} height={90} borderRadius={18} style={{ marginBottom: 16 }} />

      {/* Timeline Section Skeleton */}
      <View style={styles.timelineSkeleton}>
        <SkeletonItem width={160} height={20} borderRadius={6} style={{ marginBottom: 14 }} />
        <SkeletonItem width={'100%'} height={75} borderRadius={14} style={{ marginBottom: 10 }} />
        <SkeletonItem width={'100%'} height={75} borderRadius={14} style={{ marginBottom: 10 }} />
        <SkeletonItem width={'100%'} height={75} borderRadius={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: '#CBD5E1',
  },
  skeletonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  heroSkeleton: {
    backgroundColor: '#022C22',
    borderRadius: 22,
    padding: 18,
    marginHorizontal: -16,
    marginTop: -8,
    marginBottom: 16,
  },
  topBarSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricsGridSkeleton: {
    gap: 12,
    marginBottom: 16,
  },
  metricsRowSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timelineSkeleton: {
    marginTop: 8,
  },
});

export default SkeletonItem;
