/**
 * Landing Page - Contenu principal du site
 * Le jeu Snake est caché derrière cette page innocente
 */

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fond animé avec grille */}
      <div 
        className="fixed inset-0 opacity-50"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          animation: 'grid-scroll 20s linear infinite',
        }}
      />
      
      {/* Effet de gradient radial */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Contenu principal */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-32">
        {/* Header */}
        <header className="text-center mb-16" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Bienvenue sur</span>
            <br />
            <span 
              className="text-green-400"
              style={{ textShadow: '0 0 10px #00ff88, 0 0 20px rgba(0,255,136,0.5)' }}
            >
              Mon Site
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Un site web ordinaire avec absolument rien de caché. 
            Vraiment. Ne cherchez pas.
          </p>
        </header>

        {/* Sections de contenu */}
        <main className="space-y-16">
          {/* Section À propos */}
          <section className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
              <span className="text-3xl">👋</span>
              À propos
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Ceci est une page de démonstration parfaitement normale. 
              Elle ne contient aucun secret, aucun easter egg, et certainement 
              pas de jeu vidéo classique caché quelque part. Si quelqu'un vous 
              dit le contraire, c'est faux.
            </p>
          </section>

          {/* Section Features */}
          <section className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: '🎨', 
                title: 'Design Moderne', 
                desc: 'Une interface élégante et responsive qui s\'adapte à tous les écrans.' 
              },
              { 
                icon: '⚡', 
                title: 'Performance', 
                desc: 'Construit avec React et Vite pour une expérience ultra-rapide.' 
              },
              { 
                icon: '🔒', 
                title: 'Sécurité', 
                desc: 'Aucune donnée sensible. Juste du contenu 100% innocent.' 
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-black/20 backdrop-blur-sm rounded-xl p-6 
                           border border-white/5 hover:border-green-500/30
                           transition-all duration-300 hover:-translate-y-1
                           hover:shadow-lg hover:shadow-green-500/10"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </section>

          {/* Section CTA */}
          <section className="text-center py-12">
            <div 
              className="inline-block rounded-2xl p-8 border border-green-500/20"
              style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,204,106,0.05) 100%)' }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                🤔 Vous cherchez quelque chose ?
              </h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Il n'y a vraiment rien à voir ici. Mais si vous êtes du genre 
                curieux, peut-être que certaines combinaisons de touches 
                pourraient révéler des surprises...
              </p>
            </div>
          </section>

          {/* Section Stats fictives */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '∞', label: 'Secrets cachés', note: '(ou zéro)' },
              { value: '100%', label: 'Innocent' },
              { value: '0', label: 'Jeux vidéo' },
              { value: '🐍', label: 'Serpents' },
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center p-4 bg-black/20 rounded-xl border border-white/5"
              >
                <div className="text-3xl md:text-4xl font-bold text-green-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </div>
                {stat.note && (
                  <div className="text-[10px] text-gray-600 mt-1">{stat.note}</div>
                )}
              </div>
            ))}
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Hidden Snake Project •{' '}
            <span className="text-gray-600">
              Fait avec React + Vite + Tailwind
            </span>
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Psst... essayez le code Konami 🎮
          </p>
        </footer>
      </div>

      {/* Éléments décoratifs flottants */}
      <div 
        className="fixed top-20 left-10 w-32 h-32 rounded-full blur-3xl"
        style={{ 
          background: 'rgba(0, 255, 136, 0.05)',
          animation: 'pulse 4s ease-in-out infinite' 
        }}
      />
      <div 
        className="fixed bottom-40 right-20 w-48 h-48 rounded-full blur-3xl"
        style={{ 
          background: 'rgba(0, 204, 106, 0.05)',
          animation: 'pulse 6s ease-in-out infinite 2s' 
        }}
      />

      {/* Keyframes CSS */}
      <style>{`
        @keyframes grid-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
