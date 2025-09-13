import { useState, useEffect } from 'react'
import './App.css'

interface NetworkInfo {
  ipAddress: string
  subnetMask: string
  cidr: number
  networkAddress: string
  broadcastAddress: string
  firstHost: string
  lastHost: string
  totalHosts: number
  usableHosts: number
  wildcardMask: string
  networkClass: string
}

function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<NetworkInfo | null>(null)
  const [error, setError] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)

  const validateIP = (ip: string): boolean => {
    const parts = ip.split('.')
    if (parts.length !== 4) return false
    return parts.every(part => {
      const num = parseInt(part, 10)
      return num >= 0 && num <= 255
    })
  }

  const ipToNumber = (ip: string): number => {
    return ip.split('.').reduce((acc, part) => (acc << 8) + parseInt(part, 10), 0)
  }

  const numberToIP = (num: number): string => {
    return [
      (num >>> 24) & 0xff,
      (num >>> 16) & 0xff,
      (num >>> 8) & 0xff,
      num & 0xff
    ].join('.')
  }

  const getNetworkClass = (firstOctet: number): string => {
    if (firstOctet >= 1 && firstOctet <= 126) return 'A'
    if (firstOctet >= 128 && firstOctet <= 191) return 'B'
    if (firstOctet >= 192 && firstOctet <= 223) return 'C'
    if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)'
    if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reserved)'
    return 'Unknown'
  }

  const calculateSubnet = (input: string): NetworkInfo | null => {
    if (!input.trim()) {
      setError('')
      return null
    }
    
    // Check if input contains CIDR notation
    const cidrMatch = input.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/)
    if (cidrMatch) {
      const [, ip, cidrStr] = cidrMatch
      const cidr = parseInt(cidrStr, 10)
      
      if (!validateIP(ip)) {
        setError('Invalid IP address format')
        return null
      }
      
      if (cidr < 0 || cidr > 32) {
        setError('CIDR must be between 0 and 32')
        return null
      }
      
      const ipNum = ipToNumber(ip)
      const mask = (0xffffffff << (32 - cidr)) >>> 0
      const networkAddress = ipNum & mask
      const broadcastAddress = networkAddress | (~mask >>> 0)
      
      setError('')
      return {
        ipAddress: ip,
        subnetMask: numberToIP(mask),
        cidr,
        networkAddress: numberToIP(networkAddress),
        broadcastAddress: numberToIP(broadcastAddress),
        firstHost: numberToIP(networkAddress + 1),
        lastHost: numberToIP(broadcastAddress - 1),
        totalHosts: Math.pow(2, 32 - cidr),
        usableHosts: Math.max(0, Math.pow(2, 32 - cidr) - 2),
        wildcardMask: numberToIP(~mask >>> 0),
        networkClass: getNetworkClass(ip.split('.')[0] as any)
      }
    }
    
    // Check if input is just an IP address
    if (validateIP(input)) {
      // Default to /24 for single IP
      return calculateSubnet(`${input}/24`)
    }
    
    setError('Invalid input format. Use IP/CIDR (e.g., 192.168.1.1/24) or IP address')
    return null
  }

  // Real-time calculation effect
  useEffect(() => {
    if (!input.trim()) {
      setResult(null)
      setError('')
      return
    }

    setIsCalculating(true)
    const timeoutId = setTimeout(() => {
      const result = calculateSubnet(input.trim())
      setResult(result)
      setIsCalculating(false)
    }, 300) // Debounce for 300ms

    return () => {
      clearTimeout(timeoutId)
      setIsCalculating(false)
    }
  }, [input])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 50%, #e0e7ff 100%)'}}>
      {/* Clean background pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Clean Header */}
        <div style={{textAlign: 'center', marginBottom: '4rem'}}>
          <h1 style={{fontSize: '3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif'}}>
            IP Calculator
          </h1>
          <div style={{width: '5rem', height: '0.25rem', background: 'linear-gradient(90deg, #3b82f6, #6366f1)', margin: '0 auto', borderRadius: '9999px', marginBottom: '2rem'}}></div>
          <p style={{fontSize: '1.25rem', color: '#475569', maxWidth: '42rem', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif'}}>
            Professional subnet calculation with real-time results
          </p>
        </div>

        {/* Clean Input Section */}
        <div style={{backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', marginBottom: '3rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0'}}>
          <div style={{position: 'relative'}}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter IP address or CIDR (e.g., 192.168.1.1/24)"
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '0.75rem',
                color: '#1e293b',
                fontSize: '1.125rem',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
            {isCalculating && (
              <div style={{position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)'}}>
                <div style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  border: '2px solid #3b82f6',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* Clean Results Section */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Network Information Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Network Information</h2>
                <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'IP Address', value: result.ipAddress },
                  { label: 'Subnet Mask', value: result.subnetMask },
                  { label: 'CIDR Notation', value: `/${result.cidr}` },
                  { label: 'Network Class', value: result.networkClass },
                  { label: 'Wildcard Mask', value: result.wildcardMask }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                    <span className="text-slate-600 font-medium">{item.label}:</span>
                    <span className="font-mono text-slate-800 font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Range Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Address Range</h2>
                <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Network Address', value: result.networkAddress },
                  { label: 'Broadcast Address', value: result.broadcastAddress },
                  { label: 'First Host', value: result.firstHost },
                  { label: 'Last Host', value: result.lastHost },
                  { label: 'Total Hosts', value: result.totalHosts.toLocaleString() },
                  { label: 'Usable Hosts', value: result.usableHosts.toLocaleString() }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                    <span className="text-slate-600 font-medium">{item.label}:</span>
                    <span className="font-mono text-slate-800 font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Clean Help Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">How to Use</h2>
            <div className="h-1 w-12 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                <h3 className="text-slate-800 font-bold text-lg mb-2">Enter IP with CIDR</h3>
                <p className="text-slate-600">Type <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">192.168.1.1/24</code> for precise subnet calculation</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                <h3 className="text-slate-800 font-bold text-lg mb-2">Real-time Updates</h3>
                <p className="text-slate-600">Results update automatically as you type - no button needed!</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                <h3 className="text-slate-800 font-bold text-lg mb-2">Single IP Address</h3>
                <p className="text-slate-600">Enter just an IP like <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">192.168.1.100</code> (defaults to /24)</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                <h3 className="text-slate-800 font-bold text-lg mb-2">All IPv4 Classes</h3>
                <p className="text-slate-600">Supports CIDR values from /0 to /32 for any network size</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
