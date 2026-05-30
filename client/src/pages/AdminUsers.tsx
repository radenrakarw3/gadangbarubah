import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Plus, UserCog, Trash2, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiFetch } from "@/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type StaffUser = {
  id: string;
  username: string;
  role: "admin";
  createdAt: string;
};

const staffFormSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type StaffFormData = z.infer<typeof staffFormSchema>;

export default function AdminUsers() {
  const [, navigate] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { data: usersData, isLoading } = useQuery<{ success: boolean; data: StaffUser[] }>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const response = await apiFetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Gagal memuat data user");
      }
      return response.json();
    },
  });

  const staffUsers = usersData?.data ?? [];

  const createUserMutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      const response = await apiFetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "admin" }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat user");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User berhasil dibuat",
        description: "Akun staff baru dapat digunakan untuk login",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setIsCreateDialogOpen(false);
      form.reset({ username: "", password: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal membuat user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiFetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus user");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User berhasil dihapus",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setDeleteUserId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal menghapus user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Helmet>
        <title>Kelola User - Admin Gadang Barubah</title>
        <meta
          name="description"
          content="Kelola akun administrator Gadang Barubah"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto">
          <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
            <div className="flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 flex-1 justify-center">
                <UserCog className="h-6 w-6 text-primary" />
                <div>
                  <h1 className="font-semibold text-lg">Kelola User</h1>
                  <p className="text-sm text-muted-foreground">Admin Panel</p>
                </div>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" data-testid="button-create-user">
                    <Plus className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah User Baru</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit((data) =>
                        createUserMutation.mutate(data),
                      )}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="nama.user" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Minimal 6 karakter"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={createUserMutation.isPending}
                      >
                        {createUserMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          "Simpan User"
                        )}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : staffUsers.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Belum ada user staff.
                </CardContent>
              </Card>
            ) : (
              staffUsers.map((user) => (
                <Card key={user.id} data-testid={`card-user-${user.id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{user.username}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Dibuat {formatDate(user.createdAt)}
                        </p>
                      </div>
                      <Badge variant="default">Admin</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setDeleteUserId(user.id)}
                      data-testid={`button-delete-user-${user.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Hapus
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus user ini?</AlertDialogTitle>
            <AlertDialogDescription>
              User yang sudah memproses transaksi tidak dapat dihapus. Admin
              terakhir juga tidak dapat dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteUserId && deleteUserMutation.mutate(deleteUserId)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
