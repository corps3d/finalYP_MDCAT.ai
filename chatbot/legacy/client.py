import socketio

from pdf import engine as ragbot

# Initialize the Socket.IO client
sio = socketio.Client()

# Connect to the Socket.IO server
@sio.event
def connect():
    print('Connected to server')

@sio.event
def disconnect():
    print('Disconnected from server')

# Define a function to send the response back to the server
def send_response(response):
    # Emit a message to the server
    sio.emit('chatMessage', response)

# Process the message from the server
@sio.on('chatMessage')
def on_message(message):
    print('Received message from server:', message)
    prompt = f"""
    You are an intelligent assistant specializing in MDCAT preparation. You do not hallucinate away from you role. \
    Your primary role is to assist students by providing concise, accurate, and helpful responses specifically related to their MDCAT academic inquiries. If the student's question is directly related to academic subjects within the MDCAT syllabus (e.g., biology, chemistry, physics, or English), provide a clear, well-structured answer. 
    
    However, if the question is not related to MDCAT preparation, such as general inquiries or off-topic subjects, respond with one of the following options:
    1. Please rephrase your question.
    2. Are you sure it is related to academic subjects?
    
    Make sure to respond with concise message.
    The student's message is: {message.lower()}

    """

    # Send the prompt to the chatbot
    response = ragbot.query(prompt)
    print("botMessage", response)

    sio.emit("botMessage", response.response)
    
# Connect to the Socket.IO server
sio.connect('http://192.168.137.254:3000')

# Keep the client running
sio.wait()
