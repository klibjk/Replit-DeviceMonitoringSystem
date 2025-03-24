import { useState } from "react";
import { Link } from "wouter";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Home, 
  HardDrive, 
  AlertTriangle, 
  ClipboardList,
  Menu
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Devices", href: "/devices", icon: HardDrive },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Audit Logs", href: "/audit-logs", icon: ClipboardList },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button 
            type="button" 
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-gray-800 text-white p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center h-16 px-4 border-b border-gray-700">
              <span className="text-xl font-bold">Device Tracker</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="mr-4 h-6 w-6 text-gray-400" />
                  {item.name}
                </Link>
              ))}
            </nav>
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
        </SheetContent>
      </Sheet>
      <span className="text-xl font-bold text-gray-900 ml-2">Device Tracker</span>
    </div>
  );
}
