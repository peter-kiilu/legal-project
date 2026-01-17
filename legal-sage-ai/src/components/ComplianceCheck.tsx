import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileCheck, Calendar, AlertCircle, Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ComplianceCheck = () => {
  const [filingCheck, setFilingCheck] = useState<any>(null);
  const [deadlineCheck, setDeadlineCheck] = useState<any>(null);
  const [checkingFiling, setCheckingFiling] = useState(false);
  const [checkingDeadlines, setCheckingDeadlines] = useState(false);
  const { toast } = useToast();

  const checkFilingCompliance = async () => {
    setCheckingFiling(true);
    
    setTimeout(() => {
      setFilingCheck({
        status: 'warning',
        score: 85,
        issues: [
          { type: 'missing', item: 'Certificate of Service', severity: 'high' },
          { type: 'format', item: 'Page numbering inconsistent', severity: 'medium' },
          { type: 'content', item: 'Missing required signature block', severity: 'high' }
        ],
        compliant: [
          'Document formatting meets court standards',
          'Required headers and footers present',
          'Filing fee calculation correct',
          'Case number properly formatted'
        ]
      });
      setCheckingFiling(false);
      toast({
        title: "Filing compliance check complete",
        description: "Found 3 issues that need attention."
      });
    }, 2000);
  };

  const checkDeadlines = async () => {
    setCheckingDeadlines(true);
    
    setTimeout(() => {
      setDeadlineCheck({
        upcoming: [
          { task: 'Response to Motion', date: '2024-01-15', daysLeft: 5, priority: 'high' },
          { task: 'Discovery Deadline', date: '2024-01-22', daysLeft: 12, priority: 'medium' },
          { task: 'Expert Witness Disclosure', date: '2024-02-01', daysLeft: 22, priority: 'low' }
        ],
        overdue: [
          { task: 'Initial Disclosures', date: '2024-01-05', daysOverdue: 5, priority: 'critical' }
        ],
        completed: [
          { task: 'Case Management Conference', date: '2023-12-20' },
          { task: 'Complaint Filing', date: '2023-11-15' }
        ]
      });
      setCheckingDeadlines(false);
      toast({
        title: "Deadline check complete",
        description: "Found 1 overdue item and 3 upcoming deadlines."
      });
    }, 1500);
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      default: return 'bg-yellow-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/25">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1">Procedural Compliance</h1>
          <p className="text-muted-foreground">
            Ensure your legal procedures meet all regulatory requirements.
          </p>
        </div>
      </div>

      {/* Check Options */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow group">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/50 group-hover:scale-110 transition-transform">
                <FileCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              Court Filing Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Check if your documents meet court filing standards and identify any missing elements.
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:opacity-90"
              onClick={checkFilingCompliance}
              disabled={checkingFiling}
            >
              {checkingFiling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Checking...
                </>
              ) : (
                <>
                  <FileCheck className="h-4 w-4 mr-2" />
                  Check Compliance
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow group">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/50 group-hover:scale-110 transition-transform">
                <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              Statute of Limitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Verify important deadlines, filing dates, and statute of limitations for your case.
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:opacity-90"
              onClick={checkDeadlines}
              disabled={checkingDeadlines}
            >
              {checkingDeadlines ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Checking...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Check Deadlines
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filing Results */}
      {filingCheck && (
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Filing Compliance Report
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className={`text-3xl font-bold ${getScoreColor(filingCheck.score)}`}>
                  <span className="text-white">{filingCheck.score}</span>
                  <span className="text-white/60 text-lg">/100</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Issues */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  Issues Found ({filingCheck.issues.length})
                </h4>
                <div className="space-y-2">
                  {filingCheck.issues.map((issue: any, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityStyles(issue.severity)}`}></div>
                      <div className="flex-1">
                        <span className="text-sm font-medium">{issue.item}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getPriorityStyles(issue.severity)}`}>
                          {issue.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliant */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Compliant Items ({filingCheck.compliant.length})
                </h4>
                <div className="space-y-2">
                  {filingCheck.compliant.map((item: string, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deadline Results */}
      {deadlineCheck && (
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Deadline Management Report
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Overdue */}
            {deadlineCheck.overdue.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Overdue Items
                </h4>
                <div className="space-y-2">
                  {deadlineCheck.overdue.map((item: any, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500">
                          <AlertCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <span className="font-medium block">{item.task}</span>
                          <span className="text-sm text-muted-foreground">Due: {item.date}</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-red-600 bg-red-100 dark:bg-red-900/50 px-3 py-1 rounded-full">
                        {item.daysOverdue} days overdue
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2 text-orange-600">
                <Clock className="h-4 w-4" />
                Upcoming Deadlines
              </h4>
              <div className="space-y-2">
                {deadlineCheck.upcoming.map((item: any, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                        <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <span className="font-medium block">{item.task}</span>
                        <span className="text-sm text-muted-foreground">Due: {item.date}</span>
                      </div>
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${getPriorityStyles(item.priority)}`}>
                      {item.daysLeft} days left
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {deadlineCheck.completed.map((item: any, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-950/20"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium block">{item.task}</span>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplianceCheck;