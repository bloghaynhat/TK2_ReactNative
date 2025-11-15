import { checkConnection } from "@/service/db";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [dbStatus, setDbStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Kiểm tra kết nối database
    const isConnected = checkConnection();
    if (isConnected) {
      setDbStatus('✅ Database connected successfully!');
    } else {
      setDbStatus('❌ Database connection faileds');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Grocery App</Text>
      <Text style={styles.subtitle}>Câu 1: Khởi tạo & cấu hình dự án</Text>
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{dbStatus}</Text>
      </View>
      <Text style={styles.info}>Database: groceries.db</Text>
      <Text style={styles.info}>Table: grocery_items</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  statusBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});
