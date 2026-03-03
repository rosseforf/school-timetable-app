import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { Plus, Trash2, CalendarDays, PartyPopper } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSchool } from '@/contexts/SchoolContext';
import { Holiday } from '@/types/school';
import Colors from '@/constants/colors';

export default function BayramScreen() {
  const insets = useSafeAreaInsets();
  const { holidays, updateHolidays, isAdmin } = useSchool();
  const [showForm, setShowForm] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'bayram' | 'dam_olish'>('bayram');

  const sortedHolidays = useMemo(() => {
    return [...holidays].sort((a, b) => a.date.localeCompare(b.date));
  }, [holidays]);

  const addHoliday = useCallback(() => {
    if (!isAdmin) {
      Alert.alert("Ruxsat yo'q", "Bayram qo'shish uchun Admin rejimiga kiring.");
      return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newDate)) {
      Alert.alert('Xato', "Sanani YYYY-MM-DD formatida kiriting (masalan: 2026-03-21)");
      return;
    }
    if (!newName.trim()) {
      Alert.alert('Xato', 'Bayram nomini kiriting');
      return;
    }
    const holiday: Holiday = {
      id: `h_${Date.now()}`,
      date: newDate,
      name: newName.trim(),
      type: newType,
    };
    updateHolidays([...holidays, holiday]);
    setNewDate('');
    setNewName('');
    setShowForm(false);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [isAdmin, newDate, newName, newType, holidays, updateHolidays]);

  const deleteHoliday = useCallback((id: string) => {
    if (!isAdmin) {
      Alert.alert("Ruxsat yo'q", "Faqat Admin o'chirishi mumkin.");
      return;
    }
    Alert.alert("O'chirish", "Bayramni o'chirishni tasdiqlaysizmi?", [
      { text: 'Bekor qilish', style: 'cancel' },
      {
        text: "O'chirish",
        style: 'destructive',
        onPress: () => {
          updateHolidays(holidays.filter(h => h.id !== id));
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        },
      },
    ]);
  }, [isAdmin, holidays, updateHolidays]);

  const formatDate = (dateStr: string): string => {
    try {
      const [y, m, d] = dateStr.split('-');
      return `${d}.${m}.${y}`;
    } catch {
      return dateStr;
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        title: 'Bayramlar',
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerShadowVisible: false,
      }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
      >
        <View style={styles.headerCard}>
          <PartyPopper size={32} color={Colors.warning} />
          <Text style={styles.headerTitle}>Bayramlar va dam olish kunlari</Text>
          <Text style={styles.headerSub}>
            Bayram kunlarida qo'ng'iroqlar avtomatik o'chiriladi
          </Text>
        </View>

        {isAdmin && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowForm(!showForm)}
            activeOpacity={0.7}
          >
            <Plus size={18} color={Colors.primary} />
            <Text style={styles.addBtnText}>Yangi bayram qo'shish</Text>
          </TouchableOpacity>
        )}

        {showForm && (
          <View style={styles.form}>
            <Text style={styles.formLabel}>Sana (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={newDate}
              onChangeText={setNewDate}
              placeholder="2026-03-21"
              placeholderTextColor={Colors.textMuted}
              keyboardType="default"
            />
            <Text style={styles.formLabel}>Nomi</Text>
            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Navro'z bayrami"
              placeholderTextColor={Colors.textMuted}
            />
            <Text style={styles.formLabel}>Turi</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[styles.typeBtn, newType === 'bayram' && styles.typeBtnActive]}
                onPress={() => setNewType('bayram')}
              >
                <Text style={[styles.typeBtnText, newType === 'bayram' && styles.typeBtnTextActive]}>
                  Bayram
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, newType === 'dam_olish' && styles.typeBtnActive]}
                onPress={() => setNewType('dam_olish')}
              >
                <Text style={[styles.typeBtnText, newType === 'dam_olish' && styles.typeBtnTextActive]}>
                  Dam olish
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={addHoliday} activeOpacity={0.7}>
              <Text style={styles.saveBtnText}>Saqlash</Text>
            </TouchableOpacity>
          </View>
        )}

        {sortedHolidays.length === 0 ? (
          <View style={styles.emptyState}>
            <CalendarDays size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Bayramlar hali kiritilmagan</Text>
          </View>
        ) : (
          sortedHolidays.map((h) => {
            const isPast = h.date < today;
            const isToday = h.date === today;
            return (
              <View
                key={h.id}
                style={[
                  styles.holidayCard,
                  isPast && styles.holidayCardPast,
                  isToday && styles.holidayCardToday,
                ]}
              >
                <View style={styles.holidayInfo}>
                  <Text style={styles.holidayDate}>{formatDate(h.date)}</Text>
                  <Text style={[styles.holidayName, isPast && styles.textPast]}>{h.name}</Text>
                  <View style={[
                    styles.typeBadge,
                    h.type === 'bayram' ? styles.bayramBadge : styles.damBadge,
                  ]}>
                    <Text style={[
                      styles.typeBadgeText,
                      h.type === 'bayram' ? styles.bayramBadgeText : styles.damBadgeText,
                    ]}>
                      {h.type === 'bayram' ? 'Bayram' : 'Dam olish'}
                    </Text>
                  </View>
                  {isToday && <Text style={styles.todayBadge}>Bugun!</Text>}
                </View>
                {isAdmin && (
                  <TouchableOpacity onPress={() => deleteHoliday(h.id)} style={styles.deleteBtn}>
                    <Trash2 size={18} color={Colors.danger} />
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: { flex: 1 },
  content: { padding: 16 },
  headerCard: {
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 12,
    textAlign: 'center' as const,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: 'center' as const,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 8,
  },
  addBtnText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  form: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600' as const,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  typeBtnText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  typeBtnTextActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '700' as const,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 12,
  },
  holidayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  holidayCardPast: {
    opacity: 0.5,
  },
  holidayCardToday: {
    borderColor: Colors.warning,
    backgroundColor: 'rgba(255, 193, 7, 0.08)',
  },
  holidayInfo: {
    flex: 1,
  },
  holidayDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
    fontVariant: ['tabular-nums'],
  },
  holidayName: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600' as const,
    marginTop: 2,
  },
  textPast: {
    color: Colors.textMuted,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  bayramBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
  },
  damBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  bayramBadgeText: {
    color: Colors.warning,
  },
  damBadgeText: {
    color: Colors.accentLight,
  },
  todayBadge: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '700' as const,
    marginTop: 4,
  },
  deleteBtn: {
    padding: 10,
  },
});
