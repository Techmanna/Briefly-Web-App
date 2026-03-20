"use client";

import {
  useAdminUsersQuery,
  useDeleteAdminUserMutation,
} from "@/api/queries/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  Info,
  Layers,
  FileText,
  Search,
  Trash2,
  Edit2,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDialog } from "./user-dialog";
import { User } from "@/api/clients/users";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: result, isLoading } = useAdminUsersQuery(page, 20, search);
  const deleteMutation = useDeleteAdminUserMutation();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success("User deleted successfully");
      } catch {
        toast.error("Failed to delete user");
      }
    }
  };

  if (isLoading) {
    // return (
    //   <div className="space-y-6">
    //     <div className="flex justify-between items-center">
    //       <Skeleton className="h-10 w-64" />
    //       <Skeleton className="h-10 w-64" />
    //     </div>
    //     <Skeleton className="h-96 w-full rounded-3xl" />
    //   </div>
    // );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold tracking-tight">
            Platform Users
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor user engagement across the platform.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 rounded-xl border-border/60"
          />
        </div>
      </div>

      <Card className="border-border shadow-none rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Engagement</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-10 w-64" />
                          <Skeleton className="h-10 w-64" />
                        </div>
                        <Skeleton className="h-96 w-full rounded-3xl" />
                      </div>
                    </td>
                  </tr>
                ) : result?.items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Info className="h-8 w-8 opacity-20" />
                        <p>No users found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  result?.items.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-secondary/20 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground/80">
                              {user.name || "Anonymous User"}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {user.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {user.email && (
                            <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors">
                              <Mail className="h-3 w-3" />
                              <span className="font-medium">{user.email}</span>
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors">
                              <Phone className="h-3 w-3" />
                              <span className="font-medium">{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              <Layers className="h-3 w-3" />
                              Subscriptions
                            </div>
                            <div className="font-bold text-foreground/80">
                              {user.count.subscriptions} categories
                            </div>
                          </div>
                          <div className="flex flex-col border-l border-border/40 pl-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              <FileText className="h-3 w-3" />
                              Digests
                            </div>
                            <div className="font-bold text-foreground/80">
                              {user.count.digests} received
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                handleDelete(user.id, user.name || "Anonymous")
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {result?.meta && result.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4 pb-10">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-border/60"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {result.meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl border-border/60"
            onClick={() =>
              setPage((p) => Math.min(result.meta.totalPages, p + 1))
            }
            disabled={page === result.meta.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <UserDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
