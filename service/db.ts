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
    const result = db.getAllSync('SELECT COUNT(*) as count FROM grocery_items;') as Array<{ count: number }>;
    const count = result[0]?.count || 0;

    if (count === 0) {
      console.log('📦 Bảng đang trống, đang seed dữ liệu mẫu...');
      
      const currentTime = Date.now();
      
      // Thêm 3 bản ghi mẫu
      db.runSync(
        'INSERT INTO grocery_items (name, quantity, category, bought, created_at) VALUES (?, ?, ?, ?, ?);',
        ['Sữa', 2, 'Đồ uống', 0, currentTime]
      );
      
      db.runSync(
        'INSERT INTO grocery_items (name, quantity, category, bought, created_at) VALUES (?, ?, ?, ?, ?);',
        ['Trứng', 10, 'Thực phẩm', 0, currentTime]
      );
      
      db.runSync(
        'INSERT INTO grocery_items (name, quantity, category, bought, created_at) VALUES (?, ?, ?, ?, ?);',
        ['Bánh mì', 1, 'Thực phẩm', 0, currentTime]
      );
      
      console.log('✅ Đã seed 3 bản ghi mẫu thành công!');
      return true;
    } else {
      console.log(`ℹ️ Bảng đã có ${count} bản ghi, không cần seed.`);
      return false;
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
    const result = db.getAllSync(
      'SELECT name FROM sqlite_master WHERE type="table" AND name="grocery_items";'
    );
    if (result.length > 0) {
      console.log('✅ DB Check: Bảng grocery_items đã tồn tại.');
      return true;
    } else {
      console.log('⚠️ DB Check: Bảng grocery_items chưa tồn tại.');
      return false;
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
    const result = db.getAllSync('SELECT COUNT(*) as count FROM grocery_items;') as Array<{ count: number }>;
    return result[0]?.count || 0;
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
    const result = db.getAllSync('SELECT * FROM grocery_items ORDER BY created_at DESC;') as GroceryItem[];
    return result;
  } catch (error) {
    console.error('❌ Error getting all items:', error);
    return [];
  }
};

// Export database instance để sử dụng ở nơi khác
export { db };

