import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { lireTransactions, calculerSolde } from '../database/transactions';

const CAT_COLORS = {
  logement: "#C8956C", alimentation: "#F5C542", transport: "#00BFFF",
  loisirs: "#8A2BE2", sante: "#00FF88", vetements: "#FF69B4",
  education: "#007BFF", bienetre: "#9B8EC4", sport: "#FF6B35",
  animaux: "#7ED321", autre: "#E0E0E0", salaire: "#00FF88", freelance: "#00FFFF"
};

const CAT_LABELS = {
  logement: "Logement", alimentation: "Alimentation", transport: "Transport",
  loisirs: "Loisirs", sante: "Santé", vetements: "Vêtements",
  education: "Éducation", bienetre: "Bien-être", sport: "Sport",
  animaux: "Animaux", autre: "Autre", salaire: "Salaire", freelance: "Freelance"
};

export default function DashboardScreen() {
  const [stats, setStats] = useState({ total_revenus: 0, total_depenses: 0 });
  const [categoriesData, setCategoriesData] = useState([]);

  const loadData = async () => {
    const dataStats = await calculerSolde();
    setStats({
      total_revenus: dataStats.total_revenus || 0,
      total_depenses: dataStats.total_depenses || 0
    });

    const txs = await lireTransactions();
    const deps = txs.filter(t => t.type === 'depense');
    const catMap = {};
    deps.forEach(t => {
      catMap[t.categorie] = (catMap[t.categorie] || 0) + t.montant;
    });

    const catArray = Object.keys(catMap).map(key => ({
      id: key,
      label: CAT_LABELS[key] || key,
      color: CAT_COLORS[key] || "#E0E0E0",
      montant: catMap[key]
    })).sort((a, b) => b.montant - a.montant);

    setCategoriesData(catArray);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const solde = stats.total_revenus - stats.total_depenses;
  const isPositive = solde >= 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.cardsRow}>
        <View style={[styles.statCard, { borderColor: 'rgba(0,255,136,0.15)' }]}>
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(0,255,136,0.1)' }]}>
            <Text style={{ fontSize: 16 }}>📈</Text>
          </View>
          <Text style={styles.statLbl}>Revenus</Text>
          <Text style={[styles.statVal, { color: '#00FF88' }]}>{stats.total_revenus.toFixed(2)} €</Text>
        </View>
        <View style={[styles.statCard, { borderColor: 'rgba(255,20,147,0.15)' }]}>
          <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,20,147,0.1)' }]}>
            <Text style={{ fontSize: 16 }}>📉</Text>
          </View>
          <Text style={styles.statLbl}>Dépenses</Text>
          <Text style={[styles.statVal, { color: '#FF1493' }]}>{stats.total_depenses.toFixed(2)} €</Text>
        </View>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLbl}>SOLDE DU MOIS</Text>
        <Text style={[styles.balanceVal, { color: isPositive ? '#00FF88' : '#FF1493' }]}>
          {isPositive ? '+' : '-'}{Math.abs(solde).toFixed(2)} €
        </Text>
        <Text style={styles.balanceMsg}>
          {isPositive ? "✨ Vous économisez ce mois-ci" : "⚠️ Dépenses supérieures aux revenus"}
        </Text>
      </View>

      <TouchableOpacity style={styles.btnConseils} activeOpacity={0.8}>
        <Text style={styles.btnConseilsText}>🤖 Conseils IA</Text>
      </TouchableOpacity>

      {categoriesData.length > 0 && (
        <View style={styles.catCard}>
          <Text style={styles.catCardTitle}>Dépenses par catégorie</Text>
          {categoriesData.map((cat, index) => {
            const pct = Math.min((cat.montant / stats.total_depenses) * 100, 100);
            return (
              <View key={index} style={styles.catRow}>
                <View style={styles.catInfo}>
                  <View style={styles.catNameWrap}>
                    <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.catName}>{cat.label}</Text>
                  </View>
                  <Text style={[styles.catAmt, { color: cat.color }]}>{cat.montant.toFixed(2)} €</Text>
                </View>
                <View style={styles.progBg}>
                  <View style={[styles.progFill, { backgroundColor: cat.color, width: `${pct}%` }]} />
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { padding: 18, paddingBottom: 100 },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  statCard: {
    flex: 1, backgroundColor: '#1c1c1e', borderRadius: 22,
    padding: 16, borderWidth: 1, marginHorizontal: 4,
  },
  iconWrap: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statLbl: { fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: '600', marginBottom: 5 },
  statVal: { fontSize: 20, fontWeight: '800', letterSpacing: -1 },
  balanceCard: {
    backgroundColor: '#1c1c1e', borderColor: 'rgba(138,43,226,0.25)',
    borderWidth: 1, borderRadius: 26, paddingVertical: 26,
    paddingHorizontal: 20, marginBottom: 14, alignItems: 'center',
  },
  balanceLbl: { fontSize: 10, color: '#6b7280', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 10, fontWeight: '600' },
  balanceVal: { fontSize: 38, fontWeight: '800', letterSpacing: -2, marginBottom: 8 },
  balanceMsg: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  btnConseils: {
    backgroundColor: '#8A2BE2', padding: 15, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  btnConseilsText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  catCard: { backgroundColor: '#1c1c1e', borderRadius: 22, padding: 18, borderWidth: 1, borderColor: '#2a2a2a' },
  catCardTitle: { fontSize: 14, fontWeight: '700', color: '#ffffff', marginBottom: 16 },
  catRow: { marginBottom: 13 },
  catInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 },
  catNameWrap: { flexDirection: 'row', alignItems: 'center' },
  catDot: { width: 8, height: 8, borderRadius: 4, marginRight: 9 },
  catName: { fontSize: 13, fontWeight: '500', color: '#ffffff' },
  catAmt: { fontSize: 13, fontWeight: '700' },
  progBg: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 4, overflow: 'hidden' },
  progFill: { height: 4, borderRadius: 4 },
});
