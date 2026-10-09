import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/components/form-ui";
import api from "@/services/api";

type TaskStatus = "open" | "in_progress" | "done";
type Priority = "low" | "normal" | "high";
type KitchenTask = { id: string; title: string; station: string; priority: Priority; status: TaskStatus; dueTime: string; notes: string };
type TaskForm = Omit<KitchenTask, "id" | "status">;

const emptyForm: TaskForm = { title: "", station: "Main kitchen", priority: "normal", dueTime: "", notes: "" };

export default function KitchenTasksScreen() {
  const [tasks, setTasks] = useState<KitchenTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<KitchenTask | null>(null);
  const [form, setForm] = useState<TaskForm>(emptyForm);

  const load = useCallback(async () => {
    try {
      const response = await api.get<{ data: KitchenTask[] }>("/kitchen/tasks");
      setTasks(response.data);
    } catch (error) {
      Alert.alert("Could not load tasks", error instanceof Error ? error.message : "Make sure the backend is running and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalVisible(true);
  };

  const openEdit = (task: KitchenTask) => {
    setEditing(task);
    setForm({ title: task.title, station: task.station, priority: task.priority, dueTime: task.dueTime, notes: task.notes });
    setModalVisible(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.station.trim()) {
      Alert.alert("Required", "Add a task title and station.");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/kitchen/tasks/${editing.id}`, form);
      } else {
        await api.post("/kitchen/tasks", form);
      }
      setModalVisible(false);
      await load();
    } catch (error) {
      Alert.alert("Save failed", error instanceof Error ? error.message : "The kitchen task could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (task: KitchenTask) => {
    const status: TaskStatus = task.status === "open" ? "in_progress" : task.status === "in_progress" ? "done" : "open";
    try {
      await api.put(`/kitchen/tasks/${task.id}`, { status });
      await load();
    } catch (error) {
      Alert.alert("Update failed", error instanceof Error ? error.message : "The task status could not be updated.");
    }
  };

  const deleteTask = async (task: KitchenTask) => {
    try {
      await api.delete(`/kitchen/tasks/${task.id}`);
      setTasks((current) => current.filter((item) => item.id !== task.id));
    } catch (error) {
      Alert.alert("Delete failed", error instanceof Error ? error.message : "The kitchen task could not be deleted.");
    }
  };

  const remove = (task: KitchenTask) => {
    if (Platform.OS === "web") {
      if (window.confirm(`Delete "${task.title}"?`)) {
        void deleteTask(task);
      }
      return;
    }

    Alert.alert("Delete task?", task.title, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => void deleteTask(task) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Prep tasks</Text>
          <Text style={styles.subtitle}>Create and manage kitchen work</Text>
        </View>
        <Pressable style={styles.addButton} onPress={openCreate}>
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>
      {loading ? <ActivityIndicator style={styles.loader} color={colors.green} /> : (
        <ScrollView contentContainerStyle={styles.content}>
          {tasks.map((task) => (
            <View key={task.id} style={[styles.card, task.status === "done" && styles.doneCard]}>
              <View style={styles.cardTop}>
                <View style={styles.taskIcon}><Ionicons name={task.status === "done" ? "checkmark" : "clipboard-outline"} size={20} color={colors.text} /></View>
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskTitle, task.status === "done" && styles.doneText]}>{task.title}</Text>
                  <Text style={styles.meta}>{task.station}{task.dueTime ? ` • Due ${task.dueTime}` : ""}</Text>
                </View>
                <View style={[styles.priority, priorityStyles[task.priority]]}><Text style={priorityText[task.priority]}>{task.priority}</Text></View>
              </View>
              {task.notes ? <Text style={styles.notes}>{task.notes}</Text> : null}
              <View style={styles.actions}>
                <Pressable style={styles.statusButton} onPress={() => updateStatus(task)}>
                  <Text style={styles.statusButtonText}>{task.status === "open" ? "Start" : task.status === "in_progress" ? "Complete" : "Reopen"}</Text>
                </Pressable>
                <Pressable style={styles.editButton} onPress={() => openEdit(task)}><Ionicons name="create-outline" size={18} color={colors.text} /></Pressable>
                <Pressable style={styles.deleteButton} onPress={() => remove(task)}><Ionicons name="trash-outline" size={18} color="#B42318" /></Pressable>
              </View>
            </View>
          ))}
          {tasks.length === 0 && <View style={styles.empty}><Ionicons name="clipboard-outline" size={42} color={colors.border} /><Text style={styles.emptyTitle}>No prep tasks</Text><Text style={styles.emptyText}>Create the first kitchen task with the plus button.</Text></View>}
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}><View style={styles.modal}>
          <View style={styles.modalHeader}><Text style={styles.modalTitle}>{editing ? "Edit prep task" : "New prep task"}</Text><Pressable onPress={() => setModalVisible(false)}><Ionicons name="close" size={24} color={colors.text} /></Pressable></View>
          <TextInput style={styles.input} placeholder="Task title" value={form.title} onChangeText={(title) => setForm({ ...form, title })} />
          <TextInput style={styles.input} placeholder="Station (e.g. Grill)" value={form.station} onChangeText={(station) => setForm({ ...form, station })} />
          <TextInput style={styles.input} placeholder="Due time (e.g. 6:30 PM)" value={form.dueTime} onChangeText={(dueTime) => setForm({ ...form, dueTime })} />
          <TextInput style={[styles.input, styles.notesInput]} placeholder="Notes (optional)" multiline value={form.notes} onChangeText={(notes) => setForm({ ...form, notes })} />
          <View style={styles.priorityRow}>{(["low", "normal", "high"] as Priority[]).map((priority) => <Pressable key={priority} style={[styles.priorityChoice, form.priority === priority && styles.prioritySelected]} onPress={() => setForm({ ...form, priority })}><Text style={styles.priorityChoiceText}>{priority}</Text></Pressable>)}</View>
          <Pressable style={styles.saveButton} onPress={save} disabled={saving}>{saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>{editing ? "Update task" : "Create task"}</Text>}</Pressable>
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}

const priorityStyles = StyleSheet.create({ low: { backgroundColor: "#EEF1F0" }, normal: { backgroundColor: "#FFF4D6" }, high: { backgroundColor: "#FCE4E4" } });
const priorityText = StyleSheet.create({ low: { color: "#5F6B66", fontSize: 10, fontWeight: "800" }, normal: { color: "#966600", fontSize: 10, fontWeight: "800" }, high: { color: "#B42318", fontSize: 10, fontWeight: "800" } });
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg }, header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 24 }, title: { fontSize: 24, fontWeight: "800", color: colors.text }, subtitle: { color: colors.muted, fontSize: 13, marginTop: 4 }, addButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.text, alignItems: "center", justifyContent: "center" }, loader: { marginTop: 48 }, content: { paddingHorizontal: 24, paddingBottom: 32 }, card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12 }, doneCard: { opacity: 0.65 }, cardTop: { flexDirection: "row", alignItems: "center" }, taskIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", marginRight: 12 }, taskInfo: { flex: 1 }, taskTitle: { fontSize: 16, fontWeight: "800", color: colors.text }, doneText: { textDecorationLine: "line-through" }, meta: { fontSize: 12, color: colors.muted, marginTop: 4 }, priority: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10 }, notes: { color: colors.muted, fontSize: 13, marginTop: 12 }, actions: { flexDirection: "row", gap: 8, marginTop: 14 }, statusButton: { flex: 1, backgroundColor: "#EAF7F0", borderRadius: 9, alignItems: "center", justifyContent: "center", minHeight: 38 }, statusButtonText: { color: "#19704B", fontWeight: "800", fontSize: 13 }, editButton: { width: 40, minHeight: 38, borderRadius: 9, backgroundColor: "#F1F3F2", alignItems: "center", justifyContent: "center" }, deleteButton: { width: 40, minHeight: 38, borderRadius: 9, backgroundColor: "#FCE4E4", alignItems: "center", justifyContent: "center" }, empty: { alignItems: "center", padding: 48 }, emptyTitle: { color: colors.text, fontWeight: "800", fontSize: 16, marginTop: 12 }, emptyText: { color: colors.muted, textAlign: "center", marginTop: 6 }, modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" }, modal: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 }, modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }, modalTitle: { color: colors.text, fontSize: 20, fontWeight: "800" }, input: { backgroundColor: colors.bg, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10, color: colors.text }, notesInput: { minHeight: 70, textAlignVertical: "top" }, priorityRow: { flexDirection: "row", gap: 8, marginVertical: 6 }, priorityChoice: { flex: 1, paddingVertical: 11, borderRadius: 9, backgroundColor: colors.bg, alignItems: "center" }, prioritySelected: { backgroundColor: "#D5EDE3" }, priorityChoiceText: { color: colors.text, fontWeight: "700", textTransform: "capitalize" }, saveButton: { backgroundColor: colors.text, borderRadius: 11, alignItems: "center", justifyContent: "center", minHeight: 48, marginTop: 14 }, saveText: { color: "#fff", fontWeight: "800" },
});
