import { AddItemModal } from "@/components/AddItemModal";
import { EditItemModal } from "@/components/EditItemModal";
import { EmptyState } from "@/components/EmptyState";
import { GroceryItem } from "@/components/GroceryItem";
import { ListHeader } from "@/components/ListHeader";
import { useGroceryItems } from "@/hooks/useGroceryItems";
import type { GroceryItem as GroceryItemType } from "@/service/db";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  // Use custom hook for grocery items logic
  const {
    filteredItems,
    searchQuery,
    setSearchQuery,
    refreshing,
    importing,
    onRefresh,
    handleAddItem: addItemToDb,
    handleToggleBought,
    handleUpdateItem: updateItemInDb,
    handleDeleteItem,
    handleImportFromAPI,
  } = useGroceryItems();

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [nameError, setNameError] = useState('');
  
  // Edit Modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItemType | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState('1');
  const [editItemCategory, setEditItemCategory] = useState('');
  const [editNameError, setEditNameError] = useState('');

  const handleAddItem = () => {
    // Validate name
    if (!newItemName.trim()) {
      setNameError('Tên món không được để trống!');
      return;
    }

    // Parse quantity
    const quantity = parseInt(newItemQuantity) || 1;

    // Add to database using hook
    const success = addItemToDb(newItemName.trim(), quantity, newItemCategory.trim());

    if (success) {
      // Reset form
      setNewItemName('');
      setNewItemQuantity('1');
      setNewItemCategory('');
      setNameError('');
      
      // Close modal
      setModalVisible(false);
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



  const handleOpenEditModal = (item: GroceryItemType) => {
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
      return;
    }

    // Parse quantity
    const quantity = parseInt(editItemQuantity) || 1;

    // Update in database using hook
    const success = updateItemInDb(editingItem.id, editItemName.trim(), quantity, editItemCategory.trim());

    if (success) {
      // Reset form
      setEditItemName('');
      setEditItemQuantity('1');
      setEditItemCategory('');
      setEditNameError('');
      setEditingItem(null);
      
      // Close modal
      setEditModalVisible(false);
    }
  };



  return (
    <View style={styles.container}>
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <GroceryItem
            item={item}
            onToggleBought={handleToggleBought}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteItem}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() => (
          <ListHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            importing={importing}
            filteredItemsCount={filteredItems.length}
            onImport={handleImportFromAPI}
          />
        )}
        ListEmptyComponent={() => <EmptyState searchQuery={searchQuery} />}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {/* Floating Add Button */}
      <TouchableOpacity 
        style={[styles.fabButton, importing && styles.fabButtonDisabled]}
        onPress={handleOpenModal}
        disabled={importing}
        activeOpacity={0.8}
      >
        <Text style={styles.fabButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add Item Modal */}
      <AddItemModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleAddItem}
        itemName={newItemName}
        setItemName={setNewItemName}
        itemQuantity={newItemQuantity}
        setItemQuantity={setNewItemQuantity}
        itemCategory={newItemCategory}
        setItemCategory={setNewItemCategory}
        nameError={nameError}
        setNameError={setNameError}
      />

      {/* Edit Item Modal */}
      <EditItemModal
        visible={editModalVisible}
        onClose={handleCloseEditModal}
        onSave={handleUpdateItem}
        itemName={editItemName}
        setItemName={setEditItemName}
        itemQuantity={editItemQuantity}
        setItemQuantity={setEditItemQuantity}
        itemCategory={editItemCategory}
        setItemCategory={setEditItemCategory}
        nameError={editNameError}
        setNameError={setEditNameError}
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
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  // Import Button Styles
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  importButtonDisabled: {
    backgroundColor: '#9E9E9E',
    opacity: 0.6,
  },
  importButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  importButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  fabButtonDisabled: {
    backgroundColor: '#BDBDBD',
    opacity: 0.6,
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
