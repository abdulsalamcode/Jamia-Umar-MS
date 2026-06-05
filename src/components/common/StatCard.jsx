import React from 'react'

export default function StatCard({ icon, value, label, trend, trendValue }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 
                    p-5 flex items-center gap-4 
                    hover:shadow-md hover:-translate-y-1 
                    transition-all duration-200">

      {/* Icon Box */}
      <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100
                      flex items-center justify-center text-2xl flex-shrink-0">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-2xl font-bold text-green-900 leading-tight">
          {value}
        </div>
        <div className="text-xs text-gray-400 font-medium mt-0.5 uppercase tracking-wide">
          {label}
        </div>

        {/* Trend (optional) */}
        {trend && (
          <div className={`flex items-center gap-1 mt-1.5 text-xs font-bold
            ${trend === 'up' ? 'text-green-500' : 'text-red-400'}`}>
            <span>{trend === 'up' ? '▲' : '▼'}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>

    </div>
  )
}