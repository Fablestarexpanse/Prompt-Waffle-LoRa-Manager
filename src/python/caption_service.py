"""
JoyCaption Service - Simplified version for LoRA Caption Editor
Communicates via JSON over stdin/stdout
"""
import sys
import json
from PIL import Image
from transformers import AutoProcessor, AutoModelForCausalLM
import torch

class CaptionService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.processor = None
        self._send_message({"type": "status", "message": f"Using device: {self.device}"})
        
    def load_model(self):
        """Load the caption model"""
        try:
            self._send_message({"type": "status", "message": "Loading model..."})
            # Using a simpler model for demonstration - can be replaced with JoyCaption
            model_name = "Salesforce/blip-image-captioning-base"
            self.processor = AutoProcessor.from_pretrained(model_name)
            self.model = AutoModelForCausalLM.from_pretrained(model_name).to(self.device)
            self._send_message({"type": "ready", "message": "Model loaded successfully"})
        except Exception as e:
            self._send_message({"type": "error", "message": f"Failed to load model: {str(e)}"})
            
    def generate_caption(self, image_path):
        """Generate caption for a single image"""
        try:
            image = Image.open(image_path).convert('RGB')
            inputs = self.processor(image, return_tensors="pt").to(self.device)
            
            with torch.no_grad():
                outputs = self.model.generate(**inputs, max_length=50)
            
            caption = self.processor.decode(outputs[0], skip_special_tokens=True)
            return {"success": True, "caption": caption}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _send_message(self, message):
        """Send JSON message to stdout"""
        print(json.dumps(message), flush=True)
    
    def run(self):
        """Main service loop"""
        self.load_model()
        
        for line in sys.stdin:
            try:
                request = json.loads(line.strip())
                command = request.get("command")
                
                if command == "caption":
                    image_path = request.get("image_path")
                    result = self.generate_caption(image_path)
                    self._send_message({
                        "type": "result",
                        "image_path": image_path,
                        **result
                    })
                elif command == "ping":
                    self._send_message({"type": "pong"})
                elif command == "exit":
                    break
                    
            except Exception as e:
                self._send_message({
                    "type": "error",
                    "message": f"Request error: {str(e)}"
                })

if __name__ == "__main__":
    service = CaptionService()
    service.run()
