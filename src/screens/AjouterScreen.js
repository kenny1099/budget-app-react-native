import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ajouterTransaction } from '../database/transactions';

const CATEGORIES_DEPENSES = [
  { id: 'logement', label: 'Logement', icon: '🏠', color: '#C8956C' },
  { id: 'alimentation', label: 'Alimentation', icon: '🍔', color: '#F5C542' },
  { id: 'transport', label: 'Transport', icon: '🚗', color: '#00BFFF' },
  { id: 'loisirs', label: 'Loisirs', icon: '🎮', color: '#8A2BE2' },
  { id: 'sante', label: 'Santé', icon: '⚕️', color: '#00FF88' },
  { id: 'autre', label: 'Autre', icon: '📦', color: '#E0E0E0' },
];

const CATEGORIES_REVENUS = [
  { id: 'salaire', label: 'Salaire', icon: '💰', color: '#00FF88' },
  { id: 'freelance', label: 'Freelance', icon: '💻', color: '#00FFFF' },
  { id: 'autre', label: 'Autre', icon: '📦', color: '#E0E0E0' },
];

export default function AjouterScreen({ navigation }) {
  const [type, setType] = useState('depense');
  const [categorie, setCategorie] = useState('alimentation');
  const [description, setDescription] = useState('');
  const [montant, setMontant] = useState('');

  const currentCategories = type === 'depense' ? CATEGORIES_DEPENSES : CATEGORIES_REVENUS;

  const handleAjouter = async () => {
    if (!description || !montant) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    const valMontant = parseFloat(montant);
    if (isNaN(valMontant) || valMontant <= 0) {
      Alert.alert('Erreur', 'Montant invalide.');
      return;
    }
    const date = new Date().toISOString().split('T')[0];
    try {
      await ajouterTransaction(description, valMontant, type, categorie, date);
      setDescription('');
      setMontant('');
      navigation.navigate('Dashboard');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder la transaction.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.typeToggle}>
        <TouchableOpacity
          style={[styles.btnType, type === 'depense' && styles.activeDep]}
          onPress={() => { setType('depense'); setCategorie('alimentation'); }}
        >
          <Text style={[styles.btnTypeText, type === 'depense' && { color: '#ffffff' }]}>Dépense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnType, type === 'revenu' && styles.activeRev]}
          onPress={() => { setType('revenu'); setCategorie('salaire'); }}
        >
          <Text style={[styles.btnTypeText, type === 'revenu' && { color: '#000000' }]}>Revenu</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#6b7280"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Montant"
        placeholderTextColor="#6b7280"
        keyboardType="numeric"
        value={montant}
        onChangeText={setMontant}
      />

      <View style={styles.catGrid}>
        {currentCategories.map((cat) => {
          const isActive = categorie === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.btnCat, isActive && { borderColor: cat.color + '55', backgroundColor: cat.color + '12' }]}
              onPress={() => setCategorie(cat.id)}
            >
              <View style={[styles.catIco, isActive && { backgroundColor: cat.color + '22' }]}>
                <Text style={{ fontSize: 16 }}>{cat.icon}</Text>
              </View>
              <Text style={[styles.catLabel, isActive && { color: cat.color }]}>{cat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.btnSubmit} onPress={handleAjouter}>
        <Text style={styles.btnSubmitText}>Ajouter ✓</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { padding: 18, paddingBottom: 100 },
  typeToggle: { flexDirection: 'row', backgroundColor: '#0d0d0d', borderRadius: 14, padding: 4, marginBottom: 16 },
  btnType: { flex: 1, padding: 11, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  activeDep: { backgroundColor: '#FF1493' },
  activeRev: { backgroundColor: '#00FF88' },
  btnTypeText: { fontWeight: '700', fontSize: 13, color: '#6b7280' },
  input: {
    backgroundColor: '#0d0d0d', borderWidth: 1, borderColor: '#2a2a2a',
    borderRadius: 13, padding: 15, color: '#ffffff', fontSize: 14, marginBottom: 12,
  },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  btnCat: {
    width: '31%', paddingVertical: 11, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#2a2a2a',
    backgroundColor: '#0d0d0d', alignItems: 'center', marginBottom: 10,
  },
  catIco: {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  catLabel: { fontSize: 10, fontWeight: '700', color: '#6b7280' },
  btnSubmit: { backgroundColor: '#8A2BE2', padding: 16, borderRadius: 18, alignItems: 'center', marginTop: 10 },
  btnSubmitText: { color: '#ffffff', fontWeight: '800', fontSize: 16 },
});
