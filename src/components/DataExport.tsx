
import React from 'react';
import { Download, FileText, Table } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from '../hooks/use-toast';

interface DataExportProps {
  data: any[];
  filename: string;
}

const DataExport: React.FC<DataExportProps> = ({ data, filename }) => {
  const exportToPDF = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${filename} to PDF...`,
    });
    // Mock export functionality
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${filename}.pdf has been downloaded.`,
      });
    }, 2000);
  };

  const exportToExcel = () => {
    toast({
      title: "Export Started",
      description: `Exporting ${filename} to Excel...`,
    });
    // Mock export functionality
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${filename}.xlsx has been downloaded.`,
      });
    }, 2000);
  };

  const exportToCSV = () => {
    // Simple CSV export
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data[0] || {}).join(",") + "\n"
      + data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: `${filename}.csv has been downloaded.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
          <Table className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <Table className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataExport;
