import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Dashboard from "@/pages/dashboard";
import Devices from "@/pages/devices";
import Alerts from "@/pages/alerts";
import AuditLogs from "@/pages/audit-logs";

function Router() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <MobileNav />
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none p-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/devices" component={Devices} />
            <Route path="/alerts" component={Alerts} />
            <Route path="/audit-logs" component={AuditLogs} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
