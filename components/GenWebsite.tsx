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
