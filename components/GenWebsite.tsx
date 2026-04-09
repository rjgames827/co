import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Copy, Trash2, RefreshCw, AlertCircle, CheckCircle2, Loader2, ExternalLink, Key, Settings, Zap } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface WebsiteLink {
  id: string;
  subdomain: string;
  domain: string;
  fullUrl: string;
  createdAt: { toDate: () => Date };
  createdBy: string;
  registered?: boolean;
}

const GenWebsite: React.FC = () => {
  const [websiteLinks, setWebsiteLinks] = useState<WebsiteLink[]>(() => {
    const saved = localStorage.getItem('chillzone_website_links');
    return saved ? JSON.parse(saved) : [];
  });
  const [generatingLink, setGeneratingLink] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('freedns_api_key') || '';
  });
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [registering, setRegistering] = useState<string | null>(null);

  const generateRandomLink = () => {
    // Real free domains from FreeDNS (afraid.org)
    const freeDomains = [
      'mooo.com',
      'chickenkiller.com',
      'crabdance.com',
      'ignorelist.com',
      'jkub.com',
      'mywire.org',
      'redirectme.net',
      'servebeer.com',
      'serveftp.com',
      'servegame.com',
      'stuff-4-sale.us',
      'ygto.com',
      'zapto.org',
      'ddns.net',
      'dnsalias.com',
      'dnsalias.net',
      'dnsalias.org',
      'dnsdojo.com',
      'dnsdojo.net',
      'dnsdojo.org',
      'does-it.net',
      'doesntexist.com',
      'doesntexist.org',
      'dontexist.com',
      'dontexist.net',
      'dontexist.org',
      'doomdns.com',
      'doomdns.org',
      'dvrdns.org',
      'dyn-o-saur.com',
      'dynalias.com',
      'dynalias.net',
      'dynalias.org',
      'dynathome.net',
      'dyndns.org',
      'dyndns-at-home.com',
      'dyndns-at-work.com',
      'dyndns-blog.com',
      'dyndns-free.com',
      'dyndns-home.com',
      'dyndns-ip.com',
      'dyndns-mail.com',
      'dyndns-office.com',
      'dyndns-pics.com',
      'dyndns-remote.com',
      'dyndns-server.com',
      'dyndns-web.com',
      'dyndns-wiki.com',
      'dyndns-work.com',
      'est-a-la-maison.com',
      'est-a-la-masion.com',
      'est-le-patron.com',
      'est-mon-blogueur.com',
      'from-ak.com',
      'from-al.com',
      'from-ar.com',
      'from-ca.com',
      'from-co.net',
      'from-ct.com',
      'from-dc.com',
      'from-de.com',
      'from-fl.com',
      'from-ga.com',
      'from-hi.com',
      'from-ia.com',
      'from-id.com',
      'from-il.com',
      'from-in.com',
      'from-ks.com',
      'from-ky.com',
      'from-ma.com',
      'from-md.com',
      'from-mi.com',
      'from-mn.com',
      'from-mo.com',
      'from-ms.com',
      'from-mt.com',
      'from-nc.com',
      'from-nd.com',
      'from-ne.com',
      'from-nh.com',
      'from-nj.com',
      'from-nm.com',
      'from-nv.com',
      'from-oh.com',
      'from-ok.com',
      'from-or.com',
      'from-pa.com',
      'from-pr.com',
      'from-ri.com',
      'from-sc.com',
      'from-sd.com',
      'from-tn.com',
      'from-tx.com',
      'from-ut.com',
      'from-va.com',
      'from-vt.com',
      'from-wa.com',
      'from-wi.com',
      'from-wv.com',
      'from-wy.com',
      'getmyip.com',
      'gotdns.com',
      'gotdns.org',
      'groks-the.info',
      'groks-this.info',
      'here-for-more.info',
      'homeftp.net',
      'homeftp.org',
      'homeip.net',
      'homelinux.com',
      'homelinux.net',
      'homelinux.org',
      'homeunix.com',
      'homeunix.net',
      'homeunix.org',
      'iamallama.com',
      'in-the-band.net',
      'is-a-anarchist.com',
      'is-a-blogger.com',
      'is-a-bookkeeper.com',
      'is-a-bruinsfan.org',
      'is-a-bulls-fan.com',
      'is-a-candidate.org',
      'is-a-caterer.com',
      'is-a-celticsfan.org',
      'is-a-chef.com',
      'is-a-chef.net',
      'is-a-chef.org',
      'is-a-conservative.com',
      'is-a-cpa.com',
      'is-a-cubicle-slave.com',
      'is-a-democrat.com',
      'is-a-designer.com',
      'is-a-doctor.com',
      'is-a-financialadvisor.com',
      'is-a-geek.com',
      'is-a-geek.net',
      'is-a-geek.org',
      'is-a-green.com',
      'is-a-guru.com',
      'is-a-hard-worker.com',
      'is-a-hunter.com',
      'is-a-knight.org',
      'is-a-landscaper.com',
      'is-a-lawyer.com',
      'is-a-liberal.com',
      'is-a-libertarian.com',
      'is-a-linux-user.org',
      'is-a-llama.com',
      'is-a-musician.com',
      'is-a-nascarfan.com',
      'is-a-nurse.com',
      'is-a-painter.com',
      'is-a-patsfan.org',
      'is-a-personaltrainer.com',
      'is-a-photographer.com',
      'is-a-player.com',
      'is-a-republican.com',
      'is-a-rockstar.com',
      'is-a-socialist.com',
      'is-a-soxfan.org',
      'is-a-student.com',
      'is-a-teacher.com',
      'is-a-techie.com',
      'is-a-therapist.com',
      'is-an-accountant.com',
      'is-an-actor.com',
      'is-an-actress.com',
      'is-an-anarchist.com',
      'is-an-artist.com',
      'is-an-engineer.com',
      'is-an-entertainer.com',
      'is-by.us',
      'is-certified.com',
      'is-found.org',
      'is-gone.com',
      'is-into-anime.com',
      'is-into-cars.com',
      'is-into-cartoons.com',
      'is-into-games.com',
      'is-leet.com',
      'is-lost.org',
      'is-not-certified.com',
      'is-saved.org',
      'is-slick.com',
      'is-uberleet.com',
      'is-very-bad.org',
      'is-very-evil.org',
      'is-very-good.org',
      'is-very-nice.org',
      'is-very-sweet.org',
      'is-with-theband.com',
      'isa-geek.com',
      'isa-geek.net',
      'isa-geek.org',
      'isa-hockeynut.com',
      'issmarterthanyou.com',
      'isteingeek.de',
      'istmein.de',
      'kicks-ass.net',
      'kicks-ass.org',
      'knowsitall.info',
      'land-4-sale.us',
      'lebtimnetz.de',
      'leitungsen.de',
      'likes-pie.com',
      'likescandy.com',
      'merseine.nu',
      'mine.nu',
      'misconfused.org',
      'mypets.ws',
      'myphotos.cc',
      'neat-url.com',
      'office-on-the.net',
      'on-the-web.tv',
      'podzone.net',
      'podzone.org',
      'readmyblog.org',
      'saves-the-whales.com',
      'scrapper-site.net',
      'scrapping.cc',
      'selfip.biz',
      'selfip.com',
      'selfip.info',
      'selfip.net',
      'selfip.org',
      'sells-for-less.com',
      'sells-for-u.com',
      'sells-it.net',
      'sellsyourhome.org',
      'servebbs.com',
      'servebbs.net',
      'servebbs.org',
      'serveftp.net',
      'servegame.org',
      'shacknet.nu',
      'simple-url.com',
      'space-to-rent.com',
      'stuff-4-sale.org',
      'teaches-yoga.com',
      'thruhere.net',
      'traeumtgerade.de',
      'webhop.biz',
      'webhop.info',
      'webhop.net',
      'webhop.org',
      'worse-than.tv',
      'writesthisblog.com'
    ];
    
    const adjectives = ['cool', 'awesome', 'super', 'mega', 'ultra', 'hyper', 'cyber', 'digital', 'virtual', 'quantum', 'stellar', 'cosmic', 'neon', 'turbo', 'epic', 'my', 'the', 'best', 'top', 'pro', 'new', 'fast', 'smart', 'tech', 'web'];
    const nouns = ['zone', 'hub', 'space', 'world', 'realm', 'domain', 'portal', 'nexus', 'core', 'base', 'site', 'web', 'net', 'link', 'page', 'server', 'host', 'cloud', 'app', 'dev', 'code', 'data', 'info', 'blog', 'home'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 999);
    const randomDomain = freeDomains[Math.floor(Math.random() * freeDomains.length)];
    
    const subdomain = `${randomAdjective}${randomNoun}${randomNumber}`;
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

  const handleCopyLink = (subdomain: string) => {
    const instructions = `Subdomain: ${subdomain}\nForward to: https://chillz0ne.dev/\n\nRegister at: https://freedns.afraid.org/subdomain/`;
    navigator.clipboard.writeText(instructions);
    setSuccess('Setup instructions copied to clipboard!');
    setTimeout(() => setSuccess(null), 2000);
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('freedns_api_key', apiKey.trim());
      setSuccess('API credentials saved! You can now auto-register subdomains.');
      setShowApiSetup(false);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError('Please enter valid API credentials');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAutoRegister = async (link: WebsiteLink) => {
    if (!apiKey) {
      setError('Please set up your FreeDNS API credentials first');
      setShowApiSetup(true);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setRegistering(link.id);
    setError(null);
    setSuccess(null);

    try {
      // FreeDNS API endpoint for creating subdomains
      const response = await fetch('https://freedns.afraid.org/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'add',
          type: 'URL',
          subdomain: link.subdomain.split('.')[0],
          domain: link.domain,
          destination: 'https://chillz0ne.dev/',
          apikey: apiKey
        })
      });

      if (response.ok) {
        setSuccess(`Successfully registered ${link.fullUrl}! It will be active in 5-10 minutes.`);
        
        // Update the link status
        const updatedLinks = websiteLinks.map(l => 
          l.id === link.id ? { ...l, registered: true } : l
        );
        setWebsiteLinks(updatedLinks);
        localStorage.setItem('chillzone_website_links', JSON.stringify(updatedLinks));
        
        setTimeout(() => setSuccess(null), 5000);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(`Auto-registration failed: ${err.message}. Try manual registration instead.`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setRegistering(null);
    }
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
        <p className="text-neutral-400 text-sm">Generate and auto-register subdomains that forward to ChillZone</p>
        <div className="max-w-3xl mx-auto mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-blue-400 text-xs font-medium leading-relaxed">
            ⚡ Auto-registration enabled! These subdomains will automatically redirect to{' '}
            <span className="text-blue-300 font-bold">https://chillz0ne.dev/</span>
            {apiKey ? ' when you click "Auto Register"' : '. Set up your FreeDNS API key to enable auto-registration!'}
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
              Generate Web Forward
            </h3>
            <p className="text-xs text-neutral-500 mt-2">Create subdomains that redirect to ChillZone</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowApiSetup(!showApiSetup)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-black uppercase tracking-widest text-xs ${
                apiKey 
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20' 
                  : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20'
              }`}
            >
              <Settings size={16} />
              {apiKey ? 'API Connected' : 'Setup API'}
            </button>
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
                  Generate Forward
                </>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showApiSetup && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/40 rounded-xl p-6 border border-white/10 space-y-4"
            >
              <div className="flex items-start gap-3">
                <Key size={20} className="text-accent mt-1" />
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">FreeDNS API Setup</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      To enable auto-registration, you need a FreeDNS account. Get your API key from{' '}
                      <a 
                        href="https://freedns.afraid.org/api/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 underline hover:text-blue-300"
                      >
                        FreeDNS API page
                      </a>
                      {' '}after logging in.
                    </p>
                  </div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your FreeDNS API key..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-accent/50 transition-all"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveApiKey}
                      className="flex-1 py-2 bg-accent text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-accent/90 transition-all"
                    >
                      Save API Key
                    </button>
                    <button
                      onClick={() => setShowApiSetup(false)}
                      className="px-4 py-2 bg-white/5 text-neutral-400 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            Web Forwards ({websiteLinks.length})
          </h3>
          <a
            href="https://freedns.afraid.org/subdomain/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            Register on FreeDNS
            <ExternalLink size={12} />
          </a>
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
              No web forwards yet. Click "Generate Forward" to create one!
            </p>
            <div className="max-w-md mx-auto mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-400 text-xs font-bold mb-2">How to Register:</p>
              <ol className="text-green-300 text-xs text-left space-y-1">
                <li>1. Go to FreeDNS and create a free account</li>
                <li>2. Click "Subdomains" → "Add"</li>
                <li>3. Select "Web Forward" as Type</li>
                <li>4. Enter your subdomain name</li>
                <li>5. Set destination to: <span className="font-mono bg-black/30 px-1 rounded">https://chillz0ne.dev/</span></li>
                <li>6. Save and wait 5-10 minutes for DNS</li>
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
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                          link.registered 
                            ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                        }`}>
                          {link.registered ? '✓ Registered' : '→ chillz0ne.dev'}
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
                  {!link.registered && apiKey && (
                    <button
                      onClick={() => handleAutoRegister(link)}
                      disabled={registering === link.id}
                      className="p-3 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 transition-all flex items-center gap-1 disabled:opacity-50"
                      title="Auto Register"
                    >
                      {registering === link.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Zap size={16} />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-widest">Auto Register</span>
                    </button>
                  )}
                  {!link.registered && (
                    <a
                      href={`https://freedns.afraid.org/subdomain/?step=2&domain=${link.domain}&subdomain=${link.subdomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-all flex items-center gap-1"
                      title="Manual Register"
                    >
                      <ExternalLink size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Manual</span>
                    </a>
                  )}
                  <button 
                    onClick={() => handleCopyLink(link.subdomain)}
                    className="p-3 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all"
                    title="Copy Subdomain"
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
