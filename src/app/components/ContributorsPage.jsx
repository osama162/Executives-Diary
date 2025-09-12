import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import ContributorModal from './ContributorModal';

const ContributorsPage = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContributor, setEditingContributor] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('authToken');

  // ---------- GET CONTRIBUTORS ----------
  const fetchContributors = async () => {
    setLoading(true);
    setError('');
    try {
      const url = new URL(`${API_BASE}/api/auth/contributors/`);
      url.searchParams.set('page', page);
      url.searchParams.set('page_size', pageSize);

      const res = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`, // switch to Bearer if required by your backend
        },
      });

      const json = await res.json();
      if (!res.ok || json.status_code !== 200) {
        throw new Error(json?.message || 'Failed to load contributors');
      }

      const results = json?.data?.results ?? [];
      const pg = json?.data?.pagination ?? {};

      const mapped = results.map((u) => ({
        id: u.id,
        first_name: u.first_name ?? '',
        last_name: u.last_name ?? '',
        fullName: [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || u.email,
        email: u.email,
        cnic: u.cnic || '—',
        phone: u.phone || '—',
        address: u.address || '—',
        photo: u.profile_picture,
        status: (u.status || 'inactive').toLowerCase() === 'active' ? 'Active' : 'Inactive',
        createdAt: u.created_at || null, // Joined column
      }));

      setContributors(mapped);
      setPage(pg.page || 1);
      setTotal(pg.total || mapped.length);
      setTotalPages(pg.total_pages || 1);
    } catch (e) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (API_BASE && token) fetchContributors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE, token, page, pageSize]);

  const filteredContributors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return contributors;
    return contributors.filter((c) =>
      (c.fullName || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.cnic || '').toLowerCase().includes(q) ||
      (c.address || '').toLowerCase().includes(q)
    );
  }, [contributors, searchTerm]);

  const openEditModal = (contributor) => {
    setEditingContributor(contributor);
    setIsModalOpen(true);
  };

  // ---------- POST /api/auth/users/ (CREATE) ----------
  // Expects FormData from ContributorModal (including profile_picture)
  const handleCreateContributor = async (formData /* FormData */) => {
    setCreating(true);
    setError('');

    // The API also needs role + status; modal already adds them, but ensure here if needed:
    if (!formData.get('role')) formData.append('role', 'contributor');
    if (!formData.get('status')) formData.append('status', 'active');

    try {
      const res = await fetch(`${API_BASE}/api/auth/users/`, {
        method: 'POST',
        headers: {
          // DO NOT set Content-Type when sending FormData
          Authorization: `Token ${token}`, // or Bearer
        },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || json.status_code !== 200) {
        throw new Error(json?.message || 'Failed to create contributor');
      }

      // Close modal and refresh list
      setIsModalOpen(false);
      setEditingContributor(null);
      await fetchContributors();
    } catch (e) {
      setError(e.message || 'Something went wrong while creating contributor');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contributors</h1>
          <p className="text-gray-600 mt-2">Manage contributors who create executive biographies</p>
        </div>
        <button
          onClick={() => { setEditingContributor(null); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-60"
          disabled={creating}
        >
          <Plus className="h-5 w-5" />
          <span>{creating ? 'Creating…' : 'Add Contributor'}</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, phone, CNIC, address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {(loading || creating) && (
        <div className="mb-4 text-sm text-gray-500">
          {loading ? 'Loading contributors…' : 'Creating contributor…'}
        </div>
      )}
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNIC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContributors.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    {c.profile_picture ? (
                      <img
                        src={c.profile_picture}
                        alt={c.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                        {(c.fullName || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{c.fullName}</div>
                      <div className="text-sm text-gray-500">{c.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{c.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.cnic}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                    <button onClick={() => openEditModal(c)} className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => alert('Delete API not yet integrated')} className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredContributors.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No contributors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages} • {total} total
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className={`px-3 py-1 rounded border ${
                page <= 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className={`px-3 py-1 rounded border ${
                page >= totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ContributorModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingContributor(null); }}
          // IMPORTANT: This passes the FormData from the modal to the API call above
          onSubmit={handleCreateContributor}
          contributor={editingContributor}
        />
      )}
    </div>
  );
};

export default ContributorsPage;
