import { useState } from 'react';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

const ResumeOptimizer = ({ optimizations }) => {
    const [copiedIndex, setCopiedIndex] = useState(null);

    if (!optimizations || !optimizations.improvements || optimizations.improvements.length === 0) return null;

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="glass-card p-6 mt-6">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="text-yellow-400" />
                AI Resume Optimizer (XYZ Formula)
            </h3>
            <p className="text-sm text-gray-400 mb-6">We identified weak bullet points in your experience and rewrote them using Google's recommended XYZ format.</p>

            <div className="space-y-6">
                {optimizations.improvements.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Original */}
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 relative">
                            <span className="absolute top-0 right-0 bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg font-bold">Original</span>
                            <p className="text-sm text-gray-300 mt-2">{item.original}</p>
                        </div>

                        {/* AI Arrow (Desktop) */}
                        <div className="hidden md:flex items-center justify-center -mx-6 z-10">
                            <div className="bg-dark-900 border border-gray-700 rounded-full p-2">
                                <ArrowRight className="text-gray-500" size={16} />
                            </div>
                        </div>

                        {/* Optimized */}
                        <div className="bg-neon-green/10 border border-neon-green/50 rounded-lg p-4 relative group">
                            <span className="absolute top-0 right-0 bg-neon-green/20 text-neon-green text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg font-bold flex items-center gap-1 cursor-pointer hover:bg-neon-green hover:text-dark-900 transition-colors" onClick={() => handleCopy(item.optimized, idx)}>
                                {copiedIndex === idx ? <Check size={12} /> : "Copy AI Version"}
                            </span>
                            <p className="text-sm text-white mt-2 font-medium">{item.optimized}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResumeOptimizer;
