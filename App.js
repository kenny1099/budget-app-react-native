import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { initDatabase } from './src/database/db';

import DashboardScreen from './src/screens/DashboardScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import AjouterScreen from './src/screens/AjouterScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    initDatabase().catch(err => console.error('Erreur DB :', err));
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#8A2BE2',
          tabBarInactiveTintColor: '#6b7280',
          headerStyle: styles.header,
          headerTintColor: '#ffffff',
          headerTitleStyle: styles.headerTitle,
          sceneContainerStyle: { backgroundColor: '#121212' },
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            title: 'Budget+',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📊</Text>,
          }}
        />
        <Tab.Screen
          name="Ajouter"
          component={AjouterScreen}
          options={{
            title: 'Nouvelle Transaction',
            tabBarLabel: () => null,
            tabBarIcon: () => (
              <View style={styles.fabWrap}>
                <View style={styles.fab}>
                  <Text style={styles.fabText}>+</Text>
                </View>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{
            title: 'Historique',
            tabBarLabel: 'Txns',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>💳</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 68,
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    borderRadius: 34,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    elevation: 10,
    borderTopWidth: 0,
  },
  header: {
    backgroundColor: '#1c1c1e',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  headerTitle: { fontWeight: '800', fontSize: 22 },
  tabBarLabel: {
    fontSize: 9, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
  },
  fabWrap: { top: -15, justifyContent: 'center', alignItems: 'center' },
  fab: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: '#8A2BE2', borderWidth: 3, borderColor: '#121212',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#8A2BE2', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  fabText: { color: '#ffffff', fontSize: 26, fontWeight: '300', lineHeight: 28 },
});
