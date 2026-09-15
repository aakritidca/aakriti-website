"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Input, Select, FieldWrap } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { createUser, deleteUser } from "./actions";

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
}

export function UsersManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: UserListItem[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"SUPER_ADMIN" | "ADMIN" | "EDITOR">("EDITOR");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleAdd() {
    setErrors({});
    startTransition(async () => {
      const result = await createUser({ name, email, password, role });
      if (result.success) {
        toast.success("User added");
        setAdding(false);
        setName("");
        setEmail("");
        setPassword("");
        setRole("EDITOR");
        window.location.reload();
      } else {
        setErrors(result.fieldErrors ?? {});
      }
    });
  }

  async function handleDelete() {
    if (!confirmDeleteId) return;
    try {
      await deleteUser(confirmDeleteId);
      setUsers((u) => u.filter((usr) => usr.id !== confirmDeleteId));
      toast.success("User removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove user");
    }
    setConfirmDeleteId(null);
  }

  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-stone-900">Users</h1>
        {!adding && (
          <Button variant="dark" onClick={() => setAdding(true)}>
            <Plus size={15} /> Add User
          </Button>
        )}
      </div>

      {adding && (
        <div className="bg-white border border-line p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrap label="Name" htmlFor="u-name" required error={errors.name}>
              <Input id="u-name" value={name} onChange={(e) => setName(e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Email" htmlFor="u-email" required error={errors.email}>
              <Input id="u-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Password" htmlFor="u-password" required error={errors.password} hint="Minimum 8 characters">
              <Input id="u-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FieldWrap>
            <FieldWrap label="Role" htmlFor="u-role" required>
              <Select id="u-role" value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </Select>
            </FieldWrap>
          </div>
          <div className="flex gap-3 pt-2">
            <Button size="sm" variant="dark" onClick={handleAdd} loading={isPending}>
              Add User
            </Button>
            <Button size="sm" variant="outline" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white border border-line">
        <table className="w-full text-[13.5px]">
          <thead>
            <tr className="text-left text-[12px] text-stone-500 border-b border-line">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-line last:border-b-0">
                <td className="px-6 py-3.5 font-medium text-stone-900">
                  {user.name} {user.id === currentUserId && <span className="text-stone-400 font-normal">(you)</span>}
                </td>
                <td className="px-6 py-3.5 text-stone-600">{user.email}</td>
                <td className="px-6 py-3.5">
                  <Badge variant="outline">{user.role.replace("_", " ")}</Badge>
                </td>
                <td className="px-6 py-3.5 text-right">
                  {user.id !== currentUserId && (
                    <button
                      onClick={() => setConfirmDeleteId(user.id)}
                      className="p-1.5 text-stone-500 hover:text-error"
                      aria-label="Remove user"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Remove this user?"
        description="They will immediately lose access to the admin panel."
        confirmLabel="Remove"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
