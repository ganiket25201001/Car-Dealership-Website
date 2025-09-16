import { useParams } from 'react-router-dom';
import { Phone, Mail, Calendar, Edit, Star } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { mockLeads } from '../services/mockData';
import { Lead, Interaction } from '../types';
import { format } from 'date-fns';

export default function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const lead = mockLeads.find((l: Lead) => l.id === id);

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lead not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The lead you're looking for doesn't exist.</p>
      </div>
    );
  }

  const renderStarRating = (score: number) => {
    const stars = Math.floor(score / 20);
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">{score}/100</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <StatusBadge status={lead.status} />
            {renderStarRating(lead.score)}
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary">
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button variant="secondary">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button variant="secondary">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button variant="secondary">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                <p className="text-sm text-gray-900 dark:text-white">{lead.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-sm text-gray-900 dark:text-white">{lead.email}</p>
              </div>
              {lead.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                  <p className="text-sm text-gray-900 dark:text-white">{lead.address}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Lead Source */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lead Source</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Source</label>
                <p className="text-sm text-gray-900 dark:text-white capitalize">{lead.source}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                <p className="text-sm text-gray-900 dark:text-white">{format(lead.createdAt, 'PPP')}</p>
              </div>
            </div>
          </Card>

          {/* Vehicle Interest */}
          {lead.vehicleInterest && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Vehicle Interest</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                  <p className="text-sm text-gray-900 dark:text-white">{lead.vehicleInterest.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Budget</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    ${lead.vehicleInterest.budget.min.toLocaleString()} - ${lead.vehicleInterest.budget.max.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Financing</label>
                  <p className="text-sm text-gray-900 dark:text-white">{lead.vehicleInterest.financing ? 'Required' : 'Cash Purchase'}</p>
                </div>
                {lead.vehicleInterest.tradeIn && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Trade-in</label>
                    <p className="text-sm text-gray-900 dark:text-white">{lead.vehicleInterest.tradeIn}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Timeline</label>
                  <p className="text-sm text-gray-900 dark:text-white">{lead.vehicleInterest.timeline}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Activity & Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Timeline */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {lead.interactions.length > 0 ? (
                lead.interactions.map((interaction: Interaction) => (
                  <div key={interaction.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        {interaction.type === 'call' && <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        {interaction.type === 'email' && <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">{interaction.createdBy}</span>
                        <span className="text-gray-500 dark:text-gray-400"> • {format(interaction.date, 'PPp')}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{interaction.notes}</p>
                      {interaction.duration && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Duration: {interaction.duration} minutes</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No interactions recorded yet.</p>
              )}
            </div>
          </Card>

          {/* Notes */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">{lead.notes}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Added by {lead.assignedTo} • {format(lead.lastActivity, 'PPp')}
                </p>
              </div>
              <div>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  rows={3}
                  placeholder="Add a note..."
                />
                <div className="mt-2 flex justify-end">
                  <Button size="sm">Add Note</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Tags */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs font-medium rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}