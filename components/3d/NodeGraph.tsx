'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Lock, Eye, Brain, Network } from 'lucide-react';

const NODES = [
  { id: 'core', label: 'Spryzen+ Core', color: '#00d4ff', desc: 'Monoio Thread-Per-Core', icon: Zap },
  { id: 'waf', label: 'WAF Engine', color: '#7c3aed', desc: 'SIMD Aho-Corasick', icon: Shield },
  { id: 'ebpf', label: 'eBPF Shield', color: '#00e676', desc: 'XDP 1.4µs Kernel Drop', icon: Network },
  { id: 'ouroboros', label: 'Ouroboros', color: '#a855f7', desc: 'Self-Healing AI', icon: Brain },
  { id: 'spryzenid', label: 'Spryzen ID', color: '#d4af37', desc: 'Hardware Passports', icon: Lock },
  { id: 'zkdpi', label: 'ZK-DPI', color: '#ff6d00', desc: 'Bulletproofs ZK Proofs', icon: Eye },
];

export default function NodeGraph() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
      {/* Background glow matrix */}
      <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl relative z-10">
        {NODES.map((node, i) => {
          const Icon = node.icon;
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-cyan-500/40 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: `${node.color}20`, border: `1px solid ${node.color}40`, color: node.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors">
                  {node.label}
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{node.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
