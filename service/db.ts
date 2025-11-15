import * as SQLite from 'expo-sqlite';

// Tên cơ sở dữ liệu
const DATABASE_NAME = 'groceries.db';

// Mở kết nối đến database
const db = SQLite.openDatabaseSync(DATABASE_NAME);

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

// Export database instance để sử dụng ở nơi khác
export { db };
