import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Brain, Sparkles, RotateCcw, TrendingUp, Scale, Users, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CasePrediction = () => {
  const [caseType, setCaseType] = useState('');
  const [caseSummary, setCaseSummary] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<string>('');
  const { toast } = useToast();

  const caseTypes = [
    { value: 'criminal', label: 'Criminal', icon: Scale },
    { value: 'civil', label: 'Civil', icon: Users },
    { value: 'corporate', label: 'Corporate', icon: Building },
    { value: 'family', label: 'Family', icon: Users },
    { value: 'employment', label: 'Employment', icon: Users },
    { value: 'land', label: 'Land & Property', icon: Building },
  ];

  const analyzeCase = async () => {
    if (!caseType || !caseSummary.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a case type and provide a case summary.",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          case_details: `Case Type: ${caseType}\n\nCase Summary:\n${caseSummary}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze case');
      }

      const data = await response.json();
      setPrediction(data.prediction);

      toast({
        title: "Analysis complete",
        description: "Case outcome prediction has been generated."
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const resetForm = () => {
    setCaseType('');
    setCaseSummary('');
    setPrediction('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1">Case Outcome Prediction</h1>
          <p className="text-muted-foreground">
            Get AI-powered insights on potential case outcomes based on Kenyan law.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Enter Case Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="case-type" className="text-sm font-medium">Case Type</Label>
              <Select value={caseType} onValueChange={setCaseType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select case type..." />
                </SelectTrigger>
                <SelectContent>
                  {caseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4 text-muted-foreground" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="case-summary" className="text-sm font-medium">Case Summary</Label>
              <Textarea
                id="case-summary"
                className="min-h-[200px] resize-none"
                placeholder="Provide a detailed summary of the case, including:

• Key facts and circumstances
• Parties involved and their roles
• Legal issues at stake
• Relevant evidence or documentation
• Applicable laws or precedents..."
                value={caseSummary}
                onChange={(e) => setCaseSummary(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {caseSummary.length} characters • More details = better predictions
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90"
                onClick={analyzeCase}
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Analyzing Case...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Predict Outcome
                  </>
                )}
              </Button>
              {(caseType || caseSummary || prediction) && (
                <Button variant="outline" onClick={resetForm}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prediction Results or Placeholder */}
        {prediction ? (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Prediction Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                {prediction}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/20">
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-20 h-20 rounded-3xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-6">
                <Brain className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Predictions</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Fill in the case details on the left to receive an AI-powered prediction of the likely outcome based on Kenyan legal precedents.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium">
                  Historical Analysis
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium">
                  Precedent Matching
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs font-medium">
                  Risk Assessment
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CasePrediction;