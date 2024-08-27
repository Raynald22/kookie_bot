class BeepCommand {
    getCommandName() {
        return 'beep';
    }

    getCommandData() {
        return {
            name: 'beep',
            description: 'Replies with Boop!',
        };
    }

    async execute(messageOrInteraction, args) {
        if (messageOrInteraction.isCommand) {
            // Handle slash command
            await messageOrInteraction.reply('Boop!');
        } else {
            // Handle prefix command
            await messageOrInteraction.reply('Boop!');
        }
    }
}

module.exports = BeepCommand;
