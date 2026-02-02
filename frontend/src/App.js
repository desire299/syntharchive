
import { useState } from "react";
import "./App.css";
import { Search, ExternalLink, Zap, Music, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// 👇 TA LISTE COMPLÈTE (13 Synthés)
const MES_SYNTHES = [
  // --- LES GRATUITS ---
  {
    id: "1",
    name: "Vital",
    description: "Le concurrent gratuit de Serum. Un synthé wavetable ultra visuel et puissant.",
    price: "Gratuit",
    type: "free",
    category: "wavetable",
    website_url: "https://vital.audio",
    features: ["Wavetable", "Visuel incroyable", "Modulation facile"],
    image_url: "https://vital.audio/images/media/vital_spectral_warping.png"
  },
  {
    id: "2",
    name: "Surge XT",
    description: "Un monstre open-source. Il peut faire n'importe quel son si on prend le temps.",
    price: "Gratuit",
    type: "free",
    category: "hybrid",
    website_url: "https://surge-synthesizer.github.io",
    features: ["Open Source", "MPE Support", "Effets intégrés"],
    image_url: "https://surge-synthesizer.github.io/images/surge-ui-classic.png"
  },
  {
    id: "3",
    name: "Dexed",
    description: "La réplique exacte du Yamaha DX7. Parfait pour les sons années 80.",
    price: "Gratuit",
    type: "free",
    category: "fm",
    website_url: "https://asb2m10.github.io/dexed/",
    features: ["Synthèse FM", "Compatible Sysex DX7", "Vintage"],
    image_url: "https://asb2m10.github.io/dexed/img/dexed.png"
  },
  {
    id: "4",
    name: "TAL-Noisemaker",
    description: "Le son analogique classique, simple et efficace. Des basses et des leads chauds.",
    price: "Gratuit",
    type: "free",
    category: "analog",
    website_url: "https://tal-software.com/products/tal-noisemaker",
    features: ["Analogique", "Chorus Juno", "Simple"],
    image_url: "https://tal-software.com/images/products/tal-noisemaker.png"
  },
  {
    id: "5",
    name: "Helm",
    description: "Un synthé semi-modulaire très visuel, le petit frère de Vital.",
    price: "Gratuit",
    type: "free",
    category: "subtractive",
    website_url: "https://tytel.org/helm/",
    features: ["Modulaire", "Open Source", "Léger"],
    image_url: "https://tytel.org/static/helm_front.png"
  },

  // --- LES PAYANTS (Classiques) ---
  {
    id: "6",
    name: "Serum",
    description: "Le standard de l'industrie pour l'EDM et la Bass Music. Incontournable.",
    price: "189 $",
    type: "paid",
    category: "wavetable",
    website_url: "https://xferrecords.com/products/serum",
    features: ["Wavetable", "Ultra net", "Import Audio"],
    image_url: "https://xferrecords.com/uploads/product/image/1/serum_front_1024.png"
  },
  {
    id: "7",
    name: "Omnisphere 2",
    description: "Le synthé le plus vaste du monde. Des milliers de sons cinématiques.",
    price: "499 $",
    type: "paid",
    category: "hybrid",
    website_url: "https://www.spectrasonics.net/products/omnisphere/",
    features: ["Gigantesque", "Cinématique", "Granulaire"],
    image_url: "https://www.spectrasonics.net/products/images/omnisphere/omnisphere-box-large.jpg"
  },
  {
    id: "8",
    name: "Pigments 5",
    description: "Le synthé moderne d'Arturia. Coloré, visuel et très créatif.",
    price: "199 €",
    type: "paid",
    category: "wavetable",
    website_url: "https://www.arturia.com/products/software-instruments/pigments/overview",
    features: ["Polychrome", "Séquenceur fou", "Moderne"],
    image_url: "https://assets.arturia.com/images/products/pigments-4/pigments-4-main.jpg"
  },
  {
    id: "9",
    name: "Phase Plant",
    description: "Un terrain de jeu modulaire pour les sound designers. Tout est possible.",
    price: "199 $",
    type: "paid",
    category: "modular",
    website_url: "https://kilohearts.com/products/phase_plant",
    features: ["Modulaire", "Effets Kilohearts", "Complexe"],
    image_url: "https://kilohearts.com/static/img/products/phase_plant/phase_plant_screenshot.png"
  },
  {
    id: "10",
    name: "Massive X",

value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
             </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {["all", "free", "paid"].map((filter) => (
              <Button 
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                onClick={() => {
                   // Petite astuce pour filtrer par type (free/paid) ou catégorie
                   if(filter === 'free' || filter === 'paid') {
                      const filtered = MES_SYNTHES.filter(s => s.type === filter);
                      setFilteredSynths(filtered);
                      setActiveFilter(filter);
                   } else {
                      handleFilter("all");
                   }
                }}
                className={`capitalize ${activeFilter === filter ? 'bg-purple-600' : 'border-gray-800 text-gray-400'}`}
              >
                {filter === "all" ? "Tout" : filter === "free" ? "Gratuits" : "Payants"}
              </Button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSynths.map((synth) => (
            <div key={synth.id} className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/20">
              
              <div className="aspect-video overflow-hidden bg-gray-950 relative">
                <img 
                  src={synth.image_url} 
                  alt={synth.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badge change de couleur selon le prix */}
                <Badge className={`absolute top-3 right-3 backdrop-blur-md ${synth.type === 'free' ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-purple-500/20 text-purple-300 border-purple-500/50'}`}>
                  {synth.price}
                </Badge>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {synth.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-purple-400 font-medium uppercase mt-1">
                    <Music className="w-3 h-3" />
                    {synth.category}
                  </div>
                </div>

                <p className="text-gray-400 text-sm line-clamp-2 h-10">
                  {synth.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {synth.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 border border-gray-700">
                      {f}
                    </span>
                  ))}
                </div>

                <Button 
                  className="w-full bg-white text-black hover:bg-gray-200 gap-2 font-bold"
                  onClick={() => window.open(synth.website_url, '_blank')}
                >
                  Voir le site <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredSynths.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Aucun synthé trouvé pour cette recherche.
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
