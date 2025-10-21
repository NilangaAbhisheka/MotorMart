import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useToast } from '../../components/Toast'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: '',
    maxAuctionDuration: 30,
    defaultCommissionRate: 5.0,
    maintenanceMode: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      setLoading(true)
      const res = await api.get('/api/admin/settings')
      setSettings(res.data)
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    try {
      setSaving(true)
      await api.post('/api/admin/settings', settings)
      toast.success('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h2>
        <p className="text-gray-600">Configure platform settings and preferences</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">General Settings</h3>
        
        <div className="space-y-6">
          {/* Site Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="MotorMart"
            />
            <p className="mt-1 text-sm text-gray-500">
              The name displayed across the platform
            </p>
          </div>

          {/* Max Auction Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Auction Duration (days)
            </label>
            <input
              type="number"
              value={settings.maxAuctionDuration}
              onChange={(e) => setSettings({ ...settings, maxAuctionDuration: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="1"
              max="90"
            />
            <p className="mt-1 text-sm text-gray-500">
              Maximum number of days an auction can run
            </p>
          </div>

          {/* Commission Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Commission Rate (%)
            </label>
            <input
              type="number"
              value={settings.defaultCommissionRate}
              onChange={(e) => setSettings({ ...settings, defaultCommissionRate: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="0"
              max="100"
              step="0.1"
            />
            <p className="mt-1 text-sm text-gray-500">
              Platform commission percentage on successful sales
            </p>
          </div>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
              <p className="text-sm text-gray-500 mt-1">
                Enable to show maintenance message to users
              </p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenanceMode ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Platform Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Platform Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 font-medium mb-1">Platform Version</div>
            <div className="text-2xl font-bold text-blue-900">v1.0.0</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 font-medium mb-1">Environment</div>
            <div className="text-2xl font-bold text-green-900">Development</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 font-medium mb-1">Database</div>
            <div className="text-2xl font-bold text-purple-900">MySQL</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-sm text-orange-600 font-medium mb-1">Server Status</div>
            <div className="text-2xl font-bold text-orange-900">● Online</div>
          </div>
        </div>
      </div>

      {/* System Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">System Actions</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Clear Cache</h4>
              <p className="text-sm text-gray-500 mt-1">Clear all cached data</p>
            </div>
            <button
              onClick={() => toast.info('Cache clearing would be implemented here')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Cache
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Database Backup</h4>
              <p className="text-sm text-gray-500 mt-1">Create a backup of the database</p>
            </div>
            <button
              onClick={() => toast.info('Database backup would be implemented here')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Backup Now
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
            <div>
              <h4 className="font-medium text-red-900">Reset Platform</h4>
              <p className="text-sm text-red-600 mt-1">⚠️ Danger: This will reset all data</p>
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure? This will delete ALL data!')) {
                  toast.error('Reset functionality disabled for safety')
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={loadSettings}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Reset Changes
        </button>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
