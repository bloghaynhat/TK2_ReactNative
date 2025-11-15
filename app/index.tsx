import { checkConnection, getAllItems, getItemCount, type GroceryItem } from "@/service/db";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [dbStatus, setDbStatus] = useState<string>('Checking...');
  const [itemCount, setItemCount] = useState<number>(0);
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    // Kiểm tra kết nối database
    const isConnected = checkConnection();
    if (isConnected) {
      setDbStatus('✅ Database connected successfully!');
      
      // Đếm số lượng items
      const count = getItemCount();
      setItemCount(count);

      // Lấy tất cả items
      const allItems = getAllItems();
      setItems(allItems);
    } else {
      setDbStatus('❌ Database connection failed');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView 
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>🛒 Grocery App</Text>
        <Text style={styles.subtitle}>Câu 2: Tạo bảng và seed dữ liệu mẫu</Text>
        
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{dbStatus}</Text>
        </View>
        
        <Text style={styles.info}>Database: groceries.db</Text>
        <Text style={styles.info}>Table: grocery_items</Text>
        <Text style={styles.infoHighlight}>📊 Số lượng items: {itemCount}</Text>
        {itemCount > 0 && (
          <Text style={styles.successText}>✅ Dữ liệu mẫu đã được seed!</Text>
        )}

        {/* Bảng hiển thị dữ liệu */}
        {items.length > 0 && (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>📋 Danh sách Grocery Items:</Text>
            
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colId]}>ID</Text>
              <Text style={[styles.tableHeaderText, styles.colName]}>Tên</Text>
              <Text style={[styles.tableHeaderText, styles.colQty]}>SL</Text>
              <Text style={[styles.tableHeaderText, styles.colCategory]}>Danh mục</Text>
              <Text style={[styles.tableHeaderText, styles.colStatus]}>Trạng thái</Text>
            </View>

            {/* Table Rows */}
            {items.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                ]}
              >
                <Text style={[styles.tableCell, styles.colId]}>{item.id}</Text>
                <Text style={[styles.tableCell, styles.colName]}>{item.name}</Text>
                <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.colCategory]}>{item.category}</Text>
                <Text style={[styles.tableCell, styles.colStatus]}>
                  {item.bought ? '✅' : '⬜'}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.pullToRefresh}>⬇️ Kéo xuống để refresh</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
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
  infoHighlight: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 10,
  },
  successText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 10,
    fontWeight: '600',
  },
  tableContainer: {
    width: '100%',
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  tableHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableRowEven: {
    backgroundColor: '#f9f9f9',
  },
  tableRowOdd: {
    backgroundColor: 'white',
  },
  tableCell: {
    fontSize: 12,
    color: '#333',
  },
  colId: {
    width: '10%',
    textAlign: 'center',
  },
  colName: {
    width: '25%',
  },
  colQty: {
    width: '15%',
    textAlign: 'center',
  },
  colCategory: {
    width: '30%',
  },
  colStatus: {
    width: '20%',
    textAlign: 'center',
  },
  pullToRefresh: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
