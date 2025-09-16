import { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Star, Phone, Mail, Edit, Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockLeads, mockTeamMembers } from '../services/mockData';
import { Lead } from '../types';

const statusColumns = [
  { id: 'new', title: 'New', leads: mockLeads.filter(l => l.status === 'new') },
  { id: 'contacted', title: 'Contacted', leads: mockLeads.filter(l => l.status === 'contacted') },
  { id: 'qualified', title: 'Qualified', leads: mockLeads.filter(l => l.status === 'qualified') },
  { id: 'negotiating', title: 'Negotiating', leads: mockLeads.filter(l => l.status === 'negotiating') },
  { id: 'converted', title: 'Converted', leads: mockLeads.filter(l => l.status === 'converted') }
];

interface LeadCardProps {
  lead: Lead;
}

function LeadCard({ lead }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderStarRating = (score: number) => {
    const stars = Math.floor(score / 20);
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">{score}</span>
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 cursor-move relative group"
    >
      {/* Edit button - appears on hover */}
      <Link
        to={`/leads/${lead.id}/edit`}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
        onClick={(e) => e.stopPropagation()}
      >
        <Edit className="w-3 h-3 text-gray-600 dark:text-gray-300" />
      </Link>

      <div className="flex justify-between items-start mb-3">
        {renderStarRating(lead.score)}
        <div className="flex space-x-1.5">
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900">
            <Phone className="w-3.5 h-3.5" />
          </button>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900">
            <Mail className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 leading-tight">{lead.name}</h4>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate">{lead.email}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 capitalize flex items-center">
        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-1.5"></span>
        {lead.source}
      </p>
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full">
          👤 {lead.assignedTo || 'Unassigned'}
        </span>
        <span className="text-xs text-green-600 dark:text-green-400 font-medium">⏰ 2h ago</span>
      </div>
      
      {lead.vehicleInterest && (
        <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">{lead.vehicleInterest.type}</p>
          <p className="text-xs text-blue-600 dark:text-blue-300">
            ${lead.vehicleInterest.budget?.min?.toLocaleString()} - ${lead.vehicleInterest.budget?.max?.toLocaleString()}
          </p>
        </div>
      )}
      
      {lead.notes && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 italic bg-gray-50 dark:bg-gray-700 p-2 rounded border-l-2 border-gray-300 dark:border-gray-600">
          "{lead.notes.substring(0, 60)}..."
        </p>
      )}
      
      <div className="flex flex-wrap gap-1 mb-2">
        {lead.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-xs px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 text-blue-800 dark:text-blue-100 rounded-full font-medium">
            {tag}
          </span>
        ))}
      </div>
      
      {lead.nextFollowUp && (
        <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900 border-l-2 border-orange-400 rounded">
          <p className="text-xs text-orange-700 dark:text-orange-200 font-medium">📅 Follow-up: Tomorrow 10 AM</p>
        </div>
      )}
    </div>
  );
}

export default function LeadManagement() {
  const [leads, setLeads] = useState(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Update lead status based on column
    const updatedLeads = leads.map(lead => 
      lead.id === activeId 
        ? { ...lead, status: overId as Lead['status'] }
        : lead
    );
    
    setLeads(updatedLeads);
  };

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'high-priority') return matchesSearch && lead.score >= 85;
    if (selectedFilter === 'unassigned') return matchesSearch && !lead.assignedTo;
    if (selectedFilter === 'follow-up') return matchesSearch && lead.nextFollowUp;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lead Management Center</h1>
            <p className="text-blue-100 dark:text-blue-200 mb-4">Drag and drop leads to update their status • Track progress in real-time</p>
            <div className="flex space-x-6 text-sm">
              <span className="flex items-center">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                {leads.length} Total Leads
              </span>
              <span className="flex items-center">
                <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                {leads.filter(l => l.status === 'new').length} New Today
              </span>
              <span className="flex items-center">
                <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                {leads.filter(l => l.score >= 85).length} High Priority
              </span>
            </div>
          </div>
          <Button
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search leads by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Leads</option>
            <option value="high-priority">High Priority</option>
            <option value="unassigned">Unassigned</option>
            <option value="follow-up">Follow-up Needed</option>
          </select>
          <Button variant="secondary" className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Enhanced Kanban Board */}
        <div className="lg:col-span-3">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-5 gap-4">
              {statusColumns.map((column) => {
                const columnLeads = filteredLeads.filter(l => l.status === column.id);
                const totalValue = columnLeads.reduce((sum, lead) => 
                  sum + (lead.vehicleInterest?.budget?.max || 0), 0);
                
                return (
                  <div key={column.id} className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            column.id === 'new' ? 'bg-blue-500' :
                            column.id === 'contacted' ? 'bg-yellow-500' :
                            column.id === 'qualified' ? 'bg-purple-500' :
                            column.id === 'negotiating' ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}></span>
                          {column.title}
                        </h3>
                        {totalValue > 0 && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            ${totalValue.toLocaleString()} potential
                          </p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        column.id === 'new' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' :
                        column.id === 'contacted' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200' :
                        column.id === 'qualified' ? 'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200' :
                        column.id === 'negotiating' ? 'bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200' :
                        'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                      }`}>
                        {columnLeads.length}
                      </span>
                    </div>
                    
                    <SortableContext
                      items={columnLeads.map(l => l.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3 min-h-[200px]">
                        {columnLeads.map((lead) => (
                          <LeadCard key={lead.id} lead={lead} />
                        ))}
                        {columnLeads.length === 0 && (
                          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                            <p className="text-sm">No leads in this stage</p>
                            <p className="text-xs mt-1">Drag leads here to update status</p>
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </div>
                );
              })}
            </div>
          </DndContext>
        </div>

        {/* Enhanced Right Sidebar */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              � Today's Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{leads.filter(l => l.status === 'new').length}</p>
                <p className="text-xs text-blue-700 dark:text-blue-400">New Leads</p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-300">{leads.filter(l => l.status === 'converted').length}</p>
                <p className="text-xs text-green-700 dark:text-green-400">Converted</p>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">{leads.filter(l => l.score >= 85).length}</p>
                <p className="text-xs text-purple-700 dark:text-purple-400">High Priority</p>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-900 rounded-lg">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">{leads.filter(l => l.nextFollowUp).length}</p>
                <p className="text-xs text-orange-700 dark:text-orange-400">Follow-ups</p>
              </div>
            </div>
          </Card>

          {/* Enhanced Team Status */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              👥 Team Performance
            </h3>
            <div className="space-y-4">
              {mockTeamMembers.map((member) => (
                <div key={member.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${
                        member.status === 'available' ? 'bg-green-400' :
                        member.status === 'busy' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`} />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {member.conversionRate}% conversion
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>📋 {member.leadsAssigned} leads</span>
                    <span className={member.status === 'available' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}>
                      {member.status === 'available' ? '✅ Available' : '🔄 Busy'}
                    </span>
                  </div>
                  <div className="mt-2 bg-white dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{width: `${(member.leadsAssigned / 20) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              ⚡ Quick Actions
            </h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-center">
                <Plus className="w-4 h-4 mr-2" />
                Add New Lead
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                📧 Send Bulk Email
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                📊 Generate Report
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                🔄 Auto-Assign Leads
              </Button>
            </div>
          </Card>

          {/* Enhanced Bulk Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              📋 Bulk Operations
            </h3>
            <div className="space-y-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">☑️ 5 leads selected</p>
                <p className="text-xs text-blue-600 dark:text-blue-300">Total potential: $375,000</p>
              </div>
              <div className="space-y-2">
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Assign To Team Member...</option>
                  <option>Rajesh Kumar</option>
                  <option>Vikram Singh</option>
                  <option>Anita Gupta</option>
                  <option>Deepak Joshi</option>
                </select>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Change Status To...</option>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Negotiating</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="primary" className="text-xs">
                    Apply Changes
                  </Button>
                  <Button variant="secondary" className="text-xs">
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}