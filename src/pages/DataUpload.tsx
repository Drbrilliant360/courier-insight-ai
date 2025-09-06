import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Eye, Trash2 } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export default function DataUpload() {
  const { toast } = useToast();
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [fileName, setFileName] = useState<string>("");
  const [fileData, setFileData] = useState<any[]>([]);
  const [fileStats, setFileStats] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  // Parse CSV data
  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
    
    return data;
  };

  // Calculate file statistics
  const calculateStats = (data: any[]) => {
    const totalRecords = data.length;
    const completedDeliveries = data.filter(row => 
      row.status?.toLowerCase().includes('completed') || 
      row.status?.toLowerCase().includes('delivered')
    ).length;
    
    const uniqueCouriers = new Set(data.map(row => row.courier_name || row.courier)).size;
    const avgDeliveryTime = data.length > 0 ? "25 min" : "N/A"; // Mock calculation
    
    return {
      totalRecords,
      completedDeliveries,
      uniqueCouriers,
      avgDeliveryTime,
      completionRate: totalRecords > 0 ? Math.round((completedDeliveries / totalRecords) * 100) : 0
    };
  };

  const handleFileUpload = useCallback((file: File) => {
    if (!file) return;
    
    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setUploadStatus("error");
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setUploadStatus("error");
      toast({
        title: "File too large",
        description: "File size must be less than 50MB",
        variant: "destructive"
      });
      return;
    }

    setFileName(file.name);
    setUploadStatus("uploading");
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsedData = parseCSV(csvText);
        
        if (parsedData.length === 0) {
          throw new Error("No valid data found");
        }
        
        setFileData(parsedData);
        setFileStats(calculateStats(parsedData));
        setUploadStatus("success");
        
        toast({
          title: "Upload successful",
          description: `${parsedData.length} records loaded from ${file.name}`,
        });
      } catch (error) {
        setUploadStatus("error");
        toast({
          title: "Upload failed",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    
    reader.onerror = () => {
      setUploadStatus("error");
      toast({
        title: "Upload failed",
        description: "Failed to read file",
        variant: "destructive"
      });
    };
    
    reader.readAsText(file);
  }, [toast]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const clearData = () => {
    setFileData([]);
    setFileStats(null);
    setFileName("");
    setUploadStatus("idle");
    toast({
      title: "Data cleared",
      description: "All uploaded data has been removed",
    });
  };

  const downloadSample = () => {
    const sampleCSV = `order_id,courier_name,pickup_location,delivery_location,pickup_time,delivery_time,status
DEL-001,John Smith,"40.7128,-74.0060","40.6962,-73.9961",2024-01-15 09:00:00,2024-01-15 09:25:00,completed
DEL-002,Maria Garcia,"40.7505,-73.9370","40.7549,-73.9840",2024-01-15 10:30:00,2024-01-15 11:00:00,completed
DEL-003,David Chen,"40.6892,-74.0445","40.7282,-73.7949",2024-01-15 11:15:00,2024-01-15 12:10:00,in_transit`;

    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_delivery_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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

      {/* Data Statistics */}
      {fileStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Records"
            value={fileStats.totalRecords.toLocaleString()}
            change={`${fileName} loaded`}
            changeType="positive"
            icon={FileSpreadsheet}
          />
          <StatCard
            title="Completed Deliveries"
            value={fileStats.completedDeliveries.toLocaleString()}
            change={`${fileStats.completionRate}% completion rate`}
            changeType="positive"
            icon={CheckCircle}
          />
          <StatCard
            title="Unique Couriers"
            value={fileStats.uniqueCouriers.toString()}
            change="Active in dataset"
            changeType="neutral"
            icon={Upload}
          />
          <StatCard
            title="Avg Delivery Time"
            value={fileStats.avgDeliveryTime}
            change="Estimated from data"
            changeType="neutral"
            icon={Upload}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <MetricCard title="Upload Delivery Dataset" glow>
          <div className="space-y-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-lg font-medium text-foreground mb-2">
                {dragActive ? 'Drop your CSV file here' : 'Drop your CSV file here'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files (Max 50MB)
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleInputChange}
                className="hidden"
                id="file-upload"
              />
              <div className="flex gap-2 justify-center">
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </label>
                <Button variant="secondary" onClick={downloadSample}>
                  <Download className="w-4 h-4 mr-2" />
                  Sample CSV
                </Button>
              </div>
            </div>

            {/* Upload Status */}
            {uploadStatus !== "idle" && (
              <div className="p-4 rounded-lg border">
                {uploadStatus === "uploading" && (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                    <span className="text-sm">Processing {fileName}...</span>
                  </div>
                )}
                {uploadStatus === "success" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-secondary">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">Successfully processed {fileName}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={clearData}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                {uploadStatus === "error" && (
                  <div className="flex items-center space-x-3 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">Error processing {fileName}</span>
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
      {fileData.length > 0 ? (
        <MetricCard title={`Data Preview - ${fileData.length} Records`} glow>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge variant="outline">
                  <Eye className="w-3 h-3 mr-1" />
                  Showing first 10 rows
                </Badge>
                <Badge variant="secondary">
                  {fileData.length} total records
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={clearData}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </Button>
            </div>
            
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border">
                    {Object.keys(fileData[0] || {}).map((header) => (
                      <th key={header} className="text-left p-3 font-medium text-foreground whitespace-nowrap">
                        {header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fileData.slice(0, 10).map((row, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                      {Object.values(row).map((value: any, colIndex) => (
                        <td key={colIndex} className="p-3 text-foreground whitespace-nowrap max-w-32 truncate">
                          {value?.toString() || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {fileData.length > 10 && (
              <div className="text-center text-sm text-muted-foreground">
                ... and {fileData.length - 10} more records
              </div>
            )}
          </div>
        </MetricCard>
      ) : (
        <MetricCard title="Data Preview">
          <div className="text-center py-8">
            <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">No data uploaded yet</p>
            <p className="text-sm text-muted-foreground">
              Upload a CSV file to see your data preview here
            </p>
          </div>
        </MetricCard>
      )}
    </div>
  );
}