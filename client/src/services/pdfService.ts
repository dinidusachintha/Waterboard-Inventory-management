import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Inventory } from '@/types/inventory.types';
import { formatDate, formatNumber } from '@/utils/formatters';

export const generateInventoryPDF = (inventory: Inventory[]) => {
  const doc = new jsPDF('landscape');
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('Waterboard Inventory Report', 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
  
  // Add summary
  const totalItems = inventory.length;
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = inventory.filter(item => item.status === 'low-stock').length;
  const outOfStockCount = inventory.filter(item => item.status === 'out-of-stock').length;
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Summary:`, 20, 45);
  doc.setFontSize(10);
  doc.text(`Total Items: ${totalItems}`, 20, 55);
  doc.text(`Total Quantity: ${totalQuantity}`, 20, 62);
  doc.text(`Low Stock Items: ${lowStockCount}`, 20, 69);
  doc.text(`Out of Stock Items: ${outOfStockCount}`, 20, 76);
  
  // Create table
  const tableData = inventory.map(item => [
    item.itemCode,
    item.itemName,
    item.category,
    `${formatNumber(item.quantity)} ${item.unit}`,
    item.status === 'in-stock' ? 'In Stock' : item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock',
    item.sectionName || item.sectionId,
    item.location,
    formatDate(item.purchaseDate)
  ]);
  
  autoTable(doc, {
    startY: 85,
    head: [['Item Code', 'Item Name', 'Category', 'Quantity', 'Status', 'Section', 'Location', 'Purchase Date']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 35 },
      6: { cellWidth: 30 },
      7: { cellWidth: 25 }
    }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount} - Waterboard Inventory Management System`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`inventory-report-${formatDate(new Date())}.pdf`);
};

export const generateSingleItemPDF = (item: Inventory) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('Waterboard Inventory Item Details', 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
  
  // Add item details
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Item Information', 20, 50);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  const details = [
    ['Item Code:', item.itemCode],
    ['Item Name:', item.itemName],
    ['Category:', item.category],
    ['Quantity:', `${formatNumber(item.quantity)} ${item.unit}`],
    ['Minimum Stock:', `${item.minimumStock} ${item.unit}`],
    ['Maximum Stock:', `${item.maximumStock} ${item.unit}`],
    ['Status:', item.status === 'in-stock' ? 'In Stock' : item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'],
    ['Location:', item.location],
    ['Section:', item.sectionName || item.sectionId],
    ['Supplier:', item.supplier],
    ['Purchase Date:', formatDate(item.purchaseDate)],
    ['Expiry Date:', item.expiryDate ? formatDate(item.expiryDate) : 'N/A'],
    ['Notes:', item.notes || 'No notes']
  ];
  
  let y = 60;
  details.forEach(detail => {
    doc.setFont('helvetica', 'bold');
    doc.text(detail[0], 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(detail[1], 80, y);
    y += 8;
  });
  
  // Add status color indicator
  const statusColor = item.status === 'in-stock' ? [34, 197, 94] : 
                      item.status === 'low-stock' ? [234, 179, 8] : [239, 68, 68];
  
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.rect(150, 58, 8, 8, 'F');
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Waterboard Inventory Management System - Official Document',
    doc.internal.pageSize.getWidth() / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );
  
  doc.save(`inventory-item-${item.itemCode}.pdf`);
};