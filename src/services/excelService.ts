import * as XLSX from 'xlsx';
import { LighthouseResult } from '@/types/lighthouse';

export class ExcelService {
  static async exportResults(results: LighthouseResult[]): Promise<void> {
    const workbook = XLSX.utils.book_new();
    
    // Prepare data for Excel
    const excelData = results.map(result => ({
      'Name (Website Title)': result.name,
      'Page Status (HTTP Code)': result.pageStatus,
      'URL': result.url,
      'Device': result.device,
      'Performance': result.performance,
      'Accessibility': result.accessibility,
      'Best Practices': result.bestPractices,
      'SEO': result.seo
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const colWidths = [
      { wch: 40 }, // Name
      { wch: 15 }, // Page Status
      { wch: 50 }, // URL
      { wch: 10 }, // Device
      { wch: 12 }, // Performance
      { wch: 15 }, // Accessibility
      { wch: 15 }, // Best Practices
      { wch: 8 },  // SEO
    ];
    worksheet['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lighthouse Results');

    // Generate file name with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `lighthouse-results-${timestamp}.xlsx`;

    // Write and download file
    XLSX.writeFile(workbook, fileName);
  }
}