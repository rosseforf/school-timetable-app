export interface SchoolClass {
  id: string;
  name: string;
  grade: number;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  phone?: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface LessonTime {
  id: string;
  lessonNumber: number;
  startTime: string;
  endTime: string;
  shift: number;
}

export interface ScheduleEntry {
  id: string;
  dayIndex: number;
  shift: number;
  lessonNumber: number;
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId: string;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  type: 'bayram' | 'dam_olish';
}

export interface BellSettings {
  enabled: boolean;
  volume: number;
  vibration: boolean;
  preWarning: number;
  breakBell: boolean;
  paused: boolean;
}

export interface SchoolData {
  classes: SchoolClass[];
  teachers: Teacher[];
  subjects: Subject[];
  rooms: Room[];
  lessonTimes: LessonTime[];
  schedule: ScheduleEntry[];
  holidays: Holiday[];
  bellSettings: BellSettings;
  adminPassword: string;
}

export type DayName = 'Dushanba' | 'Seshanba' | 'Chorshanba' | 'Payshanba' | 'Juma' | 'Shanba';

export const DAY_NAMES: DayName[] = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

export interface CurrentLessonInfo {
  type: 'lesson' | 'break' | 'before' | 'after';
  lessonNumber?: number;
  remainingMinutes: number;
  remainingSeconds: number;
  shift: number;
}
