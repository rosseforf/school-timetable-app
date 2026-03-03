import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { Bell, BellOff, Volume2, Vibrate, Clock, AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSchool } from '@/contexts/SchoolContext';
import Colors from '@/constants/colors';

export default function SignalScreen() {
  const insets = useSafeAreaInsets();
  const { bellSettings, updateBellSettings, isAdmin } = useSchool();
  const [localSettings, setLocalSettings] = useState(bellSettings);

  const updateSetting = (key: keyof typeof localSettings, value: boolean | number) => {
    if (!isAdmin) {
      Alert.alert("Ruxsat yo'q", "Signal sozlamalarini o'zgartirish uchun Admin rejimiga kiring.");
      return;
    }
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    updateBellSettings(updated);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const togglePause = () => {
    if (!isAdmin) {
      Alert.alert("Ruxsat yo'q", "Faqat Admin to'xtatishi mumkin.");
      return;
    }
    const updated = { ...localSettings, paused: !localSettings.paused };
    setLocalSettings(updated);
    updateBellSettings(updated);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(
        updated.paused ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Success
      );
    }
  };

  const testBell = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert('Test', "Qo'ng'iroq sinov qilindi!");
  };

  const preWarningOptions = [0, 1, 3, 5];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        title: "Signal boshqaruvi",
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerShadowVisible: false,
      }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
      >
        {localSettings.paused && (
          <View style={styles.pauseBanner}>
            <AlertTriangle size={20} color={Colors.danger} />
            <Text style={styles.pauseText}>Barcha signallar to'xtatilgan</Text>
          </View>
        )}

        <View style={styles.statusCard}>
          {localSettings.paused ? (
            <BellOff size={40} color={Colors.danger} />
          ) : localSettings.enabled ? (
            <Bell size={40} color={Colors.primary} />
          ) : (
            <BellOff size={40} color={Colors.textMuted} />
          )}
          <Text style={[styles.statusText, {
            color: localSettings.paused ? Colors.danger : localSettings.enabled ? Colors.primary : Colors.textMuted,
          }]}>
            {localSettings.paused ? "To'xtatilgan" : localSettings.enabled ? 'Yoqilgan' : "O'chirilgan"}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.pauseBtn, localSettings.paused && styles.pauseBtnActive]}
          onPress={togglePause}
          activeOpacity={0.7}
        >
          <Text style={styles.pauseBtnText}>
            {localSettings.paused ? 'Signallarni yoqish' : "Barchasini to'xtatish"}
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Asosiy sozlamalar</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={18} color={Colors.textSecondary} />
              <Text style={styles.settingLabel}>Signal yoqilgan</Text>
            </View>
            <Switch
              value={localSettings.enabled}
              onValueChange={(v) => updateSetting('enabled', v)}
              trackColor={{ false: Colors.border, true: Colors.primaryDark }}
              thumbColor={localSettings.enabled ? Colors.primary : Colors.textMuted}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Vibrate size={18} color={Colors.textSecondary} />
              <Text style={styles.settingLabel}>Tebranish</Text>
            </View>
            <Switch
              value={localSettings.vibration}
              onValueChange={(v) => updateSetting('vibration', v)}
              trackColor={{ false: Colors.border, true: Colors.primaryDark }}
              thumbColor={localSettings.vibration ? Colors.primary : Colors.textMuted}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Clock size={18} color={Colors.textSecondary} />
              <Text style={styles.settingLabel}>Tanaffus signali</Text>
            </View>
            <Switch
              value={localSettings.breakBell}
              onValueChange={(v) => updateSetting('breakBell', v)}
              trackColor={{ false: Colors.border, true: Colors.primaryDark }}
              thumbColor={localSettings.breakBell ? Colors.primary : Colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Oldindan ogohlantirish</Text>
          <View style={styles.preWarningRow}>
            {preWarningOptions.map((minutes) => (
              <TouchableOpacity
                key={minutes}
                style={[
                  styles.preWarningBtn,
                  localSettings.preWarning === minutes && styles.preWarningBtnActive,
                ]}
                onPress={() => updateSetting('preWarning', minutes)}
              >
                <Text style={[
                  styles.preWarningText,
                  localSettings.preWarning === minutes && styles.preWarningTextActive,
                ]}>
                  {minutes === 0 ? "O'ch" : `${minutes} daq`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ovoz balandligi</Text>
          <View style={styles.volumeRow}>
            <Volume2 size={18} color={Colors.textSecondary} />
            <View style={styles.volumeBarContainer}>
              <View style={[styles.volumeBar, { width: `${localSettings.volume}%` }]} />
            </View>
            <Text style={styles.volumeText}>{localSettings.volume}%</Text>
          </View>
          <View style={styles.volumeButtons}>
            {[20, 40, 60, 80, 100].map((v) => (
              <TouchableOpacity
                key={v}
                style={[styles.volBtn, localSettings.volume === v && styles.volBtnActive]}
                onPress={() => updateSetting('volume', v)}
              >
                <Text style={[styles.volBtnText, localSettings.volume === v && styles.volBtnTextActive]}>
                  {v}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.testBtn} onPress={testBell} activeOpacity={0.7}>
          <Bell size={18} color={Colors.text} />
          <Text style={styles.testBtnText}>Sinov qo'ng'irog'i</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  pauseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 10,
  },
  pauseText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginTop: 12,
  },
  pauseBtn: {
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  pauseBtnActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  pauseBtnText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    color: Colors.text,
  },
  preWarningRow: {
    flexDirection: 'row',
    gap: 8,
  },
  preWarningBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  preWarningBtnActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  preWarningText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  preWarningTextActive: {
    color: Colors.primary,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  volumeBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.cardBg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  volumeBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  volumeText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600' as const,
    width: 40,
    textAlign: 'right' as const,
  },
  volumeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  volBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  volBtnActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  volBtnText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  volBtnTextActive: {
    color: Colors.primary,
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 8,
  },
  testBtnText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
