import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ProfileIcon from '../ProfileIcon';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ProfileIcon />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.nameText}>User Profile</Text>
          <Text style={styles.emailText}>user@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>✏️</Text>
            <Text style={styles.settingText}>Edit Profile</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingText}>Notifications</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🔒</Text>
            <Text style={styles.settingText}>Privacy & Security</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Assistant</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🎤</Text>
            <Text style={styles.settingText}>Voice Settings</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🧠</Text>
            <Text style={styles.settingText}>AI Preferences</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>📝</Text>
            <Text style={styles.settingText}>Conversation History</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>❓</Text>
            <Text style={styles.settingText}>Help & FAQ</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>📧</Text>
            <Text style={styles.settingText}>Contact Support</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>ℹ️</Text>
            <Text style={styles.settingText}>About</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
    marginBottom: 40,
    marginTop: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2a3642',
    borderWidth: 2,
    borderColor: '#00ccff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
    color: '#00ccff',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: '#888',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00ccff',
    marginBottom: 15,
    marginLeft: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a3642',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#3a4652',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 20,
    color: '#666',
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});