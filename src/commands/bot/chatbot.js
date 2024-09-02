const { HfInference } = require('@huggingface/inference');

class ChatBotCommand {
    constructor() {
        // Initialize Hugging Face Inference with your API key
        this.hf = new HfInference('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'); // Optional: Use a free tier API key or leave it empty to run locally
    }

    getCommandName() {
        return 'chatbot';
    }

    getCommandData() {
        return {
            name: 'chatbot',
            description: 'Chat with the bot and get responses based on what you type.',
            options: [
                {
                    name: 'message',
                    type: 3, // STRING type
                    description: 'The message you want to send to the chatbot',
                    required: true,
                },
            ],
        };
    }

    async execute(messageOrInteraction) {
        let userMessage;
        if (messageOrInteraction.isCommand && messageOrInteraction.isChatInputCommand()) {
            userMessage = messageOrInteraction.options.getString('message');
        } else {
            userMessage = messageOrInteraction.content;
        }

        const response = await this.getChatbotResponse(userMessage);

        if (messageOrInteraction.isCommand) {
            await messageOrInteraction.reply(response);
        } else {
            await messageOrInteraction.reply(response);
        }
    }

    async getChatbotResponse(message) {
        try {
            const response = await this.hf.textGeneration({
                model: 'EleutherAI/gpt-neo-2.7B', // Using GPT-Neo 2.7B model
                inputs: message,
                parameters: {
                    max_new_tokens: 150,
                    temperature: 0.7, // Adjust temperature to reduce repetition
                    top_p: 0.9 // Use nucleus sampling to prevent repetitive output
                },
            });

            let reply = response.generated_text.trim();
            reply = this.removeRepetitions(reply); // Remove or reduce repeated phrases
            reply = reply.replace(/^\?\?chatbot\s*/i, ''); // Remove any bot name prefix
            return `${reply}`;
        } catch (error) {
            console.error('Error generating chatbot response:', error);
            return 'Oops, something went wrong! Could you try that again in a bit?';
        }
    }

    // Helper function to remove repeated phrases
    removeRepetitions(text) {
        const sentences = text.split('. ');
        const uniqueSentences = [];

        sentences.forEach(sentence => {
            if (!uniqueSentences.includes(sentence)) {
                uniqueSentences.push(sentence);
            }
        });

        return uniqueSentences.join('. ');
    }
}

module.exports = ChatBotCommand;
