from fastapi import FastAPI, APIRouter, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Synth(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: str  # "Free", "$149", etc.
    type: str  # "free" or "paid"
    category: str  # "wavetable", "fm", "analog", "sampler", etc.
    website_url: str
    features: List[str]
    image_url: str
    compatibility: List[str]  # ["FL Studio", "Ableton", "Logic", etc.]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SynthCreate(BaseModel):
    name: str
    description: str
    price: str
    type: str
    category: str
    website_url: str
    features: List[str]
    image_url: str
    compatibility: List[str]


# Routes
@api_router.get("/")
async def root():
    return {"message": "Synth Directory API"}

@api_router.get("/synths", response_model=List[Synth])
async def get_synths(
    type: Optional[str] = Query(None, description="Filter by type: free or paid"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by name or description")
):
    query = {}
    
    if type:
        query["type"] = type.lower()
    
    if category:
        query["category"] = category.lower()
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    synths = await db.synths.find(query, {"_id": 0}).to_list(1000)
    
    for synth in synths:
        if isinstance(synth.get('timestamp'), str):
            synth['timestamp'] = datetime.fromisoformat(synth['timestamp'])
    
    return synths

@api_router.post("/synths", response_model=Synth)
async def create_synth(input: SynthCreate):
    synth_dict = input.model_dump()
    synth_obj = Synth(**synth_dict)
    
    doc = synth_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.synths.insert_one(doc)
    return synth_obj

@api_router.post("/synths/seed")
async def seed_synths():
    """Seed the database with initial synth data"""
    
    # Check if already seeded
    count = await db.synths.count_documents({})
    if count > 0:
        return {"message": "Database already seeded", "count": count}
    
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
    
    for synth_data in synths_data:
        synth_obj = Synth(**synth_data)
        doc = synth_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.synths.insert_one(doc)
    
    return {"message": "Database seeded successfully", "count": len(synths_data)}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
