import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import ClockDisplay from '@/components/ClockDisplay';
import CurrentStatus from '@/components/CurrentStatus';
import ClassGrid from '@/components/ClassGrid';
import BottomBar from '@/components/BottomBar';
import Colors from '@/constants/colors';

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ClockDisplay />
        <CurrentStatus />
        <ClassGrid />
      </ScrollView>
      <BottomBar />
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
  scrollContent: {
    paddingBottom: 100,
  },
});
