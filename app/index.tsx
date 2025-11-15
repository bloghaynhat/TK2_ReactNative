import { getAllItems, type GroceryItem } from "@/service/db";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    // Lấy tất cả items từ database
    const allItems = getAllItems();
    setItems(allItems);
    console.log(`📱 Loaded ${allItems.length} items from database`);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Component render cho mỗi item
  const renderItem = ({ item }: { item: GroceryItem }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={[styles.statusBadge, item.bought ? styles.boughtBadge : styles.notBoughtBadge]}>
          <Text style={styles.statusText}>
            {item.bought ? '✅ Đã mua' : '⬜ Chưa mua'}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Số lượng:</Text>
          <Text style={styles.detailValue}>{item.quantity}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Danh mục:</Text>
          <Text style={styles.detailValue}>{item.category || 'Chưa phân loại'}</Text>
        </View>
      </View>
    </View>
  );

  // Empty state component
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Danh sách trống</Text>
      <Text style={styles.emptyMessage}>Thêm món cần mua nhé!</Text>
    </View>
  );

  // Header component
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>🛒 Grocery App</Text>
      <Text style={styles.subtitle}>Câu 3: Màn hình danh sách</Text>
      <Text style={styles.itemCount}>
        {items.length > 0 ? `Có ${items.length} món cần mua` : 'Chưa có món nào'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  itemCount: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    marginTop: 5,
  },
  // Item Card Styles
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  boughtBadge: {
    backgroundColor: '#E8F5E9',
  },
  notBoughtBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  // Empty State Styles
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
