import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Brain, CheckCircle, MessageSquare, Scale, Sparkles, TrendingUp, Clock, Shield } from 'lucide-react';

const DashboardHome = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'document-analysis',
      path: '/document-analysis',
      title: 'Document Analysis',
      description: 'Upload and analyze legal documents with AI assistance',
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      shadowColor: 'shadow-blue-500/25',
      bgHover: 'hover:bg-blue-50 dark:hover:bg-blue-950/30'
    },
    {
      id: 'case-prediction',
      path: '/case-prediction',
      title: 'Case Prediction',
      description: 'Get AI-powered predictions on case outcomes',
      icon: Brain,
      gradient: 'from-purple-500 to-purple-600',
      shadowColor: 'shadow-purple-500/25',
      bgHover: 'hover:bg-purple-50 dark:hover:bg-purple-950/30'
    },
    {
      id: 'compliance-check',
      path: '/compliance',
      title: 'Compliance Check',
      description: 'Ensure your procedures meet legal requirements',
      icon: CheckCircle,
      gradient: 'from-teal-500 to-teal-600',
      shadowColor: 'shadow-teal-500/25',
      bgHover: 'hover:bg-teal-50 dark:hover:bg-teal-950/30'
    },
    {
      id: 'legal-assistant',
      path: '/chat',
      title: 'Legal Assistant',
      description: 'Chat with your AI legal assistant for instant help',
      icon: MessageSquare,
      gradient: 'from-orange-500 to-orange-600',
      shadowColor: 'shadow-orange-500/25',
      bgHover: 'hover:bg-orange-50 dark:hover:bg-orange-950/30'
    }
  ];

  const stats = [
    { label: 'Documents Analyzed', value: '34', icon: FileText, trend: '+12%' },
    { label: 'Cases Predicted', value: '23', icon: Brain, trend: '+8%' },
    { label: 'Compliance Checks', value: '12', icon: Shield, trend: '+15%' },
    { label: 'Time Saved', value: '32h', icon: Clock, trend: '+23%' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-8 text-white">
        <div className="absolute inset-0 pattern-dots opacity-10"></div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Scale className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium text-white/80">AI-Powered Platform</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Legal Sage</h1>
              <p className="text-white/80 max-w-lg">
                Streamline your legal workflow with intelligent document analysis, case predictions, and compliance checks.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="secondary"
              onClick={() => navigate('/document-analysis')}
              className="bg-white/20 text-white hover:bg-white/30 border-0"
            >
              Quick Start
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-card/80 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id} 
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md ${feature.bgHover}`}
                onClick={() => navigate(feature.path)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg ${feature.shadowColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    className={`w-full bg-gradient-to-r ${feature.gradient} hover:opacity-90 text-white border-0`}
                    size="sm"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity / Quick Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Quick Tips</CardTitle>
            <CardDescription>Get the most out of Legal Sage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <div className="p-2 rounded-lg bg-blue-500">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Upload Multiple Documents</h4>
                <p className="text-xs text-muted-foreground">Analyze multiple documents at once for comprehensive insights.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30">
              <div className="p-2 rounded-lg bg-purple-500">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Detailed Case Inputs</h4>
                <p className="text-xs text-muted-foreground">Provide detailed case information for more accurate predictions.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30">
              <div className="p-2 rounded-lg bg-teal-500">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Ask Specific Questions</h4>
                <p className="text-xs text-muted-foreground">Use the chat to ask specific questions about your documents.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-lg">Platform Highlights</CardTitle>
            <CardDescription>What makes Legal Sage special</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">Powered by advanced AI models</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">Specialized for Kenyan law</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">24/7 availability</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm">Regular model updates</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
