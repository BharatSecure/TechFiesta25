from langchain.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnableLambda
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from typing import List, Dict
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmergencyHelplineBot:
    def __init__(self):
        
        # Initialize chat history and model
        self.chat_history: List = []
        try:
            self.model = ChatGoogleGenerativeAI(model='gemini-1.5-pro', api_key='AIzaSyDv7RThoILjeXAryluncDRZ1QeFxAixR7Q')
        except Exception as e:
            logger.error(f"Failed to initialize model: {str(e)}")
            raise

        # Initialize base system prompt
        self.system_prompt = """
        You are an emergency helpline operator. Your role is to:
        1. Quickly assess the emergency situation
        2. Gather critical information systematically
        3. Remain calm and professional
        4. Ask one question at a time
        5. Keep responses brief and focused
        """

    def create_initial_prompt(self) -> ChatPromptTemplate:
        """Creates the initial conversation prompt"""
        return ChatPromptTemplate([
            ('system', self.system_prompt),
            ('human', 'Please help me')
        ])

    def get_location_prompt(self, user_input: str) -> ChatPromptTemplate:
        """Creates a prompt to get the user's location"""
        return ChatPromptTemplate([
            ("system", "Extract or request the location information from the user. If location is not provided, ask for it specifically."),
            ("human", user_input)
        ])

    def get_emergency_type_prompt(self, user_input: str) -> ChatPromptTemplate:
        """Creates a prompt to determine the type of emergency"""
        return ChatPromptTemplate([
            ("system", "Determine the type of emergency from the user's input. If not clear, ask specifically about the nature of the emergency."),
            ("human", user_input)
        ])
    
    def more_information(self, user_input: str) -> ChatPromptTemplate:
        '''Creates a prompt template to gather more information regarding the situation'''
        return ChatPromptTemplate([
            ('system', "Analyze the user's situation based on their initial input and generate tailored follow-up questions to gather more specific and relevant details. Consider factors such as the nature of the situation (e.g., medical emergency, safety threat, or logistical issue), urgency, and emotional state. Ensure the questions are clear, concise, and empathetic, focusing on gathering actionable information while maintaining a supportive tone. Prioritize obtaining critical details such as location, people involved, immediate risks, and any specific assistance required"),
            ('human', user_input)
        ])
    
    def process_response(self, prompt_template: ChatPromptTemplate) -> str:
        """Process the prompt and get response from the model"""
        try:
            chain = prompt_template | self.model | StrOutputParser()
            response = chain.invoke({})
            
            # Add to chat history
            self.chat_history.append(AIMessage(content=response))
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing response: {str(e)}")
            return "I apologize, but I'm having trouble processing your request. Please try again or call emergency services directly if this is an urgent situation."

    def update_chat_history(self, message: str, is_human: bool = True) -> None:
        """Update chat history with new messages"""
        message_type = HumanMessage if is_human else AIMessage
        self.chat_history.append(message_type(content=message))

    async def handle_conversation(self, user_input: str) -> Dict:
        """Handle the conversation flow"""
        try:
            # Update chat history with user input
            self.update_chat_history(user_input)
            
            # Determine which prompt to use based on conversation state
            if not self.chat_history:
                prompt = self.create_initial_prompt()
            elif len(self.chat_history) == 1:
                prompt = self.get_emergency_type_prompt(user_input)
            elif len(self.chat_history) == 2:
                prompt = self.get_location_prompt(user_input)
            else:
                prompt = self.more_information(user_input)
            
            # Get response
            response = self.process_response(prompt)
            
            return {
                'response': response,
                'chat_history': self.chat_history
            }
            
        except Exception as e:
            logger.error(f"Error in conversation handling: {str(e)}")
            return {
                'response': "I'm experiencing technical difficulties. If this is an emergency, please call emergency services directly.",
                'chat_history': self.chat_history
            }

# Example usage
if __name__ == "__main__":
    bot = EmergencyHelplineBot()
    
    # Simulate a conversation
    async def run_conversation():
        responses = await bot.handle_conversation("Please help me")
        print("Bot:", responses['response'])
        
        responses = await bot.handle_conversation("I've fallen and can't get up")
        print("Bot:", responses['response'])
        
        responses = await bot.handle_conversation("I'm at 123 Main Street")
        print("Bot:", responses['response'])

        responses = await bot.handle_conversation("I'm stuck here in the tub")
        print("Bot:", responses['response'])
        
        responses = await bot.handle_conversation("I'm at 123 Main Street")
        print("Bot:", responses['response'])

        responses = await bot.handle_conversation("I'm at 123 Main Street")
        print("Bot:", responses['response'])

    import asyncio
    asyncio.run(run_conversation())