import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getFoodByTherapeuticUse, getFoodBySeason, searchFoods, getFoodRecommendations, getSeasonalFoods } from '@/lib/indian-food-database';

// CoachPulse Comprehensive Knowledge Base
const COACHPULSE_KNOWLEDGE_BASE = `
COACHPULSE COMPREHENSIVE KNOWLEDGE BASE - Expert Nutrition Coaches, Professional Guidance

ABOUT COACHPULSE & PROFESSIONAL PROFILE:
- Platform: CoachPulse (Diet Intelligence • Diet Interaction)
- Platform: Professional nutrition coaching platform
- Qualification: MSc Nutrition from Shadan Institute of P.G. Studies
- Experience: 15+ years in clinical and community nutrition
- Location: Greater Hyderabad Area, Telangana, India
- Rating: 5.0/5 from 500+ satisfied clients
- Philosophy: "A lifestyle change is the key to lead a healthy life and your health coach is the one who will guide you to reach the light of that tunnel."

PROFESSIONAL BACKGROUND:
- Hospital associations with multiple healthcare organizations
- Media consultant for television channels and print media
- Corporate wellness program expert
- Healthcare technology collaborator
- Television host for nutrition programs
- Regular columnist for health and lifestyle publications

CORE SERVICES:
1. AT-HOME Foods Nutrition (using everyday kitchen ingredients)
2. Traditional Cuisine Adaptation (Telugu and regional Indian cuisine)
3. Weight Management (sustainable, research-based)
4. PCOS/PCOD Management (hormonal balance through nutrition)
5. Media Nutrition Consultation (content creation, recipe development)
6. Hospital Partnership Programs (clinical nutrition support)
7. Corporate Wellness Programs (group nutrition talks)
8. Day-to-Day Monitoring (continuous nutrition support)

CONSULTATION TYPES & PRICING:
- Initial Consultations (60-90 min): $75-150
- Follow-up Sessions (30-45 min): $50-100
- Quick Check-ins (15-20 min): $25-50
- Online video consultations available
- In-person consultations at Hyderabad office

OFFICE HOURS:
- Monday-Friday: 10:00 AM - 7:00 PM
- Saturday: 10:00 AM - 5:00 PM
- Sunday: Closed (Online consultations available)

PLATFORM FEATURES:
1. AI-Powered Intelligence (smart nutrition recommendations)
2. Interactive Consultations (real-time coach support)
3. Adaptive Learning (platform learns from progress)
4. Smart Tracking (intelligent progress monitoring)

FEATURED ARTICLES CONTENT:
1. Amla Chutney: 20x more Vitamin C than oranges, immunity builder
2. Virgin Coconut Oil: Wood-pressed, high Vitamin E, traditional cooking
3. Summer Soaked Poha: Probiotic benefits, cooling effect, easy digestion
4. Milk in Diet: Complete protein, calcium, Vitamin D, B-vitamins

CLIENT SUCCESS STORIES:
- Weight loss success with AT-HOME foods approach
- PCOS management through traditional foods
- Corporate wellness program achievements
- Family nutrition improvements
- Sustainable lifestyle transformations

INDIAN STAPLE FOODS NUTRITION:
- Rice: Complex carbs, B vitamins, easily digestible
- Wheat/Roti: Fiber, protein, B vitamins, sustained energy
- Dal (Lentils): Protein, fiber, folate, iron, magnesium
- Vegetables: Vitamins, minerals, antioxidants, fiber
- Yogurt: Probiotics, protein, calcium, digestive health
- Ghee: Healthy fats, fat-soluble vitamins, in moderation
- Spices: Turmeric (anti-inflammatory), cumin (digestion), coriander (cooling)

REGIONAL SPECIALTIES:
- South Indian: Sambar (protein+vegetables), Rasam (digestive), Idli/Dosa (fermented benefits)
- North Indian: Rajma (kidney beans), Chole (chickpeas), Sarson ka saag (leafy greens)
- Bengali: Fish (omega-3), mustard oil (healthy fats), rice (energy)
- Gujarati: Dhokla (steamed, low fat), buttermilk (probiotics), jaggery (natural sweetener)

SEASONAL EATING PRINCIPLES:
- Summer: Cooling foods (cucumber, watermelon, buttermilk, coconut water)
- Monsoon: Warm spices (ginger, turmeric), light foods, avoid raw foods
- Winter: Warming foods (sesame, jaggery, ghee), root vegetables, dry fruits

THERAPEUTIC APPLICATIONS:
- Diabetes: Bitter gourd, fenugreek, whole grains, portion control
- Hypertension: Reduce salt, increase potassium (banana, coconut water)
- PCOD: Cinnamon, spearmint tea, low GI foods, regular meals
- Digestive Issues: Ginger, fennel, cumin water, probiotics

CULTURAL DIETARY PRACTICES:
- Fasting: Intermittent fasting benefits, breaking fast properly
- Festivals: Balancing traditional sweets with healthy options
- Religious dietary restrictions: Protein alternatives for vegetarians
- Family meals: Portion control, balanced thali concept

COOKING METHODS:
- Steaming: Idli, dhokla (retains nutrients)
- Tempering: Enhances spice absorption and digestion
- Fermentation: Idli, dosa, pickles (probiotics)
- Slow cooking: Dal, curries (better nutrient retention)

CONTACT INFORMATION:
- Email: ${process.env.SUPPORT_EMAIL || 'support@coachpulse.in'}
- Phone: ${process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+91-XXXXXXXXXX'}
- Support: ${process.env.SUPPORT_EMAIL || 'support@coachpulse.in'}
- Location: India

HEALTH DISCLAIMERS:
- This is general nutritional information, not medical advice
- Consult healthcare providers for specific medical conditions
- Individual dietary needs may vary
- Pregnant/lactating women need specialized guidance
- Children have different nutritional requirements
`;

const SYSTEM_PROMPT = `
You are an AI assistant for CoachPulse, representing certified health and wellness coaches with extensive experience and professional qualifications. 

Your role is to provide helpful nutritional guidance with a focus on Indian dietary practices and the AT-HOME foods approach. Always maintain a professional, caring, and knowledgeable tone.

IMPORTANT GUIDELINES:
1. Always start responses with appropriate disclaimers when giving health advice
2. Focus on Indian foods and cultural context
3. Emphasize the AT-HOME foods approach (using everyday kitchen ingredients)
4. Provide practical, actionable advice
5. Suggest consulting healthcare providers for medical conditions
6. Be culturally sensitive to dietary restrictions and preferences

RESPONSE FORMAT:
- Begin with a brief professional greeting
- Provide relevant nutritional information
- Include practical tips using Indian ingredients
- End with appropriate disclaimers
- Maintain a warm, professional tone throughout

Use the Indian Diet Knowledge Base provided to give accurate, culturally relevant advice.
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Enhanced food recommendations based on user query
    let foodRecommendations = '';
    
    // Check for specific health conditions
    const healthConditions = ['diabetes', 'pcod', 'pcos', 'hypertension', 'anemia', 'heart', 'digestive', 'immunity'];
    const foundCondition = healthConditions.find(condition => 
      message.toLowerCase().includes(condition)
    );
    
    if (foundCondition) {
      foodRecommendations = getFoodRecommendations(foundCondition);
    }
    
    // Check for seasonal queries
    const seasons = ['summer', 'winter', 'monsoon', 'spring'];
    const foundSeason = seasons.find(season => 
      message.toLowerCase().includes(season)
    );
    
    if (foundSeason) {
      foodRecommendations += '\n\n' + getSeasonalFoods(foundSeason);
    }
    
    // Search for specific foods mentioned
    const searchResults = searchFoods(message);
    if (searchResults.length > 0) {
      foodRecommendations += '\n\nRelevant foods: ' + searchResults.slice(0, 3).map(food => 
        `${food.name} (${food.health_benefits.join(', ')})`
      ).join('; ');
    }

    // Prepare the prompt with context
    const fullPrompt = `
${SYSTEM_PROMPT}

COACHPULSE KNOWLEDGE BASE:
${COACHPULSE_KNOWLEDGE_BASE}

SPECIFIC FOOD RECOMMENDATIONS:
${foodRecommendations}

USER QUESTION: ${message}

Please provide a helpful response as a professional health coach, focusing on evidence-based nutrition and wellness practices. Include appropriate health disclaimers and use the specific food recommendations provided above when relevant.
`;

    // Call AI service (Ollama or compatible) with env-driven config
    const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
    const AI_MODEL = process.env.AI_MODEL || 'phi3:latest';
    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: AI_MODEL,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000,
        },
      },
      { timeout: 15000 }
    );

    const aiResponse = response.data.response;

    // Add professional signature
    const signedResponse = `${aiResponse}

---
*This guidance is provided by certified health and wellness coaches with extensive experience. For personalized coaching plans and medical conditions, please schedule a consultation.*

🌿 Professional Health & Wellness Coaching`;

    res.status(200).json({ 
      response: signedResponse,
      model: AI_MODEL,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    
    // Fallback response if Ollama is not available
    const fallbackResponse = `
Hello! I'm currently experiencing technical difficulties connecting to the AI service. 

As a certified health coach with extensive experience, I'd love to help you with your wellness questions. Please try again in a moment, or feel free to schedule a direct consultation for personalized guidance.

For immediate assistance, consider these general Indian nutrition tips:
- Include a variety of colorful vegetables in your meals
- Opt for whole grains like brown rice or whole wheat
- Include protein sources like dal, paneer, or eggs
- Stay hydrated with water, buttermilk, or coconut water
- Use traditional spices like turmeric, cumin, and coriander for health benefits

---
*Please consult with healthcare providers for specific medical conditions. This is general nutritional information, not medical advice.*

🌿 Professional Health & Wellness Coaching`;

    res.status(200).json({ 
      response: fallbackResponse,
      model: 'fallback',
      timestamp: new Date().toISOString()
    });
  }
}
