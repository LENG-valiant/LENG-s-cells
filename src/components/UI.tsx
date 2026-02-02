'use client'

import { ReactNode } from 'react'
import { Star } from 'lucide-react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
  style?: React.CSSProperties
}

export function Card({ children, className = '', onClick, hover = true, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

interface ToolCardProps {
  name: string
  description: string
  icon: string
  category: string
  isFavorite: boolean
  onFavorite: () => void
  onClick: () => void
}

export function ToolCard({ name, description, icon, category, isFavorite, onFavorite, onClick }: ToolCardProps) {
  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{name}</h3>
            <span className="text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full">
              {category}
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onFavorite()
          }}
          className={`p-2 rounded-full transition-colors ${
            isFavorite ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' : 'text-gray-300 dark:text-gray-400 hover:text-yellow-500'
          }`}
        >
          <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{description}</p>
    </Card>
  )
}

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color: string
}

export function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <Card hover={false}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">{title}</p>
        </div>
      </div>
    </Card>
  )
}

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-300 mb-4">{description}</p>
      {action}
    </div>
  )
}

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
