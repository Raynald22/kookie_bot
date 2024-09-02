const { EmbedBuilder } = require('discord.js');

class NotifyTikTokLiveCommand {
    getCommandName() {
        return 'notifytiktoklive';
    }

    getCommandData() {
        return {
            name: 'notifytiktoklive',
            description: 'Notifies when a member is live on TikTok.',
        };
    }

    async execute(messageOrInteraction) {
        if (messageOrInteraction.isCommand) {
            // Handle slash command
            await this.handleSlashCommand(messageOrInteraction);
        } else {
            // Handle prefix command
            await this.handlePrefixCommand(messageOrInteraction);
        }
    }

    async handleSlashCommand(interaction) {
        const guild = interaction.guild;
        if (!guild) {
            return await interaction.reply('This command can only be used in a server.');
        }

        const isLive = await this.checkIfUserIsLiveOnTikTok('username'); // Implement this function

        const embed = new EmbedBuilder()
            .setTitle('TikTok Live Notification')
            .setColor(isLive ? '#FF0000' : '#00FF00')
            .setDescription(isLive ? '**User is now live on TikTok!**' : 'User is not currently live.')
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }

    async handlePrefixCommand(message) {
        const guild = message.guild;
        if (!guild) {
            return await message.reply('This command can only be used in a server.');
        }

        const isLive = await this.checkIfUserIsLiveOnTikTok('username'); // Implement this function

        const embed = new EmbedBuilder()
            .setTitle('TikTok Live Notification')
            .setColor(isLive ? '#FF0000' : '#00FF00')
            .setDescription(isLive ? '**User is now live on TikTok!**' : 'User is not currently live.')
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }

    async checkIfUserIsLiveOnTikTok(username) {
        // Implement the logic to check if the user is live on TikTok
        // This is just a placeholder return value for now
        return Math.random() > 0.5; // Simulate a 50% chance of being live
    }
}

module.exports = NotifyTikTokLiveCommand;
