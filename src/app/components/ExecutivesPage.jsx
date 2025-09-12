import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import BiographyModal from './BiographyModal';

const ExecutivesPage = ({ contributorId }) => {
  const [executives, setExecutives] = useState([
    {
      id: 1,
      name: 'John Doe',
      company: 'TechCorp',
      position: 'CEO',
      status: 'Published',
      createdAt: '2024-01-15',
      views: 150,
      email: 'john.doe@techcorp.com'
    },
    {
      id: 2,
      name: 'Jane Smith',
      company: 'FinanceInc',
      position: 'CFO',
      status: 'Pending',
      createdAt: '2024-02-10',
      views: 0,
      email: 'jane.smith@financeinc.com'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      company: 'StartupCo',
      position: 'CTO',
      status: 'Published',
      createdAt: '2024-02-15',
      views: 89,
      email: 'bob@startupco.com'
    },
    {
      id: 4,
      name: 'Alice Brown',
      company: 'MarketPro',
      position: 'CMO',
      status: 'Unlisted',
      createdAt: '2024-02-20',
      views: 25,
      email: 'alice@marketpro.com'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredExecutives = executives.filter((exec) =>
    exec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exec.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exec.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBiography = (email) => {
    console.log('Creating biography for email:', email);
    alert(`Biography creation started for ${email}. Redirecting to Client Dashboard...`);
    setIsModalOpen(false);
  };

  const handleDeleteExecutive = (id) => {
    if (window.confirm('Are you sure you want to delete this biography? This action cannot be undone.')) {
      setExecutives(executives.filter((exec) => exec.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Unlisted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-150"
          >
            <Plus className="h-5 w-5" />
            <span>Create Executive Biography</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search executives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {executives.filter((e) => e.status === 'Published').length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {executives.filter((e) => e.status === 'Pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {executives.filter((e) => e.status === 'Unlisted').length}
          </div>
          <div className="text-sm text-gray-600">Unlisted</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {executives.reduce((sum, e) => sum + e.views, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
      </div>

      {/* Executives Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Executive
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company & Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExecutives.map((executive) => (
                <tr key={executive.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{executive.name}</div>
                    <div className="text-sm text-gray-500">{executive.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{executive.company}</div>
                    <div className="text-sm text-gray-500">{executive.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(executive.status)}`}>
                      {executive.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {executive.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(executive.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors duration-150" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors duration-150" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExecutive(executive.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors duration-150"
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
          <p className="text-gray-500">No executives found matching your search.</p>
        </div>
      )}

      {/* Biography Creation Modal */}
      <BiographyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateBiography}
      />
    </div>
  );
};

export default ExecutivesPage;
