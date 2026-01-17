import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Scale, Brain, CheckCircle, MessageSquare, LogOut } from 'lucide-react';
import DocumentAnalysis from './DocumentAnalysis';
import CasePrediction from './CasePrediction';
import ComplianceCheck from './ComplianceCheck';
import LegalAssistant from './LegalAssistant';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeFeature, setActiveFeature] = useState<string>('');

  const features = [
    {
      id: 'document-analysis',
      title: 'Document Analysis',
      description: 'Upload and analyze legal documents with AI assistance',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 'case-prediction',
      title: 'Case Outcome Prediction',
      description: 'Get AI-powered predictions on case outcomes',
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      id: 'compliance-check',
      title: 'Procedural Compliance',
      description: 'Ensure your procedures meet legal requirements',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 'legal-assistant',
      title: 'Legal Assistant Chat',
      description: 'Chat with your AI legal assistant for instant help',
      icon: MessageSquare,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Scale className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Legal Sage</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">AI-Powered Legal Assistant</h2>
          <p className="text-muted-foreground">
            Streamline your legal workflow with intelligent document analysis, case predictions, and compliance checks.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id} 
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                onClick={() => setActiveFeature(feature.id)}
              >
                <CardHeader className="text-center">
                  <Icon className={`h-12 w-12 mx-auto mb-2 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Content Area */}
        <Card className="min-h-[400px]">
          <CardContent className="p-8">
            {activeFeature === '' && (
              <div className="text-center py-16">
                <Scale className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Select a Feature</h3>
                <p className="text-muted-foreground">
                  Choose one of the features above to get started with your AI legal assistant.
                </p>
              </div>
            )}

            {activeFeature === 'document-analysis' && <DocumentAnalysis />}
            {activeFeature === 'case-prediction' && <CasePrediction />}
            {activeFeature === 'compliance-check' && <ComplianceCheck />}
            {activeFeature === 'legal-assistant' && <LegalAssistant />}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;