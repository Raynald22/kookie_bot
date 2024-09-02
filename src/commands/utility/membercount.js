const { EmbedBuilder } = require('discord.js');

class MemberCountCommand {
    getCommandName() {
        return 'membercount';
    }

    getCommandData() {
        return {
            name: 'membercount',
            description: 'Shows the total number of members in the server.',
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

        const memberCount = guild.memberCount;

        const embed = new EmbedBuilder()
            .setTitle('Member Count')
            .setColor('#00FF00')
            .setDescription(`**${guild.name}** has a total of **${memberCount}** members!`)
            .setThumbnail(guild.iconURL())
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }

    async handlePrefixCommand(message) {
        const guild = message.guild;
        if (!guild) {
            return await message.reply('This command can only be used in a server.');
        }

        const memberCount = guild.memberCount;

        const embed = new EmbedBuilder()
            .setTitle('Member Count')
            .setColor('#00FF00')
            .setDescription(`**${guild.name}** has a total of **${memberCount}** members!`)
            .setThumbnail(guild.iconURL())
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
}

module.exports = MemberCountCommand;
