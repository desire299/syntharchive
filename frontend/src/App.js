import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
import { Search, Filter, ExternalLink, Zap, Music, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

  synths_data = [
        # FREE SYNTHS
        {
            "name": "Vital",
            "description": "Puissant synthétiseur wavetable moderne avec une interface intuitive et des oscillateurs spectral.",
            "price": "Gratuit",
            "type": "free",
            "category": "wavetable",
            "website_url": "https://vital.audio",
            "features": ["Wavetable spectral", "Modulation avancée", "Effets intégrés", "Interface moderne"],
            "image_url": "https://images.unsplash.com/photo-1634286050107-567499885ff9?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        },
        {
            "name": "Surge XT",
            "description": "Synthétiseur hybride open-source avec 3 oscillateurs et modulation flexible.",
            "price": "Gratuit",
            "type": "free",
            "category": "hybrid",
            "website_url": "https://surge-synthesizer.github.io",
            "features": ["Hybrid synthesis", "8 types d'oscillateurs", "Effets studio", "Open source"],
            "image_url": "https://images.unsplash.com/photo-1761503588211-1ba834b55b48?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        },
        {
            "name": "Dexed",
            "description": "Émulation précise du légendaire Yamaha DX7, parfait pour les sons FM classiques.",
            "price": "Gratuit",
            "type": "free",
            "category": "fm",
            "website_url": "https://asb2m10.github.io/dexed",
            "features": ["Synthèse FM", "Compatible DX7", "32 algorithmes", "Banques de presets"],
            "image_url": "https://images.unsplash.com/photo-1758179762756-7ad05acc2e33?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        },
        {
            "name": "TAL-NoiseMaker",
            "description": "Synthétiseur virtuel analogique avec filtres auto-oscillants et effets vintage.",
            "price": "Gratuit",
            "type": "free",
            "category": "analog",
            "website_url": "https://tal-software.com/products/tal-noisemaker",
            "features": ["VA synthesis", "3 oscillateurs", "Juno chorus", "Filtres vintage"],
            "image_url": "https://images.unsplash.com/photo-1760411070288-e0d211aa6c2c?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        },
        {
            "name": "Helm",
            "description": "Synthétiseur polyphonique open-source avec modulation complexe et effets intégrés.",
            "price": "Gratuit",
            "type": "free",
            "category": "subtractive",
            "website_url": "https://tytel.org/helm",
            "features": ["32 voix polyphoniques", "Drag & drop modulation", "Open source", "Multi-plateforme"],
            "image_url": "https://images.unsplash.com/photo-1634286051376-940ff8525141?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        },
        
        # PAID SYNTHS
        {
            "name": "Serum",
            "description": "Le standard de l'industrie pour la synthèse wavetable avec visualisation en temps réel.",
            "price": "$189",
            "type": "paid",
            "category": "wavetable",
            "website_url": "https://xferrecords.com/products/serum",
            "features": ["Wavetable avancé", "Visualisation temps réel", "Import audio", "Ultra clean"],
            "image_url": "https://images.unsplash.com/photo-1765448999810-528c435f2ed6?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        },
        {
            "name": "Massive X",
            "description": "Nouvelle génération du légendaire Massive par Native Instruments.",
            "price": "$149",
            "type": "paid",
            "category": "wavetable",
            "website_url": "https://www.native-instruments.com/en/products/komplete/synths/massive-x",
            "features": ["170+ wavetables", "Routage modulaire", "Performer mode", "Effets pro"],
            "image_url": "https://images.unsplash.com/photo-1741746239350-9021ddfa3d59?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        },
        {
            "name": "Omnisphere 2",
            "description": "Synthétiseur flagship de Spectrasonics avec une librairie sonore massive.",
            "price": "$499",
            "type": "paid",
            "category": "hybrid",
            "website_url": "https://www.spectrasonics.net/products/omnisphere",
            "features": ["14,000+ sons", "Hardware integration", "Granular synthesis", "Orb controller"],
            "image_url": "https://images.unsplash.com/photo-1708395259847-59e3bc3a8cf9?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        },
        {
            "name": "Pigments",
            "description": "Synthétiseur wavetable/VA d'Arturia avec moteur de synthèse hybride innovant.",
            "price": "$199",
            "type": "paid",
            "category": "wavetable",
            "website_url": "https://www.arturia.com/products/software-instruments/pigments",
            "features": ["Dual engines", "Wavetable + VA + Sample", "Séquenceurs multiples", "Effets studio"],
            "image_url": "https://images.unsplash.com/photo-1758179761295-e2366ee41eee?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        },
        {
            "name": "Phase Plant",
            "description": "Synthétiseur modulaire semi-modulaire de Kilohearts avec routage infini.",
            "price": "$179",
            "type": "paid",
            "category": "modular",
            "website_url": "https://kilohearts.com/products/phase_plant",
            "features": ["Modulaire", "Snap Heap intégré", "Routage flexible", "Sound design avancé"],
            "image_url": "https://images.unsplash.com/photo-1708395260005-857cbefd05a4?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        },
        {
            "name": "Sylenth1",
            "description": "Synthétiseur VA classique connu pour ses sons chauds et sa faible CPU.",
            "price": "$139",
            "type": "paid",
            "category": "analog",
            "website_url": "https://www.lennardigital.com/sylenth1",
            "features": ["4 oscillateurs unison", "Filtres analogiques", "Low CPU", "Sons classiques"],
            "image_url": "https://images.unsplash.com/photo-1766182065635-75b013345dc3?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        },
        {
            "name": "Avenger",
            "description": "Powerhouse de Vengeance Sound avec 8 oscillateurs et modulation avancée.",
            "price": "$227",
            "type": "paid",
            "category": "hybrid",
            "website_url": "https://www.vengeance-sound.com/avenger",
            "features": ["8 oscillateurs", "Multi-engine", "Arpeggiator avancé", "Drummaps"],
            "image_url": "https://images.unsplash.com/photo-1769755031384-e8d5f1c2ea18?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        },
        {
            "name": "Analog Lab",
            "description": "Collection de presets des synthés vintage légendaires d'Arturia.",
            "price": "$99",
            "type": "paid",
            "category": "analog",
            "website_url": "https://www.arturia.com/products/software-instruments/analoglab",
            "features": ["6500+ presets", "17 synthés classiques", "Browser intuitif", "Performances live"],
            "image_url": "https://images.unsplash.com/photo-1573871518064-2b8ce743ceed?w=800",
            "compatibility": ["FL Studio", "Ableton", "Logic Pro", "Cubase", "Reaper"]
        }
    ]


function App() {
  const [synths, setSynths] = useState([]);
  const [filteredSynths, setFilteredSynths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");


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
