const { EmbedBuilder } = require('discord.js');

class UserInfoCommand {
    getCommandName() {
        return 'userinfo';
    }

    getCommandData() {
        return {
            name: 'userinfo',
            description: 'Displays AI-generated information about the mentioned user.',
            options: [
                {
                    name: 'user',
                    type: 6, // USER type
                    description: 'The user you want to get information about',
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

        const member = messageOrInteraction.guild.members.cache.get(user.id);
        const aiGeneratedDescription = this.generateUserDescription(user, member);

        const embed = new EmbedBuilder()
            .setTitle(`${user.username} - Discord User`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setDescription(aiGeneratedDescription)
            .addFields(
                { name: 'Username', value: user.tag, inline: true },
                { name: 'User ID', value: user.id, inline: true },
                { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Joined Server', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'N/A', inline: true }
            )
            .setColor('#3498db')
            .setTimestamp();

        if (messageOrInteraction.isCommand) {
            await messageOrInteraction.reply({ embeds: [embed] });
        } else {
            await messageOrInteraction.reply({ embeds: [embed] });
        }
    }

    generateUserDescription(user, member) {
        let description = `${user.username} is ${this.getRandomTrait()} `;
        if (member) {
            description += `and has been gracing this server with their presence since ${new Date(member.joinedTimestamp).toLocaleDateString()}.`;
        } else {
            description += `and has been navigating the vast lands of Discord since ${new Date(user.createdTimestamp).toLocaleDateString()}.`;
        }
    
        description += ` Known for ${this.getRandomQuirk()}, ${user.username} is truly a unique character in our community.`;
    
        return description;
    }
    
    getRandomTrait() {
        const traits = [
            'a master of sarcasm',
            'a walking meme generator',
            'an expert in procrastination',
            'the unofficial server therapist',
            'the life of every virtual party',
            'a coding wizard with a caffeine addiction',
            'the server’s go-to for bad puns',
            'a lover of all things chaotic',
            'a mysterious figure always lurking in the shadows',
            'a beacon of positivity (most of the time)',
            'a connoisseur of dad jokes',
            'a professional lurker with occasional bursts of wisdom',
            'the server’s resident tech support',
            'a fountain of random trivia knowledge',
            'a gaming legend in their own mind',
            'a relentless emoji spammer',
        ];
        return traits[Math.floor(Math.random() * traits.length)];
    }
    
    getRandomQuirk() {
        const quirks = [
            'their unending love for pineapple pizza',
            'an unhealthy obsession with cat memes',
            'a disturbing number of unplayed games in their Steam library',
            'a tendency to start projects and never finish them',
            'their collection of “funny” T-shirts',
            'an ability to disappear for weeks and return like nothing happened',
            'a habit of changing their username every week',
            'the fact that they still quote Vine videos in 2024',
            'their incessant need to correct everyone’s grammar',
            'an uncanny ability to derail any conversation',
            'their secret identity as a serial meme hoarder',
            'the way they always manage to turn every conversation into a debate about Star Wars',
            'their talent for sending the perfect GIF at the perfect moment',
            'their extensive and somewhat concerning knowledge of conspiracy theories',
            'their love for sending unsolicited pictures of their pets',
            'their unmatched skill in dodging responsibilities',
            'their irrational hatred of autocorrect',
            'their ability to speak fluent sarcasm',
        ];
        return quirks[Math.floor(Math.random() * quirks.length)];
    }    
}

module.exports = UserInfoCommand;
