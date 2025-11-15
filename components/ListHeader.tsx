import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ListHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  importing: boolean;
  filteredItemsCount: number;
  onImport: () => void;
}

export const ListHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  importing, 
  filteredItemsCount,
  onImport 
}: ListHeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>🛒 Grocery App</Text>
      <Text style={styles.subtitle}>Câu 10: Tách custom hook + hoàn thiện UI/UX</Text>

      {/* Import from API Button */}
      <TouchableOpacity 
        style={[styles.importButton, importing && styles.importButtonDisabled]}
        onPress={onImport}
        disabled={importing}
        activeOpacity={0.7}
      >
        {importing ? (
          <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
        ) : (
          <Text style={styles.importButtonIcon}>🌐</Text>
        )}
        <Text style={styles.importButtonText}>
          {importing ? 'Đang import...' : 'Import từ API'}
        </Text>
      </TouchableOpacity>

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
          Tìm thấy {filteredItemsCount} kết quả
        </Text>
      )}

      <Text style={styles.itemCount}>
        {filteredItemsCount > 0 ? `Có ${filteredItemsCount} món` : 'Chưa có món nào'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
