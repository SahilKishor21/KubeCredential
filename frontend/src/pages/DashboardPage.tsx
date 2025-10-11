import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { issuanceApi, verificationApi } from '@/lib/api';
import { Shield, FileCheck, Server, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCredentials: 0,
    issuanceWorker: '',
    verificationWorker: '',
    issuanceHealthy: false,
    verificationHealthy: false,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [credentialsRes, issuanceHealth, verificationHealth] = await Promise.all([
        issuanceApi.getAllCredentials(),
        issuanceApi.healthCheck().catch(() => ({ success: false, data: { workerId: 'N/A' } })),
        verificationApi.healthCheck().catch(() => ({ success: false, data: { workerId: 'N/A' } })),
      ]);

      setStats({
        totalCredentials: credentialsRes.data?.length || 0,
        issuanceWorker: issuanceHealth.data?.workerId || 'N/A',
        verificationWorker: verificationHealth.data?.workerId || 'N/A',
        issuanceHealthy: issuanceHealth.success,
        verificationHealthy: verificationHealth.success,
      });
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 ">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor your credential management system
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/issue')} className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0">
            <Shield className="h-4 w-4" />
            Issue Credential
          </Button>
          <Button onClick={() => navigate('/verify')} variant="outline" className="gap-2 border-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-950 dark:hover:to-blue-950">
            <FileCheck className="h-4 w-4" />
            Verify
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Credentials</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCredentials}</div>
            <p className="text-xs text-blue-100 mt-1">Issued credentials</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-gradient-to-br from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Issuance Service</CardTitle>
            <Server className="h-4 w-4 text-purple-100" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={stats.issuanceHealthy ? 'success' : 'destructive'} className="bg-white/20 backdrop-blur-sm">
                {stats.issuanceHealthy ? 'Healthy' : 'Down'}
              </Badge>
            </div>
            <p className="text-xs text-purple-100 mt-2">
              Worker: {stats.issuanceWorker}
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-gradient-to-br from-teal-500 to-emerald-600 dark:from-teal-600 dark:to-emerald-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">Verification Service</CardTitle>
            <Server className="h-4 w-4 text-teal-100" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={stats.verificationHealthy ? 'success' : 'destructive'} className="bg-white/20 backdrop-blur-sm">
                {stats.verificationHealthy ? 'Healthy' : 'Down'}
              </Badge>
            </div>
            <p className="text-xs text-teal-100 mt-2">
              Worker: {stats.verificationWorker}
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 bg-gradient-to-br from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white">System Status</CardTitle>
            <AlertCircle className="h-4 w-4 text-pink-100" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={stats.issuanceHealthy && stats.verificationHealthy ? 'success' : 'destructive'} className="bg-white/20 backdrop-blur-sm">
                {stats.issuanceHealthy && stats.verificationHealthy ? 'Operational' : 'Issues Detected'}
              </Badge>
            </div>
            <p className="text-xs text-pink-100 mt-2">
              All systems {stats.issuanceHealthy && stats.verificationHealthy ? 'running' : 'need attention'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Quick Actions</CardTitle>
          <CardDescription>Common tasks to get started</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Button
            onClick={() => navigate('/issue')}
            variant="outline"
            className="h-auto flex-col items-start gap-2 p-4 border-2 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 transition-all"
          >
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div className="text-left">
              <p className="font-semibold">Issue New Credential</p>
              <p className="text-sm text-muted-foreground">Create and issue a new credential to a holder</p>
            </div>
          </Button>

          <Button
            onClick={() => navigate('/verify')}
            variant="outline"
            className="h-auto flex-col items-start gap-2 p-4 border-2 hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950 transition-all"
          >
            <FileCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <div className="text-left">
              <p className="font-semibold">Verify Credential</p>
              <p className="text-sm text-muted-foreground">Check if a credential is valid and issued</p>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}