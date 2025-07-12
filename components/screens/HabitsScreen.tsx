import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import ProfileIcon from '../ProfileIcon';

interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  completedToday: boolean;
}

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Morning Meditation', emoji: '🧘', streak: 7, completedToday: true },
    { id: '2', name: 'Read for 30 minutes', emoji: '📚', streak: 3, completedToday: false },
    { id: '3', name: 'Exercise', emoji: '💪', streak: 12, completedToday: true },
    { id: '4', name: 'Drink 8 glasses of water', emoji: '💧', streak: 5, completedToday: false },
    { id: '5', name: 'Practice gratitude', emoji: '🙏', streak: 2, completedToday: false },
  ]);

  const toggleHabit = (habitId: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const newCompletedToday = !habit.completedToday;
          return {
            ...habit,
            completedToday: newCompletedToday,
            streak: newCompletedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1)
          };
        }
        return habit;
      })
    );
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;

  return (
    <View style={styles.container}>
      <ProfileIcon />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Habits</Text>
          <Text style={styles.subtitle}>Build better routines, one day at a time</Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <View style={styles.progressStats}>
              <Text style={styles.progressNumber}>{completedToday}/{totalHabits}</Text>
              <Text style={styles.progressLabel}>Habits Completed</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(completedToday / totalHabits) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        <View style={styles.habitsSection}>
          <Text style={styles.sectionTitle}>Your Habits</Text>
          
          {habits.map((habit) => (
            <TouchableOpacity 
              key={habit.id}
              style={[
                styles.habitItem,
                habit.completedToday && styles.habitCompleted
              ]}
              onPress={() => toggleHabit(habit.id)}
            >
              <View style={styles.habitLeft}>
                <View style={[
                  styles.checkbox,
                  habit.completedToday && styles.checkboxCompleted
                ]}>
                  {habit.completedToday && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.habitEmoji}>{habit.emoji}</Text>
                <View style={styles.habitTextContainer}>
                  <Text style={[
                    styles.habitName,
                    habit.completedToday && styles.habitNameCompleted
                  ]}>
                    {habit.name}
                  </Text>
                  <Text style={styles.streakText}>
                    🔥 {habit.streak} day streak
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add New Habit</Text>
        </TouchableOpacity>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Total Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>85%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2332',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  progressSection: {
    marginBottom: 30,
  },
  progressCard: {
    backgroundColor: '#2a3642',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3a4652',
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00ccff',
    marginBottom: 15,
  },
  progressStats: {
    alignItems: 'center',
    marginBottom: 15,
  },
  progressNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  progressLabel: {
    fontSize: 14,
    color: '#888',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#3a4652',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ccff',
    borderRadius: 4,
  },
  habitsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00ccff',
    marginBottom: 15,
  },
  habitItem: {
    backgroundColor: '#2a3642',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#3a4652',
  },
  habitCompleted: {
    backgroundColor: '#1a3a2a',
    borderColor: '#2a5a3a',
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3a4652',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  checkboxCompleted: {
    backgroundColor: '#00ccff',
    borderColor: '#00ccff',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  habitTextContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  habitNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  streakText: {
    fontSize: 14,
    color: '#ff6600',
  },
  addButton: {
    backgroundColor: '#00aaff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2a3642',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a4652',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ccff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});