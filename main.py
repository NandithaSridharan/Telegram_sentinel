from telethon import TelegramClient, events
from config.credentials import API_ID, API_HASH
from config.settings import SUSPICIOUS_KEYWORDS, LOG_FILE, CHAT_ID
import datetime
from utils.data_processing import analyze_sentiment

# Initialize the Telegram Client
client = TelegramClient('sentinel', API_ID, API_HASH)

# Send alert function using Telethon
async def send_alert(message_text):
    # Send a message to the specified chat ID
    await client.send_message(CHAT_ID, f"Suspicious message detected: {message_text}")

# Function to monitor a channel
async def monitor_channel(channel_username):
    print(f"Monitoring {channel_username} for suspicious activity...")
    async for message in client.iter_messages(channel_username):
        sentiment_score = analyze_sentiment(message.text) if message.text else 0
        if message.text:  # Only process messages with text
            print(f"Message from {message.sender_id}: {message.text}")  # Debugging
            if any(keyword in message.text.lower() for keyword in SUSPICIOUS_KEYWORDS) or sentiment_score < -0.5:
                await log_suspicious_message(message)
        else:
            print(f"Message from {message.sender_id} is not a text message.")

# Function to log suspicious messages
async def log_suspicious_message(message):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {message.sender_id}: {message.text}\n"
    with open(LOG_FILE, 'a') as f:
        f.write(log_entry)
    print(f"Logged suspicious message: {message.text}")
    await send_alert(message.text)  # Send alert after logging the suspicious message

# Main function to run the bot
async def main():
    await monitor_channel('@dealspoint')  # Replace with an actual Telegram channel username

with client:
    client.loop.run_until_complete(main())
