import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/ui/Icon';

type TableShape = 'circle' | 'square';
type FloorType = 'INDOOR' | 'PATIO' | 'BAR LOUNGE';

interface FloorTable {
  id: string;
  name: string;
  seats: number;
  shape: TableShape;
  x: number;
  y: number;
  width?: number;
  height?: number;
  floor: FloorType;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_WIDTH = SCREEN_WIDTH - 32;

const TABLE_COLORS = [
  '#D1FAE5', // Light Emerald
  '#DBEAFE', // Light Blue
  '#FEF08A', // Light Yellow
  '#FCE7F3', // Light Pink
  '#EDE9FE', // Light Purple
  '#FFEDD5', // Light Orange
  '#E0E7FF', // Light Indigo
  '#CCFBF1', // Light Teal
];

// Sub-component to handle drag-and-drop for each table
const DraggableTable = ({ table, isSelected, onPress, onUpdatePosition, tableIndex }: any) => {
  const pan = useRef(new Animated.ValueXY({ x: table.x, y: table.y })).current;

  useEffect(() => {
    // If external state updates the position, animate or snap to it
    // But usually we just update the Pan value if it changes drastically.
    pan.setValue({ x: table.x, y: table.y });
  }, [table.x, table.y]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only start dragging if the user actually moved their finger a bit
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        onPress();
        pan.setOffset({
          // @ts-ignore
          x: pan.x._value,
          // @ts-ignore
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        pan.flattenOffset();
        // Prevent accidental drags from triggering placement out of bounds, but for now just save
        onUpdatePosition({
          // @ts-ignore
          x: Math.max(0, pan.x._value),
          // @ts-ignore
          y: Math.max(0, pan.y._value),
        });
      },
    })
  ).current;

  const isCircle = table.shape === 'circle';
  const w = table.width || 80;
  const h = table.height || 80;
  
  const unselectedColor = TABLE_COLORS[tableIndex % TABLE_COLORS.length];

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        pan.getLayout(),
        styles.tableItem,
        { width: w, height: h, position: 'absolute' },
        isCircle ? { borderRadius: Math.max(w, h) / 2 } : styles.tableShapeSquare,
        !isSelected && { backgroundColor: unselectedColor },
        isSelected && styles.tableSelected,
      ]}
    >
      <Text style={[styles.tableNameText, isSelected && styles.tableTextSelected]}>{table.name}</Text>
      <Text style={[styles.tableSeatsText, isSelected && styles.tableTextSelected]}>{table.seats} seats</Text>
      {isSelected && (
        <View style={styles.selectedBadge}>
          <Icon name="check" size={10} color="#FFFFFF" />
        </View>
      )}
    </Animated.View>
  );
};

const FLOORS: FloorType[] = ['INDOOR', 'PATIO', 'BAR LOUNGE'];

export default function FloorLayoutScreen() {
  const router = useRouter();
  
  const [currentFloor, setCurrentFloor] = useState<FloorType>('INDOOR');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [tables, setTables] = useState<FloorTable[]>([
    { id: '1', name: 'T1', seats: 4, shape: 'circle', x: 20, y: 30, floor: 'INDOOR' },
    { id: '2', name: 'T2', seats: 2, shape: 'square', x: 130, y: 20, width: 90, height: 90, floor: 'INDOOR' },
    { id: '3', name: 'T3', seats: 4, shape: 'circle', x: 250, y: 30, floor: 'INDOOR' },
    { id: '4', name: 'T4', seats: 6, shape: 'square', x: 20, y: 150, width: 100, height: 100, floor: 'INDOOR' },
    { id: '5', name: 'T5', seats: 4, shape: 'circle', x: 250, y: 150, floor: 'INDOOR' },
    { id: '6', name: 'T6', seats: 2, shape: 'circle', x: 30, y: 290, floor: 'INDOOR' },
    { id: '8', name: 'T8', seats: 4, shape: 'square', x: 130, y: 290, floor: 'INDOOR' },
    { id: '7', name: 'T7', seats: 8, shape: 'circle', x: 220, y: 260, width: 106, height: 106, floor: 'INDOOR' },
    
    { id: '9', name: 'P1', seats: 2, shape: 'square', x: 50, y: 50, floor: 'PATIO' },
    { id: '10', name: 'P2', seats: 4, shape: 'circle', x: 180, y: 50, floor: 'PATIO' },
    
    { id: '11', name: 'B1', seats: 4, shape: 'square', x: 80, y: 100, floor: 'BAR LOUNGE' },
  ]);

  const [selectedTableId, setSelectedTableId] = useState<string | null>('2');

  const filteredTables = tables.filter(t => t.floor === currentFloor);
  const selectedTable = tables.find(t => t.id === selectedTableId) || null;
  const totalSeats = filteredTables.reduce((acc, t) => acc + t.seats, 0);

  const handleUpdateSelectedTable = (updates: Partial<FloorTable>) => {
    if (!selectedTableId) return;
    setTables(prev => prev.map(t => (t.id === selectedTableId ? { ...t, ...updates } : t)));
  };

  const handleUpdateTablePosition = (id: string, x: number, y: number) => {
    setTables(prev => prev.map(t => (t.id === id ? { ...t, x, y } : t)));
  };

  const handleAddTable = () => {
    const newId = Date.now().toString();
    const offset = (filteredTables.length % 5) * 20; 
    setTables([
      ...tables,
      { id: newId, name: `T${tables.length + 1}`, seats: 4, shape: 'circle', x: 100 + offset, y: 100 + offset, floor: currentFloor },
    ]);
    setSelectedTableId(newId);
  };

  const handleDeleteSelected = () => {
    if (!selectedTableId) return;
    
    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to delete ${selectedTable?.name}?`)) {
        setTables(prev => prev.filter(t => t.id !== selectedTableId));
        setSelectedTableId(null);
      }
    } else {
      Alert.alert('Delete table', `Are you sure you want to delete ${selectedTable?.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTables(prev => prev.filter(t => t.id !== selectedTableId));
            setSelectedTableId(null);
          },
        },
      ]);
    }
  };

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Reset to default layout?')) {
        router.reload();
      }
    } else {
      Alert.alert('Reset Layout', 'Reset to default layout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => router.reload() },
      ]);
    }
  };

  const renderTileFloor = () => {
    const lines = [];
    const step = 45; // Tile size
    const numVertical = Math.ceil(CANVAS_WIDTH / step);
    const numHorizontal = Math.ceil(460 / step); // Canvas height is 460
    
    // Vertical lines
    for (let i = 0; i <= numVertical; i++) {
      lines.push(
        <View 
          key={`v-${i}`} 
          style={[
            styles.tileLineVertical, 
            { left: i * step }
          ]} 
        />
      );
    }
    
    // Horizontal lines
    for (let i = 0; i <= numHorizontal; i++) {
      lines.push(
        <View 
          key={`h-${i}`} 
          style={[
            styles.tileLineHorizontal, 
            { top: i * step }
          ]} 
        />
      );
    }
    
    return lines;
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#064E3B" />
      
      {/* Dark Green Header Section */}
      <View style={[styles.headerSection, { zIndex: 100 }]}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerTitleBox}>
                <Pressable onPress={() => router.replace('/(staff)/manager')} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
                  <Icon name="arrow-back" size={20} color="#FFFFFF" />
                </Pressable>
                <Text style={styles.headerTitle}>Floor layout & Plan</Text>
              </View>
              <Pressable onPress={handleReset} style={({ pressed }) => [styles.resetBtn, pressed && styles.pressed]}>
                <Text style={styles.resetText}>Reset</Text>
              </Pressable>
            </View>

            <View style={styles.headerBottomRow}>
              {/* Dropdown Button */}
              <View style={{ position: 'relative', zIndex: 50 }}>
                <Pressable 
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)} 
                  style={({ pressed }) => [styles.floorDropdownBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.floorDropdownText}>{currentFloor}</Text>
                  <Icon name="chevron-down" size={16} color="#064E3B" />
                </Pressable>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {FLOORS.map(floor => (
                      <Pressable 
                        key={floor} 
                        onPress={() => {
                          setCurrentFloor(floor);
                          setSelectedTableId(null);
                          setIsDropdownOpen(false);
                        }} 
                        style={[styles.dropdownItem, currentFloor === floor && styles.dropdownItemActive]}
                      >
                        <Text style={[styles.dropdownItemText, currentFloor === floor && styles.dropdownItemTextActive]}>
                          {floor}
                        </Text>
                        {currentFloor === floor && <Icon name="check" size={16} color="#059669" />}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.statsLeft}>
                <View style={styles.activeDot} />
                <Text style={styles.statsText}>{filteredTables.length} tables · {totalSeats} seats</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          {/* Canvas Card Area */}
          <View style={styles.canvasCard}>
            {/* Background Tile Floor */}
            {renderTileFloor()}

            {/* Tables */}
            {filteredTables.map((table, index) => (
              <DraggableTable
                key={table.id}
                table={table}
                tableIndex={index}
                isSelected={table.id === selectedTableId}
                onPress={() => setSelectedTableId(table.id)}
                onUpdatePosition={(pos: { x: number, y: number }) => handleUpdateTablePosition(table.id, pos.x, pos.y)}
              />
            ))}

            {/* Add Table Floating Button (Inside Canvas) */}
            <Pressable
              onPress={handleAddTable}
              style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
            >
              <Icon name="plus" size={16} color="#FFFFFF" />
              <Text style={styles.fabText}>Add table</Text>
            </Pressable>
          </View>
          
          {/* Permanent Bottom Editor Card */}
          <View style={styles.editorCard}>
            {selectedTable ? (
              <>
                <View style={styles.sheetHeaderRow}>
                  <View style={styles.sheetTitleBox}>
                    <View style={styles.sheetTableIcon}>
                      <Icon name="grid" size={20} color="#FFFFFF" />
                    </View>
                    <View>
                      <Text style={styles.sheetTitle}>Table {selectedTable.name}</Text>
                      <Text style={styles.sheetSubtitle}>{currentFloor} · {selectedTable.seats} seats</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Table name</Text>
                  <View style={styles.textInputWrapper}>
                    <TextInput
                      style={styles.textInput}
                      value={selectedTable.name}
                      onChangeText={(val) => handleUpdateSelectedTable({ name: val })}
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                <View style={styles.rowControls}>
                  <View style={styles.controlCol}>
                    <Text style={styles.label}>Seats</Text>
                    <View style={styles.stepperBox}>
                      <Pressable
                        onPress={() => handleUpdateSelectedTable({ seats: Math.max(1, selectedTable.seats - 1) })}
                        style={({ pressed }) => [styles.stepperBtnLeft, pressed && styles.pressed]}
                      >
                        <Text style={{ fontSize: 24, fontWeight: '700', color: '#064E3B', marginTop: -4 }}>-</Text>
                      </Pressable>
                      <Text style={styles.stepperVal}>{selectedTable.seats}</Text>
                      <Pressable
                        onPress={() => handleUpdateSelectedTable({ seats: selectedTable.seats + 1 })}
                        style={({ pressed }) => [styles.stepperBtnRight, pressed && styles.pressed]}
                      >
                        <Icon name="plus" size={16} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.controlCol}>
                    <Text style={styles.label}>Shape</Text>
                    <View style={styles.shapeSelectorBox}>
                      <Pressable
                        onPress={() => handleUpdateSelectedTable({ shape: 'square' })}
                        style={[styles.shapeBtn, selectedTable.shape === 'square' && styles.shapeBtnActive]}
                      >
                        <View style={[styles.shapeIconSquare, selectedTable.shape === 'square' && styles.shapeIconSquareActive]} />
                      </Pressable>
                      <Pressable
                        onPress={() => handleUpdateSelectedTable({ shape: 'circle' })}
                        style={[styles.shapeBtn, selectedTable.shape === 'circle' && styles.shapeBtnActive]}
                      >
                        <View style={[styles.shapeIconCircle, selectedTable.shape === 'circle' && styles.shapeIconCircleActive]} />
                      </Pressable>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={handleDeleteSelected}
                  style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
                >
                  <Icon name="trash-outline" size={16} color="#EF4444" />
                  <Text style={styles.deleteBtnText}>Delete table</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    if (Platform.OS === 'web') {
                      window.alert('Floor layout saved successfully!');
                    } else {
                      Alert.alert('Success', 'Floor layout saved successfully!');
                    }
                  }}
                  style={({ pressed }) => [styles.saveLayoutBtn, pressed && styles.pressed]}
                >
                  <Icon name="check" size={18} color="#FFFFFF" />
                  <Text style={styles.saveLayoutBtnText}>Save Layout</Text>
                </Pressable>
              </>
            ) : (
              <View style={styles.emptyPanelState}>
                <Icon name="grid" size={48} color="#E2E8F0" />
                <Text style={styles.emptyPanelTitle}>No table selected</Text>
                <Text style={styles.emptyPanelSubtitle}>Select a table from the floor plan to edit its properties, or add a new table.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F6F2', // Warm beige/off-white background matching the image
  },
  headerSection: {
    backgroundColor: '#064E3B',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 24,
    zIndex: 100,
    elevation: 100, // Important for Android so dropdown doesn't clip
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floorDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  floorDropdownText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#064E3B',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
    zIndex: 999,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: '#ECFDF5',
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  dropdownItemTextActive: {
    color: '#059669',
    fontWeight: '700',
  },
  statsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  statsText: {
    fontSize: 13,
    color: '#D1FAE5',
    fontWeight: '500',
  },
  container: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 24, 
  },
  canvasCard: {
    width: CANVAS_WIDTH,
    height: 460,
    backgroundColor: '#F8FAF6', // Very subtle green/white for the canvas card
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tileLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#94A3B8', // Darker gray for better visibility
    opacity: 0.5,
  },
  tileLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#94A3B8',
    opacity: 0.5,
  },
  tableItem: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tableShapeSquare: {
    borderRadius: 20,
  },
  tableSelected: {
    backgroundColor: '#064E3B',
    borderColor: '#6EE7B7', // Thick light green border matching the image
    borderWidth: 4,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  tableNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  tableSeatsText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  tableTextSelected: {
    color: '#FFFFFF',
  },
  selectedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#064E3B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    gap: 8,
  },
  fabText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyPanelState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyPanelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyPanelSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sheetTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  sheetTableIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#059669',
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  textInput: {
    flex: 1,
    height: 54,
    fontSize: 16,
    fontWeight: '700',
    color: '#064E3B',
  },
  rowControls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  controlCol: {
    flex: 1,
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    height: 54,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepperBtnLeft: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepperBtnRight: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#064E3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  shapeSelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    height: 54,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shapeBtn: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  shapeBtnActive: {
    backgroundColor: '#064E3B',
  },
  shapeIconSquare: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: '#94A3B8',
  },
  shapeIconSquareActive: {
    backgroundColor: '#FFFFFF',
  },
  shapeIconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94A3B8',
  },
  shapeIconCircleActive: {
    borderColor: '#FFFFFF',
  },
  deleteBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 12,
    gap: 8,
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
  saveLayoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  saveLayoutBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
