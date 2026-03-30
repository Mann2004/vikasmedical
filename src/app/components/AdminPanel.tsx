import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  Users, Search, Edit2, Trash2, Download, LogOut, 
  Loader2, RefreshCw, Eye, FileText, X, Check, 
  AlertCircle, Filter, ChevronDown, ChevronUp, Shield,
  Phone, Calendar, StickyNote, User, ChevronRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import app from '../../firebase';

interface User {
  id: string;
  name: string;
  mobile: string;
  dob: string;
  createdAt: any;
  medicines?: Medicine[];
}

interface Medicine {
  id: string;
  name: string;
  duration: string;
  notes?: string;
  createdAt?: number;
}

export function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [medicineFilter, setMedicineFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', mobile: '', dob: '' });
  const [isViewingMedicines, setIsViewingMedicines] = useState(false);
  const [viewingMedicines, setViewingMedicines] = useState<Medicine[]>([]);
  const [medicinesLoading, setMedicinesLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [usersVisibleCount, setUsersVisibleCount] = useState(3);
  const [medicinesVisibleCount, setMedicinesVisibleCount] = useState(3);
  const [selectedMedicineFilter, setSelectedMedicineFilter] = useState('');
  const [usersWithMedicine, setUsersWithMedicine] = useState<User[]>([]);
  const [showMedicineUsers, setShowMedicineUsers] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const db = getFirestore(app);

  // Check admin authentication
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!adminLoggedIn) {
      navigate('/admin-login');
      return;
    }
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      const usersList: User[] = [];
      for (const userDoc of usersSnapshot.docs) {
        const userData = { id: userDoc.id, ...userDoc.data() } as User;
        
        // Load medicines for each user
        const medicinesRef = collection(db, 'customers', userDoc.id, 'medicines');
        const medicinesSnapshot = await getDocs(medicinesRef);
        const medicines: Medicine[] = [];
        medicinesSnapshot.forEach((medDoc) => {
          medicines.push({ id: medDoc.id, ...medDoc.data() } as Medicine);
        });
        
        usersList.push({ ...userData, medicines });
      }
      
      setUsers(usersList);
      setFilteredUsers(usersList);
      setDisplayedUsers(usersList.slice(0, 3));
    } catch (err) {
      console.error('Error loading users:', err);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search by name or mobile
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter name or mobile number to search');
      return;
    }
    
    let filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm)
    );
    
    setFilteredUsers(filtered);
    setDisplayedUsers(filtered.slice(0, 3));
    setUsersVisibleCount(3);
    
    if (filtered.length === 0) {
      toast.info('No users found matching your search');
    } else {
      toast.success(`Found ${filtered.length} user(s)`);
    }
  };

  // Handle medicine filter
  const handleMedicineFilter = async () => {
    if (!medicineFilter.trim()) {
      toast.error('Please enter a medicine name');
      return;
    }
    
    setMedicinesLoading(true);
    setShowMedicineUsers(true);
    setSelectedMedicineFilter(medicineFilter);
    
    try {
      const usersWithMed: User[] = [];
      
      for (const user of users) {
        const hasMedicine = user.medicines?.some(med => 
          med.name.toLowerCase().includes(medicineFilter.toLowerCase())
        );
        
        if (hasMedicine) {
          usersWithMed.push(user);
        }
      }
      
      setUsersWithMedicine(usersWithMed);
      
      if (usersWithMed.length === 0) {
        toast.info('No users found with this medicine');
      } else {
        toast.success(`Found ${usersWithMed.length} user(s) taking this medicine`);
      }
    } catch (err) {
      console.error('Error filtering medicines:', err);
      toast.error('Failed to filter medicines');
    } finally {
      setMedicinesLoading(false);
    }
  };

  // Reset search
  const resetSearch = () => {
    setSearchTerm('');
    setFilteredUsers(users);
    setDisplayedUsers(users.slice(0, 3));
    setUsersVisibleCount(3);
    toast.info('Search reset');
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      mobile: user.mobile,
      dob: user.dob || '',
    });
    setIsEditing(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        name: editForm.name,
        mobile: editForm.mobile,
        dob: editForm.dob,
        updatedAt: new Date(),
      });
      
      toast.success('User updated successfully!');
      await loadUsers();
      setIsEditing(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // First delete all medicines of the user
      const medicinesRef = collection(db, 'customers', userId, 'medicines');
      const medicinesSnapshot = await getDocs(medicinesRef);
      
      for (const medDoc of medicinesSnapshot.docs) {
        await deleteDoc(doc(db, 'customers', userId, 'medicines', medDoc.id));
      }
      
      // Then delete the user
      await deleteDoc(doc(db, 'users', userId));
      
      toast.success('User and their medicines deleted successfully!');
      await loadUsers();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
    }
  };

  const handleViewMedicines = async (user: User) => {
    setIsViewingMedicines(true);
    setSelectedUser(user);
    setMedicinesLoading(true);
    
    try {
      const medicinesRef = collection(db, 'customers', user.id, 'medicines');
      const medicinesSnapshot = await getDocs(medicinesRef);
      const medicines: Medicine[] = [];
      medicinesSnapshot.forEach((doc) => {
        medicines.push({ id: doc.id, ...doc.data() } as Medicine);
      });
      setViewingMedicines(medicines);
    } catch (err) {
      console.error('Error loading medicines:', err);
      toast.error('Failed to load medicines');
    } finally {
      setMedicinesLoading(false);
    }
  };

  const exportToExcel = () => {
    const exportData = filteredUsers.map(user => ({
      'Name': user.name,
      'Mobile': user.mobile,
      'Date of Birth': user.dob || 'N/A',
      'Registration Date': user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A',
      'Medicines Count': user.medicines?.length || 0,
      'Medicines List': user.medicines?.map(m => `${m.name}${m.notes ? ` (${m.notes})` : ''}`).join(', ') || 'No medicines',
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users Data');
    XLSX.writeFile(wb, `vikas-medical-users-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Data exported to Excel!');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const getMedicinesCount = (user: User) => {
    return user.medicines?.length || 0;
  };

  const toggleUserMedicines = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  const loadMoreUsers = () => {
    const newCount = usersVisibleCount + 3;
    setUsersVisibleCount(newCount);
    setDisplayedUsers(filteredUsers.slice(0, newCount));
  };

  const showLessUsers = () => {
    setUsersVisibleCount(3);
    setDisplayedUsers(filteredUsers.slice(0, 3));
  };

  const loadMoreMedicineUsers = () => {
    const newCount = medicinesVisibleCount + 3;
    setMedicinesVisibleCount(newCount);
  };

  const showLessMedicineUsers = () => {
    setMedicinesVisibleCount(3);
  };

  const hasMoreUsers = displayedUsers.length < filteredUsers.length;
  const hasMoreMedicineUsers = medicinesVisibleCount < usersWithMedicine.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAFAF1]/30 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl text-[#2C3E50]" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                  Admin Panel
                </h1>
                <p className="text-[10px] sm:text-xs text-[#1E8449]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Manage Users & Medicines
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={loadUsers}
                variant="outline"
                size="sm"
                className="border-2 border-[#EAFAF1] text-[#2C3E50] hover:bg-[#EAFAF1] p-2 sm:p-2.5"
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-2 border-red-500 text-red-500 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1">
        {/* Stats Cards - 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-[#EAFAF1]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Total Users</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {users.length}
                </p>
              </div>
              <Users className="w-8 h-8 sm:w-12 sm:h-12 text-[#2ECC71]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-[#EAFAF1]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Total Medicines</p>
                <p className="text-2xl sm:text-3xl font-bold text-[#2C3E50]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {users.reduce((sum, user) => sum + (user.medicines?.length || 0), 0)}
                </p>
              </div>
              <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-[#2ECC71]" />
            </div>
          </motion.div>
        </div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-[#EAFAF1] mb-6 sm:mb-8"
        >
          <div className="space-y-4">
            {/* Search by Name or Mobile */}
            <div>
              <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                <Search className="w-4 h-4 text-[#2ECC71]" />
                Search by Name or Mobile
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter name or mobile number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 text-sm sm:text-base"
                />
                <Button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-[#2ECC71] to-[#1E8449] text-white whitespace-nowrap px-3 sm:px-4 text-xs sm:text-sm"
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Search
                </Button>
                {searchTerm && (
                  <Button
                    onClick={resetSearch}
                    variant="outline"
                    className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 whitespace-nowrap px-3 sm:px-4 text-xs sm:text-sm"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
            
            {/* Filter by Medicine */}
            <div>
              <Label className="flex items-center gap-2 mb-2 text-sm sm:text-base">
                <Filter className="w-4 h-4 text-[#2ECC71]" />
                Filter by Medicine
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter medicine name..."
                  value={medicineFilter}
                  onChange={(e) => setMedicineFilter(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleMedicineFilter()}
                  className="flex-1 text-sm sm:text-base"
                />
                <Button
                  onClick={handleMedicineFilter}
                  className="bg-gradient-to-r from-[#2ECC71] to-[#1E8449] text-white whitespace-nowrap px-3 sm:px-4 text-xs sm:text-sm"
                >
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-500">
              Showing {displayedUsers.length} of {filteredUsers.length} users
            </p>
            <Button
              onClick={exportToExcel}
              className="bg-gradient-to-r from-[#2ECC71] to-[#1E8449] text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export to Excel</span>
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </motion.div>

        {/* Users List with Toggle Medicines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-[#EAFAF1] overflow-hidden"
        >
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#2ECC71]" />
              <p className="mt-2 text-gray-500 text-sm">Loading users...</p>
            </div>
          ) : displayedUsers.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">No users found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#EAFAF1] to-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">#</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">Mobile</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">DOB</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">Medicines</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[#2C3E50]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedUsers.map((user, index) => (
                      <>
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-[#EAFAF1] hover:bg-[#EAFAF1]/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-[#2C3E50]">{user.name}</span>
                          </td>
                          <td className="px-4 py-3 text-sm">{user.mobile}</td>
                          <td className="px-4 py-3 text-sm">{user.dob || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleUserMedicines(user.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-[#EAFAF1] text-[#1E8449] rounded-lg text-xs hover:bg-[#2ECC71] hover:text-white transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              {getMedicinesCount(user)} Medicines
                              <ChevronRight className={`w-3 h-3 transition-transform ${expandedUser === user.id ? 'rotate-90' : ''}`} />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="p-1.5 rounded-lg border-2 border-[#2ECC71] text-[#2ECC71] hover:bg-[#EAFAF1] transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(user.id)}
                                className="p-1.5 rounded-lg border-2 border-red-400 text-red-400 hover:bg-red-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                        {expandedUser === user.id && (
                          <tr className="bg-[#EAFAF1]/30">
                            <td colSpan={6} className="px-4 py-3">
                              <div className="ml-8">
                                <p className="text-sm font-semibold text-[#2C3E50] mb-2">Medicines List:</p>
                                {user.medicines && user.medicines.length > 0 ? (
                                  <div className="space-y-2">
                                    {user.medicines.map((med, idx) => (
                                      <div key={med.id} className="bg-white rounded-lg p-3 border border-[#EAFAF1]">
                                        <p className="font-medium text-[#2C3E50]">{idx + 1}. {med.name}</p>
                                        {med.duration && (
                                          <p className="text-sm text-gray-600 mt-1">⏱️ Duration: {med.duration}</p>
                                        )}
                                        {med.notes && (
                                          <p className="text-sm text-blue-600 mt-1 flex items-start gap-1">
                                            <StickyNote className="w-3 h-3 mt-0.5" />
                                            <span>{med.notes}</span>
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 text-sm">No medicines added yet</p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-[#EAFAF1]">
                {displayedUsers.map((user, index) => (
                  <div key={user.id} className="p-4 hover:bg-[#EAFAF1]/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 bg-gradient-to-br from-[#2ECC71] to-[#1E8449] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <h3 className="font-semibold text-[#2C3E50] text-base">{user.name}</h3>
                        </div>
                        <div className="space-y-1 mt-2">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Phone className="w-3 h-3 text-[#2ECC71]" />
                            {user.mobile}
                          </p>
                          {user.dob && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-[#2ECC71]" />
                              {user.dob}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 rounded-lg border-2 border-[#2ECC71] text-[#2ECC71] hover:bg-[#EAFAF1] transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="p-2 rounded-lg border-2 border-red-400 text-red-400 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Toggle Medicines Button */}
                    <button
                      onClick={() => toggleUserMedicines(user.id)}
                      className="mt-3 w-full inline-flex items-center justify-between px-3 py-2 bg-[#EAFAF1] rounded-lg hover:bg-[#2ECC71] hover:text-white transition-colors group"
                    >
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {getMedicinesCount(user)} Medicines
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${expandedUser === user.id ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {/* Expanded Medicines */}
                    {expandedUser === user.id && (
                      <div className="mt-3 pl-2 border-l-2 border-[#2ECC71]">
                        <div className="space-y-2">
                          {user.medicines && user.medicines.length > 0 ? (
                            user.medicines.map((med, idx) => (
                              <div key={med.id} className="bg-white rounded-lg p-3 border border-[#EAFAF1]">
                                <p className="font-medium text-[#2C3E50] text-sm">{idx + 1}. {med.name}</p>
                                {med.duration && (
                                  <p className="text-xs text-gray-600 mt-1">⏱️ Duration: {med.duration}</p>
                                )}
                                {med.notes && (
                                  <p className="text-xs text-blue-600 mt-1 flex items-start gap-1">
                                    <StickyNote className="w-3 h-3 mt-0.5" />
                                    <span>{med.notes}</span>
                                  </p>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No medicines added yet</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Load More / Show Less Buttons */}
              {filteredUsers.length > 3 && (
                <div className="p-4 border-t border-[#EAFAF1]">
                  {hasMoreUsers ? (
                    <Button
                      onClick={loadMoreUsers}
                      className="w-full bg-gradient-to-r from-[#2ECC71] to-[#1E8449] text-white"
                    >
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Load More ({filteredUsers.length - displayedUsers.length} more)
                    </Button>
                  ) : usersVisibleCount > 3 && (
                    <Button
                      onClick={showLessUsers}
                      variant="outline"
                      className="w-full border-2 border-[#2ECC71] text-[#2ECC71] hover:bg-[#EAFAF1]"
                    >
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Medicine Filter Results Modal */}
        {showMedicineUsers && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Users taking "{selectedMedicineFilter}"
                </h3>
                <button onClick={() => {
                  setShowMedicineUsers(false);
                  setSelectedMedicineFilter('');
                  setMedicinesVisibleCount(3);
                }} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {medicinesLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#2ECC71]" />
                </div>
              ) : usersWithMedicine.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found with this medicine</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {usersWithMedicine.slice(0, medicinesVisibleCount).map((user, idx) => (
                      <div key={user.id} className="border border-[#EAFAF1] rounded-lg p-3 sm:p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-[#2C3E50] text-sm sm:text-base">{idx + 1}. {user.name}</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {user.mobile}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {user.dob || 'N/A'}
                            </p>
                            <div className="mt-2">
                              <p className="text-xs font-medium text-[#2ECC71] mb-1">Medicines:</p>
                              <div className="space-y-1">
                                {user.medicines?.filter(med => 
                                  med.name.toLowerCase().includes(selectedMedicineFilter.toLowerCase())
                                ).map((med, medIdx) => (
                                  <div key={med.id} className="text-xs text-gray-600 pl-2 border-l-2 border-[#2ECC71]">
                                    • {med.name}
                                    {med.duration && <span className="text-gray-400 ml-1">({med.duration})</span>}
                                    {med.notes && <span className="block text-blue-600 mt-0.5">📝 {med.notes}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load More for Medicine Users */}
                  {usersWithMedicine.length > 3 && (
                    <div className="mt-4">
                      {hasMoreMedicineUsers ? (
                        <Button
                          onClick={loadMoreMedicineUsers}
                          className="w-full bg-gradient-to-r from-[#2ECC71] to-[#1E8449] text-white text-sm"
                        >
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Load More ({usersWithMedicine.length - medicinesVisibleCount} more)
                        </Button>
                      ) : medicinesVisibleCount > 3 && (
                        <Button
                          onClick={showLessMedicineUsers}
                          variant="outline"
                          className="w-full border-2 border-[#2ECC71] text-[#2ECC71] hover:bg-[#EAFAF1] text-sm"
                        >
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Show Less
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#2C3E50] to-[#1a252f] text-white mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Vikas Medical
              </h3>
              <p className="text-xs sm:text-sm text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                Your trusted medical store for over 28 years. Quality medicines at affordable prices.
              </p>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Contact Info
              </h3>
              <p className="text-xs sm:text-sm text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                📞 +91 98244 19469<br />
                📞 +91 83477 23201<br />
                🏥 Court Road, Near Old Police Station, Umreth
              </p>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Timings
              </h3>
              <p className="text-xs sm:text-sm text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                ⏰ 8:45 AM – 10:30 PM<br />
                📅 Open All Days
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 mt-6 sm:mt-8 pt-6 text-center">
            <p className="text-xs sm:text-sm text-white/60" style={{ fontFamily: 'Inter, sans-serif' }}>
              © {new Date().getFullYear()} Vikas Medical & Provision Store. All rights reserved.
            </p>
            <p className="text-xs text-white/40 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Your Health, Our Priority
            </p>
          </div>
        </div>
      </footer>

      {/* Edit User Modal */}
      {isEditing && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Edit User
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Name</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-sm">Mobile</Label>
                <Input
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-sm">Date of Birth</Label>
                <Input
                  type="date"
                  value={editForm.dob}
                  onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleUpdateUser} className="flex-1 bg-gradient-to-r from-[#2ECC71] to-[#1E8449] text-white text-sm">
                <Check className="w-4 h-4 mr-2" />
                Update
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1 text-sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Medicines Modal */}
      {isViewingMedicines && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Medicines of {selectedUser.name}
              </h3>
              <button onClick={() => setIsViewingMedicines(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {medicinesLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#2ECC71]" />
              </div>
            ) : viewingMedicines.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No medicines added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {viewingMedicines.map((med, idx) => (
                  <div key={med.id} className="border border-[#EAFAF1] rounded-lg p-3 sm:p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-[#2C3E50] text-sm sm:text-base">{idx + 1}. {med.name}</p>
                        {med.duration && (
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">⏱️ Duration: {med.duration}</p>
                        )}
                        {med.notes && (
                          <p className="text-xs sm:text-sm text-blue-600 mt-1 flex items-start gap-1">
                            <StickyNote className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{med.notes}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full"
          >
            <div className="text-center">
              <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Delete User?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                This will permanently delete the user and all their medicines. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => handleDeleteUser(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button onClick={() => setDeleteConfirm(null)} variant="outline" className="flex-1 text-sm">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}