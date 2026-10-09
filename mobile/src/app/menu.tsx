import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '@/components/ui/Icon';

export default function MenuScreen() {
  const [activeCategory, setActiveCategory] = useState('All Courses');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All Courses', 'Signature Mains', 'Artisanal Pasta', 'Craft Cocktails', 'Desserts'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={20} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Explore</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn}>
            <Icon name="bell" size={18} color="#111827" />
          </Pressable>
          <Pressable style={styles.profileBtn}>
            <Icon name="person" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={[styles.searchInput, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
            placeholder="Search cuts, pairings, cellars..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.filterBtn}>
            <Icon name="filter" size={14} color="#111827" />
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={styles.categoriesContent}>
          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.categoryChip,
                activeCategory === cat && styles.categoryChipActive
              ]}
            >
              {activeCategory === cat && <Icon name="restaurant" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />}
              <Text style={[
                styles.categoryText,
                activeCategory === cat && styles.categoryTextActive
              ]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Chef's Spotlight */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="star" size={14} color="#F59E0B" />
            <Text style={styles.sectionTitle}>CHEF'S SPOTLIGHT</Text>
          </View>
        </View>

        <View style={styles.spotlightCard}>
          <View style={styles.spotlightImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop' }} 
              style={styles.spotlightImage} 
            />
            <View style={styles.tagsContainer}>
              <View style={styles.tag}><Text style={styles.tagText}>PRIME CUT</Text></View>
              <View style={styles.tag}><Text style={styles.tagText}>GLUTEN-FREE</Text></View>
            </View>
            <View style={styles.ratingBadge}>
              <Icon name="star" size={10} color="#F59E0B" />
              <Text style={styles.ratingText}>4.9 (120)</Text>
            </View>
          </View>

          <View style={styles.spotlightContent}>
            <Text style={styles.spotlightTitle}>Dry-Aged Wagyu Tenderloin</Text>
            <Text style={styles.spotlightDesc}>Center-cut A5 medallion, roasted fingerlings, charred pine-nut asparagus & rich cabernet demi-glace.</Text>
            
            <View style={styles.spotlightFooter}>
              <View>
                <Text style={styles.priceLabel}>A LA CARTE</Text>
                <Text style={styles.price}>$48.00</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Curated Selections */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleDark}>Curated Selections</Text>
          <Text style={styles.realTimeText}>REAL-TIME AVAILABLE</Text>
        </View>

        <View style={styles.listContainer}>
          {/* Item 1 */}
          <View style={styles.listItem}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=300&auto=format&fit=crop' }} style={styles.listImage} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Truffle Pesto & Burrata</Text>
              <Text style={styles.listDesc} numberOfLines={2}>Handcrafted tagliatelle, roasted pine nuts, artisan burrata.</Text>
              <Text style={styles.listPrice}>$29.50</Text>
            </View>
          </View>

          {/* Item 2 */}
          <View style={styles.listItem}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=300&auto=format&fit=crop' }} style={styles.listImage} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Emerald Botanical Spritz</Text>
              <Text style={styles.listDesc} numberOfLines={2}>Distilled cucumber, fresh mint ribbon, lime & botanical tonic.</Text>
              <Text style={styles.listPrice}>$18.00</Text>
            </View>
          </View>

          {/* Item 3 */}
          <View style={styles.listItem}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=300&auto=format&fit=crop' }} style={styles.listImage} />
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>Matcha Lava Fondant & Gold</Text>
              <Text style={styles.listDesc} numberOfLines={2}>Valrhona dark shell, ceremonial matcha molten flow, 24K leaf.</Text>
              <Text style={styles.listPrice}>$19.50</Text>
            </View>
          </View>
        </View>

        {/* 5-Course Journey Card */}
        <View style={styles.journeyCard}>
          <View style={styles.journeyHeader}>
            <View style={styles.journeyBadge}><Text style={styles.journeyBadgeText}>SOMMELIER CURATED</Text></View>
            <Text style={styles.journeyPrice}>$125 / person</Text>
          </View>
          <Text style={styles.journeyTitle}>5-Course Seasonal Journey</Text>
          <Text style={styles.journeyDesc}>Complete culinary itinerary featuring private cellar reserve vintages, and tableside finishing.</Text>
          <View style={styles.journeyFooter}>
            <View style={styles.journeyIcons}>
              <Text style={{ fontSize: 16 }}>🍷</Text>
              <Text style={{ fontSize: 16, marginLeft: -8 }}>🥩</Text>
              <Text style={{ fontSize: 16, marginLeft: -8 }}>🍰</Text>
            </View>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.reserveText}>Reserve Experience</Text>
              <Icon name="arrow-forward" size={14} color="#059669" />
            </Pressable>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F9F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    color: '#111827',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#111827',
  },
  filterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesScroll: {
    marginTop: 16,
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  categoryChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  categoryText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#4B5563',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
    color: '#F59E0B',
    letterSpacing: 0.8,
  },
  spotlightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  spotlightImageContainer: {
    position: 'relative',
    height: 200,
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
  },
  tagsContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    color: '#111827',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
  },
  spotlightContent: {
    padding: 16,
  },
  spotlightTitle: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    color: '#111827',
    marginBottom: 6,
  },
  spotlightDesc: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  spotlightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    color: '#059669',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  addBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  sectionTitleDark: {
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    color: '#111827',
  },
  realTimeText: {
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    color: '#059669',
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
  },
  listTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
    marginBottom: 4,
  },
  listDesc: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#6B7280',
    marginBottom: 6,
  },
  listPrice: {
    fontSize: 13,
    fontFamily: 'Inter_800ExtraBold',
    color: '#059669',
  },
  listAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1FAE5',
    marginLeft: 12,
  },
  journeyCard: {
    backgroundColor: '#FEFCE8',
    borderRadius: 24,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF08A',
  },
  journeyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  journeyBadge: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  journeyBadgeText: {
    fontSize: 9,
    fontFamily: 'Inter_800ExtraBold',
    color: '#854D0E',
  },
  journeyPrice: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#4B5563',
  },
  journeyTitle: {
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    color: '#111827',
    marginBottom: 6,
  },
  journeyDesc: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 16,
  },
  journeyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  journeyIcons: {
    flexDirection: 'row',
  },
  reserveText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#059669',
  },
  floatingCart: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 16,
    shadowColor: '#10B981',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  cartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartTitle: {
    fontSize: 13,
    fontFamily: 'Inter_800ExtraBold',
    color: '#111827',
  },
  cartSub: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: '#6B7280',
    marginTop: 2,
  },
  checkoutBtn: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
});
