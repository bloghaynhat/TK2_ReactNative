import * as SQLite from 'expo-sqlite';

// Tên cơ sở dữ liệu
const DATABASE_NAME = 'groceries.db';

// Mở kết nối đến database
const db = SQLite.openDatabaseSync(DATABASE_NAME);

// Interface cho grocery item
export interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  bought: number;
  created_at: number;
}

/**
 * Khởi tạo bảng grocery_items nếu nó chưa tồn tại.
 * Cấu trúc: id, name, quantity, category, bought (0/1), created_at
 */
export const initDatabase = () => {
  try {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS grocery_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        category TEXT,
        bought INTEGER DEFAULT 0,
        created_at INTEGER
      );`
    );
    console.log('✅ Database initialized successfully: Table grocery_items created.');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return false;
  }
};

/**
 * Hàm seed dữ liệu mẫu nếu bảng đang trống
 */
export const seedData = () => {
  try {
    // Kiểm tra xem bảng có dữ liệu chưa
    const countStmt = db.prepareSync('SELECT COUNT(*) as count FROM grocery_items;');
    try {
      const result = countStmt.executeSync<{ count: number }>().getAllSync();
      const count = result[0]?.count || 0;

      if (count === 0) {
        console.log('📦 Bảng đang trống, đang seed dữ liệu mẫu...');
        
        const currentTime = Date.now();
        
        const insertStmt = db.prepareSync(
          'INSERT INTO grocery_items (name, quantity, category, bought, created_at) VALUES (?, ?, ?, ?, ?);'
        );
        
        try {
          // Thêm 3 bản ghi mẫu
          insertStmt.executeSync(['Sữa', 2, 'Đồ uống', 0, currentTime]);
          insertStmt.executeSync(['Trứng', 10, 'Thực phẩm', 0, currentTime]);
          insertStmt.executeSync(['Bánh mì', 1, 'Thực phẩm', 0, currentTime]);
          
          console.log('✅ Đã seed 3 bản ghi mẫu thành công!');
          return true;
        } finally {
          insertStmt.finalizeSync();
        }
      } else {
        console.log(`ℹ️ Bảng đã có ${count} bản ghi, không cần seed.`);
        return false;
      }
    } finally {
      countStmt.finalizeSync();
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    return false;
  }
};

/**
 * Hàm kiểm tra kết nối để đảm bảo DB hoạt động.
 * (Không bắt buộc nhưng hữu ích cho việc debug)
 */
export const checkConnection = () => {
  try {
    const stmt = db.prepareSync(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="grocery_items";'
    );
    try {
      const result = stmt.executeSync().getAllSync();
      if (result.length > 0) {
        console.log('✅ DB Check: Bảng grocery_items đã tồn tại.');
        return true;
      } else {
        console.log('⚠️ DB Check: Bảng grocery_items chưa tồn tại.');
        return false;
      }
    } finally {
      stmt.finalizeSync();
    }
  } catch (error) {
    console.error('❌ DB Check Error:', error);
    return false;
  }
};

/**
 * Hàm đếm số lượng items trong bảng
 */
export const getItemCount = (): number => {
  try {
    const stmt = db.prepareSync('SELECT COUNT(*) as count FROM grocery_items;');
    try {
      const result = stmt.executeSync<{ count: number }>().getAllSync();
      return result[0]?.count || 0;
    } finally {
      stmt.finalizeSync();
    }
  } catch (error) {
    console.error('❌ Error counting items:', error);
    return 0;
  }
};

/**
 * Hàm lấy tất cả items từ bảng
 */
export const getAllItems = (): GroceryItem[] => {
  try {
    const stmt = db.prepareSync('SELECT * FROM grocery_items ORDER BY created_at DESC;');
    try {
      const result = stmt.executeSync<GroceryItem>().getAllSync();
      return result;
    } finally {
      stmt.finalizeSync();
    }
  } catch (error) {
    console.error('❌ Error getting all items:', error);
    return [];
  }
};

/**
 * Hàm thêm item mới vào bảng
 */
export const addItem = (name: string, quantity: number = 1, category: string = ''): boolean => {
  try {
    const currentTime = Date.now();
    const stmt = db.prepareSync(
      'INSERT INTO grocery_items (name, quantity, category, bought, created_at) VALUES (?, ?, ?, ?, ?);'
    );
    try {
      stmt.executeSync([name, quantity, category, 0, currentTime]);
      console.log(`✅ Đã thêm item: ${name}`);
      return true;
    } finally {
      stmt.finalizeSync();
    }
  } catch (error) {
    console.error('❌ Error adding item:', error);
    return false;
  }
};

/**
 * Hàm toggle trạng thái bought của item (0 <-> 1)
 */
export const toggleItemBought = (id: number): boolean => {
  try {
    const stmt = db.prepareSync(
      'UPDATE grocery_items SET bought = CASE WHEN bought = 0 THEN 1 ELSE 0 END WHERE id = ?;'
    );
    try {
      stmt.executeSync([id]);
      console.log(`✅ Đã toggle trạng thái item id: ${id}`);
      return true;
    } finally {
      stmt.finalizeSync();
    }
  } catch (error) {
    console.error('❌ Error toggling item:', error);
    return false;
  }
};

/**
 * Hàm cập nhật thông tin item
 */
export const updateItem = (id: number, name: string, quantity: number, category: string): boolean => {
  try {
    const stmt = db.prepareSync(
      'UPDATE grocery_items SET name = ?, quantity = ?, category = ? WHERE id = ?;'
    );
    try {
      stmt.executeSync([name, quantity, category, id]);
      console.log(`✅ Đã cập nhật item id ${id}: ${name}`);
      return true;
    } finally {
      stmt.finalizeSync();
    }
  } catch (error) {
    console.error('❌ Error updating item:', error);
    return false;
  }
};

/**
 * Hàm xóa tất cả items (chỉ dùng cho testing)
 */
export const clearAllItems = () => {
  try {
    db.execSync('DELETE FROM grocery_items;');
    console.log('🗑️ Đã xóa tất cả items');
    return true;
  } catch (error) {
    console.error('❌ Error clearing items:', error);
    return false;
  }
};

// Export database instance để sử dụng ở nơi khác
export { db };

