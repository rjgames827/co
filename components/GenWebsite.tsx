import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Copy, Trash2, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface WebsiteLink {
  id: string;
  subdomain: string;
  domain: string;
  fullUrl: string;
  createdAt: { toDate: () => Date };
  createdBy: string;
}

const GenWebsite: React.FC = () => {
  const [websiteLinks, setWebsiteLinks] = useState<WebsiteLink[]>(() => {
    const saved = localStorage.getItem('chillzone_website_links');
    return saved ? JSON.parse(saved) : [];
  });
  const [generatingLink, setGeneratingLink] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const generateRandomLink = () => {
    const adjectives = ['cool', 'awesome', 'super', 'mega', 'ultra', 'hyper', 'cyber', 'digital', 'virtual', 'quantum', 'stellar', 'cosmic', 'neon', 'turbo', 'epic'];
    const nouns = ['zone', 'hub', 'space', 'world', 'realm', 'domain', 'portal', 'nexus', 'core', 'base', 'site', 'web', 'net', 'link', 'page'];
    const domains = ['netlify.app', 'vercel.app', 'github.io', 'web.app', 'pages.dev', 'herokuapp.com', 'onrender.com', 'fly.dev'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 9999);
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    
    const subdomain = `${randomAdjective}-${randomNoun}-${randomNumber}`;
    return { subdomain, domain: randomDomain, fullUrl: `https://${subdomain}.${randomDomain}` };
  };

  const handleGenerateLink = () => {
    setGeneratingLink(true);
    setError(null);
    setSuccess(null);

    try {
      const { subdomain, domain, fullUrl } = generateRandomLink();
      
      const newLink: WebsiteLink = {
        id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        subdomain,
        domain,
        fullUrl,
        createdAt: { toDate: () => new Date() },
        createdBy: 'user'
      };

      const updatedLinks = [newLink, ...websiteLinks];
      setWebsiteLinks(updatedLinks);
      localStorage.setItem('chillzone_website_links', JSON.stringify(updatedLinks));

      setSuccess('New website link generated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to generate link.');
      console.error(err);
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleDeleteLink = (id: string) => {
    try {
      const updatedLinks = websiteLinks.filter(link => link.id !== id);
      setWebsiteLinks(updatedLinks);
      localStorage.setItem('chillzone_website_links', JSON.stringify(updatedLinks));
      setSuccess('Link deleted successfully!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError('Failed to delete link.');
      console.error(err);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setSuccess('Link copied to clipboard!');
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-6xl font-black uppercase italic tracking-tighter">
          Website Link <span className="text-accent">Generator</span>
        </h1>
        <p className="text-neutral-400 text-sm">Generate random website URLs instantly - no database required!</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 rounded-2xl p-8 border border-white/5 space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
              <Link size={20} className="text-accent" />
              Generate New Link
            </h3>
            <p className="text-xs text-neutral-500 mt-2">Click the button to create a random website URL</p>
          </div>
          <button
            onClick={handleGenerateLink}
            disabled={generatingLink}
            className="flex items-center gap-2 bg-accent hover:bg-accent/80 disabled:opacity-50 text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20"
          >
            {generatingLink ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw size={20} />
                Generate Link
              </>
            )}
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }} 
              className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }} 
              className="flex items-center gap-2 text-green-500 text-sm font-bold bg-green-500/10 p-4 rounded-xl border border-green-500/20"
            >
              <CheckCircle2 size={16} />
              {success}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">
            Generated Links ({websiteLinks.length})
          </h3>
        </div>
        
        {websiteLinks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 space-y-4"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
              <Link size={32} className="text-neutral-600" />
            </div>
            <p className="text-neutral-600 italic text-sm">
              No links generated yet. Click "Generate Link" to create one!
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {websiteLinks.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-accent/30 transition-all"
              >
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                      <Link size={20} className="text-accent" />
                    </div>
                    <div>
                      <a 
                        href={link.fullUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white font-bold text-lg hover:text-accent transition-colors flex items-center gap-2"
                      >
                        {link.fullUrl}
                      </a>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-neutral-500">
                          {link.subdomain}
                        </span>
                        <span className="text-xs text-neutral-600">•</span>
                        <span className="text-xs font-mono text-neutral-500">
                          {link.domain}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-neutral-600 pl-16">
                    Created: {link.createdAt?.toDate().toLocaleString() || 'Just now'}
                  </p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleCopyLink(link.fullUrl)}
                    className="p-3 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all"
                    title="Copy Link"
                  >
                    <Copy size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
                    title="Delete Link"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenWebsite;
