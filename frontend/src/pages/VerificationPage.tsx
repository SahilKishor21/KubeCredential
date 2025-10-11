import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Spinner } from '@/components/ui/Spinner';
import { VerificationResult } from '@/components/VerificationResult';
import { verificationApi } from '@/lib/api';
import { toast } from 'sonner';
import { FileCheck, Search, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';

export function VerificationPage() {
  const [credentialId, setCredentialId] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentialId.trim()) {
      toast.error('Please enter a credential ID');
      return;
    }

    setLoading(true);
    setVerificationResult(null);

    try {
      const response = await verificationApi.verifyCredential(credentialId.trim());
      
      if (response.data) {
        setVerificationResult(response.data);
        
        if (response.data.valid) {
          toast.success('Credential verified successfully!');
        } else {
          toast.error('Credential verification failed');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCredentialId('');
    setVerificationResult(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header - Centered */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-400 shadow-lg">
              <FileCheck className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Verify Credential
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Check the validity and authenticity of issued credentials instantly
          </p>
        </div>

        {/* Verification Form - Modern Card */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-cyan-50/30 to-teal-50/30 dark:from-slate-900 dark:via-cyan-950/30 dark:to-teal-950/30 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 shadow-md">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Enter Credential ID
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Provide the credential ID to verify its authenticity
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="credentialId" className="text-base font-semibold">Credential ID *</Label>
                <div className="relative">
                  <Input
                    id="credentialId"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="CRED-1234567890-ABCDEFGH"
                    className="font-mono text-base h-14 border-2 border-cyan-200 dark:border-cyan-800 focus:border-cyan-400 dark:focus:border-cyan-600 bg-white dark:bg-slate-900 shadow-sm pl-12"
                    required
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-500" />
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Enter the unique identifier of the credential you want to verify
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 gap-2 h-12 text-base bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-600 hover:via-teal-600 hover:to-emerald-600 border-0 shadow-lg hover:shadow-xl transition-all"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Verify Credential
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={loading}
                  className="px-8 h-12 border-2 border-cyan-200 dark:border-cyan-800 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-teal-50 dark:hover:from-cyan-950 dark:hover:to-teal-950"
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Verification Result */}
        {verificationResult && (
          <div className="animate-in fade-in-50 duration-500">
            <VerificationResult result={verificationResult} />
          </div>
        )}

        {/* Info Section - More Engaging */}
        {!verificationResult && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 hover:shadow-lg transition-all">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">
                  Secure Verification
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Independent microservice validates credentials against the issuance database
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/50 dark:to-emerald-950/50 hover:shadow-lg transition-all">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-400">
                    <FileCheck className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-teal-900 dark:text-teal-100">
                  Instant Results
                </h3>
                <p className="text-sm text-teal-700 dark:text-teal-300">
                  Get immediate verification status with complete credential details
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 hover:shadow-lg transition-all">
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-purple-900 dark:text-purple-100">
                  Audit Trail
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Every verification is logged with worker ID and timestamp
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}