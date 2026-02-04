'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CORE_PRODUCTS, SUPPORTING_PRODUCTS } from '@/lib/products-data';

export default function Products() {
  return (
    <section
      id="products"
      className="section-container bg-[#0d0d0d] relative"
    >
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#fafafa] mb-4">
            Products
          </h2>
          <p className="text-xl text-gray-400">
            6개의 라이브 프로덕트 에코시스템
          </p>
        </motion.div>

        {/* Dual Layer - Core Products */}
        <div className="mb-12">
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-[#00ff88] uppercase tracking-wider mb-6 flex items-center gap-2"
          >
            <span className="w-8 h-[2px] bg-[#00ff88]" />
            Core Products
          </motion.h3>

          <div className="grid md:grid-cols-2 gap-8">
            {CORE_PRODUCTS.map((product, index) => (
              <Card key={product.id} glowColor={product.color} delay={index * 0.1}>
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4
                        className="text-2xl font-bold mb-1"
                        style={{ color: product.color }}
                      >
                        {product.name}
                      </h4>
                      <p className="text-gray-400">{product.description}</p>
                    </div>
                    <span className="text-3xl">
                      {product.id === 'scout-manager' ? '🎯' : '📊'}
                    </span>
                  </div>

                  <div className="flex-1">
                    <ul className="space-y-2 mb-4">
                      {product.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <span style={{ color: product.color }}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {product.metrics && product.metrics.length > 0 && (
                      <div className="flex gap-4 mb-4">
                        {product.metrics.map((metric, i) => (
                          <div
                            key={i}
                            className="bg-[#0a0a0a] rounded-lg px-3 py-2"
                          >
                            <div
                              className="text-xl font-bold"
                              style={{ color: product.color }}
                            >
                              {metric.value}
                              {metric.unit}
                            </div>
                            <div className="text-xs text-gray-500">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    href={product.url}
                    variant="secondary"
                    size="sm"
                    className="self-start"
                  >
                    Visit Site →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Supporting Products */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center gap-2"
          >
            <span className="w-8 h-[2px] bg-gray-500" />
            Supporting Products
          </motion.h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUPPORTING_PRODUCTS.map((product, index) => (
              <motion.a
                key={product.id}
                href={product.url}
                target={product.url !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 hover:border-[#444] transition-all"
                style={{
                  boxShadow: `0 0 0 rgba(${product.color}, 0)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 20px ${product.color}30`;
                  e.currentTarget.style.borderColor = product.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 rgba(${product.color}, 0)`;
                  e.currentTarget.style.borderColor = '#333';
                }}
              >
                <h4
                  className="font-bold mb-1"
                  style={{ color: product.color }}
                >
                  {product.name}
                </h4>
                <p className="text-sm text-gray-400">{product.description}</p>
                {product.id === 'vibeops' && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 bg-[#a78bfa]/20 rounded text-[#a78bfa]">
                    In Development
                  </span>
                )}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
