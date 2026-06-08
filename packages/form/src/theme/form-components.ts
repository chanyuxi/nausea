import type { ComponentType, ReactNode } from 'react'

export interface FormRegionProps {
  children?: ReactNode
  className?: string
}

export interface FormErrorProps extends FormRegionProps {
  error?: unknown
}

export interface FormComponents {
  Control?: ComponentType<FormRegionProps>
  Error?: ComponentType<FormErrorProps>
  Field?: ComponentType<FormRegionProps>
  Label?: ComponentType<FormRegionProps>
  Root?: ComponentType<FormRegionProps>
}
