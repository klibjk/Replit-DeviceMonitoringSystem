import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  HardDrive, 
  AlertTriangle, 
  ClipboardList,
  User 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Devices", href: "/devices", icon: HardDrive },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Audit Logs", href: "/audit-logs", icon: ClipboardList },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-xl font-bold text-white">Device Tracker</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    )}
                  >
                    <item.icon 
                      className={cn(
                        "mr-3 h-6 w-6",
                        isActive ? "text-gray-300" : "text-gray-400"
                      )} 
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <div className="rounded-full h-8 w-8 flex items-center justify-center bg-gray-300 text-gray-700">
                    <span className="text-sm font-medium">JD</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs font-medium text-gray-300">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
