import { motion } from "framer-motion";
import { LogIn, Sparkles, Zap, Shield, Heart } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-foreground text-background relative overflow-hidden flex flex-col">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-pokeball-pattern-white opacity-20 pointer-events-none" />

      <header className="w-full max-w-7xl mx-auto px-6 py-6 relative z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full border-2 border-primary" />
          </div>
          <span className="font-display font-black text-2xl tracking-tight text-white">
            Poké<span className="text-primary">Dex</span>
          </span>
        </div>
        <button
          onClick={handleLogin}
          className="px-6 py-2.5 rounded-full font-bold text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
        >
          Sign In
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-white/80">The Original 151 Collection</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-black leading-tight mb-6">
            Your Ultimate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">
              Pokémon Journey
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Explore the original generation. Vote on your favorites, build your ultimate team, and join a community of trainers.
          </p>

          <button
            onClick={handleLogin}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-rose-500 text-white font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300"
          >
            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Login with Replit to Start
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
          {[
            { icon: <Zap className="w-6 h-6 text-yellow-400" />, title: "Vote on Pokémon", desc: "Upvote your favorites and downvote the ones you don't like." },
            { icon: <Heart className="w-6 h-6 text-primary" />, title: "Curate Favorites", desc: "Build a personalized collection of your top Pokémon." },
            { icon: <Shield className="w-6 h-6 text-blue-400" />, title: "Original 151", desc: "Experience the nostalgia of the Kanto region." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + (i * 0.1) }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 text-left backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-display font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
