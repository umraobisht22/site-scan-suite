import React, { useState } from 'react';
import { UrlInput } from '@/components/UrlInput';
import { ProgressTracker } from '@/components/ProgressTracker';
import { ResultsTable } from '@/components/ResultsTable';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { LighthouseResult, ProcessingStats } from '@/types/lighthouse';
import { PageSpeedService } from '@/services/pageSpeedService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, SkipForward } from 'lucide-react';

const Index = () => {
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [results, setResults] = useState<LighthouseResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<ProcessingStats>({
    total: 0,
    completed: 0,
    errors: 0,
    currentUrl: ''
  });
  const { toast } = useToast();

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const testUrls = async (urls: string[]) => {
    setIsProcessing(true);
    setResults([]);
    
    // Create initial results with pending status
    const initialResults: LighthouseResult[] = [];
    urls.forEach(url => {
      ['mobile', 'desktop'].forEach(device => {
        initialResults.push({
          id: generateId(),
          url,
          name: url,
          pageStatus: 0,
          device: device as 'mobile' | 'desktop',
          performance: 0,
          accessibility: 0,
          bestPractices: 0,
          seo: 0,
          status: 'pending'
        });
      });
    });

    setResults(initialResults);
    setStats({
      total: initialResults.length,
      completed: 0,
      errors: 0,
      currentUrl: urls[0]
    });

    try {
      for (let i = 0; i < initialResults.length; i++) {
        const result = initialResults[i];
        
        setStats(prev => ({
          ...prev,
          currentUrl: result.url
        }));

        // Update status to testing
        setResults(prev => 
          prev.map(r => 
            r.id === result.id 
              ? { ...r, status: 'testing' as const }
              : r
          )
        );

        try {
          const testResult = isDemoMode 
            ? await PageSpeedService.testUrlWithFallback(result.url, result.device)
            : await PageSpeedService.testUrl(result.url, result.device);

          // Update with results
          setResults(prev => 
            prev.map(r => 
              r.id === result.id 
                ? { ...r, ...testResult }
                : r
            )
          );

          setStats(prev => ({
            ...prev,
            completed: prev.completed + 1
          }));

        } catch (error) {
          setResults(prev => 
            prev.map(r => 
              r.id === result.id 
                ? { 
                    ...r, 
                    status: 'error' as const,
                    error: 'Testing failed',
                    pageStatus: 0 
                  }
                : r
            )
          );

          setStats(prev => ({
            ...prev,
            errors: prev.errors + 1
          }));
        }
      }

      toast({
        title: "Testing completed",
        description: `Processed ${initialResults.length} tests`,
      });

    } catch (error) {
      toast({
        title: "Testing failed",
        description: "An error occurred during testing",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setStats(prev => ({ ...prev, currentUrl: '' }));
    }
  };

  const handleDemoMode = () => {
    setIsDemoMode(true);
    setIsApiKeySet(true);
    toast({
      title: "Demo mode enabled",
      description: "You can now test with simulated data",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Website Performance Tester</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test multiple websites using Google Lighthouse to analyze performance, accessibility, best practices, and SEO across mobile and desktop devices
          </p>
          {isDemoMode && (
            <Badge variant="secondary" className="bg-gradient-success text-success-foreground">
              <Zap className="h-3 w-3 mr-1" />
              Demo Mode Active
            </Badge>
          )}
        </div>

        {/* API Key Setup or Demo Mode */}
        {!isApiKeySet && (
          <div className="space-y-4">
            <ApiKeyInput onApiKeySet={setIsApiKeySet} />
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={handleDemoMode}
                className="flex items-center gap-2"
              >
                <SkipForward className="h-4 w-4" />
                Skip & Use Demo Mode
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {isApiKeySet && (
          <>
            <UrlInput onUrlsSubmit={testUrls} isProcessing={isProcessing} />
            <ProgressTracker stats={stats} isProcessing={isProcessing} />
            <ResultsTable results={results.filter(r => r.status === 'completed' || r.status === 'error')} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;