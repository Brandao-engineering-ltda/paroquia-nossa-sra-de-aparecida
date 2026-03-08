"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ShieldOff, UserCheck, UserX } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

export function UserTable({ initialUsers }: { initialUsers: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateUser(
    id: string,
    data: { role?: string; isActive?: boolean }
  ) {
    setLoadingId(id);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
      );
      router.refresh();
    }
    setLoadingId(null);
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border/50 bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className={
                    user.role === "admin"
                      ? "bg-royal text-white"
                      : ""
                  }
                >
                  {user.role === "admin" ? "Admin" : "Usuário"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.isActive ? "default" : "destructive"}
                  className={
                    user.isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : ""
                  }
                >
                  {user.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={loadingId === user.id}
                    onClick={() =>
                      updateUser(user.id, { isActive: !user.isActive })
                    }
                    title={user.isActive ? "Desativar" : "Ativar"}
                  >
                    {user.isActive ? (
                      <UserX className="h-4 w-4 text-destructive" />
                    ) : (
                      <UserCheck className="h-4 w-4 text-green-600" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={loadingId === user.id}
                    onClick={() =>
                      updateUser(user.id, {
                        role: user.role === "admin" ? "user" : "admin",
                      })
                    }
                    title={
                      user.role === "admin"
                        ? "Remover admin"
                        : "Tornar admin"
                    }
                  >
                    {user.role === "admin" ? (
                      <ShieldOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Shield className="h-4 w-4 text-royal" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
