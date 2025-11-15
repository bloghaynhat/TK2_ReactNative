import type { GroceryItem as GroceryItemType } from '@/service/db';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GroceryItemProps {
  item: GroceryItemType;
  onToggleBought: (id: number, name: string, bought: number) => void;
  onEdit: (item: GroceryItemType) => void;
  onDelete: (id: number, name: string) => void;
}

export const GroceryItem = ({ item, onToggleBought, onEdit, onDelete }: GroceryItemProps) => {
  return (
    <TouchableOpacity 
      style={[styles.itemCard, item.bought ? styles.itemCardBought : null]}
      onPress={() => onToggleBought(item.id, item.name, item.bought)}
      activeOpacity={0.7}
    >
      <View style={styles.itemHeader}>
        <Text style={[
          styles.itemName, 
          item.bought ? styles.itemNameBought : null
        ]}>
          {item.bought ? '✅ ' : ''}{item.name}
        </Text>
        <View style={[styles.statusBadge, item.bought ? styles.boughtBadge : styles.notBoughtBadge]}>
          <Text style={styles.statusText}>
            {item.bought ? 'Đã mua' : 'Chưa mua'}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Số lượng:</Text>
          <Text style={[styles.detailValue, item.bought ? styles.textMuted : null]}>{item.quantity}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Danh mục:</Text>
          <Text style={[styles.detailValue, item.bought ? styles.textMuted : null]}>
            {item.category || 'Chưa phân loại'}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemActions}>
        <Text style={styles.tapHint}>👆 Chạm để đánh dấu</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
          >
            <Text style={styles.editButtonText}>✏️ Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(item.id, item.name);
            }}
          >
            <Text style={styles.deleteButtonText}>🗑️ Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  itemCardBought: {
    backgroundColor: '#f0f0f0',
    opacity: 0.8,
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
  itemNameBought: {
    textDecorationLine: 'line-through',
    color: '#999',
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
    gap: 20,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  textMuted: {
    color: '#999',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  tapHint: {
    fontSize: 11,
    color: '#bbb',
    fontStyle: 'italic',
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
