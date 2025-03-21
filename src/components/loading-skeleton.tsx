"use client"

import { useEffect, useState, type ReactNode } from "react"

interface SkeletonProps {
  height?: string
  width?: string
  borderRadius?: string
  className?: string
}

export const Skeleton = ({
  height = "1rem",
  width = "100%",
  borderRadius = "0.5rem",
  className = "",
}: SkeletonProps) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        height,
        width,
        borderRadius,
      }}
    />
  )
}

export const PageSkeleton = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="gradient-bg min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <Skeleton height="3rem" width="300px" className="mb-4" />
          <Skeleton height="1.5rem" width="500px" className="mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-black/50 p-6 rounded-xl">
                <Skeleton height="200px" className="mb-4" />
                <Skeleton height="1.5rem" width="80%" className="mb-2" />
                <Skeleton height="1rem" className="mb-4" />
                <Skeleton height="1rem" width="90%" className="mb-2" />
                <Skeleton height="1rem" width="80%" className="mb-4" />
                <div className="flex justify-between">
                  <Skeleton height="2rem" width="45%" />
                  <Skeleton height="2rem" width="45%" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

