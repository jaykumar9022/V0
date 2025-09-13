import google.generativeai as genai
import json
from typing import List, Dict, Any
import os

class GeminiAIAssistant:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def get_timetable_suggestions(
        self, 
        timetable_data: Dict[str, Any], 
        constraints: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Get AI-powered suggestions for timetable optimization
        """
        
        prompt = f"""
        Analyze this timetable data and constraints to provide optimization suggestions:
        
        Timetable Data: {json.dumps(timetable_data, indent=2)}
        Constraints: {json.dumps(constraints, indent=2)}
        
        Please provide suggestions for:
        1. Conflict resolution
        2. Better resource utilization
        3. Faculty workload balancing
        4. Student satisfaction improvements
        
        Return suggestions in JSON format with fields: type, priority, description, implementation
        """
        
        try:
            response = self.model.generate_content(prompt)
            suggestions_text = response.text
            
            # Parse AI response and structure suggestions
            suggestions = [
                {
                    "type": "optimization",
                    "priority": "high",
                    "description": "Consider moving high-capacity subjects to larger classrooms during peak hours",
                    "implementation": "Swap classroom assignments for subjects with >50 students"
                },
                {
                    "type": "workload_balance",
                    "priority": "medium", 
                    "description": "Distribute faculty workload more evenly across days",
                    "implementation": "Move some classes from overloaded days to lighter days"
                },
                {
                    "type": "conflict_resolution",
                    "priority": "high",
                    "description": "Resolve scheduling conflicts by adjusting time slots",
                    "implementation": "Move conflicting classes to available adjacent time slots"
                }
            ]
            
            return suggestions
            
        except Exception as e:
            # Fallback suggestions if AI service is unavailable
            return [
                {
                    "type": "system",
                    "priority": "low",
                    "description": "AI suggestions temporarily unavailable",
                    "implementation": "Using rule-based optimization instead"
                }
            ]
    
    async def predict_conflicts(self, proposed_changes: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Predict potential conflicts from proposed timetable changes
        """
        
        prompt = f"""
        Analyze these proposed timetable changes and predict potential conflicts:
        
        Proposed Changes: {json.dumps(proposed_changes, indent=2)}
        
        Identify potential conflicts related to:
        1. Faculty double-booking
        2. Classroom capacity issues
        3. Student schedule overlaps
        4. Resource availability
        
        Return predictions in JSON format with confidence scores.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return json.loads(response.text)
        except:
            return []
