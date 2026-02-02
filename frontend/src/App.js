import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import { Search, Filter, ExternalLink, Zap, Music, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [synths, setSynths] = useState([]);
  const [filteredSynths, setFilteredSynths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchSynths();
  }, []);

  const fetchSynths = async () => {
    try {
      setLoading(true);
      
      // Try to seed first
      await axios.post(`${API}/synths/seed`).catch(() => {});
      
      // Fetch synths
      const response = await axios.get(`${API}/synths`);
      setSynths(response.data);
      setFilteredSynths(response.data);
    } catch (error) {
      console.error("Error fetching synths:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = synths;

    // Filter by type
    if (activeFilter !== "all") {
      result = result.filter(synth => synth.type === activeFilter);
    }

    // Search
    if (searchQuery) {
      result = result.filter(synth =>
        synth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        synth.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        synth.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredSynths(result);
  }, [searchQuery, activeFilter, synths]);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'wavetable': return <Zap className="w-4 h-4" />;
      case 'analog': return <Music className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115]">
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex flex-col justify-center items-center overflow-hidden">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(129, 140, 248, 0.15) 0%, rgba(15, 17, 21, 0) 70%)'
          }}
        />
        
        {/* Hero bg image */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1768885512408-7bd6eb726025?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwzfHxtdXNpYyUyMHByb2R1Y3Rpb24lMjBzdHVkaW8lMjBkYXJrJTIwbmVvbnxlbnwwfHx8fDE3NzAwNDUyMTZ8MA&ixlib=rb-4.1.0&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6" style={{fontFamily: 'Manrope, sans-serif'}}>
            Les Meilleurs Synthés <br/>
            <span className="text-[#818cf8]">Pour Votre Studio</span>
          </h1>
          
          <p className="text-lg leading-relaxed text-[#94a3b8] mb-12 max-w-2xl mx-auto" style={{fontFamily: 'DM Sans, sans-serif'}}>
            Découvrez une sélection complète de synthétiseurs VST pour FL Studio et Ableton. 
            Des plugins gratuits aux outils professionnels.
          </p>

          {/* Search Bar with Glassmorphism */}
          <div 
            className="max-w-2xl mx-auto p-2 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 0 40px -10px rgba(129, 140, 248, 0.3)'
            }}
            data-testid="search-container"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] w-5 h-5" />
              <Input
                data-testid="search-input"
                type="text"
                placeholder="Rechercher un synthé... (ex: Serum, Vital, Massive)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-14 bg-[#0f1115] border-white/10 focus:border-[#818cf8]/50 focus:ring-[#818cf8]/20 rounded-xl text-lg"
                style={{fontFamily: 'DM Sans, sans-serif'}}
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-3 justify-center mt-8 flex-wrap" data-testid="filter-container">
            <Button
              data-testid="filter-all"
              onClick={() => setActiveFilter("all")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                activeFilter === "all"
                  ? "bg-[#818cf8] text-white shadow-lg shadow-[#818cf8]/20"
                  : "bg-white/5 text-[#94a3b8] hover:bg-white/10"
              }`}
              style={{fontFamily: 'DM Sans, sans-serif'}}
            >
              <Filter className="w-4 h-4 mr-2" />
              Tous
            </Button>
            <Button
              data-testid="filter-free"
              onClick={() => setActiveFilter("free")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                activeFilter === "free"
                  ? "bg-[#818cf8] text-white shadow-lg shadow-[#818cf8]/20"
                  : "bg-white/5 text-[#94a3b8] hover:bg-white/10"
              }`}
              style={{fontFamily: 'DM Sans, sans-serif'}}
            >
              Gratuit
            </Button>
            <Button
              data-testid="filter-paid"
              onClick={() => setActiveFilter("paid")}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                activeFilter === "paid"
                  ? "bg-[#818cf8] text-white shadow-lg shadow-[#818cf8]/20"
                  : "bg-white/5 text-[#94a3b8] hover:bg-white/10"
              }`}
              style={{fontFamily: 'DM Sans, sans-serif'}}
            >
              Premium
            </Button>
          </div>
        </div>
      </div>

      {/* Synths Grid */}
      <div className="px-6 md:px-12 lg:px-24 pb-24">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#818cf8] mx-auto"></div>
            <p className="text-[#94a3b8] mt-4" style={{fontFamily: 'DM Sans, sans-serif'}}>Chargement des synthés...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <p className="text-[#94a3b8]" style={{fontFamily: 'DM Sans, sans-serif'}}>
                {filteredSynths.length} synthé{filteredSynths.length !== 1 ? 's' : ''} trouvé{filteredSynths.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8" data-testid="synths-grid">
              {filteredSynths.map((synth) => (
                <div
                  key={synth.id}
                  data-testid={`synth-card-${synth.id}`}
                  className="bg-[#16181d] border border-white/5 hover:border-[#818cf8]/30 transition-all duration-300 group overflow-hidden rounded-2xl relative"
                  style={{
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={synth.image_url} 
                      alt={synth.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16181d] via-transparent to-transparent opacity-60" />
                    
                    {/* Price badge */}
                    <div className="absolute top-3 right-3">
                      <Badge 
                        className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${
                          synth.type === "free" 
                            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                            : "bg-[#818cf8]/20 text-[#818cf8] border border-[#818cf8]/30"
                        }`}
                        style={{fontFamily: 'DM Sans, sans-serif'}}
                      >
                        {synth.price}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-[#818cf8]">
                        {getCategoryIcon(synth.category)}
                      </div>
                      <span className="text-xs text-[#94a3b8] uppercase tracking-wide" style={{fontFamily: 'DM Sans, sans-serif'}}>
                        {synth.category}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-semibold mb-2 text-white" style={{fontFamily: 'Manrope, sans-serif'}}>
                      {synth.name}
                    </h3>
                    
                    <p className="text-base leading-relaxed text-[#94a3b8] mb-4 line-clamp-2" style={{fontFamily: 'DM Sans, sans-serif'}}>
                      {synth.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {synth.features.slice(0, 3).map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 bg-white/5 rounded-md text-[#94a3b8]"
                          style={{fontFamily: 'DM Sans, sans-serif'}}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <a 
                      href={synth.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      data-testid={`get-it-button-${synth.id}`}
                    >
                      <Button 
                        className="w-full bg-[#818cf8] text-white hover:bg-[#818cf8]/90 shadow-lg shadow-[#818cf8]/20 rounded-full px-6 py-6 text-base font-medium transition-all duration-300 hover:scale-105 group/btn"
                        style={{fontFamily: 'DM Sans, sans-serif'}}
                      >
                        Télécharger
                        <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </a>

                    {/* Compatibility */}
                    <div className="mt-3 text-xs text-[#94a3b8] text-center" style={{fontFamily: 'DM Sans, sans-serif'}}>
                      Compatible: {synth.compatibility.slice(0, 2).join(", ")}...
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSynths.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[#94a3b8] text-lg" style={{fontFamily: 'DM Sans, sans-serif'}}>
                  Aucun synthé trouvé. Essayez une autre recherche.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-[#94a3b8] text-sm" style={{fontFamily: 'DM Sans, sans-serif'}}>
          Tous les synthétiseurs listés appartiennent à leurs créateurs respectifs.
        </p>
      </footer>
    </div>
  );
}

export default App;
