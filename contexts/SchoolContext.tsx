import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import {
  SchoolClass, Teacher, Subject, Room, LessonTime,
  ScheduleEntry, Holiday, BellSettings, SchoolData,
  CurrentLessonInfo, DAY_NAMES,
} from '@/types/school';
import {
  DEFAULT_CLASSES, DEFAULT_TEACHERS, DEFAULT_SUBJECTS, DEFAULT_ROOMS,
  DEFAULT_LESSON_TIMES, DEFAULT_SCHEDULE, DEFAULT_BELL_SETTINGS, DEFAULT_ADMIN_PASSWORD,
} from '@/constants/defaults';

const STORAGE_KEY = 'school_data_v1';

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export const [SchoolProvider, useSchool] = createContextHook(() => {
  const queryClient = useQueryClient();

  const [classes, setClasses] = useState<SchoolClass[]>(DEFAULT_CLASSES);
  const [teachers, setTeachers] = useState<Teacher[]>(DEFAULT_TEACHERS);
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);
  const [lessonTimes, setLessonTimes] = useState<LessonTime[]>(DEFAULT_LESSON_TIMES);
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(DEFAULT_SCHEDULE);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [bellSettings, setBellSettings] = useState<BellSettings>(DEFAULT_BELL_SETTINGS);
  const [adminPassword, setAdminPassword] = useState<string>(DEFAULT_ADMIN_PASSWORD);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const dataQuery = useQuery({
    queryKey: ['school-data'],
    queryFn: async (): Promise<SchoolData | null> => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          return JSON.parse(raw) as SchoolData;
        }
      } catch (e) {
        console.log('Failed to load school data:', e);
      }
      return null;
    },
  });

  useEffect(() => {
    if (dataQuery.data && !dataLoaded) {
      const d = dataQuery.data;
      setClasses(d.classes);
      setTeachers(d.teachers);
      setSubjects(d.subjects);
      setRooms(d.rooms);
      setLessonTimes(d.lessonTimes);
      setSchedule(d.schedule);
      setHolidays(d.holidays);
      setBellSettings(d.bellSettings);
      setAdminPassword(d.adminPassword);
      setDataLoaded(true);
      console.log('School data loaded from storage');
    } else if (dataQuery.data === null && !dataLoaded) {
      setDataLoaded(true);
      console.log('No saved data, using defaults');
    }
  }, [dataQuery.data, dataLoaded]);

  const saveMutation = useMutation({
    mutationFn: async (data: SchoolData) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-data'] });
    },
  });

  const persistData = useCallback((overrides?: Partial<SchoolData>) => {
    const data: SchoolData = {
      classes: overrides?.classes ?? classes,
      teachers: overrides?.teachers ?? teachers,
      subjects: overrides?.subjects ?? subjects,
      rooms: overrides?.rooms ?? rooms,
      lessonTimes: overrides?.lessonTimes ?? lessonTimes,
      schedule: overrides?.schedule ?? schedule,
      holidays: overrides?.holidays ?? holidays,
      bellSettings: overrides?.bellSettings ?? bellSettings,
      adminPassword: overrides?.adminPassword ?? adminPassword,
    };
    saveMutation.mutate(data);
  }, [classes, teachers, subjects, rooms, lessonTimes, schedule, holidays, bellSettings, adminPassword, saveMutation]);

  const updateClasses = useCallback((newClasses: SchoolClass[]) => {
    setClasses(newClasses);
    persistData({ classes: newClasses });
  }, [persistData]);

  const updateTeachers = useCallback((newTeachers: Teacher[]) => {
    setTeachers(newTeachers);
    persistData({ teachers: newTeachers });
  }, [persistData]);

  const updateSubjects = useCallback((newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    persistData({ subjects: newSubjects });
  }, [persistData]);

  const updateRooms = useCallback((newRooms: Room[]) => {
    setRooms(newRooms);
    persistData({ rooms: newRooms });
  }, [persistData]);

  const updateLessonTimes = useCallback((newTimes: LessonTime[]) => {
    setLessonTimes(newTimes);
    persistData({ lessonTimes: newTimes });
  }, [persistData]);

  const updateSchedule = useCallback((newSchedule: ScheduleEntry[]) => {
    setSchedule(newSchedule);
    persistData({ schedule: newSchedule });
  }, [persistData]);

  const updateHolidays = useCallback((newHolidays: Holiday[]) => {
    setHolidays(newHolidays);
    persistData({ holidays: newHolidays });
  }, [persistData]);

  const updateBellSettings = useCallback((newSettings: BellSettings) => {
    setBellSettings(newSettings);
    persistData({ bellSettings: newSettings });
  }, [persistData]);

  const updateAdminPassword = useCallback((newPass: string) => {
    setAdminPassword(newPass);
    persistData({ adminPassword: newPass });
  }, [persistData]);

  const verifyPassword = useCallback((pin: string) => {
    if (pin === adminPassword) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, [adminPassword]);

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
  }, []);

  const getCurrentDayIndex = useCallback((): number => {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  }, []);

  const getShiftByTime = useCallback((): number => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const shift2Times = lessonTimes.filter(lt => lt.shift === 2);
    if (shift2Times.length > 0) {
      const shift2Start = timeToMinutes(shift2Times[0].startTime);
      if (currentMinutes >= shift2Start) return 2;
    }
    return 1;
  }, [lessonTimes]);

  const getCurrentLessonInfo = useCallback((shift: number): CurrentLessonInfo => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();
    const totalCurrentSeconds = currentMinutes * 60 + currentSeconds;

    const shiftTimes = lessonTimes
      .filter(lt => lt.shift === shift)
      .sort((a, b) => a.lessonNumber - b.lessonNumber);

    if (shiftTimes.length === 0) {
      return { type: 'before', remainingMinutes: 0, remainingSeconds: 0, shift };
    }

    const firstStart = timeToMinutes(shiftTimes[0].startTime);
    const lastEnd = timeToMinutes(shiftTimes[shiftTimes.length - 1].endTime);

    if (currentMinutes < firstStart) {
      const remaining = firstStart * 60 - totalCurrentSeconds;
      return {
        type: 'before',
        remainingMinutes: Math.floor(remaining / 60),
        remainingSeconds: remaining % 60,
        shift,
      };
    }

    if (currentMinutes >= lastEnd) {
      return { type: 'after', remainingMinutes: 0, remainingSeconds: 0, shift };
    }

    for (let i = 0; i < shiftTimes.length; i++) {
      const lt = shiftTimes[i];
      const start = timeToMinutes(lt.startTime) * 60;
      const end = timeToMinutes(lt.endTime) * 60;

      if (totalCurrentSeconds >= start && totalCurrentSeconds < end) {
        const remaining = end - totalCurrentSeconds;
        return {
          type: 'lesson',
          lessonNumber: lt.lessonNumber,
          remainingMinutes: Math.floor(remaining / 60),
          remainingSeconds: remaining % 60,
          shift,
        };
      }

      if (i < shiftTimes.length - 1) {
        const nextStart = timeToMinutes(shiftTimes[i + 1].startTime) * 60;
        if (totalCurrentSeconds >= end && totalCurrentSeconds < nextStart) {
          const remaining = nextStart - totalCurrentSeconds;
          return {
            type: 'break',
            lessonNumber: lt.lessonNumber,
            remainingMinutes: Math.floor(remaining / 60),
            remainingSeconds: remaining % 60,
            shift,
          };
        }
      }
    }

    return { type: 'after', remainingMinutes: 0, remainingSeconds: 0, shift };
  }, [lessonTimes]);

  const isHolidayToday = useCallback((): Holiday | null => {
    const today = new Date().toISOString().split('T')[0];
    return holidays.find(h => h.date === today) ?? null;
  }, [holidays]);

  const getScheduleForDayShift = useCallback((dayIndex: number, shift: number): ScheduleEntry[] => {
    return schedule.filter(s => s.dayIndex === dayIndex && s.shift === shift);
  }, [schedule]);

  const getClassName = useCallback((id: string): string => {
    return classes.find(c => c.id === id)?.name ?? '';
  }, [classes]);

  const getTeacherName = useCallback((id: string): string => {
    return teachers.find(t => t.id === id)?.name ?? '';
  }, [teachers]);

  const getSubjectName = useCallback((id: string): string => {
    return subjects.find(s => s.id === id)?.name ?? '';
  }, [subjects]);

  const getRoomName = useCallback((id: string): string => {
    return rooms.find(r => r.id === id)?.name ?? '';
  }, [rooms]);

  const exportData = useCallback((): string => {
    const data: SchoolData = {
      classes, teachers, subjects, rooms, lessonTimes, schedule, holidays, bellSettings, adminPassword,
    };
    return JSON.stringify(data, null, 2);
  }, [classes, teachers, subjects, rooms, lessonTimes, schedule, holidays, bellSettings, adminPassword]);

  const importData = useCallback((json: string): boolean => {
    try {
      const data = JSON.parse(json) as SchoolData;
      setClasses(data.classes);
      setTeachers(data.teachers);
      setSubjects(data.subjects);
      setRooms(data.rooms);
      setLessonTimes(data.lessonTimes);
      setSchedule(data.schedule);
      setHolidays(data.holidays);
      setBellSettings(data.bellSettings);
      setAdminPassword(data.adminPassword);
      persistData(data);
      return true;
    } catch {
      console.log('Failed to import data');
      return false;
    }
  }, [persistData]);

  return {
    classes, teachers, subjects, rooms, lessonTimes, schedule, holidays,
    bellSettings, adminPassword, isAdmin, dataLoaded,
    updateClasses, updateTeachers, updateSubjects, updateRooms,
    updateLessonTimes, updateSchedule, updateHolidays,
    updateBellSettings, updateAdminPassword,
    verifyPassword, logoutAdmin,
    getCurrentDayIndex, getShiftByTime, getCurrentLessonInfo,
    isHolidayToday, getScheduleForDayShift,
    getClassName, getTeacherName, getSubjectName, getRoomName,
    exportData, importData,
  };
});
