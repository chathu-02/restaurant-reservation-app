import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Icon } from '../components/ui/Icon';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: 'Host Team' | 'Kitchen Team' | 'Management';
  station: string;
  isOnDuty: boolean;
  avatarColor: string;
}

const initialStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Jane Doe',
    role: 'Head Hostess',
    department: 'Host Team',
    station: 'Zone A',
    isOnDuty: true,
    avatarColor: '#10B981',
  },
  {
    id: '2',
    name: 'Mark Smith',
    role: 'Sous Chef',
    department: 'Kitchen Team',
    station: 'Station 2',
    isOnDuty: true,
    avatarColor: '#F59E0B',
  },
  {
    id: '3',
    name: 'Alex Lee',
    role: 'Line Cook',
    department: 'Kitchen Team',
    station: 'Prep A',
    isOnDuty: false,
    avatarColor: '#6366F1',
  },
  {
    id: '4',
    name: 'Rachel Wong',
    role: 'Shift Lead',
    department: 'Management',
    station: 'Zone B',
    isOnDuty: true,
    avatarColor: '#EC4899',
  },
];

type FilterType = 'ALL' | 'ACTIVE' | 'MANAGERS' | 'KITCHEN';

export default function StaffAccountsScreen() {
  const router = useRouter();

  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  // Add/Edit form state
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDepartment, setFormDepartment] = useState<'Host Team' | 'Kitchen Team' | 'Management'>('Host Team');
  const [formStation, setFormStation] = useState('Zone A');

  const totalCount = staffList.length;
  const activeCount = staffList.filter((s) => s.isOnDuty).length;
  const managersCount = staffList.filter((s) => s.department === 'Management').length;
  const kitchenCount = staffList.filter((s) => s.department === 'Kitchen Team').length;

  const toggleDuty = (id: string) => {
    setStaffList((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, isOnDuty: !member.isOnDuty } : member
      )
    );
  };

  const handleDelete = (member: StaffMember) => {
    Alert.alert(
      'Remove Staff Member',
      `Are you sure you want to remove ${member.name} from the staff directory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setStaffList((prev) => prev.filter((m) => m.id !== member.id));
          },
        },
      ]
    );
  };

  const handleOpenAdd = () => {
    setFormName('');
    setFormRole('');
    setFormDepartment('Host Team');
    setFormStation('Zone A');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (member: StaffMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormDepartment(member.department);
    setFormStation(member.station);
  };

  const handleSaveAdd = () => {
    if (!formName.trim() || !formRole.trim()) {
      Alert.alert('Required', 'Please enter staff name and role');
      return;
    }

    const newMember: StaffMember = {
      id: Date.now().toString(),
      name: formName.trim(),
      role: formRole.trim(),
      department: formDepartment,
      station: formStation.trim() || 'General Floor',
      isOnDuty: true,
      avatarColor: '#3B82F6',
    };

    setStaffList((prev) => [newMember, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = () => {
    if (!editingMember) return;
    if (!formName.trim() || !formRole.trim()) {
      Alert.alert('Required', 'Please enter staff name and role');
      return;
    }

    setStaffList((prev) =>
      prev.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: formName.trim(),
              role: formRole.trim(),
              department: formDepartment,
              station: formStation.trim(),
            }
          : m
      )
    );
    setEditingMember(null);
  };

  // Filter & Search logic
  const filteredList = staffList.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.station.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'ACTIVE') return m.isOnDuty;
    if (filter === 'MANAGERS') return m.department === 'Management';
    if (filter === 'KITCHEN') return m.department === 'Kitchen Team';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Back, Title + Active count, Plus button */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={() => router.push('/dashboard')}
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={20} color="#374151" />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Staff accounts</Text>
            <View style={styles.statusIndicatorRow}>
              <View style={styles.greenDot} />
              <Text style={styles.statusSubText}>
                {totalCount} team members • {activeCount} active
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addPlusBtn}
            onPress={handleOpenAdd}
            activeOpacity={0.8}
          >
            <Icon name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar with ⌘K Badge */}
        <View style={styles.searchContainer}>
          <View style={styles.searchIconWrap}>
            <Icon name="search" size={18} color="#9CA3AF" />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or role..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
              <Icon name="close" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.commandBadge}>
              <Icon name="command" size={11} color="#6B7280" />
              <Text style={styles.commandBadgeText}>K</Text>
            </View>
          )}
        </View>

        {/* Filter Chips Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            style={[styles.filterChip, filter === 'ALL' && styles.filterChipActive]}
            onPress={() => setFilter('ALL')}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'ALL' && styles.filterChipTextActive,
              ]}
            >
              All ({totalCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filter === 'ACTIVE' && styles.filterChipActive]}
            onPress={() => setFilter('ACTIVE')}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'ACTIVE' && styles.filterChipTextActive,
              ]}
            >
              Active ({activeCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filter === 'MANAGERS' && styles.filterChipActive]}
            onPress={() => setFilter('MANAGERS')}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'MANAGERS' && styles.filterChipTextActive,
              ]}
            >
              Managers ({managersCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filter === 'KITCHEN' && styles.filterChipActive]}
            onPress={() => setFilter('KITCHEN')}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === 'KITCHEN' && styles.filterChipTextActive,
              ]}
            >
              Kitchen ({kitchenCount})
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Dinner Shift Roster Banner */}
        <View style={styles.rosterBanner}>
          <View style={styles.rosterBannerLeft}>
            <View style={styles.rosterDot} />
            <Text style={styles.rosterBannerTitle}>Dinner Shift Roster</Text>
          </View>
          <Text style={styles.rosterBannerRight}>
            {activeCount} on clock • Handover 10 PM
          </Text>
        </View>

        {/* Staff Members List */}
        <View style={styles.staffCardsList}>
          {filteredList.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="search" size={32} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No staff members found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or filter</Text>
            </View>
          ) : (
            filteredList.map((member) => (
              <View key={member.id} style={styles.staffCard}>
                <View style={styles.staffCardHeader}>
                  <View style={[styles.avatarCircle, { backgroundColor: member.avatarColor }]}>
                    <Text style={styles.avatarInitials}>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </Text>
                  </View>

                  <View style={styles.staffInfo}>
                    <Text style={styles.staffName}>{member.name}</Text>
                    <Text style={styles.staffRole}>{member.role}</Text>
                    <Text style={styles.staffDepartmentStation}>
                      {member.department} • {member.station}
                    </Text>
                  </View>

                  <Switch
                    trackColor={{ false: '#E5E7EB', true: '#00B37E' }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#E5E7EB"
                    onValueChange={() => toggleDuty(member.id)}
                    value={member.isOnDuty}
                  />
                </View>

                {/* Card Action Buttons (Edit / Delete) */}
                <View style={styles.cardActionsRow}>
                  <View style={styles.dutyStatusPill}>
                    <View
                      style={[
                        styles.dutyStatusDot,
                        { backgroundColor: member.isOnDuty ? '#00B37E' : '#9CA3AF' },
                      ]}
                    />
                    <Text
                      style={[
                        styles.dutyStatusText,
                        { color: member.isOnDuty ? '#00875A' : '#6B7280' },
                      ]}
                    >
                      {member.isOnDuty ? 'On Duty' : 'Off Shift'}
                    </Text>
                  </View>

                  <View style={styles.actionButtonsGroup}>
                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => handleOpenEdit(member)}
                      activeOpacity={0.7}
                    >
                      <Icon name="edit" size={15} color="#4B5563" />
                      <Text style={styles.actionBtnText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.iconActionBtn, { borderColor: '#FEE2E2' }]}
                      onPress={() => handleDelete(member)}
                      activeOpacity={0.7}
                    >
                      <Icon name="trash" size={15} color="#DC2626" />
                      <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Staff Modal */}
      <Modal
        visible={isAddModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Staff Member</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Maria Santos"
                placeholderTextColor="#9CA3AF"
                value={formName}
                onChangeText={setFormName}
              />

              <Text style={styles.fieldLabel}>Role / Position</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Floor Captain"
                placeholderTextColor="#9CA3AF"
                value={formRole}
                onChangeText={setFormRole}
              />

              <Text style={styles.fieldLabel}>Department</Text>
              <View style={styles.departmentSelectRow}>
                {(['Host Team', 'Kitchen Team', 'Management'] as const).map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    style={[
                      styles.deptPill,
                      formDepartment === dept && styles.deptPillActive,
                    ]}
                    onPress={() => setFormDepartment(dept)}
                  >
                    <Text
                      style={[
                        styles.deptPillText,
                        formDepartment === dept && styles.deptPillTextActive,
                      ]}
                    >
                      {dept}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Station / Zone</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Zone A, Station 1"
                placeholderTextColor="#9CA3AF"
                value={formStation}
                onChangeText={setFormStation}
              />

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSaveAdd}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSubmitBtnText}>Save Staff Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal
        visible={editingMember !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingMember(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Staff Member</Text>
              <TouchableOpacity onPress={() => setEditingMember(null)}>
                <Icon name="close" size={22} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Staff name"
                placeholderTextColor="#9CA3AF"
                value={formName}
                onChangeText={setFormName}
              />

              <Text style={styles.fieldLabel}>Role / Position</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Role"
                placeholderTextColor="#9CA3AF"
                value={formRole}
                onChangeText={setFormRole}
              />

              <Text style={styles.fieldLabel}>Station / Zone</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Station"
                placeholderTextColor="#9CA3AF"
                value={formStation}
                onChangeText={setFormStation}
              />

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSaveEdit}
                activeOpacity={0.8}
              >
                <Text style={styles.modalSubmitBtnText}>Update Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F9F8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B37E',
  },
  statusSubText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  addPlusBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#181A1E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 14,
    height: 44,
  },
  searchIconWrap: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    paddingVertical: 8,
  },
  clearSearchBtn: {
    padding: 4,
  },
  commandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  commandBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF2F0',
  },
  filterChipActive: {
    backgroundColor: '#181A1E',
    borderColor: '#181A1E',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  rosterBanner: {
    backgroundColor: '#E8FAF0',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rosterBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rosterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B37E',
  },
  rosterBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#009669',
  },
  rosterBannerRight: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00875A',
  },
  staffCardsList: {
    gap: 12,
  },
  staffCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF2F0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  staffCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  staffRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 1,
  },
  staffDepartmentStation: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dutyStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  dutyStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dutyStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    width: '100%',
    maxWidth: 380,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  modalForm: {
    gap: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  departmentSelectRow: {
    flexDirection: 'row',
    gap: 6,
  },
  deptPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  deptPillActive: {
    backgroundColor: '#181A1E',
  },
  deptPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  deptPillTextActive: {
    color: '#FFFFFF',
  },
  modalSubmitBtn: {
    backgroundColor: '#181A1E',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  modalSubmitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
