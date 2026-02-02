'use client'

import { useState, useEffect, useRef } from 'react'

interface HeartbeatChartProps {
  isActive: boolean
}

export default function HeartbeatChart({ isActive }: HeartbeatChartProps) {
  const [isBeating, setIsBeating] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  // 触发心跳动画
  useEffect(() => {
    if (isActive) {
      setIsBeating(true)
      const timer = setTimeout(() => {
        setIsBeating(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  return (
    <div className="w-full flex justify-center py-4">
      <svg
        ref={svgRef}
        width="300"
        height="100"
        viewBox="0 0 300 100"
        className={`transition-all duration-300 ${isBeating ? 'scale-105' : 'scale-100'}`}
      >
        {/* 网格背景 */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="300" height="100" fill="url(#grid)" />
        
        {/* 心跳曲线 */}
        <path
          d="M 0 50 Q 20 50 30 40 T 60 40 T 90 40 T 120 40 T 150 40 T 180 40 T 210 40 T 240 40 T 270 40 T 300 50"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          className="transition-all duration-300"
        />
        
        {/* 跳动的峰值点 */}
        <path
          d="M 30 40 L 35 10 L 40 40 M 90 40 L 95 10 L 100 40 M 150 40 L 155 10 L 160 40 M 210 40 L 215 10 L 220 40 M 270 40 L 275 10 L 280 40"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          className={`transition-all duration-300 ${isBeating ? 'opacity-100' : 'opacity-70'}`}
        />
        
        {/* 中心点 */}
        <circle cx="150" cy="50" r="4" fill="#ef4444" className={`transition-all duration-300 ${isBeating ? 'scale-125' : 'scale-100'}`} />
        
        {/* 心跳文本 */}
        <text x="150" y="85" textAnchor="middle" fill="#6b7280" fontSize="12">
          心脏跳动曲线
        </text>
      </svg>
    </div>
  )
}