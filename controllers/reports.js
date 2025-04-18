const Report = require('../models/Report');
const puppeteer = require('puppeteer');
const exceljs = require('exceljs');

// Get all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ month: 1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generate PDF
exports.generatePDF = async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Use your actual frontend URL or a template
    await page.goto('http://localhost:3000/dashboard?export=true', {
      waitUntil: 'networkidle0'
    });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true
    });
    
    await browser.close();
    
    res.contentType('application/pdf');
    res.send(pdf);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generate Excel
exports.generateExcel = async (req, res) => {
  try {
    const reports = await Report.find().sort({ month: 1 });
    
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Reports');
    
    // Add headers
    worksheet.columns = [
      { header: 'Month', key: 'month', width: 15 },
      { header: 'Attendance %', key: 'attendancePercentage', width: 15 },
      { header: 'Complaints', key: 'complaints', width: 15 },
      { header: 'Leaves', key: 'leaves', width: 15 }
    ];
    
    // Add data
    reports.forEach(report => {
      worksheet.addRow({
        month: report.month,
        attendancePercentage: report.attendancePercentage,
        complaints: report.complaints,
        leaves: report.leaves
      });
    });
    
    // Set response headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reports.xlsx'
    );
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};