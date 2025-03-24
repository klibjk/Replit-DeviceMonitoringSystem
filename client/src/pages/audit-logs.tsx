import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { AuditLog } from "@shared/schema";

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [tableFilter, setTableFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  
  const { 
    data: auditLogs = [], 
    isLoading,
    isError
  } = useQuery<AuditLog[]>({
    queryKey: ['/api/audit-logs'],
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 2000, // Consider data stale after 2 seconds
  });
  
  // First sort logs by timestamp in descending order (newest first),
  // then filter them based on search and filter criteria
  const filteredLogs = [...auditLogs]
    .sort((a, b) => {
      // Sort by timestamp descending (newest first)
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
    })
    .filter(log => {
      const matchesSearch = search === "" || 
        log.table_name.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.performed_by.toLowerCase().includes(search.toLowerCase()) ||
        log.record_id.toString().includes(search);
      
      const matchesTable = tableFilter === "all" || log.table_name === tableFilter;
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      
      return matchesSearch && matchesTable && matchesAction;
    });
  
  // Get unique tables and actions for filters
  const uniqueTablesMap = new Map<string, boolean>();
  auditLogs.forEach(log => uniqueTablesMap.set(log.table_name, true));
  const uniqueTables = Array.from(uniqueTablesMap.keys());
  
  const uniqueActionsMap = new Map<string, boolean>();
  auditLogs.forEach(log => uniqueActionsMap.set(log.action, true));
  const uniqueActions = Array.from(uniqueActionsMap.keys());
  
  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "create":
        return "success";
      case "update":
        return "warning";
      case "delete":
        return "destructive";
      default:
        return "secondary";
    }
  };
  
  if (isError) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
          <div className="mt-4 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading audit logs
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Failed to fetch audit log data. Please try again later.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
        
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          
          <Select value={tableFilter} onValueChange={setTableFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All tables" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tables</SelectItem>
              {uniqueTables.map(table => (
                <SelectItem key={table} value={table}>
                  {table}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {uniqueActions.map(action => (
                <SelectItem key={action} value={action}>
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Record ID</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[70px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {log.timestamp 
                            ? format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="capitalize">
                          {log.table_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getActionBadgeVariant(log.action)}>
                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.record_id}</TableCell>
                        <TableCell>{log.performed_by}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        {search || tableFilter || actionFilter 
                          ? 'No audit logs match your filters' 
                          : 'No audit logs found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
