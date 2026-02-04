'use client';

import { motion } from 'framer-motion';

const PRODUCTS = [
  { name: 'Scout Manager', url: 'https://scoutmanager.io' },
  { name: 'Infleos', url: 'https://infleos.io' },
  { name: 'GetCareKorea', url: 'https://getcarekorea.com' },
  { name: 'CS Flow', url: 'https://cs-landing.afformation.co.kr' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#222] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-[#00ff88] mb-4">
              AFFORMATION
            </h3>
            <p className="text-gray-400 mb-4">
              &quot;마케팅을 알고 코드를 짜는 조직&quot;
            </p>
            <p className="text-sm text-gray-500">
              의료관광 마케팅 10년+ 경험과
              <br />
              AI Native 개발 역량의 결합
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-bold text-[#fafafa] uppercase tracking-wider mb-4">
              Products
            </h4>
            <ul className="space-y-2">
              {PRODUCTS.map((product) => (
                <li key={product.url}>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#00ff88] transition-colors text-sm"
                  >
                    {product.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-[#fafafa] uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://afformation.co.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00ff88] transition-colors"
                >
                  afformation.co.kr
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@afformation.co.kr"
                  className="text-gray-400 hover:text-[#00ff88] transition-colors"
                >
                  contact@afformation.co.kr
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#222] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Afformation Inc. All rights reserved.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 text-xs text-gray-600"
          >
            <span>Built with</span>
            <span className="text-[#00ff88]">Claude Code</span>
            <span>+</span>
            <span className="text-[#00d4ff]">bkit PDCA</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
