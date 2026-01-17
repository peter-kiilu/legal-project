import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Shield, Brain, Zap, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-500"></div>
        <div className="pattern-dots absolute inset-0 opacity-50"></div>
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Legal Sage</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
          <Sparkles className="h-4 w-4 mr-2" />
          AI-Powered Legal Intelligence
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="block">Transform Your</span>
          <span className="bg-gradient-to-r from-primary via-accent to-purple-500 bg-clip-text text-transparent">
            Legal Practice
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          AI-powered assistant that supports judges, lawyers, and clerks by analyzing legal documents, 
          predicting case outcomes, and ensuring procedural compliance in real-time.
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap mb-16">
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 px-8"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="border-2 hover:bg-muted/50 px-8"
          >
            Watch Demo
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Enterprise Security</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>99.9% Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>GDPR Compliant</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful AI Features</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to streamline your legal workflow and make better decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">Document Analysis</CardTitle>
              <CardDescription className="text-base">
                Advanced AI analysis of legal documents with intelligent summarization and key insight extraction.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/25">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">Case Prediction</CardTitle>
              <CardDescription className="text-base">
                Leverage machine learning to predict case outcomes based on historical data and case patterns.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-teal-500/25">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">Compliance Check</CardTitle>
              <CardDescription className="text-base">
                Real-time procedural compliance monitoring to ensure all legal requirements are met.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">98%</div>
            <p className="text-muted-foreground">Accuracy Rate</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">10k+</div>
            <p className="text-muted-foreground">Documents Analyzed</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">50%</div>
            <p className="text-muted-foreground">Time Saved</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">24/7</div>
            <p className="text-muted-foreground">AI Availability</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary via-primary to-accent text-white">
          <div className="absolute inset-0 pattern-dots opacity-10"></div>
          <CardContent className="relative p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Legal Practice?</h3>
            <p className="text-white/80 mb-8 text-lg max-w-xl mx-auto">
              Join legal professionals who are already using AI to streamline their workflow and improve case outcomes.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all px-8"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold">Legal Sage</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Legal Sage. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
