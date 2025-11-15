import { initDatabase, seedData } from "@/service/db";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // Khởi tạo database khi app khởi động
    console.log('🚀 Initializing database...');
    const success = initDatabase();
    if (success) {
      console.log('✅ App ready with database connection');
      
      // Seed dữ liệu mẫu nếu bảng trống
      seedData();
    } else {
      console.log('❌ Failed to initialize database');
    }
  }, []);

  return <Stack />;
}
