import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Bell, CalendarDays, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSchool } from '@/contexts/SchoolContext';

export default function BottomBar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isHolidayToday } = useSchool();

  const holiday = isHolidayToday();
  const bayramLabel = holiday ? `Bayram: Ha` : `Bayram: Yo'q`;

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.inner}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/signal' as Href)}
          activeOpacity={0.7}
          testID="bottom-bar-signal"
        >
          <Bell size={20} color="#8BA3C7" />
          <Text style={styles.label}>Signal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/bayram' as Href)}
          activeOpacity={0.7}
          testID="bottom-bar-bayram"
        >
          <CalendarDays size={20} color="#8BA3C7" />
          <Text style={styles.label}>{bayramLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/admin' as Href)}
          activeOpacity={0.7}
          testID="bottom-bar-admin"
        >
          <Settings size={20} color="#8BA3C7" />
          <Text style={styles.label}>Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0A1525',
    borderTopWidth: 1,
    borderTopColor: '#1C3150',
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: '#B0C4DE',
    fontWeight: '500' as const,
  },
});
