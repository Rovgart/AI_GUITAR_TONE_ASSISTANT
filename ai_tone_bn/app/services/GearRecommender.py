import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class NAMGearRecommender:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        
        # Model configuration parameters
        self.config = {
            "temperature": 0.4,  # Balance between creativity and consistency
            "max_tokens": 800,   # Enough for detailed gear recommendations
            "top_p": 0.9,       # Nucleus sampling for better quality
            "frequency_penalty": 0.1,  # Reduce repetition
            "presence_penalty": 0.1    # Encourage diverse recommendations
        }
        
        # System prompt to define the AI's role and expertise
        self.system_prompt = """You are a professional guitar gear expert specializing in Neural Amp Modeler (NAM) recommendations.

IMPORTANT: You must respond in exactly this format:

* [Brief description of the band's signature sound and tone characteristics in 2-3 sentences]
* {amp: [specific amplifier model recommendations], ir: [specific impulse response/cabinet recommendations]}

Example format:
* Pink Floyd is known for their warm, saturated lead tones with rich sustain and smooth distortion. David Gilmour's signature sound features creamy overdrive with excellent note clarity and singing sustain.
* {amp: Hiwatt DR103 or Marshall Plexi 1959, ir: Marshall 1960A 4x12 with Celestion G12M Greenbacks or Hiwatt 4x12 with Fane speakers}

Requirements:
- Keep description concise but specific about tonal characteristics
- Recommend 1-2 specific amp models that are NAM-compatible
- Recommend 1-2 specific IR/cabinet combinations
- Focus on gear that has good NAM captures available or would be suitable for NAM
- Be specific with model numbers and speaker types when possible"""

    def parse_response(self, response_text: str) -> dict:
        """
        Parse the structured response into components
        
        Args:
            response_text (str): Raw LLM response
            
        Returns:
            dict: Parsed response with description, amp, and ir keys
        """
        try:
            lines = response_text.strip().split('\n')
            description = ""
            gear_dict = {"amp": "", "ir": ""}
            
            for line in lines:
                line = line.strip()
                if line.startswith('* ') and not line.startswith('* {'):
                    description = line[2:]  
                elif line.startswith('* {') and line.endswith('}'):
                    gear_content = line[3:-1] 
                    
                    parts = gear_content.split(', ir: ')
                    if len(parts) == 2:
                        gear_dict["amp"] = parts[0].replace('amp: ', '')
                        gear_dict["ir"] = parts[1]
            
            return {
                "description": description,
                "amp": gear_dict["amp"],
                "ir": gear_dict["ir"]
            }
            
        except Exception as e:
            return {
                "description": "Error parsing response",
                "amp": "Could not parse amp recommendation",
                "ir": "Could not parse IR recommendation",
                "error": str(e)
            }
    def get_nam_recommendations(self, band_name: str, return_parsed: bool = True):
        try:
            messages = [
                {
                    "role": "system",
                    "content": self.system_prompt
                },
                {
                    "role": "user", 
                    "content": f"What guitar gear would you recommend for recreating {band_name}'s signature sound using Neural Amp Modeler (NAM)?"
                }
            ]
            
            response = self.client.chat.completions.create(
                messages=messages,
                model=self.model,
                temperature=self.config["temperature"],
                max_tokens=self.config["max_tokens"],
                top_p=self.config["top_p"],
                frequency_penalty=self.config["frequency_penalty"],
                presence_penalty=self.config["presence_penalty"]
            )
            
            raw_response = response.choices[0].message.content
            
            if return_parsed:
                return self.parse_response(raw_response)
            else:
                return raw_response
            
        except Exception as e:
            if return_parsed:
                return {
                    "description": "Error getting recommendations",
                    "amp": "N/A",
                    "ir": "N/A",
                    "error": str(e)
                }
            else:
                return f"Error getting recommendations: {str(e)}"

    def batch_recommendations(self, band_list: list) -> dict:
        """
        Get recommendations for multiple bands
        
        Args:
            band_list (list): List of band names
            
        Returns:
            dict: Dictionary with band names as keys and recommendations as values
        """
        recommendations = {}
        
        for band in band_list:
            print(f"Getting recommendations for {band}...")
            recommendations[band] = self.get_nam_recommendations(band)
            
        return recommendations

if __name__ == "__main__":
    nam_recommender = NAMGearRecommender()
    
    band_name = "Metallica"
    print(f"=== NAM Gear Recommendations for {band_name} ===\n")
    
    parsed_recommendations = nam_recommender.get_nam_recommendations(band_name, return_parsed=True)
    print(f"Description: {parsed_recommendations['description']}")
    print(f"Amp: {parsed_recommendations['amp']}")
    print(f"IR: {parsed_recommendations['ir']}")
    
    print("\n" + "="*60 + "\n")
    
    print("=== Raw Format ===")
    raw_response = nam_recommender.get_nam_recommendations(band_name, return_parsed=False)
    print(raw_response)
    
    print("\n" + "="*60 + "\n")
    
    bands = ["Pink Floyd", "Tool"]
    for band in bands:
        result = nam_recommender.get_nam_recommendations(band, return_parsed=True)
        print(f"=== {band} ===")
        print(f"Description: {result['description']}")
        print(f"Amp: {result['amp']}")
        print(f"IR: {result['ir']}")
        print("\n" + "-"*40 + "\n")