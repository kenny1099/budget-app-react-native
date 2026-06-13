import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { lireTransactions, supprimerTransaction } from '../database/transactions';

const CAT_COLORS = {
  logement: "#C8956C", alimentation: "#F5C542", transport: "#00BFFF",
  loisirs: "#8A2BE2", sante: "#00FF88", vetements: "#FF69B4",
  education: "#007BFF", bienetre: "#9B8EC4", sport: "#FF6B35",
  animaux: "#7ED321", autre: "#E0E0E0", salaire: "#00FF88", freelance: "#00FFFF"
};

const CAT_ICONS = {
  logement: "🏠", alimentation: "🍔", transport: "🚗",
  loisirs: "🎮", sante: "⚕️", vetements: "👕",
  education: "📚", bienetre: "🧘", sport: "⚽",
  animaux: "🐾", autre: "📦", salaire: "💰", freelance: "💻"
};

const CAT_LABELS = {
  logement: "Logement", alimentation: "Alimentation", transport: "Transport",
  loisirs: "Loisirs", sante: "Santé", vetements: "Vêtements",
  education: "Éducation", bienetre: "Bien-être", sport: "Sport",
  animaux: "Animaux", autre: "Autre", salaire: "Salaire", freelance: "Freelance"
};

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState([]);

  const loadData = async () => {
    const data = await lireTransactions();
    setTransactions(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleDelete = async (id) => {
    await supprimerTransaction(id);
    loadData();
  };

  const renderItem = ({ item }) => {
    const color = CAT_COLORS[item.categorie] || "#E0E0E0";
    const icon = CAT_ICONS[item.categorie] || "📌";
    const label = CAT_LABELS[item.categorie] || item.categorie;
    const isRevenu = item.type === 'revenu';

    return (
      <View style={styles.txItem}>
        <View style={[styles.txIcon, { backgroundColor: color + '18', borderColor: color + '30' }]}>
          <Text style={{ fontSize: 20 }}>{icon}</Text>
        </View>
        <View style={styles.txInfo}>
          <Text style={styles.txName}>{item.description}</Text>
          <Text style={styles.txMeta}>{label} · {item.date}</Text>
        </View>
        <Text style={[styles.txAmt, { color: isRevenu ? '#00FF88' : '#FF1493' }]}>
          {isRevenu ? '+' : '−'}{item.montant.toFixed(2)} €
        </Text>
        <TouchableOpacity style={styles.txDel} onPress={() => handleDelete(item.id)}>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLbl}>TOUTES LES TRANSACTIONS ({transactions.length})</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 18 },
  sectionLbl: { fontSize: 10, color: '#6b7280', letterSpacing: 2, textTransform: 'uppercase', fontWeight: '700', marginBottom: 14 },
  listContent: { paddingBottom: 100 },
  txItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1c1c1e', borderRadius: 20,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  txIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  txInfo: { flex: 1, marginLeft: 14 },
  txName: { fontSize: 15, fontWeight: '600', color: '#ffffff', marginBottom: 3 },
  txMeta: { fontSize: 11, color: '#6b7280', fontWeight: '500' },
  txAmt: { fontSize: 15, fontWeight: '800', marginRight: 10 },
  txDel: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: '#2a2a2a',
    alignItems: 'center', justifyContent: 'center',
  },
});
