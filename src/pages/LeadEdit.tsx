import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockLeads } from '../services/mockData';
import { Lead } from '../types';

export default function LeadEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    source: '',
    status: '',
    vehicleType: '',
    budgetMin: '',
    budgetMax: '',
    financing: false,
    tradeIn: '',
    timeline: '',
    notes: ''
  });

  useEffect(() => {
    const foundLead = mockLeads.find(l => l.id === id);
    if (foundLead) {
      setLead(foundLead);
      setFormData({
        name: foundLead.name,
        email: foundLead.email,
        phone: foundLead.phone,
        address: foundLead.address || '',
        source: foundLead.source,
        status: foundLead.status,
        vehicleType: foundLead.vehicleInterest?.type || '',
        budgetMin: foundLead.vehicleInterest?.budget?.min?.toString() || '',
        budgetMax: foundLead.vehicleInterest?.budget?.max?.toString() || '',
        financing: foundLead.vehicleInterest?.financing || false,
        tradeIn: foundLead.vehicleInterest?.tradeIn || '',
        timeline: foundLead.vehicleInterest?.timeline || '',
        notes: foundLead.notes || ''
      });
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to backend
    console.log('Saving lead data:', formData);
    alert('Lead updated successfully! (This is a demo)');
    navigate(`/leads/${id}`);
  };

  const handleCancel = () => {
    navigate(`/leads/${id}`);
  };

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Lead not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/leads')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Leads</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Lead</h1>
            <p className="text-gray-600">Update lead information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </Card>

          {/* Lead Information */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <select
                  id="source"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Source</option>
                  <option value="website">Website</option>
                  <option value="facebook">Facebook</option>
                  <option value="google">Google</option>
                  <option value="twitter">Twitter</option>
                  <option value="referral">Referral</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Interest
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Electric">Electric</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700 mb-1">
                    Min Budget ($)
                  </label>
                  <input
                    type="number"
                    id="budgetMin"
                    name="budgetMin"
                    value={formData.budgetMin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Budget ($)
                  </label>
                  <input
                    type="number"
                    id="budgetMax"
                    name="budgetMax"
                    value={formData.budgetMax}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Information */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="financing"
                name="financing"
                checked={formData.financing}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="financing" className="ml-2 block text-sm text-gray-700">
                Needs Financing
              </label>
            </div>

            <div>
              <label htmlFor="tradeIn" className="block text-sm font-medium text-gray-700 mb-1">
                Trade-in Vehicle
              </label>
              <input
                type="text"
                id="tradeIn"
                name="tradeIn"
                value={formData.tradeIn}
                onChange={handleInputChange}
                placeholder="e.g., 2018 Toyota Camry"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Timeline</option>
                <option value="Immediate">Immediate</option>
                <option value="Within 1 month">Within 1 month</option>
                <option value="Within 2 months">Within 2 months</option>
                <option value="Within 3 months">Within 3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="Not sure">Not sure</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional notes about the lead..."
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </form>
    </div>
  );
}