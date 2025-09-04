import { FileText, Download, Calendar, Filter } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Button } from "@/components/ui/button";

export default function Reports() {
  const reportTemplates = [
    {
      name: "Daily Performance Report",
      description: "Comprehensive daily delivery performance metrics",
      format: "PDF",
      size: "2.3 MB",
      lastGenerated: "2 hours ago"
    },
    {
      name: "Weekly Analytics Summary",
      description: "Weekly trends, KPIs, and courier performance analysis",
      format: "Excel",
      size: "1.8 MB",
      lastGenerated: "Yesterday"
    },
    {
      name: "Anomaly Detection Report",
      description: "Detailed anomaly incidents and resolution tracking",
      format: "PDF",
      size: "956 KB",
      lastGenerated: "4 hours ago"
    },
    {
      name: "Courier Leaderboard",
      description: "Performance rankings and gamification metrics",
      format: "PDF",
      size: "1.2 MB",
      lastGenerated: "1 hour ago"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Export</h1>
        <p className="text-muted-foreground mt-1">
          Generate and download comprehensive delivery intelligence reports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Templates */}
        <MetricCard title="Available Reports" className="lg:col-span-2">
          <div className="space-y-4">
            {reportTemplates.map((report, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{report.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Format: {report.format}</span>
                      <span>Size: {report.size}</span>
                      <span>Last: {report.lastGenerated}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </MetricCard>

        {/* Quick Actions */}
        <MetricCard title="Quick Actions">
          <div className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Generate Custom Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Reports
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter Data
            </Button>
          </div>
        </MetricCard>
      </div>

      {/* Custom Report Builder */}
      <MetricCard title="Custom Report Builder" glow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Report Type</label>
              <select className="w-full p-3 border border-border rounded-lg bg-background">
                <option>Performance Analytics</option>
                <option>Delivery Trends</option>
                <option>Courier Analysis</option>
                <option>Anomaly Summary</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" className="p-3 border border-border rounded-lg bg-background" />
                <input type="date" className="p-3 border border-border rounded-lg bg-background" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Export Format</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="format" className="text-primary" defaultChecked />
                  <span className="text-sm text-foreground">PDF Report</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="format" className="text-primary" />
                  <span className="text-sm text-foreground">Excel Spreadsheet</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="format" className="text-primary" />
                  <span className="text-sm text-foreground">CSV Data</span>
                </label>
              </div>
            </div>
            <Button className="w-full btn-hero">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </MetricCard>
    </div>
  );
}