import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Button } from "@/components/ui/button";

export default function DataUpload() {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [fileName, setFileName] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setUploadStatus("uploading");
      
      // Simulate upload process
      setTimeout(() => {
        setUploadStatus("success");
      }, 2000);
    }
  };

  const mockDataPreview = [
    { id: "DEL-001", courier: "John Smith", pickup: "NYC", delivery: "Brooklyn", status: "Completed" },
    { id: "DEL-002", courier: "Maria Garcia", pickup: "Manhattan", delivery: "Queens", status: "In Transit" },
    { id: "DEL-003", courier: "David Chen", pickup: "Bronx", delivery: "Staten Island", status: "Completed" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Upload & Processing</h1>
        <p className="text-muted-foreground mt-1">
          Upload your delivery dataset for AI analysis and insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <MetricCard title="Upload Delivery Dataset">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                Drop your CSV file here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer">
                  Choose File
                </Button>
              </label>
            </div>

            {/* Upload Status */}
            {uploadStatus !== "idle" && (
              <div className="p-4 rounded-lg border">
                {uploadStatus === "uploading" && (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                    <span className="text-sm">Uploading {fileName}...</span>
                  </div>
                )}
                {uploadStatus === "success" && (
                  <div className="flex items-center space-x-3 text-secondary">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">Successfully uploaded {fileName}</span>
                  </div>
                )}
                {uploadStatus === "error" && (
                  <div className="flex items-center space-x-3 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">Error uploading {fileName}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </MetricCard>

        {/* File Requirements */}
        <MetricCard title="Dataset Requirements">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <FileSpreadsheet className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium text-foreground">CSV Format</h4>
                <p className="text-sm text-muted-foreground">
                  File must be in CSV format with comma separators
                </p>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Required Columns:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• order_id (unique identifier)</li>
                <li>• courier_name (delivery person)</li>
                <li>• pickup_location (origin coordinates)</li>
                <li>• delivery_location (destination coordinates)</li>
                <li>• pickup_time (timestamp)</li>
                <li>• delivery_time (timestamp)</li>
                <li>• status (completed/in_transit/failed)</li>
              </ul>
            </div>

            <div className="text-sm text-muted-foreground">
              <p><strong>Max file size:</strong> 50MB</p>
              <p><strong>Max records:</strong> 100,000 deliveries</p>
            </div>
          </div>
        </MetricCard>
      </div>

      {/* Data Preview */}
      <MetricCard title="Data Preview">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-foreground">Order ID</th>
                <th className="text-left p-3 font-medium text-foreground">Courier</th>
                <th className="text-left p-3 font-medium text-foreground">Pickup</th>
                <th className="text-left p-3 font-medium text-foreground">Delivery</th>
                <th className="text-left p-3 font-medium text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockDataPreview.map((row) => (
                <tr key={row.id} className="border-b border-border/50">
                  <td className="p-3 text-foreground">{row.id}</td>
                  <td className="p-3 text-foreground">{row.courier}</td>
                  <td className="p-3 text-muted-foreground">{row.pickup}</td>
                  <td className="p-3 text-muted-foreground">{row.delivery}</td>
                  <td className="p-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === "Completed" 
                        ? "bg-secondary/10 text-secondary"
                        : "bg-accent/10 text-accent"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MetricCard>
    </div>
  );
}