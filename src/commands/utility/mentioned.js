class RoastCommand {
    getCommandName() {
        return 'roast';
    }

    getCommandData() {
        return {
            name: 'roast',
            description: 'Roasts the mentioned user with a randomly generated insult.',
            options: [
                {
                    name: 'user',
                    type: 6, // USER type
                    description: 'The user you want to roast',
                    required: true,
                },
            ],
        };
    }

    async execute(messageOrInteraction) {
        let user;
        if (messageOrInteraction.isCommand && messageOrInteraction.isChatInputCommand()) {
            user = messageOrInteraction.options.getUser('user');
        } else {
            user = messageOrInteraction.mentions.users.first();
        }

        if (!user) {
            return messageOrInteraction.reply('Please mention a valid user.');
        }

        if (user.username === 'chikiseribuan') {
            return messageOrInteraction.reply('keren');
        }

        const roastMessage = this.generateRoast(user);

        if (messageOrInteraction.isCommand) {
            await messageOrInteraction.reply(roastMessage);
        } else {
            await messageOrInteraction.reply(roastMessage);
        }
    }

    generateRoast(user) {
        const roast = `${user.username}, ${this.getRandomInsult()}`;
        return roast;
    }

    getRandomInsult() {
        const insults = [
            'kocak',
            'orang gila',
            'boren',
            '🐷',
            'bau',
        ];
        return insults[Math.floor(Math.random() * insults.length)];
    }
}

module.exports = RoastCommand;
