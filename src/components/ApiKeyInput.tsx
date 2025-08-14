import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { PageSpeedService } from '@/services/pageSpeedService';

interface ApiKeyInputProps {
  onApiKeySet: (isSet: boolean) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isStored, setIsStored] = useState(false);

  useEffect(() => {
    const storedKey = PageSpeedService.getApiKey();
    if (storedKey) {
      setIsStored(true);
      onApiKeySet(true);
    }
  }, [onApiKeySet]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('pagespeed_api_key', apiKey.trim());
      PageSpeedService.setApiKey(apiKey.trim());
      setIsStored(true);
      onApiKeySet(true);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('pagespeed_api_key');
    setApiKey('');
    setIsStored(false);
    onApiKeySet(false);
  };

  if (isStored) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <Key className="h-5 w-5" />
            API Key Configured
          </CardTitle>
          <CardDescription>
            PageSpeed Insights API key is set and ready to use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleClearKey}>
            Clear API Key
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          PageSpeed Insights API Setup
        </CardTitle>
        <CardDescription>
          Enter your Google PageSpeed Insights API key to start testing websites
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            <div className="space-y-2">
              <p>To use this tool, you need a free Google PageSpeed Insights API key:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Go to the Google Developers Console</li>
                <li>Create a new project or select an existing one</li>
                <li>Enable the PageSpeed Insights API</li>
                <li>Create credentials (API key)</li>
              </ol>
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => window.open('https://developers.google.com/speed/docs/insights/v5/get-started', '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Get API Key Instructions
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="relative">
            <Input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              placeholder="Enter your PageSpeed Insights API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button onClick={handleSaveKey} disabled={!apiKey.trim()}>
          Save API Key
        </Button>

        <Alert>
          <AlertDescription className="text-sm text-muted-foreground">
            <strong>Demo Mode:</strong> You can skip this step to test the interface with simulated data. 
            For real testing, an API key is required.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};