import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Users, Phone, Calendar, Star, Receipt } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/Logo';

type AdminMemberData = {
  id: string;
  namaLengkap: string;
  jenisKelamin: string;
  noWhatsApp: string;
  tanggalLahir: string;
  kodePos: string;
  pinHash: string;
  totalPoints: number;
  billsCount: number;
};

export default function AdminMembers() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: membersData, isLoading } = useQuery({
    queryKey: ['/api/admin/members'],
    enabled: true,
  });

  const members: AdminMemberData[] = membersData?.data || [];

  // Filter members based on search query
  const filteredMembers = members.filter((member: AdminMemberData) =>
    member.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.noWhatsApp.includes(searchQuery) ||
    member.kodePos.includes(searchQuery)
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    // Format phone number for display
    return phoneNumber.startsWith('62') ? `+${phoneNumber}` : phoneNumber;
  };

  return (
    <>
      <Helmet>
        <title>Data Member - Admin Gadang Barubah</title>
        <meta name="description" content="Data member dan statistik points sistem Gadang Barubah" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto">
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
                  <h1 className="font-semibold text-lg">Data Member</h1>
                  <Badge variant="secondary" className="text-xs">
                    Administrator
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="p-4 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari member (nama, WhatsApp, kode pos)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-members"
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold" data-testid="text-total-members">{members.length}</p>
                  <p className="text-sm text-muted-foreground">Total Member</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold" data-testid="text-total-points">
                    {members.reduce((sum: number, member: AdminMemberData) => sum + member.totalPoints, 0).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Receipt className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold" data-testid="text-total-transactions">
                    {members.reduce((sum: number, member: AdminMemberData) => sum + member.billsCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Transaksi</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold" data-testid="text-active-members">
                    {members.filter((member: AdminMemberData) => member.billsCount > 0).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Member Aktif</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Members List */}
          <div className="p-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-1/3"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-6 bg-muted rounded w-16"></div>
                          <div className="h-3 bg-muted rounded w-12"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredMembers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? 'Member tidak ditemukan' : 'Belum ada member'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Coba gunakan kata kunci lain untuk pencarian' : 'Member baru akan muncul di sini setelah registrasi'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {searchQuery ? `Hasil pencarian: ${filteredMembers.length}` : `${filteredMembers.length} Member`}
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

                {filteredMembers.map((member: AdminMemberData) => (
                  <Card key={member.id} className="hover-elevate" data-testid={`card-member-${member.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {member.jenisKelamin === 'Uda' ? '🤵' : '👩'}
                          </span>
                        </div>

                        {/* Member Info */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold" data-testid={`text-member-name-${member.id}`}>
                              {member.namaLengkap}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {member.jenisKelamin}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span data-testid={`text-member-phone-${member.id}`}>
                              {formatPhoneNumber(member.noWhatsApp)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(member.tanggalLahir)}</span>
                            </div>
                            <div>
                              Kode Pos: {member.kodePos}
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="text-right space-y-1">
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
                              <Star className="h-3 w-3 mr-1" />
                              {member.totalPoints.toLocaleString('id-ID')} pts
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Receipt className="h-3 w-3 mr-1" />
                              {member.billsCount} transaksi
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}