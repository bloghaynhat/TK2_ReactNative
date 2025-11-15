import { addItem, deleteItem, getAllItems, toggleItemBought, updateItem, type GroceryItem } from "@/service/db";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Index() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [nameError, setNameError] = useState('');
  
  // Edit Modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState('1');
  const [editItemCategory, setEditItemCategory] = useState('');
  const [editNameError, setEditNameError] = useState('');

  const loadData = () => {
    // Lấy tất cả items từ database
    const allItems = getAllItems();
    setItems(allItems);
    console.log(`📱 Loaded ${allItems.length} items from database`);
  };

  // Filter items based on search query using useMemo for performance
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }, []);

  const handleAddItem = () => {
    // Validate name
    if (!newItemName.trim()) {
      setNameError('Tên món không được để trống!');
      Alert.alert('Lỗi', 'Vui lòng nhập tên món cần mua!');
      return;
    }

    // Parse quantity
    const quantity = parseInt(newItemQuantity) || 1;

    // Add to database
    const success = addItem(newItemName.trim(), quantity, newItemCategory.trim());

    if (success) {
      // Reset form
      setNewItemName('');
      setNewItemQuantity('1');
      setNewItemCategory('');
      setNameError('');
      
      // Close modal
      setModalVisible(false);
      
      // Reload data
      loadData();
      
      Alert.alert('Thành công', `Đã thêm "${newItemName}" vào danh sách!`);
    } else {
      Alert.alert('Lỗi', 'Không thể thêm món mới. Vui lòng thử lại!');
    }
  };

  const handleOpenModal = () => {
    setNewItemName('');
    setNewItemQuantity('1');
    setNewItemCategory('');
    setNameError('');
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNameError('');
  };

  const handleToggleBought = (id: number, name: string, currentBought: number) => {
    const success = toggleItemBought(id);
    if (success) {
      // Cập nhật state ngay lập tức để UI mượt mà
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, bought: item.bought === 0 ? 1 : 0 } : item
        )
      );
      console.log(`🔄 Toggle ${name}: ${currentBought === 0 ? 'Chưa mua → Đã mua' : 'Đã mua → Chưa mua'}`);
    }
  };

  const handleOpenEditModal = (item: GroceryItem) => {
    setEditingItem(item);
    setEditItemName(item.name);
    setEditItemQuantity(item.quantity.toString());
    setEditItemCategory(item.category || '');
    setEditNameError('');
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setEditingItem(null);
    setEditNameError('');
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    // Validate name
    if (!editItemName.trim()) {
      setEditNameError('Tên món không được để trống!');
      Alert.alert('Lỗi', 'Vui lòng nhập tên món cần mua!');
      return;
    }

    // Parse quantity
    const quantity = parseInt(editItemQuantity) || 1;

    // Update in database
    const success = updateItem(editingItem.id, editItemName.trim(), quantity, editItemCategory.trim());

    if (success) {
      // Reset form
      setEditItemName('');
      setEditItemQuantity('1');
      setEditItemCategory('');
      setEditNameError('');
      setEditingItem(null);
      
      // Close modal
      setEditModalVisible(false);
      
      // Reload data
      loadData();
      
      Alert.alert('Thành công', `Đã cập nhật "${editItemName}"!`);
    } else {
      Alert.alert('Lỗi', 'Không thể cập nhật món. Vui lòng thử lại!');
    }
  };

  const handleDeleteItem = (id: number, name: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa "${name}" không?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            const success = deleteItem(id);
            if (success) {
              // Reload data
              loadData();
              Alert.alert('Thành công', `Đã xóa "${name}"!`);
            } else {
              Alert.alert('Lỗi', 'Không thể xóa món. Vui lòng thử lại!');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  // Component render cho mỗi item
  const renderItem = ({ item }: { item: GroceryItem }) => (
    <TouchableOpacity 
      style={[styles.itemCard, item.bought ? styles.itemCardBought : null]}
      onPress={() => handleToggleBought(item.id, item.name, item.bought)}
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
              handleOpenEditModal(item);
            }}
          >
            <Text style={styles.editButtonText}>✏️ Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteItem(item.id, item.name);
            }}
          >
            <Text style={styles.deleteButtonText}>🗑️ Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
      <Text style={styles.subtitle}>Câu 8: Tìm kiếm/Filter real-time</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên hoặc loại..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results Counter */}
      {searchQuery.length > 0 && (
        <Text style={styles.searchResultText}>
          Tìm thấy {filteredItems.length} kết quả
        </Text>
      )}

      <Text style={styles.itemCount}>
        {filteredItems.length > 0 ? `Có ${filteredItems.length} món` : 'Chưa có món nào'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{searchQuery ? '🔍' : '🛒'}</Text>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Không tìm thấy kết quả' : 'Danh sách trống'}
            </Text>
            <Text style={styles.emptyMessage}>
              {searchQuery ? `Không có món nào chứa "${searchQuery}"` : 'Thêm món cần mua nhé!'}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={handleOpenModal}
        activeOpacity={0.8}
      >
        <Text style={styles.fabButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>➕ Thêm món mới</Text>
                <TouchableOpacity onPress={handleCloseModal}>
                  <Text style={styles.closeButton}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tên món <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, nameError ? styles.inputError : null]}
                  placeholder="Ví dụ: Sữa, Trứng, Bánh mì..."
                  value={newItemName}
                  onChangeText={(text) => {
                    setNewItemName(text);
                    if (nameError) setNameError('');
                  }}
                  autoFocus
                />
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Số lượng</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  value={newItemQuantity}
                  onChangeText={setNewItemQuantity}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Danh mục (tùy chọn)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: Thực phẩm, Đồ uống..."
                  value={newItemCategory}
                  onChangeText={setNewItemCategory}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleAddItem}
                >
                  <Text style={styles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={handleCloseEditModal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>✏️ Sửa món</Text>
                <TouchableOpacity onPress={handleCloseEditModal}>
                  <Text style={styles.closeButton}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tên món <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, editNameError ? styles.inputError : null]}
                  placeholder="Ví dụ: Sữa, Trứng, Bánh mì..."
                  value={editItemName}
                  onChangeText={(text) => {
                    setEditItemName(text);
                    if (editNameError) setEditNameError('');
                  }}
                  autoFocus
                />
                {editNameError ? <Text style={styles.errorText}>{editNameError}</Text> : null}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Số lượng</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  value={editItemQuantity}
                  onChangeText={setEditItemQuantity}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Danh mục (tùy chọn)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ví dụ: Thực phẩm, Đồ uống..."
                  value={editItemCategory}
                  onChangeText={setEditItemCategory}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCloseEditModal}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdateItem}
                >
                  <Text style={styles.saveButtonText}>Cập nhật</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  // Search Bar Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold',
  },
  searchResultText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
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
  // Floating Action Button
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabButtonText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 36,
    color: '#999',
    fontWeight: '300',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
