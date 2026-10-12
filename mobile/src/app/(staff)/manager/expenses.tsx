import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Icon from '@/components/ui/Icon';
import { Logo } from '@/components/logo';

const EXPENSE_CATEGORIES = [
  'Food Supplies',
  'Utilities',
  'Wages',
  'Equipment',
  'Marketing',
  'Maintenance',
  'Other',
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface ExpenseItem {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Pending';
  createdAt?: any;
}

export default function ExpensesScreen() {
  const router = useRouter();

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const getTodayDate = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const [formDate, setFormDate] = useState(getTodayDate());
  const [formCategory, setFormCategory] = useState('Food Supplies');
  const [formDescription, setFormDescription] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formStatus, setFormStatus] = useState<'Paid' | 'Pending'>('Paid');

  // Calendar Modal State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  // Real-time listener for expenses from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'expenses'),
      (snapshot) => {
        const items: ExpenseItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            date: data.date || getTodayDate(),
            category: data.category || 'General',
            description: data.description || '',
            amount: Number(data.amount) || 0,
            status: data.status === 'Pending' ? 'Pending' : 'Paid',
            createdAt: data.createdAt,
          });
        });

        // Sort descending by date, then created time
        items.sort((a, b) => {
          const dateDiff = (b.date || '').localeCompare(a.date || '');
          if (dateDiff !== 0) return dateDiff;
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setExpenses(items);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to expenses:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const paidExpenses = expenses.filter((e) => e.status === 'Paid').reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter((e) => e.status === 'Pending').reduce((sum, exp) => sum + exp.amount, 0);

  const formatDisplayDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        }
      }
    } catch {}
    return dateStr;
  };

  const handleOpenAddModal = () => {
    const today = getTodayDate();
    setFormDate(today);
    try {
      const parts = today.split('-');
      setCalYear(Number(parts[0]));
      setCalMonth(Number(parts[1]) - 1);
    } catch {}
    setFormCategory('Food Supplies');
    setFormDescription('');
    setFormAmount('');
    setFormStatus('Paid');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleSaveExpense = async () => {
    setFormError(null);
    const trimmedDesc = formDescription.trim();
    const cleanAmount = formAmount.replace(/[^0-9.]/g, '');
    const parsedAmount = parseFloat(cleanAmount);

    if (!trimmedDesc) {
      setFormError('Please enter an expense description.');
      return;
    }

    if (!cleanAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Please enter a valid expense amount greater than 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newExpense = {
        date: formDate.trim() || getTodayDate(),
        category: formCategory,
        description: trimmedDesc,
        amount: parsedAmount,
        status: formStatus,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'expenses'), newExpense);

      // Optimistic update
      setExpenses((prev) => {
        const item: ExpenseItem = {
          id: docRef.id,
          date: newExpense.date,
          category: newExpense.category,
          description: newExpense.description,
          amount: newExpense.amount,
          status: newExpense.status,
          createdAt: new Date(),
        };
        const updated = [item, ...prev.filter((e) => e.id !== docRef.id)];
        return updated.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      });

      setIsAddModalOpen(false);
      setFormDescription('');
      setFormAmount('');
      setFormCategory('Food Supplies');
      setFormDate(getTodayDate());
      setFormStatus('Paid');
      setFormError(null);
    } catch (err: any) {
      console.error('Error saving expense:', err);
      setFormError(err?.message || 'Could not save expense to database. Check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = (id: string, description: string) => {
    const executeDelete = async () => {
      try {
        await deleteDoc(doc(db, 'expenses', id));
        setExpenses((prev) => prev.filter((e) => e.id !== id));
      } catch (err) {
        console.error('Error deleting expense:', err);
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Are you sure you want to delete "${description}"?`)) {
        void executeDelete();
      }
    } else {
      Alert.alert(
        'Delete Expense',
        `Are you sure you want to delete "${description}" from expenses?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => void executeDelete(),
          },
        ]
      );
    }
  };

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  const handleSelectCalendarDate = (dateStr: string) => {
    setFormDate(dateStr);
    setIsCalendarOpen(false);
  };

  const renderCalendarDays = () => {
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const pad = (n: number) => String(n).padStart(2, '0');

    const cells = [];

    // Empty offset slots
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.calendarDayCell} />);
    }

    // Days 1..daysInMonth
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calYear}-${pad(calMonth + 1)}-${pad(d)}`;
      const isSelected = formDate === dateStr;
      const isToday = dateStr === getTodayDate();

      cells.push(
        <Pressable
          key={`day-${d}`}
          style={[
            styles.calendarDayCell,
            isSelected && styles.calendarDayCellSelected,
            isToday && !isSelected && styles.calendarDayCellToday,
          ]}
          onPress={() => handleSelectCalendarDate(dateStr)}
        >
          <Text
            style={[
              styles.calendarDayText,
              isSelected && styles.calendarDayTextSelected,
              isToday && !isSelected && styles.calendarDayTextToday,
            ]}
          >
            {d}
          </Text>
          {isToday && !isSelected && <View style={styles.todayIndicatorDot} />}
        </Pressable>
      );
    }

    return cells;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" />

      {/* Top Navbar */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <Logo size={28} badge />
          <Text style={styles.navTitle}>OceanGrace</Text>
        </View>

        <View style={styles.navRight}>
          <Pressable style={styles.iconButton} onPress={() => router.push('/(staff)/manager/admin-notifications' as any)}>
            <Icon name="bell" size={20} color="#A7F3D0" />
            <View style={styles.notificationDot} />
          </Pressable>
          <View style={styles.profileSection}>
            <Text style={styles.profileName}>Manager</Text>
            <View style={styles.profileAvatarPlaceholder}>
              <Icon name="person" size={16} color="#064E3B" />
            </View>
            <Icon name="chevron-down" size={16} color="#A7F3D0" />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Expenses Management</Text>
          <Text style={styles.pageSubtitle}>Track and record restaurant spending in real-time.</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: '#FEF2F2' }]}>
              <Icon name="chart" size={22} color="#EF4444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={styles.summaryValue}>Rs. {totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </View>
          </View>

          <View style={styles.statsPillRow}>
            <View style={[styles.miniStatBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.miniStatLabel, { color: '#065F46' }]}>Paid: Rs. {paidExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            </View>
            <View style={[styles.miniStatBadge, { backgroundColor: '#FFFBEB' }]}>
              <Text style={[styles.miniStatLabel, { color: '#92400E' }]}>Pending: Rs. {pendingExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            </View>
          </View>
        </View>

        {/* Table Section */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeaderSection}>
            <Text style={styles.tableTitle}>Recent Transactions ({expenses.length})</Text>
            <Pressable style={styles.addButton} onPress={handleOpenAddModal}>
              <Icon name="plus" size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Expense</Text>
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color="#10B981" size="small" />
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          ) : expenses.length === 0 ? (
            <View style={styles.emptyBox}>
              <Icon name="card" size={40} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No expenses recorded yet</Text>
              <Text style={styles.emptySubtitle}>Tap "Add Expense" above to record a new transaction.</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                {/* Table Header */}
                <View style={styles.tableRowHeader}>
                  <Text style={[styles.tableCol, { width: 40 }]}>No</Text>
                  <Text style={[styles.tableCol, { width: 110 }]}>Date</Text>
                  <Text style={[styles.tableCol, { width: 130 }]}>Category</Text>
                  <Text style={[styles.tableCol, { width: 200 }]}>Description</Text>
                  <Text style={[styles.tableCol, { width: 120, textAlign: 'right', paddingRight: 10 }]}>Amount</Text>
                  <Text style={[styles.tableCol, { width: 90, textAlign: 'center' }]}>Status</Text>
                  <Text style={[styles.tableCol, { width: 50, textAlign: 'center' }]}>Action</Text>
                </View>

                {/* Table Rows */}
                {expenses.map((exp, index) => (
                  <View key={exp.id} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]}>
                    <Text style={[styles.tableCell, { width: 40, color: '#64748B' }]}>{index + 1}</Text>
                    <Text style={[styles.tableCell, { width: 110 }]}>{exp.date}</Text>
                    <Text style={[styles.tableCell, styles.tableCellBold, { width: 130 }]}>{exp.category}</Text>
                    <Text style={[styles.tableCell, { width: 200 }]} numberOfLines={1}>{exp.description}</Text>
                    <Text style={[styles.tableCell, styles.tableCellBold, { width: 120, textAlign: 'right', paddingRight: 10, color: '#0F172A' }]}>
                      Rs. {exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
                    <View style={{ width: 90, alignItems: 'center' }}>
                      <View style={exp.status === 'Paid' ? styles.statusPillActive : styles.statusPillPending}>
                        <Text style={exp.status === 'Paid' ? styles.statusTextActive : styles.statusTextPending}>
                          {exp.status}
                        </Text>
                      </View>
                    </View>
                    <View style={{ width: 50, alignItems: 'center' }}>
                      <Pressable onPress={() => handleDeleteExpense(exp.id, exp.description)} style={{ padding: 4 }}>
                        <Icon name="trash" size={18} color="#EF4444" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Add Expense Modal Form */}
      <Modal
        visible={isAddModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Record New Expense</Text>
                <Text style={styles.modalSubTitle}>Fill in details to save to accounts</Text>
              </View>
              <Pressable onPress={() => setIsAddModalOpen(false)} style={styles.closeModalButton}>
                <Icon name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* Error Message Box */}
              {formError ? (
                <View style={styles.formErrorBox}>
                  <Icon name="alert-triangle" size={18} color="#DC2626" />
                  <Text style={styles.formErrorText}>{formError}</Text>
                </View>
              ) : null}

              {/* Date Input with Calendar Trigger */}
              <View style={styles.formGroup}>
                <View style={styles.formLabelRow}>
                  <Text style={styles.formLabel}>Date</Text>
                  <Pressable
                    style={styles.pickCalendarLink}
                    onPress={() => {
                      try {
                        const parts = formDate.split('-');
                        setCalYear(Number(parts[0]));
                        setCalMonth(Number(parts[1]) - 1);
                      } catch {}
                      setIsCalendarOpen(true);
                    }}
                  >
                    <Icon name="calendar" size={14} color="#059669" />
                    <Text style={styles.pickCalendarLinkText}>Open Calendar</Text>
                  </Pressable>
                </View>

                <Pressable
                  style={styles.dateSelectorBox}
                  onPress={() => {
                    try {
                      const parts = formDate.split('-');
                      setCalYear(Number(parts[0]));
                      setCalMonth(Number(parts[1]) - 1);
                    } catch {}
                    setIsCalendarOpen(true);
                  }}
                >
                  <View style={styles.dateSelectorLeft}>
                    <View style={styles.dateIconWrapper}>
                      <Icon name="calendar" size={18} color="#064E3B" />
                    </View>
                    <View>
                      <Text style={styles.dateSelectorDisplay}>{formatDisplayDate(formDate)}</Text>
                      <Text style={styles.dateSelectorValue}>{formDate}</Text>
                    </View>
                  </View>
                  <View style={styles.dateSelectorBadge}>
                    <Text style={styles.dateSelectorBadgeText}>Change 📅</Text>
                  </View>
                </Pressable>
              </View>

              {/* Category Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      style={[styles.categoryPill, formCategory === cat && styles.categoryPillActive]}
                      onPress={() => setFormCategory(cat)}
                    >
                      <Text style={[styles.categoryPillText, formCategory === cat && styles.categoryPillTextActive]}>
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Description Input */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. Seafood wholesale market supplier invoice"
                  placeholderTextColor="#94A3B8"
                  value={formDescription}
                  onChangeText={(val) => {
                    setFormDescription(val);
                    if (formError) setFormError(null);
                  }}
                />
              </View>

              {/* Amount Input */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Amount (Rs.)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. 4500.00"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                  value={formAmount}
                  onChangeText={(val) => {
                    setFormAmount(val);
                    if (formError) setFormError(null);
                  }}
                />
              </View>

              {/* Status Radio Pills */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Payment Status</Text>
                <View style={styles.statusSelectRow}>
                  <Pressable
                    style={[styles.statusSelectBtn, formStatus === 'Paid' && styles.statusSelectBtnActivePaid]}
                    onPress={() => setFormStatus('Paid')}
                  >
                    <Text style={[styles.statusSelectBtnText, formStatus === 'Paid' && styles.statusSelectBtnTextActive]}>
                      ✓ Paid
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.statusSelectBtn, formStatus === 'Pending' && styles.statusSelectBtnActivePending]}
                    onPress={() => setFormStatus('Pending')}
                  >
                    <Text style={[styles.statusSelectBtnText, formStatus === 'Pending' && styles.statusSelectBtnTextActive]}>
                      ⏳ Pending
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
                onPress={handleSaveExpense}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={styles.submitButtonText}>Saving to Database...</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Icon name="check" size={18} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Save Expense</Text>
                  </View>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Calendar Date Picker Modal */}
      <Modal
        visible={isCalendarOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsCalendarOpen(false)}
      >
        <View style={styles.calendarModalOverlay}>
          <View style={styles.calendarCard}>
            {/* Calendar Header with Month/Year Navigation */}
            <View style={styles.calendarHeader}>
              <Pressable onPress={handlePrevMonth} style={styles.calendarNavBtn}>
                <Icon name="chevron-left" size={20} color="#064E3B" />
              </Pressable>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.calendarMonthTitle}>
                  {MONTH_NAMES[calMonth]} {calYear}
                </Text>
                <Text style={styles.calendarSelectedSub}>
                  Selected: {formatDisplayDate(formDate)}
                </Text>
              </View>
              <Pressable onPress={handleNextMonth} style={styles.calendarNavBtn}>
                <Icon name="chevron-right" size={20} color="#064E3B" />
              </Pressable>
            </View>

            {/* Quick shortcuts */}
            <View style={styles.quickShortcutsRow}>
              <Pressable
                style={[styles.quickShortcutChip, formDate === getTodayDate() && styles.quickShortcutChipActive]}
                onPress={() => {
                  const today = getTodayDate();
                  const now = new Date();
                  setCalYear(now.getFullYear());
                  setCalMonth(now.getMonth());
                  handleSelectCalendarDate(today);
                }}
              >
                <Text style={[styles.quickShortcutChipText, formDate === getTodayDate() && styles.quickShortcutChipTextActive]}>
                  Today
                </Text>
              </Pressable>
              <Pressable
                style={styles.quickShortcutChip}
                onPress={() => {
                  const d = new Date();
                  d.setDate(d.getDate() - 1);
                  const pad = (n: number) => String(n).padStart(2, '0');
                  const yesterday = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                  setCalYear(d.getFullYear());
                  setCalMonth(d.getMonth());
                  handleSelectCalendarDate(yesterday);
                }}
              >
                <Text style={styles.quickShortcutChipText}>Yesterday</Text>
              </Pressable>
            </View>

            {/* Day of Week Headers */}
            <View style={styles.calendarDaysHeader}>
              {DAY_NAMES.map((day) => (
                <Text key={day} style={styles.calendarDayHeaderLabel}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Days Grid */}
            <View style={styles.calendarGrid}>
              {renderCalendarDays()}
            </View>

            {/* Close Button */}
            <Pressable
              style={styles.calendarCloseButton}
              onPress={() => setIsCalendarOpen(false)}
            >
              <Text style={styles.calendarCloseButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomTabBar}>
        <Pressable style={styles.tabItem} onPress={() => router.push('/(staff)/manager/admin-dashboard' as any)}>
          <Icon name="grid" size={22} color="#475569" />
          <Text style={styles.tabText}>Dashboard</Text>
        </Pressable>
        <Pressable style={styles.tabItemActive}>
          <Icon name="card" size={22} color="#064E3B" />
          <Text style={styles.tabTextActive}>Expenses</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/(staff)/manager/reports' as any)}>
          <Icon name="chart" size={22} color="#475569" />
          <Text style={styles.tabText}>Reports</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/(staff)/manager/settings' as any)}>
          <Icon name="gear" size={22} color="#475569" />
          <Text style={styles.tabText}>Settings</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#064E3B',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#042F2E',
  },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  navTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, borderRadius: 12 },
  tabItemActive: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8, borderRadius: 12, backgroundColor: '#ECFDF5' },
  tabText: { fontSize: 12, fontWeight: '500', color: '#94A3B8' },
  tabTextActive: { fontSize: 12, fontWeight: '700', color: '#064E3B' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconButton: { padding: 4, position: 'relative' },
  notificationDot: { position: 'absolute', top: 4, right: 6, width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 8 },
  profileName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', display: Platform.OS === 'web' ? 'flex' : 'none' },
  profileAvatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },

  scrollContent: { padding: 20, paddingBottom: 100 },
  headerSection: { marginBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 4, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 14, fontWeight: '500', color: '#64748B' },

  summaryRow: { marginBottom: 20 },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    gap: 16,
    elevation: 6,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  summaryIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  summaryLabel: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 4 },
  summaryValue: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  statsPillRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  miniStatBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  miniStatLabel: { fontSize: 12, fontWeight: '700' },

  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    elevation: 8,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  tableHeaderSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 },
  tableTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },

  loadingBox: { paddingVertical: 40, alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  emptyBox: { paddingVertical: 40, alignItems: 'center', gap: 6 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginTop: 8 },
  emptySubtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', maxWidth: 260 },

  tableRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 8,
    backgroundColor: '#064E3B',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tableCol: { fontSize: 12, fontWeight: '700', color: '#A7F3D0' },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 3,
  },
  tableRowEven: { backgroundColor: '#FFFFFF' },
  tableRowOdd: { backgroundColor: '#F8FAFC' },
  tableCell: { fontSize: 13, fontWeight: '500', color: '#475569' },
  tableCellBold: { fontWeight: '700', color: '#0F172A' },

  statusPillActive: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusTextActive: { fontSize: 11, fontWeight: '700', color: '#059669' },
  statusPillPending: { backgroundColor: '#FFFBEB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusTextPending: { fontSize: 11, fontWeight: '700', color: '#D97706' },

  /* Modal Form Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  modalSubTitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  closeModalButton: {
    padding: 4,
  },
  formErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  formErrorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
    flex: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  pickCalendarLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pickCalendarLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  dateSelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateSelectorDisplay: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  dateSelectorValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  dateSelectorBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dateSelectorBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#064E3B',
    borderColor: '#064E3B',
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statusSelectRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statusSelectBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  statusSelectBtnActivePaid: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  statusSelectBtnActivePending: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  statusSelectBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  statusSelectBtnTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#064E3B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Calendar Modal Styles */
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  calendarNavBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarMonthTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  calendarSelectedSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#059669',
    marginTop: 2,
  },
  quickShortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  quickShortcutChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  quickShortcutChipActive: {
    backgroundColor: '#064E3B',
  },
  quickShortcutChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  quickShortcutChipTextActive: {
    color: '#FFFFFF',
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 8,
  },
  calendarDayHeaderLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  calendarDayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 20,
    marginVertical: 2,
  },
  calendarDayCellSelected: {
    backgroundColor: '#064E3B',
  },
  calendarDayCellToday: {
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  calendarDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  calendarDayTextToday: {
    color: '#065F46',
    fontWeight: '700',
  },
  todayIndicatorDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
  },
  calendarCloseButton: {
    backgroundColor: '#064E3B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  calendarCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
