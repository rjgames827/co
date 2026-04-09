import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Copy, Trash2, RefreshCw, AlertCircle, CheckCircle2, Loader2, ExternalLink, Zap } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface WebsiteLink {
  id: string;
  subdomain: string;
  domain: string;
  fullUrl: string;
  createdAt: { toDate: () => Date };
  createdBy: string;
  registered?: boolean;
  updateUrl?: string;
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
    // Generate random NEW subdomains (not using existing ones)
    const freeDomains = [
      'mooo.com',
      'chickenkiller.com',
      'crabdance.com',
      'ignorelist.com',
      'redirectme.net',
      'servegame.com',
      'zapto.org',
      'ddns.net',
      'dnsalias.com',
      'gotdns.com',
      'is-a-geek.com',
      'is-a-blogger.com',
      'is-a-chef.com',
      'kicks-ass.net',
      'mine.nu',
      'webhop.net'
    ];
    
    const adjectives = ['cool', 'awesome', 'super', 'mega', 'ultra', 'hyper', 'cyber', 'digital', 'virtual', 'quantum', 'stellar', 'cosmic', 'neon', 'turbo', 'epic', 'my', 'the', 'best', 'top', 'pro', 'new', 'fast', 'smart', 'tech', 'web', 'chill', 'zone', 'dark', 'light', 'fire', 'ice'];
    const nouns = ['zone', 'hub', 'space', 'world', 'realm', 'domain', 'portal', 'nexus', 'core', 'base', 'site', 'web', 'net', 'link', 'page', 'server', 'host', 'cloud', 'app', 'dev', 'code', 'data', 'info', 'blog', 'home', 'chat', 'game', 'media', 'stream'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 9999);
    const randomDomain = freeDomains[Math.floor(Math.random() * freeDomains.length)];
    
    const subdomain = `${randomAdjective}${randomNoun}${randomNumber}`;
    const fullUrl = `https://${subdomain}.${randomDomain}`;
    
    return {
      subdomain: `${subdomain}.${randomDomain}`,
      domain: randomDomain,
      fullUrl: fullUrl,
      updateUrl: null // No update URL since it's not registered yet
    };
  };

  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    setError(null);
    setSuccess(null);

    try {
      const linkData = generateRandomLink();
      
      const newLink: WebsiteLink = {
        id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        subdomain: linkData.subdomain,
        domain: linkData.domain,
        fullUrl: linkData.fullUrl,
        createdAt: { toDate: () => new Date() },
        createdBy: 'user',
        registered: false,
        updateUrl: linkData.updateUrl
      };

      const updatedLinks = [newLink, ...websiteLinks];
      setWebsiteLinks(updatedLinks);
      localStorage.setItem('chillzone_website_links', JSON.stringify(updatedLinks));

      setSuccess(`✓ Subdomain idea generated! Click "Register This" to make it live.`);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError('Failed to generate subdomain idea.');
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
        <p className="text-neutral-400 text-sm">Generate random subdomain ideas for ChillZone</p>
        <div className="max-w-3xl mx-auto mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-blue-400 text-xs font-medium leading-relaxed">
            💡 Generate unique subdomain ideas, then register them on FreeDNS to redirect to{' '}
            <span className="text-blue-300 font-bold">https://chillz0ne.dev/</span>
            . Click "Register This" to set it up!
          </p>
        </div>
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
              Generate Subdomain Idea
            </h3>
            <p className="text-xs text-neutral-500 mt-2">Create random subdomain suggestions for ChillZone</p>
          </div>
          <button
            onClick={handleGenerateLink}
            disabled={generatingLink}
            className="flex items-center gap-2 bg-accent hover:bg-accent/80 disabled:opacity-50 text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20"
          >
            {generatingLink ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating...
              </>
            ) : (
              <>
                <RefreshCw size={20} />
                Generate Idea
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
            Subdomain Ideas ({websiteLinks.length})
          </h3>
          <a
            href="https://freedns.afraid.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            Go to FreeDNS
            <ExternalLink size={12} />
          </a>
        </div>
        
        {websiteLinks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
              <Link size={32} className="text-neutral-600" />
            </div>
            <p className="text-neutral-600 italic text-sm">
              No subdomain ideas yet. Click "Generate Idea" to create one!
            </p>
            <div className="max-w-lg mx-auto mt-6 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-blue-400 text-xs font-bold mb-3">📝 How it works:</p>
              <ol className="text-blue-300 text-xs space-y-2 text-left">
                <li>1. Click "Generate Idea" to create a random subdomain</li>
                <li>2. Click "Register This" to open FreeDNS with pre-filled form</li>
                <li>3. Log in to FreeDNS (free account)</li>
                <li>4. Click "Save" to register the subdomain</li>
                <li>5. Wait 5-10 minutes for DNS to update</li>
                <li>6. Your subdomain will redirect to ChillZone!</li>
              </ol>
            </div>
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
                        className="text-white font-bold text-lg hover:text-accent transition-colors flex items-center gap-2 group"
                      >
                        {link.fullUrl}
                        <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded border border-yellow-500/30">
                          Not Registered
                        </span>
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
                    Created: {link.createdAt?.toDate().toLocaleString() || 'Just now'} • Forwards to: <span className="text-accent">https://chillz0ne.dev/</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <a
                    href={`https://freedns.afraid.org/subdomain/edit.php?data_id=new&type=URL&subdomain=${link.subdomain.split('.')[0]}&domain=${link.domain}&address=https://chillz0ne.dev/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-accent text-white hover:bg-accent/80 transition-all flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
                    title="Register on FreeDNS"
                  >
                    <Zap size={16} />
                    Register This
                  </a>
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
                    title="Delete"
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
