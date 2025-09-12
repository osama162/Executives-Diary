'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Eye, Tag, User, ChevronDown, X } from 'lucide-react';
import BiographyModal from '../../components/BiographyModal';
import { useRouter } from "next/navigation";

const ConfirmDeleteModal = ({ open, onCancel, onConfirm, name = 'this executive' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Executive</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete <span className="font-medium">{name}</span>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const options = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' }
  ];

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
      >
        <span className="text-sm text-gray-700">{selectedOption?.label}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                value === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const LabelsDropdown = ({ selectedLabels, onToggleLabel, availableLabels, formatLabelText, getLabelColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getButtonText = () => {
    if (selectedLabels.length === 0) return 'All Labels';
    if (selectedLabels.length === 1) return formatLabelText(selectedLabels[0]);
    return `${selectedLabels.length} Selected`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.labels-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative labels-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2 text-left border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] ${
          selectedLabels.length > 0 
            ? 'border-blue-500 bg-blue-50 text-blue-700' 
            : 'border-gray-300 bg-white text-gray-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          <span className="text-sm">{getButtonText()}</span>
          {selectedLabels.length > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {selectedLabels.length}
            </span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 right-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-3">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-900">Select Labels</h4>
              {selectedLabels.length > 0 && (
                <button
                  onClick={() => {
                    selectedLabels.forEach(label => onToggleLabel(label));
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="space-y-1">
              {availableLabels.map((label) => (
                <label key={label} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLabels.includes(label)}
                    onChange={() => onToggleLabel(label)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 flex-1">{formatLabelText(label)}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLabelColor(label)}`}>
                    {formatLabelText(label)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ExecutivesPage = () => {
  const [executives, setExecutives] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false);
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const router = useRouter();

  // Filter states
  const [selectedLabelFilters, setSelectedLabelFilters] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_DOMAIN;

  const availableLabels = [
    'featured',
    'diary_of_the_day',
    'founder_of_the_day',
    'trending',
    'popular',
  ];

  const fetchExecutives = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/api/executives/`, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && (data.status_code === 200 || data.status === 200)) {
        const list = Array.isArray(data.data) ? data.data : [];
        setExecutives(list.filter((e) => !e.hide));
      } else {
        throw new Error(data.message || 'Failed to fetch executives');
      }
    } catch (error) {
      console.error('Error fetching executives:', error);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchExecutives();
  }, [fetchExecutives]);

  const updateExecutive = async (executiveId, updateData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE}/api/executives/${executiveId}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setExecutives((prev) =>
          prev
            .map((exec) => (exec.id === executiveId ? { ...exec, ...updateData } : exec))
            .filter((exec) => !exec.hide)
        );
        return true;
      } else {
        throw new Error(data.message || 'Failed to update executive');
      }
    } catch (error) {
      console.error('Error updating executive:', error);
      alert('Failed to update executive. Please try again.');
      return false;
    }
  };

  const toggleBiographyStatus = async (executive) => {
    const newStatus = executive.biography_status === 'active' ? 'inactive' : 'active';
    await updateExecutive(executive.id, { biography_status: newStatus });
  };

  const openLabelsModal = (executive) => {
    setSelectedExecutive(executive);
    setSelectedLabels(executive.labels || []);
    setIsLabelsModalOpen(true);
  };

  const saveLabels = async () => {
    if (selectedExecutive) {
      const success = await updateExecutive(selectedExecutive.id, { labels: selectedLabels });
      if (success) {
        setIsLabelsModalOpen(false);
        setSelectedExecutive(null);
        setSelectedLabels([]);
      }
    }
  };

  const toggleLabel = (label) => {
    setSelectedLabels((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  };

  // Filter functions
  const toggleLabelFilter = (label) => {
    setSelectedLabelFilters((prev) => 
      prev.includes(label) 
        ? prev.filter((l) => l !== label)
        : [...prev, label]
    );
  };

  const clearAllFilters = () => {
    setSelectedLabelFilters([]);
    setStatusFilter('all');
    setSearchTerm('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedLabelFilters.length > 0) count++;
    if (statusFilter !== 'all') count++;
    return count;
  };

  // Enhanced filtering logic
  const filteredExecutives = executives.filter((exec) => {
    // Text search filter
    const searchMatch = searchTerm === '' || 
      (exec.user_first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exec.user_last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exec.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exec.job_title || '').toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'active' && exec.biography_status === 'active') ||
      (statusFilter === 'inactive' && exec.biography_status === 'inactive');

    // Label filter
    const labelMatch = selectedLabelFilters.length === 0 || 
      selectedLabelFilters.some(label => (exec.labels || []).includes(label));

    return searchMatch && statusMatch && labelMatch;
  });

  const handleCreateBiography = async (executiveData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/executives/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: executiveData.email,
          first_name: executiveData.first_name,
          last_name: executiveData.last_name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchExecutives();
        alert(
          `Executive biography created successfully for ${executiveData.first_name} ${executiveData.last_name}!`
        );
        setIsModalOpen(false);
      } else {
        throw new Error(data.message || 'Failed to create executive');
      }
    } catch (error) {
      console.error('Error creating executive:', error);
      alert(`Failed to create executive: ${error.message}`);
    }
  };

  const askDeleteExecutive = (exec) => {
    setConfirmTarget(exec);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    const ok = await updateExecutive(confirmTarget.id, { hide: true });
    if (ok) {
      setConfirmOpen(false);
      setConfirmTarget(null);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setConfirmTarget(null);
  };

  const getLabelColor = (label) => {
    const colors = {
      featured: 'bg-purple-100 text-purple-800',
      diary_of_the_day: 'bg-blue-100 text-blue-800',
      founder_of_the_day: 'bg-orange-100 text-orange-800',
      trending: 'bg-pink-100 text-pink-800',
      popular: 'bg-green-100 text-green-800',
    };
    return colors[label] || 'bg-gray-100 text-gray-800';
  };

  const formatLabelText = (label) => label
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Executive Biographies</h1>
            <p className="text-gray-600 mt-2">Manage and track all your executive biography submissions</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1b1b4a] hover:bg-[#1b1b4a] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-150 cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            <span>Create Executive Biography</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search executives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Status Filter Dropdown */}
          <StatusDropdown 
            value={statusFilter} 
            onChange={setStatusFilter}
          />

          {/* Labels Filter Dropdown */}
          <LabelsDropdown
            selectedLabels={selectedLabelFilters}
            onToggleLabel={toggleLabelFilter}
            availableLabels={availableLabels}
            formatLabelText={formatLabelText}
            getLabelColor={getLabelColor}
          />

          {/* Clear All Filters Button */}
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
              Clear all
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {(selectedLabelFilters.length > 0 || statusFilter !== 'all') && (
          <div className="flex flex-wrap gap-2 items-center mt-4">
            <span className="text-sm text-gray-600">Filtered by:</span>
            
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {statusFilter === 'active' ? 'Active' : 'Inactive'} Status
                <button
                  onClick={() => setStatusFilter('all')}
                  className="hover:bg-green-200 rounded-full p-0.5 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {selectedLabelFilters.map((label) => (
              <span key={label} className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full ${getLabelColor(label)}`}>
                {formatLabelText(label)}
                <button
                  onClick={() => toggleLabelFilter(label)}
                  className="hover:bg-opacity-20 hover:bg-gray-600 rounded-full p-0.5 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredExecutives.length} of {executives.length} executives
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Executive</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company & Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labels</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExecutives.map((executive) => (
                <tr key={executive.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      {executive.picture ? (
                        <img
                          src={executive.picture}
                          alt={`${executive.user_first_name || 'Executive'} ${executive.user_last_name || ''}`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {executive.user_first_name || executive.diary_title || 'N/A'} {executive.user_last_name || ''}
                        </div>
                        <div className="text-sm text-gray-500">{executive.user_email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{executive.company || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{executive.job_title || 'N/A'}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {executive.labels && executive.labels.length > 0 ? (
                        executive.labels.map((label, index) => (
                          <span
                            key={index}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLabelColor(label)}`}
                          >
                            {formatLabelText(label)}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No labels</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {executive.country || 'N/A'}, {executive.state || 'N/A'}, {executive.city || 'N/A'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {executive.created_at ? new Date(executive.created_at).toLocaleDateString() : '—'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleBiographyStatus(executive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        executive.biography_status === 'active' ? 'bg-green-600' : 'bg-gray-200'
                      } cursor-pointer`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          executive.biography_status === 'active' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors duration-150 cursor-pointer" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openLabelsModal(executive)}
                        className="text-purple-600 hover:text-purple-900 p-1 hover:bg-purple-50 rounded transition-colors duration-150 cursor-pointer"
                        title="Manage Labels"
                      >
                        <Tag className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/ClientDashboard/${executive.id}`)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors duration-150 cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => askDeleteExecutive(executive)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors duration-150 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredExecutives.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {getActiveFiltersCount() > 0 
              ? "No executives found matching your filters." 
              : "No executives found matching your search."
            }
          </p>
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      <BiographyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateBiography} />

      {isLabelsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Manage Labels for {selectedExecutive?.user_first_name || selectedExecutive?.diary_title}
            </h3>

            <div className="space-y-3">
              {availableLabels.map((label) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={selectedLabels.includes(label)}
                    onChange={() => toggleLabel(label)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">{formatLabelText(label)}</span>
                  <span className={`ml-auto px-2 py-1 text-xs font-semibold rounded-full ${getLabelColor(label)}`}>
                    {formatLabelText(label)}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsLabelsModalOpen(false);
                  setSelectedExecutive(null);
                  setSelectedLabels([]);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveLabels}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-150 cursor-pointer"
              >
                Save Labels
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        open={confirmOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        name={
          confirmTarget
            ? `${confirmTarget.user_first_name || 'Executive'} ${confirmTarget.user_last_name || ''}`.trim()
            : 'this executive'
        }
      />
    </div>
  );
};

export default ExecutivesPage;