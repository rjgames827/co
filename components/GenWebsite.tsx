import React, { useState, useEffect } from 'react';
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
  const [availableSubdomains, setAvailableSubdomains] = useState<any[]>([]);
  const [loadingSubdomains, setLoadingSubdomains] = useState(true);

  // Fetch available subdomains from FreeDNS API
  useEffect(() => {
    const fetchSubdomains = async () => {
      try {
        const response = await fetch('https://freedns.afraid.org/api/?action=getdyndns&v=2&sha=9f1a72e70c908ad4f3a6419a9cf5da4bd60deca3&style=xml');
        const xmlText = await response.text();
        
        // Parse XML to extract subdomains
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const items = xmlDoc.getElementsByTagName('item');
        
        const subdomains = [];
        for (let i = 0; i < items.length; i++) {
          const host = items[i].getElementsByTagName('host')[0]?.textContent;
          const address = items[i].getElementsByTagName('address')[0]?.textContent;
          const url = items[i].getElementsByTagName('url')[0]?.textContent;
          
          if (host && url) {
            subdomains.push({
              host: host,
              address: address,
              updateUrl: url,
              fullUrl: `https://${host}`
            });
          }
        }
        
        setAvailableSubdomains(subdomains);
        console.log('Loaded subdomains:', subdomains);
      } catch (err) {
        console.error('Failed to fetch subdomains:', err);
        // Fallback to hardcoded subdomains
        setAvailableSubdomains([
          {
            host: 'chillz0ne.chickenkiller.com',
            address: 'https://chillz0ne.dev/chat',
            updateUrl: 'https://freedns.afraid.org/dynamic/update.php?MUtMRzZnbmtqSmZjSUhnNU4xUW1UcHkwOjI1NjM4MDM3',
            fullUrl: 'https://chillz0ne.chickenkiller.com'
          },
          {
            host: 'dfsfdsfsd.chickenkiller.com',
            address: 'https://chillz0ne.dev/chat',
            updateUrl: 'https://freedns.afraid.org/dynamic/update.php?MUtMRzZnbmtqSmZjSUhnNU4xUW1UcHkwOjI1NjM4MTg0',
            fullUrl: 'https://dfsfdsfsd.chickenkiller.com'
          },
          {
            host: 'chillz0ne.crabdance.com',
            address: 'https://chillz0ne.dev/chat',
            updateUrl: 'https://freedns.afraid.org/dynamic/update.php?MUtMRzZnbmtqSmZjSUhnNU4xUW1UcHkwOjI1NjM3MDcw',
            fullUrl: 'https://chillz0ne.crabdance.com'
          }
        ]);
      } finally {
        setLoadingSubdomains(false);
      }
    };

    fetchSubdomains();
  }, []);

  const generateRandomLink = () => {
    // Use dynamically loaded subdomains from FreeDNS API
    if (availableSubdomains.length === 0) {
      // Fallback if API hasn't loaded yet
      return {
        subdomain: 'chillz0ne.chickenkiller.com',
        domain: 'chickenkiller.com',
        fullUrl: 'https://chillz0ne.chickenkiller.com',
        updateUrl: 'https://freedns.afraid.org/dynamic/update.php?MUtMRzZnbmtqSmZjSUhnNU4xUW1UcHkwOjI1NjM4MDM3'
      };
    }
    
    // Return a random subdomain from your FreeDNS account
    const randomSubdomain = availableSubdomains[Math.floor(Math.random() * availableSubdomains.length)];
    const parts = randomSubdomain.host.split('.');
    const subdomain = parts[0];
    const domain = parts.slice(1).join('.');
    
    return {
      subdomain: randomSubdomain.host,
      domain: domain,
      fullUrl: randomSubdomain.fullUrl,
      updateUrl: randomSubdomain.updateUrl
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
        registered: true,
        updateUrl: linkData.updateUrl
      };

      const updatedLinks = [newLink, ...websiteLinks];
      setWebsiteLinks(updatedLinks);
      localStorage.setItem('chillzone_website_links', JSON.stringify(updatedLinks));

      setSuccess(`✓ ${linkData.fullUrl} is ready! Click to test it now.`);
      setTimeout(() => setSuccess(null), 5000);
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
        <p className="text-neutral-400 text-sm">Get instant working links that redirect to ChillZone</p>
        <div className="max-w-3xl mx-auto mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <p className="text-green-400 text-xs font-medium leading-relaxed">
            ✓ All links are pre-registered and working! They redirect to{' '}
            <span className="text-green-300 font-bold">https://chillz0ne.dev/chat</span>
            {' '}instantly. Just click "Generate Link" and start using it!
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
              Generate Custom Link
            </h3>
            <p className="text-xs text-neutral-500 mt-2">
              {loadingSubdomains ? 'Loading your subdomains...' : `${availableSubdomains.length} active subdomains available`}
            </p>
          </div>
          <button
            onClick={handleGenerateLink}
            disabled={generatingLink || loadingSubdomains}
            className="flex items-center gap-2 bg-accent hover:bg-accent/80 disabled:opacity-50 text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-lg shadow-accent/20"
          >
            {generatingLink || loadingSubdomains ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {loadingSubdomains ? 'Loading...' : 'Creating...'}
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
              <Zap size={32} className="text-accent" />
            </div>
            <p className="text-neutral-600 italic text-sm">
              No links yet. Click "Generate Link" to get a working ChillZone URL!
            </p>
            <div className="max-w-lg mx-auto mt-6 p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-400 text-xs font-bold mb-3">⚡ Instant Links:</p>
              <ul className="text-green-300 text-xs space-y-2 text-left">
                <li>• All links are already registered and working</li>
                <li>• Redirects to ChillZone chat instantly</li>
                <li>• No setup or waiting required</li>
                <li>• Share with friends to access ChillZone</li>
              </ul>
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
                        <span className="text-[10px] font-black uppercase tracking-widest bg-green-500/20 text-green-500 px-2 py-1 rounded border border-green-500/30">
                          ✓ Active
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
                    href={link.fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-accent text-white hover:bg-accent/80 transition-all flex items-center gap-2 font-bold uppercase tracking-widest text-xs"
                    title="Open Link"
                  >
                    <ExternalLink size={16} />
                    Open Link
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
