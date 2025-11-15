import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
  searchQuery: string;
}

export const EmptyState = ({ searchQuery }: EmptyStateProps) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Text style={styles.emptyIcon}>{searchQuery ? '🔍' : '🛒'}</Text>
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'Không tìm thấy kết quả' : 'Danh sách trống'}
      </Text>
      <Text style={styles.emptyMessage}>
        {searchQuery 
          ? `Không có món nào khớp với "${searchQuery}"`
          : 'Hãy bắt đầu bằng cách thêm món cần mua nhé!'}
      </Text>
      {!searchQuery && (
        <Text style={styles.emptyHint}>
          👆 Bấm nút + ở góc dưới cùng để thêm món mới
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
