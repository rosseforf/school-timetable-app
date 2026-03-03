import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import {
  Lock, Unlock, Users, BookOpen, DoorOpen, Clock, CalendarRange,
  Plus, Trash2, Copy, Download, Upload, LogOut, ChevronDown, ChevronRight,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSchool } from '@/contexts/SchoolContext';
import { SchoolClass, Teacher, Subject, Room, LessonTime, ScheduleEntry, DAY_NAMES } from '@/types/school';
import Colors from '@/constants/colors';

type SectionKey = 'classes' | 'teachers' | 'subjects' | 'rooms' | 'times' | 'schedule' | 'backup';

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const {
    isAdmin, verifyPassword, logoutAdmin,
    classes, teachers, subjects, rooms, lessonTimes, schedule,
    updateClasses, updateTeachers, updateSubjects, updateRooms,
    updateLessonTimes, updateSchedule,
    exportData, importData, updateAdminPassword,
  } = useSchool();

  const [pin, setPin] = useState('');
  const [openSection, setOpenSection] = useState<SectionKey | null>(null);

  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newLTLesson, setNewLTLesson] = useState('');
  const [newLTStart, setNewLTStart] = useState('');
  const [newLTEnd, setNewLTEnd] = useState('');
  const [newLTShift, setNewLTShift] = useState('1');
  const [newPassword, setNewPassword] = useState('');
  const [importJson, setImportJson] = useState('');

  const [schedDay, setSchedDay] = useState(0);
  const [schedShift, setSchedShift] = useState(1);
  const [schedLesson, setSchedLesson] = useState('1');
  const [schedClassId, setSchedClassId] = useState('');
  const [schedSubjectId, setSchedSubjectId] = useState('');
  const [schedTeacherId, setSchedTeacherId] = useState('');
  const [schedRoomId, setSchedRoomId] = useState('');

  const handleLogin = useCallback(() => {
    if (verifyPassword(pin)) {
      setPin('');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      Alert.alert('Xato', "Parol noto'g'ri");
      setPin('');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [pin, verifyPassword]);

  const toggleSection = (key: SectionKey) => {
    setOpenSection(openSection === key ? null : key);
  };

  const addClass = () => {
    if (!newClassName.trim() || !newClassGrade.trim()) {
      Alert.alert('Xato', "Sinf nomi va sinfni kiriting");
      return;
    }
    const newClass: SchoolClass = {
      id: `c_${Date.now()}`,
      name: newClassName.trim(),
      grade: parseInt(newClassGrade, 10) || 1,
    };
    updateClasses([...classes, newClass]);
    setNewClassName('');
    setNewClassGrade('');
  };

  const deleteClass = (id: string) => {
    updateClasses(classes.filter(c => c.id !== id));
  };

  const addTeacher = () => {
    if (!newTeacherName.trim()) {
      Alert.alert('Xato', "O'qituvchi ismini kiriting");
      return;
    }
    const teacher: Teacher = {
      id: `t_${Date.now()}`,
      name: newTeacherName.trim(),
      subject: newTeacherSubject.trim(),
      phone: newTeacherPhone.trim() || undefined,
    };
    updateTeachers([...teachers, teacher]);
    setNewTeacherName('');
    setNewTeacherSubject('');
    setNewTeacherPhone('');
  };

  const deleteTeacher = (id: string) => {
    updateTeachers(teachers.filter(t => t.id !== id));
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) return;
    const subj: Subject = { id: `s_${Date.now()}`, name: newSubjectName.trim() };
    updateSubjects([...subjects, subj]);
    setNewSubjectName('');
  };

  const deleteSubject = (id: string) => {
    updateSubjects(subjects.filter(s => s.id !== id));
  };

  const addRoom = () => {
    if (!newRoomName.trim()) return;
    const room: Room = { id: `r_${Date.now()}`, name: newRoomName.trim() };
    updateRooms([...rooms, room]);
    setNewRoomName('');
  };

  const deleteRoom = (id: string) => {
    updateRooms(rooms.filter(r => r.id !== id));
  };

  const addLessonTime = () => {
    if (!newLTLesson || !newLTStart || !newLTEnd) {
      Alert.alert('Xato', "Barcha maydonlarni to'ldiring");
      return;
    }
    const lt: LessonTime = {
      id: `lt_${Date.now()}`,
      lessonNumber: parseInt(newLTLesson, 10),
      startTime: newLTStart,
      endTime: newLTEnd,
      shift: parseInt(newLTShift, 10),
    };
    updateLessonTimes([...lessonTimes, lt]);
    setNewLTLesson('');
    setNewLTStart('');
    setNewLTEnd('');
  };

  const deleteLessonTime = (id: string) => {
    updateLessonTimes(lessonTimes.filter(lt => lt.id !== id));
  };

  const addScheduleEntry = () => {
    if (!schedClassId || !schedSubjectId || !schedTeacherId || !schedRoomId) {
      Alert.alert('Xato', "Barcha maydonlarni tanlang");
      return;
    }
    const entry: ScheduleEntry = {
      id: `se_${Date.now()}`,
      dayIndex: schedDay,
      shift: schedShift,
      lessonNumber: parseInt(schedLesson, 10),
      classId: schedClassId,
      subjectId: schedSubjectId,
      teacherId: schedTeacherId,
      roomId: schedRoomId,
    };
    updateSchedule([...schedule, entry]);
  };

  const deleteScheduleEntry = (id: string) => {
    updateSchedule(schedule.filter(s => s.id !== id));
  };

  const copyMonday = () => {
    const mondayEntries = schedule.filter(s => s.dayIndex === 0);
    if (mondayEntries.length === 0) {
      Alert.alert('Xato', "Dushanba kunida jadval yo'q");
      return;
    }
    Alert.alert(
      "Nusxalash",
      "Dushanba jadvali barcha kunlarga nusxalansinmi?",
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'Nusxalash',
          onPress: () => {
            const newEntries: ScheduleEntry[] = [...schedule];
            for (let day = 1; day <= 5; day++) {
              const existing = newEntries.filter(s => s.dayIndex === day);
              const filtered = newEntries.filter(s => s.dayIndex !== day);
              for (const entry of mondayEntries) {
                filtered.push({
                  ...entry,
                  id: `se_${Date.now()}_${day}_${entry.lessonNumber}_${entry.classId}`,
                  dayIndex: day,
                });
              }
              newEntries.length = 0;
              newEntries.push(...filtered);
            }
            updateSchedule(newEntries);
            Alert.alert('Tayyor', 'Jadval nusxalandi');
          },
        },
      ]
    );
  };

  const copyShift = () => {
    const shift1 = schedule.filter(s => s.shift === 1);
    if (shift1.length === 0) {
      Alert.alert('Xato', "1-smena jadvalida ma'lumot yo'q");
      return;
    }
    Alert.alert(
      'Nusxalash',
      '1-smena jadvali 2-smenaga nusxalansinmi?',
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'Nusxalash',
          onPress: () => {
            const without2 = schedule.filter(s => s.shift !== 2);
            const newShift2 = shift1.map(e => ({
              ...e,
              id: `se_${Date.now()}_s2_${e.dayIndex}_${e.lessonNumber}_${e.classId}`,
              shift: 2,
            }));
            updateSchedule([...without2, ...newShift2]);
            Alert.alert('Tayyor', '2-smenaga nusxalandi');
          },
        },
      ]
    );
  };

  const handleExport = () => {
    const json = exportData();
    Alert.alert('Eksport', "Ma'lumotlar JSON formatida tayyor. Clipboard'ga nusxalash uchun quyidagi matnni ko'ring.", [
      { text: 'OK' },
    ]);
    console.log('Exported data:', json);
  };

  const handleImport = () => {
    if (!importJson.trim()) {
      Alert.alert('Xato', 'JSON matnini kiriting');
      return;
    }
    const success = importData(importJson.trim());
    if (success) {
      Alert.alert('Tayyor', "Ma'lumotlar muvaffaqiyatli yuklandi");
      setImportJson('');
    } else {
      Alert.alert('Xato', "JSON formati noto'g'ri");
    }
  };

  const changePassword = () => {
    if (newPassword.length < 4) {
      Alert.alert('Xato', "Parol kamida 4 ta belgi bo'lishi kerak");
      return;
    }
    updateAdminPassword(newPassword);
    setNewPassword('');
    Alert.alert('Tayyor', "Parol o'zgartirildi");
  };

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{
          title: 'Admin',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
        }} />
        <View style={styles.loginContainer}>
          <View style={styles.lockIcon}>
            <Lock size={48} color={Colors.textMuted} />
          </View>
          <Text style={styles.loginTitle}>Admin rejimi</Text>
          <Text style={styles.loginSub}>Parolni kiriting</Text>
          <TextInput
            style={styles.pinInput}
            value={pin}
            onChangeText={setPin}
            placeholder="• • • •"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={8}
            textAlign="center"
          />
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.7}>
            <Unlock size={18} color={Colors.background} />
            <Text style={styles.loginBtnText}>Kirish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const filteredSchedule = schedule
    .filter(s => s.dayIndex === schedDay && s.shift === schedShift)
    .sort((a, b) => a.lessonNumber - b.lessonNumber);

  const sections: Array<{ key: SectionKey; icon: React.ReactNode; label: string; count: number }> = [
    { key: 'classes', icon: <Users size={18} color={Colors.accentLight} />, label: 'Sinflar', count: classes.length },
    { key: 'teachers', icon: <BookOpen size={18} color={Colors.primary} />, label: "O'qituvchilar", count: teachers.length },
    { key: 'subjects', icon: <BookOpen size={18} color={Colors.warning} />, label: 'Fanlar', count: subjects.length },
    { key: 'rooms', icon: <DoorOpen size={18} color={Colors.accentLight} />, label: 'Xonalar', count: rooms.length },
    { key: 'times', icon: <Clock size={18} color={Colors.primary} />, label: 'Dars vaqtlari', count: lessonTimes.length },
    { key: 'schedule', icon: <CalendarRange size={18} color={Colors.warning} />, label: 'Jadval', count: schedule.length },
    { key: 'backup', icon: <Download size={18} color={Colors.textSecondary} />, label: 'Zaxira nusxa', count: 0 },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        title: 'Admin panel',
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerShadowVisible: false,
        headerRight: () => (
          <TouchableOpacity onPress={logoutAdmin} style={styles.logoutBtn}>
            <LogOut size={20} color={Colors.danger} />
          </TouchableOpacity>
        ),
      }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
      >
        {sections.map((sec) => (
          <View key={sec.key} style={styles.sectionContainer}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(sec.key)}
              activeOpacity={0.7}
            >
              <View style={styles.sectionLeft}>
                {sec.icon}
                <Text style={styles.sectionLabel}>{sec.label}</Text>
                {sec.count > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{sec.count}</Text>
                  </View>
                )}
              </View>
              {openSection === sec.key ? (
                <ChevronDown size={18} color={Colors.textMuted} />
              ) : (
                <ChevronRight size={18} color={Colors.textMuted} />
              )}
            </TouchableOpacity>

            {openSection === 'classes' && sec.key === 'classes' && (
              <View style={styles.sectionBody}>
                <View style={styles.inlineForm}>
                  <TextInput style={[styles.input, styles.inputSmall]} value={newClassName} onChangeText={setNewClassName} placeholder="Nomi (5-A)" placeholderTextColor={Colors.textMuted} />
                  <TextInput style={[styles.input, styles.inputTiny]} value={newClassGrade} onChangeText={setNewClassGrade} placeholder="Sinf" placeholderTextColor={Colors.textMuted} keyboardType="number-pad" />
                  <TouchableOpacity style={styles.inlineAddBtn} onPress={addClass}>
                    <Plus size={18} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
                {classes.map(c => (
                  <View key={c.id} style={styles.listItem}>
                    <Text style={styles.listItemText}>{c.name} ({c.grade}-sinf)</Text>
                    <TouchableOpacity onPress={() => deleteClass(c.id)}>
                      <Trash2 size={16} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {openSection === 'teachers' && sec.key === 'teachers' && (
              <View style={styles.sectionBody}>
                <TextInput style={styles.input} value={newTeacherName} onChangeText={setNewTeacherName} placeholder="Ism" placeholderTextColor={Colors.textMuted} />
                <TextInput style={styles.input} value={newTeacherSubject} onChangeText={setNewTeacherSubject} placeholder="Fan" placeholderTextColor={Colors.textMuted} />
                <TextInput style={styles.input} value={newTeacherPhone} onChangeText={setNewTeacherPhone} placeholder="Telefon (ixtiyoriy)" placeholderTextColor={Colors.textMuted} keyboardType="phone-pad" />
                <TouchableOpacity style={styles.addItemBtn} onPress={addTeacher}>
                  <Plus size={16} color={Colors.primary} />
                  <Text style={styles.addItemText}>Qo'shish</Text>
                </TouchableOpacity>
                {teachers.map(t => (
                  <View key={t.id} style={styles.listItem}>
                    <View style={styles.listItemInfo}>
                      <Text style={styles.listItemText}>{t.name}</Text>
                      <Text style={styles.listItemSub}>{t.subject}{t.phone ? ` · ${t.phone}` : ''}</Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteTeacher(t.id)}>
                      <Trash2 size={16} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {openSection === 'subjects' && sec.key === 'subjects' && (
              <View style={styles.sectionBody}>
                <View style={styles.inlineForm}>
                  <TextInput style={[styles.input, { flex: 1 }]} value={newSubjectName} onChangeText={setNewSubjectName} placeholder="Fan nomi" placeholderTextColor={Colors.textMuted} />
                  <TouchableOpacity style={styles.inlineAddBtn} onPress={addSubject}>
                    <Plus size={18} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
                {subjects.map(s => (
                  <View key={s.id} style={styles.listItem}>
                    <Text style={styles.listItemText}>{s.name}</Text>
                    <TouchableOpacity onPress={() => deleteSubject(s.id)}>
                      <Trash2 size={16} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {openSection === 'rooms' && sec.key === 'rooms' && (
              <View style={styles.sectionBody}>
                <View style={styles.inlineForm}>
                  <TextInput style={[styles.input, { flex: 1 }]} value={newRoomName} onChangeText={setNewRoomName} placeholder="Xona raqami" placeholderTextColor={Colors.textMuted} />
                  <TouchableOpacity style={styles.inlineAddBtn} onPress={addRoom}>
                    <Plus size={18} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
                {rooms.map(r => (
                  <View key={r.id} style={styles.listItem}>
                    <Text style={styles.listItemText}>Xona {r.name}</Text>
                    <TouchableOpacity onPress={() => deleteRoom(r.id)}>
                      <Trash2 size={16} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {openSection === 'times' && sec.key === 'times' && (
              <View style={styles.sectionBody}>
                <View style={styles.inlineForm}>
                  <TextInput style={[styles.input, styles.inputTiny]} value={newLTLesson} onChangeText={setNewLTLesson} placeholder="№" placeholderTextColor={Colors.textMuted} keyboardType="number-pad" />
                  <TextInput style={[styles.input, styles.inputSmall]} value={newLTStart} onChangeText={setNewLTStart} placeholder="08:00" placeholderTextColor={Colors.textMuted} />
                  <TextInput style={[styles.input, styles.inputSmall]} value={newLTEnd} onChangeText={setNewLTEnd} placeholder="08:45" placeholderTextColor={Colors.textMuted} />
                  <TouchableOpacity
                    style={[styles.shiftToggle, newLTShift === '2' && styles.shiftToggleActive]}
                    onPress={() => setNewLTShift(newLTShift === '1' ? '2' : '1')}
                  >
                    <Text style={styles.shiftToggleText}>{newLTShift}-sm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inlineAddBtn} onPress={addLessonTime}>
                    <Plus size={18} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
                {[1, 2].map(shift => {
                  const shiftTimes = lessonTimes.filter(lt => lt.shift === shift).sort((a, b) => a.lessonNumber - b.lessonNumber);
                  return (
                    <View key={shift}>
                      <Text style={styles.shiftLabel}>{shift}-smena</Text>
                      {shiftTimes.map(lt => (
                        <View key={lt.id} style={styles.listItem}>
                          <Text style={styles.listItemText}>{lt.lessonNumber}-dars: {lt.startTime} – {lt.endTime}</Text>
                          <TouchableOpacity onPress={() => deleteLessonTime(lt.id)}>
                            <Trash2 size={16} color={Colors.danger} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            )}

            {openSection === 'schedule' && sec.key === 'schedule' && (
              <View style={styles.sectionBody}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
                  {DAY_NAMES.map((name, i) => (
                    <TouchableOpacity
                      key={name}
                      style={[styles.dayChip, schedDay === i && styles.dayChipActive]}
                      onPress={() => setSchedDay(i)}
                    >
                      <Text style={[styles.dayChipText, schedDay === i && styles.dayChipTextActive]}>
                        {name.substring(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.shiftRow}>
                  {[1, 2].map(s => (
                    <TouchableOpacity
                      key={s}
                      style={[styles.shiftBtn, schedShift === s && styles.shiftBtnActive]}
                      onPress={() => setSchedShift(s)}
                    >
                      <Text style={[styles.shiftBtnText, schedShift === s && styles.shiftBtnTextActive]}>
                        {s}-smena
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.schedForm}>
                  <TextInput style={styles.input} value={schedLesson} onChangeText={setSchedLesson} placeholder="Dars №" placeholderTextColor={Colors.textMuted} keyboardType="number-pad" />

                  <Text style={styles.pickerLabel}>Sinf:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                    {classes.map(c => (
                      <TouchableOpacity key={c.id} style={[styles.pickerChip, schedClassId === c.id && styles.pickerChipActive]} onPress={() => setSchedClassId(c.id)}>
                        <Text style={[styles.pickerChipText, schedClassId === c.id && styles.pickerChipTextActive]}>{c.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.pickerLabel}>Fan:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                    {subjects.map(s => (
                      <TouchableOpacity key={s.id} style={[styles.pickerChip, schedSubjectId === s.id && styles.pickerChipActive]} onPress={() => setSchedSubjectId(s.id)}>
                        <Text style={[styles.pickerChipText, schedSubjectId === s.id && styles.pickerChipTextActive]}>{s.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.pickerLabel}>O'qituvchi:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                    {teachers.map(t => (
                      <TouchableOpacity key={t.id} style={[styles.pickerChip, schedTeacherId === t.id && styles.pickerChipActive]} onPress={() => setSchedTeacherId(t.id)}>
                        <Text style={[styles.pickerChipText, schedTeacherId === t.id && styles.pickerChipTextActive]}>{t.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.pickerLabel}>Xona:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                    {rooms.map(r => (
                      <TouchableOpacity key={r.id} style={[styles.pickerChip, schedRoomId === r.id && styles.pickerChipActive]} onPress={() => setSchedRoomId(r.id)}>
                        <Text style={[styles.pickerChipText, schedRoomId === r.id && styles.pickerChipTextActive]}>{r.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TouchableOpacity style={styles.addItemBtn} onPress={addScheduleEntry}>
                    <Plus size={16} color={Colors.primary} />
                    <Text style={styles.addItemText}>Jadvalga qo'shish</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.quickActions}>
                  <TouchableOpacity style={styles.quickBtn} onPress={copyMonday}>
                    <Copy size={14} color={Colors.accentLight} />
                    <Text style={styles.quickBtnText}>Dushanba → Boshqa kunlar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickBtn} onPress={copyShift}>
                    <Copy size={14} color={Colors.accentLight} />
                    <Text style={styles.quickBtnText}>1-smena → 2-smena</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.scheduleListTitle}>
                  {DAY_NAMES[schedDay]}, {schedShift}-smena ({filteredSchedule.length} ta)
                </Text>
                {filteredSchedule.map(e => {
                  const cls = classes.find(c => c.id === e.classId);
                  const subj = subjects.find(s => s.id === e.subjectId);
                  const teach = teachers.find(t => t.id === e.teacherId);
                  const room = rooms.find(r => r.id === e.roomId);
                  return (
                    <View key={e.id} style={styles.listItem}>
                      <View style={styles.listItemInfo}>
                        <Text style={styles.listItemText}>
                          {e.lessonNumber}-dars · {cls?.name ?? '?'} · {subj?.name ?? '?'}
                        </Text>
                        <Text style={styles.listItemSub}>
                          {teach?.name ?? '?'} · Xona {room?.name ?? '?'}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => deleteScheduleEntry(e.id)}>
                        <Trash2 size={16} color={Colors.danger} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {openSection === 'backup' && sec.key === 'backup' && (
              <View style={styles.sectionBody}>
                <TouchableOpacity style={styles.backupBtn} onPress={handleExport}>
                  <Upload size={16} color={Colors.primary} />
                  <Text style={styles.backupBtnText}>Eksport qilish (JSON)</Text>
                </TouchableOpacity>
                <Text style={styles.pickerLabel}>Import (JSON matn):</Text>
                <TextInput
                  style={[styles.input, styles.importInput]}
                  value={importJson}
                  onChangeText={setImportJson}
                  placeholder='{"classes":...}'
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  numberOfLines={4}
                />
                <TouchableOpacity style={styles.backupBtn} onPress={handleImport}>
                  <Download size={16} color={Colors.primary} />
                  <Text style={styles.backupBtnText}>Import qilish</Text>
                </TouchableOpacity>
                <Text style={styles.pickerLabel}>Parolni o'zgartirish:</Text>
                <View style={styles.inlineForm}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Yangi parol"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry
                  />
                  <TouchableOpacity style={styles.inlineAddBtn} onPress={changePassword}>
                    <Lock size={16} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
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
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  lockIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  loginSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  pinInput: {
    width: '100%',
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    color: Colors.text,
    fontSize: 24,
    letterSpacing: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  loginBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  loginBtnText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '700' as const,
  },
  logoutBtn: {
    padding: 8,
    marginRight: 4,
  },
  sectionContainer: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionLabel: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600' as const,
  },
  badge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  sectionBody: {
    backgroundColor: Colors.cardBgElevated,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  inputSmall: {
    flex: 1,
  },
  inputTiny: {
    width: 50,
  },
  importInput: {
    height: 80,
    textAlignVertical: 'top' as const,
  },
  inlineForm: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  inlineAddBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    borderRadius: 10,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 10,
  },
  addItemText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600' as const,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  listItemInfo: {
    flex: 1,
    marginRight: 10,
  },
  listItemText: {
    fontSize: 14,
    color: Colors.text,
  },
  listItemSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  shiftLabel: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600' as const,
    marginTop: 10,
    marginBottom: 6,
  },
  shiftToggle: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shiftToggleActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  shiftToggleText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  dayScroll: {
    marginBottom: 10,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  dayChipText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  dayChipTextActive: {
    color: Colors.primary,
  },
  shiftRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  shiftBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  shiftBtnActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  shiftBtnText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  shiftBtnTextActive: {
    color: Colors.primary,
  },
  schedForm: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600' as const,
    marginBottom: 6,
    marginTop: 8,
  },
  pickerScroll: {
    marginBottom: 4,
  },
  pickerChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.background,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerChipActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  pickerChipText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  pickerChipTextActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.3)',
  },
  quickBtnText: {
    fontSize: 11,
    color: Colors.accentLight,
    fontWeight: '500' as const,
  },
  scheduleListTitle: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  backupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    borderRadius: 10,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 12,
  },
  backupBtnText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
