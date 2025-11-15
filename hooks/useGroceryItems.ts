import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { 
  addItem, 
  addItemWithStatus, 
  deleteItem, 
  getAllItems, 
  toggleItemBought, 
  updateItem, 
  type GroceryItem 
} from '@/service/db';

export const useGroceryItems = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [importing, setImporting] = useState(false);

  // Load all items from database
  const loadData = useCallback(() => {
    const allItems = getAllItems();
    setItems(allItems);
    console.log(`📱 Loaded ${allItems.length} items from database`);
  }, []);

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

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }, [loadData]);

  // Add new item
  const handleAddItem = useCallback((name: string, quantity: number, category: string) => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món cần mua!');
      return false;
    }

    const success = addItem(name.trim(), quantity, category.trim());

    if (success) {
      loadData();
      Alert.alert('Thành công', `Đã thêm "${name}"!`);
      return true;
    } else {
      Alert.alert('Lỗi', 'Không thể thêm món. Vui lòng thử lại!');
      return false;
    }
  }, [loadData]);

  // Toggle bought status
  const handleToggleBought = useCallback((id: number, name: string, currentBought: number) => {
    const success = toggleItemBought(id);
    
    if (success) {
      loadData();
      const newStatus = currentBought === 1 ? 'chưa mua' : 'đã mua';
      console.log(`🔄 Đã đổi trạng thái "${name}" sang ${newStatus}`);
    } else {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái!');
    }
  }, [loadData]);

  // Update item
  const handleUpdateItem = useCallback((
    id: number, 
    name: string, 
    quantity: number, 
    category: string
  ) => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món cần mua!');
      return false;
    }

    const success = updateItem(id, name.trim(), quantity, category.trim());

    if (success) {
      loadData();
      Alert.alert('Thành công', `Đã cập nhật "${name}"!`);
      return true;
    } else {
      Alert.alert('Lỗi', 'Không thể cập nhật món. Vui lòng thử lại!');
      return false;
    }
  }, [loadData]);

  // Delete item
  const handleDeleteItem = useCallback((id: number, name: string) => {
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
  }, [loadData]);

  // Import from API
  const handleImportFromAPI = useCallback(async () => {
    setImporting(true);
    
    try {
      console.log('🌐 Fetching data from API...');
      
      const response = await fetch('https://dummyjson.com/todos?limit=10');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ API data received:', data);
      
      // Get existing items to check for duplicates
      const existingItems = getAllItems();
      const existingNames = new Set(existingItems.map(item => item.name.toLowerCase()));
      
      let importedCount = 0;
      let skippedCount = 0;
      
      // Process API data
      if (data.todos && Array.isArray(data.todos)) {
        for (const apiItem of data.todos) {
          const itemName = apiItem.todo || 'Món không có tên';
          const normalizedName = itemName.toLowerCase();
          
          // Skip if name already exists
          if (existingNames.has(normalizedName)) {
            console.log(`⏭️ Skipping duplicate: ${itemName}`);
            skippedCount++;
            continue;
          }
          
          // Map completed to bought (true -> 1, false -> 0)
          const bought = apiItem.completed ? 1 : 0;
          const quantity = 1;
          const category = 'Import từ API';
          
          // Add to database with bought status from API
          const success = addItemWithStatus(itemName, quantity, category, bought);
          
          if (success) {
            importedCount++;
            existingNames.add(normalizedName);
          }
        }
      }
      
      // Reload data to show new items
      loadData();
      
      // Show result
      if (importedCount > 0) {
        Alert.alert(
          'Import thành công! 🎉',
          `Đã thêm ${importedCount} món mới${skippedCount > 0 ? `\nBỏ qua ${skippedCount} món trùng lặp` : ''}`,
          [{ text: 'OK' }]
        );
      } else if (skippedCount > 0) {
        Alert.alert(
          'Không có món mới',
          `Tất cả ${skippedCount} món từ API đã tồn tại trong danh sách`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Thông báo', 'Không có dữ liệu để import', [{ text: 'OK' }]);
      }
      
    } catch (error) {
      console.error('❌ Import error:', error);
      Alert.alert(
        'Lỗi khi import',
        `Không thể lấy dữ liệu từ API: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        [{ text: 'Đóng' }]
      );
    } finally {
      setImporting(false);
    }
  }, [loadData]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    refreshing,
    importing,
    loadData,
    onRefresh,
    handleAddItem,
    handleToggleBought,
    handleUpdateItem,
    handleDeleteItem,
    handleImportFromAPI,
  };
};
