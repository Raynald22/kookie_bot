const { EmbedBuilder } = require('discord.js');

class PingCommand {
    getCommandName() {
        return 'ping';
    }

    getCommandData() {
        return {
            name: 'ping',
            description: 'Replies with Pong! Shows bot and API latency.',
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
        const start = Date.now();
        const message = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const latency = Date.now() - start;
        const apiLatency = interaction.client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setColor('#00FF00')
            .addFields(
                { name: 'Bot Latency', value: `\`${latency}ms\``, inline: true },
                { name: 'API Latency', value: `\`${apiLatency}ms\``, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
    }

    async handlePrefixCommand(message) {
        const start = Date.now();
        const reply = await message.reply('Pinging...');
        const latency = Date.now() - start;
        const apiLatency = message.client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle('Pong!')
            .setColor('#00FF00')
            .addFields(
                { name: 'Bot Latency', value: `\`${latency}ms\``, inline: true },
                { name: 'API Latency', value: `\`${apiLatency}ms\``, inline: true }
            )
            .setTimestamp();

        await reply.edit({ content: null, embeds: [embed] });
    }
}

module.exports = PingCommand;
