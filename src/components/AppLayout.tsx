import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen w-full flex bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}