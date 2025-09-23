import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Search, Receipt, Calendar, Star, Phone, TrendingUp, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/Logo';

type AdminBillData = {
  id: string;
  memberId: string;
  totalAmount: number;
  pointsAwarded: number;
  processedBy: string;
  createdAt: string; // API returns ISO string, parse when needed
  memberName: string | null;
  memberWhatsApp: string | null;
};

export default function AdminBills() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low' | 'points-high' | 'points-low'>('newest');

  const { data: billsData, isLoading } = useQuery<{ success: boolean; data: AdminBillData[] }>({
    queryKey: ['/api/admin/bills'],
    enabled: true,
  });

  const bills: AdminBillData[] = billsData?.data || [];

  // Filter bills based on search query
  const filteredBills = bills.filter((bill: AdminBillData) =>
    (bill.memberName ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bill.memberWhatsApp ?? '').includes(searchQuery) ||
    bill.totalAmount.toString().includes(searchQuery) ||
    bill.pointsAwarded.toString().includes(searchQuery)
  );

  // Sort bills based on selected criteria
  const sortedBills = [...filteredBills].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'amount-high':
        return b.totalAmount - a.totalAmount;
      case 'amount-low':
        return a.totalAmount - b.totalAmount;
      case 'points-high':
        return b.pointsAwarded - a.pointsAwarded;
      case 'points-low':
        return a.pointsAwarded - b.pointsAwarded;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const formatDate = (dateString: string) => {
    try {
      const dateObj = new Date(dateString);
      return dateObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ' ' + dateObj.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPhoneNumber = (phoneNumber: string | null) => {
    if (!phoneNumber) return '-';
    return phoneNumber.startsWith('62') ? `+${phoneNumber}` : phoneNumber;
  };

  // Calculate stats
  const totalRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalPointsGiven = bills.reduce((sum, bill) => sum + bill.pointsAwarded, 0);
  const uniqueMembers = new Set(bills.map(bill => bill.memberId)).size;
  const averageTransaction = bills.length > 0 ? totalRevenue / bills.length : 0;

  return (
    <>
      <Helmet>
        <title>Riwayat Transaksi - Admin Gadang Barubah</title>
        <meta name="description" content="Riwayat transaksi dan pemberian points sistem Gadang Barubah" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
            <div className="flex items-center justify-between p-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/admin')}
                data-testid="button-back-admin"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Logo />
                <div>
                  <h1 className="font-semibold text-lg">Riwayat Transaksi</h1>
                  <Badge variant="secondary" className="text-xs">
                    Administrator
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Receipt className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold" data-testid="text-total-transactions">{bills.length}</p>
                  <p className="text-sm text-muted-foreground">Total Transaksi</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-bold" data-testid="text-total-revenue">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold" data-testid="text-total-points">
                    {totalPointsGiven.toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-muted-foreground">Points Diberikan</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold" data-testid="text-unique-members">{uniqueMembers}</p>
                  <p className="text-sm text-muted-foreground">Member Unik</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari transaksi (nama member, WhatsApp, jumlah, points)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-bills"
                  />
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-full md:w-48" data-testid="select-sort-bills">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="oldest">Terlama</SelectItem>
                    <SelectItem value="amount-high">Jumlah Terbesar</SelectItem>
                    <SelectItem value="amount-low">Jumlah Terkecil</SelectItem>
                    <SelectItem value="points-high">Points Terbanyak</SelectItem>
                    <SelectItem value="points-low">Points Tersedikit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bills List */}
          <div className="p-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/3"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="space-y-2 text-right">
                          <div className="h-6 bg-muted rounded w-24"></div>
                          <div className="h-4 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedBills.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? 'Transaksi tidak ditemukan' : 'Belum ada transaksi'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Coba gunakan kata kunci lain untuk pencarian' : 'Transaksi baru akan muncul di sini setelah kasir memproses bill'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {searchQuery ? `Hasil pencarian: ${sortedBills.length}` : `${sortedBills.length} Transaksi`}
                  </h2>
                  {searchQuery && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSearchQuery('')}
                      data-testid="button-clear-search"
                    >
                      Hapus Filter
                    </Button>
                  )}
                </div>

                {sortedBills.map((bill: AdminBillData) => (
                  <Card key={bill.id} className="hover-elevate" data-testid={`card-bill-${bill.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                          <Receipt className="h-6 w-6 text-green-600" />
                        </div>

                        {/* Transaction Info */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold" data-testid={`text-bill-member-${bill.id}`}>
                              {bill.memberName || 'Unknown Member'}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(bill.createdAt)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span data-testid={`text-bill-phone-${bill.id}`}>
                              {formatPhoneNumber(bill.memberWhatsApp)}
                            </span>
                          </div>
                        </div>

                        {/* Amount and Points */}
                        <div className="text-right space-y-1">
                          <div className="text-lg font-bold text-green-600" data-testid={`text-bill-amount-${bill.id}`}>
                            {formatCurrency(bill.totalAmount)}
                          </div>
                          <Badge variant="default" className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">
                            <Star className="h-3 w-3 mr-1" />
                            +{bill.pointsAwarded} points
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Average Transaction Info */}
                {bills.length > 0 && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Rata-rata per transaksi</p>
                        <p className="text-lg font-semibold" data-testid="text-average-transaction">
                          {formatCurrency(averageTransaction)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}