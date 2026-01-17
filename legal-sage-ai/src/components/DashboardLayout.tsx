import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Scale, 
  FileText, 
  Brain, 
  CheckCircle, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to auth if not authenticated
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

  if (!user) {
    navigate('/auth');
    return null;
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/document-analysis', label: 'Documents', icon: FileText },
    { path: '/case-prediction', label: 'Predictions', icon: Brain },
    { path: '/compliance', label: 'Compliance', icon: CheckCircle },
    { path: '/chat', label: 'Assistant', icon: MessageSquare },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const getPageTitle = () => {
    const item = navItems.find(item => item.path === location.pathname);
    return item?.label || 'Dashboard';
  };

  // Get display name from user metadata or fallback to email
  const getDisplayName = () => {
    const metadata = user?.user_metadata;
    if (metadata?.full_name) {
      // Take only first two names if full_name has more
      const names = metadata.full_name.split(' ').slice(0, 2);
      return names.join(' ');
    }
    if (metadata?.name) {
      const names = metadata.name.split(' ').slice(0, 2);
      return names.join(' ');
    }
    if (metadata?.first_name) {
      return metadata.last_name 
        ? `${metadata.first_name} ${metadata.last_name}`
        : metadata.first_name;
    }
    // Fallback: extract first two names from email (before @)
    // Handles formats like: peter.musila@email.com, peter_musila@email.com
    const emailName = user?.email?.split('@')[0] || 'User';
    const nameParts = emailName.split(/[._-]/).slice(0, 2);
    return nameParts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent group-hover:shadow-lg group-hover:shadow-primary/25 transition-all">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold hidden sm:block">Legal Sage</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center bg-muted/50 rounded-full p-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {getDisplayName()}
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut} 
                className="hidden sm:flex border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t pt-4 animate-in slide-in-from-top-2">
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                    </Link>
                  );
                })}
                <div className="border-t pt-4 mt-3 space-y-3">
                  <div className="px-4 py-2 text-sm flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-medium truncate">{getDisplayName()}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Home</Link>
            {location.pathname !== '/dashboard' && (
              <>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-foreground font-medium">{getPageTitle()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>© 2026 Legal Sage. All rights reserved.</span>
            <span className="flex items-center gap-1">
              Powered by <span className="text-primary font-medium">AI</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
