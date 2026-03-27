import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Plus, Edit2, Trash2, Download, Send, LogOut, Pill, FileText, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import app from '../../firebase';

interface Medicine {
  id: string;
  name: string;
  duration: string;
  createdAt?: number;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
  });

  const db = getFirestore(app);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) { 
      navigate('/auth'); 
      return; 
    }
    const userData = JSON.parse(currentUser);
    setUser(userData);
    loadMedicines(userData.id);
  }, [navigate]);

  const loadMedicines = async (userId: string) => {
    setIsLoading(true);
    try {
      const medicinesRef = collection(db, 'customers', userId, 'medicines');
      const q = query(medicinesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const medicinesData: Medicine[] = [];
      querySnapshot.forEach((doc) => {
        medicinesData.push({
          id: doc.id,
          ...doc.data()
        } as Medicine);
      });
      
      setMedicines(medicinesData);
    } catch (err) {
      console.error('Load medicines error:', err);
      toast.error('Could not load medicines from server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter medicine name');
      return;
    }
    
    setIsSaving(true);
    try {
      const medicinesRef = collection(db, 'customers', user.id, 'medicines');
      const newMedicine = {
        name: formData.name.trim(),
        duration: formData.duration.trim() || '',
        createdAt: Date.now(),
      };
      
      const docRef = await addDoc(medicinesRef, newMedicine);
      
      setMedicines([{
        id: docRef.id,
        ...newMedicine
      }, ...medicines]);
      
      toast.success('Medicine added successfully!');
      resetForm();
    } catch (err) {
      console.error('Add medicine error:', err);
      toast.error('Failed to add medicine');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter medicine name');
      return;
    }
    
    setIsSaving(true);
    try {
      const medicineRef = doc(db, 'customers', user.id, 'medicines', editingId!);
      const updatedMedicine = {
        name: formData.name.trim(),
        duration: formData.duration.trim() || '',
        updatedAt: Date.now(),
      };
      
      await updateDoc(medicineRef, updatedMedicine);
      
      const updatedMedicines = medicines.map((m) => 
        m.id === editingId ? { ...m, ...updatedMedicine } : m
      );
      setMedicines(updatedMedicines);
      
      toast.success('Medicine updated successfully!');
      resetForm();
    } catch (err) {
      console.error('Update medicine error:', err);
      toast.error('Failed to update medicine');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this medicine?')) return;
    
    try {
      const medicineRef = doc(db, 'customers', user.id, 'medicines', id);
      await deleteDoc(medicineRef);
      
      const updatedMedicines = medicines.filter((m) => m.id !== id);
      setMedicines(updatedMedicines);
      
      toast.success('Medicine deleted successfully!');
    } catch (err) {
      console.error('Delete medicine error:', err);
      toast.error('Failed to delete medicine');
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setFormData({
      name: medicine.name,
      duration: medicine.duration,
    });
    setEditingId(medicine.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({ name: '', duration: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  // ── PRESCRIPTION PDF ──────────────────────────────────────────────
  const generatePrescriptionPDF = () => {
    if (medicines.length === 0) { toast.error('No medicines to generate PDF'); return null; }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    // ── Background ──
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, 'F');

    // ── Top border strip ──
    doc.setFillColor(30, 132, 73);
    doc.rect(0, 0, W, 3, 'F');
    doc.setFillColor(46, 204, 113);
    doc.rect(0, 3, W, 2, 'F');

    // ── Bottom border strip ──
    doc.setFillColor(30, 132, 73);
    doc.rect(0, H - 3, W, 3, 'F');
    doc.setFillColor(46, 204, 113);
    doc.rect(0, H - 5, W, 2, 'F');

    // ── Side left accent ──
    doc.setFillColor(234, 250, 241);
    doc.rect(0, 0, 10, H, 'F');
    doc.setFillColor(46, 204, 113);
    doc.rect(0, 0, 2, H, 'F');

    // ── Store Header ──
    // Red cross symbol
    doc.setFillColor(220, 53, 69);
    doc.rect(W / 2 - 1, 8, 2, 10, 'F');
    doc.rect(W / 2 - 4, 11, 8, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 132, 73);
    doc.text('VIKAS MEDICAL & PROVISION STORE', W / 2, 25, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text('Court Road, Near Old Police Station, Umreth, Gujarat – 388220', W / 2, 31, { align: 'center' });
    doc.text('Ph: +91 98244 19469  |  +91 83477 23201  |  Timings: 8:45 AM – 10:30 PM', W / 2, 36, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.text('Reg. Pharmacist: Vikas Gandhi  |  Proprietor: Tejas Gandhi', W / 2, 41, { align: 'center' });

    // ── Divider ──
    doc.setDrawColor(46, 204, 113);
    doc.setLineWidth(0.8);
    doc.line(14, 44, W - 5, 44);
    doc.setDrawColor(200, 240, 220);
    doc.setLineWidth(0.3);
    doc.line(14, 45.5, W - 5, 45.5);

    // ── Rx Symbol ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(30, 132, 73);
    doc.text('Rx', 15, 62);

    // ── Patient Info Box ──
    doc.setFillColor(245, 255, 250);
    doc.setDrawColor(200, 240, 220);
    doc.setLineWidth(0.4);
    doc.roundedRect(38, 49, W - 43, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(44, 62, 80);
    doc.text('Patient Name:', 42, 56);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 132, 73);
    doc.text(user?.name || 'N/A', 42 + 28, 56);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(44, 62, 80);
    doc.text('Mobile:', 42, 63);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(44, 62, 80);
    doc.text(user?.mobile || 'N/A', 42 + 14, 63);

    // Date — right aligned
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${dateStr}`, W - 8, 56, { align: 'right' });

    // ── Divider ──
    doc.setDrawColor(200, 240, 220);
    doc.setLineWidth(0.4);
    doc.line(14, 70, W - 5, 70);

    // ── Medicine Table (Updated to show only Name and Duration) ──
    const tableData = medicines.map((med, idx) => [
      `${idx + 1}.`,
      med.name,
      med.duration && med.duration !== '' ? med.duration : 'As directed',
    ]);

    autoTable(doc, {
      head: [['#', 'Medicine Name', 'Duration']],
      body: tableData,
      startY: 73,
      margin: { left: 14, right: 5 },
      theme: 'plain',
      headStyles: {
        fillColor: [234, 250, 241],
        textColor: [30, 132, 73],
        fontSize: 8.5,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
        lineColor: [46, 204, 113],
        lineWidth: { bottom: 0.5 },
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center', textColor: [150, 150, 150] },
        1: { cellWidth: 85, fontStyle: 'bold', textColor: [30, 50, 80] },
        2: { cellWidth: 65, halign: 'center' },
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [44, 62, 80],
        cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
        lineColor: [220, 245, 230],
        lineWidth: { bottom: 0.2 },
      },
      alternateRowStyles: {
        fillColor: [247, 254, 250],
      },
    });

    const finalY: number = (doc as any).lastAutoTable.finalY || 73;

    // ── Total count line ──
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Total: ${medicines.length} medicine${medicines.length > 1 ? 's' : ''} prescribed`, W - 8, finalY + 7, { align: 'right' });

    // ── Signature section ──
    const sigY = Math.max(finalY + 35, H - 45);
    doc.setDrawColor(180, 220, 180);
    doc.setLineWidth(0.3);
    doc.line(W - 65, sigY + 12, W - 8, sigY + 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(44, 62, 80);
    doc.text('Pharmacist / Store Owner', W - 36, sigY + 17, { align: 'center' });
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 132, 73);
    doc.text('Vikas Gandhi (Reg. Pharmacist)', W - 36, sigY + 22, { align: 'center' });

    // ── Footer ──
    doc.setDrawColor(200, 240, 220);
    doc.setLineWidth(0.4);
    doc.line(14, H - 14, W - 5, H - 14);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a medicine list prepared by Vikas Medical & Provision Store. Always follow your doctor\'s advice.', W / 2, H - 9, { align: 'center' });
    doc.text('Vikas Medical & Provision Store  |  Court Road, Near Old Police Station, Umreth  |  +91 98244 19469', W / 2, H - 5.5, { align: 'center' });

    return doc;
  };

  const handleDownloadPDF = () => {
    const doc = generatePrescriptionPDF();
    if (doc) {
      doc.save(`prescription-${user?.name}-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Prescription PDF downloaded!');
    }
  };

  const handleSendToAdmin = () => {
    const doc = generatePrescriptionPDF();
    if (doc) {
      doc.save(`prescription-${user?.name}.pdf`);
      const message = ` *Vikas Medical & Provision Store*\n\nHello, I'm *${user?.name}* (${user?.mobile}). I'm sharing my medicine list.\n*Medicines (${medicines.length}):*\n${medicines.map((m, i) => `${i + 1}. ${m.name} — ${m.duration || 'As directed'}`).join('\n')}`;
      const whatsappUrl = `https://wa.me/919824419469?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      toast.info('PDF saved. Please attach it to WhatsApp.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAFAF1]/30 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>V</span>
              </div>
              <div>
                <h1 className="text-lg md:text-xl text-[#2C3E50]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                  Vikas Medical
                </h1>
                <p className="text-xs text-[#1E8449]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Welcome, {user.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => loadMedicines(user.id)}
                variant="outline"
                size="sm"
                className="border-2 border-[#EAFAF1] text-[#2C3E50] hover:bg-[#EAFAF1]"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-2 border-[#2ECC71] text-[#2ECC71] hover:bg-[#EAFAF1]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shop Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#2ECC71] to-[#1E8449] rounded-3xl p-6 md:p-8 mb-8 text-white shadow-xl"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                Vikas Medical & Provision Store
              </h2>
              <p className="text-white/90 mb-3 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Court Road, Near Old Police Station, Umreth, Gujarat
              </p>
              <div className="space-y-1 text-sm">
                <p style={{ fontFamily: 'Inter, sans-serif' }}>📞 +91 98244 19469</p>
                <p style={{ fontFamily: 'Inter, sans-serif' }}>📞 +91 83477 23201</p>
                <p style={{ fontFamily: 'Inter, sans-serif' }}>⏰ 8:45 AM – 10:30 PM (All Days)</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
                  <Pill className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-white/90 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Your Health, Our Priority
                </p>
                <p className="text-xs text-white/70 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Trusted for 28+ Years
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <Button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-gradient-to-r from-[#2ECC71] to-[#1E8449] hover:from-[#27ae60] hover:to-[#196f3d] text-white shadow-lg"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Medicine
          </Button>

          {medicines.length > 0 && (
            <>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="border-2 border-[#2ECC71] text-[#2ECC71] hover:bg-[#EAFAF1]"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Prescription
              </Button>
              <Button
                onClick={handleSendToAdmin}
                variant="outline"
                className="border-2 border-[#2ECC71] text-[#2ECC71] hover:bg-[#EAFAF1]"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
              >
                <Send className="w-5 h-5 mr-2" />
                Send to Store
              </Button>
            </>
          )}
        </motion.div>

        {/* Add/Edit Form - Only Name and Duration (both optional) */}
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#EAFAF1] mb-8"
          >
            <h3 className="text-2xl text-[#2C3E50] mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
              {editingId ? 'Edit Medicine' : 'Add New Medicine'}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Medicine Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Paracetamol"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">Optional but recommended</p>
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 5 days / 1 week"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">Optional</p>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={editingId ? handleUpdate : handleAdd}
                disabled={isSaving}
                className="bg-gradient-to-r from-[#2ECC71] to-[#1E8449] hover:from-[#27ae60] hover:to-[#196f3d] text-white"
              >
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? 'Update' : 'Add'} Medicine
              </Button>
              <Button onClick={resetForm} variant="outline" className="border-2 border-gray-300">
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Medicines List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-10 h-10 text-[#2ECC71] animate-spin" />
            <span className="ml-3 text-[#2C3E50]" style={{ fontFamily: 'Inter, sans-serif' }}>Loading medicines...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {medicines.length === 0 ? (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center py-12"
  >
    <FileText className="w-16 h-16 mx-auto mb-4 text-[#2ECC71]/50" />
    <h3 className="text-xl text-[#2C3E50] mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
      No Medicines Added Yet
    </h3>
    <p className="text-[#2C3E50]/70" style={{ fontFamily: 'Inter, sans-serif' }}>
      Click "Add Medicine" to start your medicine list
    </p>
  </motion.div>
) : (
  <div className="space-y-3 sm:space-y-4">
    {medicines.map((medicine, index) => (
      <motion.div
        key={medicine.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-[#EAFAF1] overflow-hidden"
      >
        {/* Mobile Layout */}
        <div className="block sm:hidden">
          <div className="p-3">
            {/* Top Row: Serial Number and Action Buttons */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {index + 1}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(medicine)}
                  className="p-1.5 rounded-lg border-2 border-[#2ECC71] text-[#2ECC71] hover:bg-[#EAFAF1] transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(medicine.id)}
                  className="p-1.5 rounded-lg border-2 border-red-400 text-red-400 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            {/* Medicine Name */}
            <h4 
              className="text-[15px] font-semibold text-[#2C3E50] mb-2 leading-relaxed break-words"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {medicine.name}
            </h4>
            
            {/* Duration Badge */}
            <div className="mt-2">
              {medicine.duration && medicine.duration !== '' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EAFAF1] text-[#1E8449] rounded-lg font-medium text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span>⏱️</span>
                  <span>{medicine.duration}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span>⏱️</span>
                  <span>Duration: As directed</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Tablet & Desktop Layout */}
        <div className="hidden sm:block">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-4">
              {/* Serial Number */}
              <div className="flex-shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {index + 1}
                </div>
              </div>
              
              {/* Medicine Info */}
              <div className="flex-1 min-w-0">
                <h4 
                  className="text-base md:text-lg font-semibold text-[#2C3E50] mb-2 break-words"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {medicine.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {medicine.duration && medicine.duration !== '' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EAFAF1] text-[#1E8449] rounded-lg font-medium text-xs md:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span>⏱️</span>
                      <span>{medicine.duration}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs md:text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span>⏱️</span>
                      <span>Duration: As directed</span>
                    </span>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  onClick={() => handleEdit(medicine)}
                  variant="outline"
                  size="sm"
                  className="border-2 border-[#2ECC71] text-[#2ECC71] hover:bg-[#EAFAF1] h-9 px-3"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(medicine.id)}
                  variant="outline"
                  size="sm"
                  className="border-2 border-red-400 text-red-400 hover:bg-red-50 h-9 px-3"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>

            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#2C3E50] to-[#1a252f] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p style={{ fontFamily: 'Inter, sans-serif' }}>
            © {new Date().getFullYear()} Vikas Medical & Provision Store. All rights reserved.
          </p>
          <p className="text-white/70 text-sm mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Your Health, Our Priority
          </p>
        </div>
      </footer>
    </div>
  );
}