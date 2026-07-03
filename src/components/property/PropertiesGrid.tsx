'use client'

import { motion } from 'framer-motion'
import PropertyCard from './PropertyCard'
import type { Property } from '@/types/property'

interface PropertiesGridProps {
  properties: Property[]
}

export function PropertiesGrid({ properties }: PropertiesGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {properties.map((property, i) => (
        <motion.div
          key={property.id}
          variants={{
            hidden:  { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          <PropertyCard property={property} priority={i < 4} />
        </motion.div>
      ))}
    </motion.div>
  )
}
