import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Spinner } from '@/components/ui/Spinner';
import { CredentialCard } from '@/components/CredentialCard';
import { issuanceApi, Credential, } from '@/lib/api';
import { useCredentialStore } from '@/store/useCredentialStore';
import { generateCredentialId } from '@/lib/utils';
import { toast } from 'sonner';
import { Shield, RefreshCw, Plus, Award, Eye, FileText } from 'lucide-react';

const credentialTypes = [
  'Academic Certificate',
  'Professional License',
  'Identity Document',
  'Training Certificate',
  'Membership Card',
  'Other',
];

export function IssuancePage() {
  const { credentials, setCredentials, addCredential } = useCredentialStore();
  const [loading, setLoading] = useState(false);
  const [loadingCredentials, setLoadingCredentials] = useState(true);
  const [formData, setFormData] = useState<Credential>({
    id: generateCredentialId(),
    holderName: '',
    holderEmail: '',
    credentialType: credentialTypes[0],
    issueDate: new Date().toISOString(),
    expiryDate: '',
    metadata: {},
  });
  const [metadataJson, setMetadataJson] = useState('');

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const response = await issuanceApi.getAllCredentials();
      if (response.success && response.data) {
        setCredentials(response.data);
      }
    } catch (error: any) {
      toast.error('Failed to load credentials');
    } finally {
      setLoadingCredentials(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMetadataJson(e.target.value);
  };

  const resetForm = () => {
    setFormData({
      id: generateCredentialId(),
      holderName: '',
      holderEmail: '',
      credentialType: credentialTypes[0],
      issueDate: new Date().toISOString(),
      expiryDate: '',
      metadata: {},
    });
    setMetadataJson('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse metadata if provided
      let metadata = {};
      if (metadataJson.trim()) {
        try {
          metadata = JSON.parse(metadataJson);
        } catch {
          toast.error('Invalid JSON in metadata field');
          setLoading(false);
          return;
        }
      }

      const credentialData: Credential = {
        ...formData,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      };

      const response = await issuanceApi.issueCredential(credentialData);

      if (response.success && response.data) {
        toast.success(response.message);
        addCredential(response.data);
        resetForm();
      } else {
        toast.error(response.message || 'Failed to issue credential');
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Credential with this ID already exists');
      } else {
        toast.error(error.response?.data?.message || 'Failed to issue credential');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 py-8">
      {/* Header - Centered */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 shadow-lg">
            <Shield className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Issue New Credential
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Create and issue new credentials to holders with complete verification
        </p>
      </div>

      {/* Issue Form - Modern Centered Layout */}
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Card */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Credential Information
              </CardTitle>
              <CardDescription className="text-base">
                Fill in the details to issue a new credential
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Credential ID */}
                <div className="space-y-2">
                  <Label htmlFor="id" className="text-sm font-semibold">Credential ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="id"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      required
                      className="font-mono border-2 border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600 bg-white dark:bg-slate-900"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setFormData((prev) => ({ ...prev, id: generateCredentialId() }))}
                      title="Generate new ID"
                      className="border-2 border-blue-200 dark:border-blue-800 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900 dark:hover:to-indigo-900"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Holder Name */}
                <div className="space-y-2">
                  <Label htmlFor="holderName" className="text-sm font-semibold">Holder Name *</Label>
                  <Input
                    id="holderName"
                    name="holderName"
                    value={formData.holderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className="border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-600 bg-white dark:bg-slate-900"
                  />
                </div>

                {/* Holder Email */}
                <div className="space-y-2">
                  <Label htmlFor="holderEmail" className="text-sm font-semibold">Holder Email *</Label>
                  <Input
                    id="holderEmail"
                    name="holderEmail"
                    type="email"
                    value={formData.holderEmail}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
                    required
                    className="border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-600 bg-white dark:bg-slate-900"
                  />
                </div>

                {/* Credential Type */}
                <div className="space-y-2">
                  <Label htmlFor="credentialType" className="text-sm font-semibold">Credential Type *</Label>
                  <Select
                    id="credentialType"
                    name="credentialType"
                    value={formData.credentialType}
                    onChange={handleInputChange}
                    required
                    className="border-2 border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 bg-white dark:bg-slate-900"
                  >
                    {credentialTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Issue Date */}
                <div className="space-y-2">
                  <Label htmlFor="issueDate" className="text-sm font-semibold">Issue Date *</Label>
                  <Input
                    id="issueDate"
                    name="issueDate"
                    type="datetime-local"
                    value={formData.issueDate.slice(0, 16)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        issueDate: new Date(e.target.value).toISOString(),
                      }))
                    }
                    required
                    className="border-2 border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600 bg-white dark:bg-slate-900"
                  />
                </div>

                {/* Expiry Date */}
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-sm font-semibold">Expiry Date (Optional)</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="datetime-local"
                    value={formData.expiryDate ? formData.expiryDate.slice(0, 16) : ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        expiryDate: e.target.value ? new Date(e.target.value).toISOString() : '',
                      }))
                    }
                    className="border-2 border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600 bg-white dark:bg-slate-900"
                  />
                </div>

                {/* Metadata */}
                <div className="space-y-2">
                  <Label htmlFor="metadata" className="text-sm font-semibold">Metadata (Optional JSON)</Label>
                  <Textarea
                    id="metadata"
                    value={metadataJson}
                    onChange={handleMetadataChange}
                    placeholder='{"department": "Engineering", "level": "Senior"}'
                    rows={4}
                    className="font-mono text-sm border-2 border-purple-200 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-600 bg-white dark:bg-slate-900"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter valid JSON for additional metadata
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="flex-1 gap-2 h-12 text-base bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        Issuing...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        Issue Credential
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm} 
                    disabled={loading}
                    className="px-6 h-12 border-2 border-indigo-200 dark:border-indigo-800 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950 dark:hover:to-purple-950"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-slate-900 dark:via-purple-950/30 dark:to-pink-950/30 backdrop-blur-sm">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-md">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Live Preview
              </CardTitle>
              <CardDescription className="text-base">
                How the credential will look
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="p-6 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-950/30 backdrop-blur-sm rounded-2xl space-y-4 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-purple-200 dark:border-purple-800">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Credential ID</p>
                    <p className="font-mono text-sm font-semibold">{formData.id}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/70 dark:bg-black/20 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Holder Information</p>
                    <p className="font-semibold text-lg">{formData.holderName || 'Not specified'}</p>
                    <p className="text-sm text-muted-foreground">{formData.holderEmail || 'Not specified'}</p>
                  </div>

                  <div className="bg-white/70 dark:bg-black/20 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Credential Type</p>
                    <p className="font-semibold">{formData.credentialType}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/70 dark:bg-black/20 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Issue Date</p>
                      <p className="text-sm font-medium">{new Date(formData.issueDate).toLocaleDateString()}</p>
                    </div>
                    {formData.expiryDate && (
                      <div className="bg-white/70 dark:bg-black/20 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
                        <p className="text-sm font-medium">{new Date(formData.expiryDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {metadataJson && (
                    <div className="bg-white/70 dark:bg-black/20 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-2">Metadata</p>
                      <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-auto max-h-32">
                        {metadataJson}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Credentials */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Recently Issued Credentials
            </h2>
            <p className="text-muted-foreground mt-1">View your latest issued credentials</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadCredentials} 
            disabled={loadingCredentials}
            className="border-2 border-blue-200 dark:border-blue-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950 dark:hover:to-indigo-950 h-10 px-4"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingCredentials ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loadingCredentials ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : credentials.length === 0 ? (
          <Card className="border-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-6 rounded-full bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 mb-6 shadow-lg">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                No credentials issued yet
              </h3>
              <p className="text-muted-foreground text-lg max-w-md">
                Issue your first credential using the form above to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {credentials.slice(0, 6).map((credential) => (
              <CredentialCard key={credential.id} credential={credential} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}