const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

class HelpCommand {
    constructor(commands) {
        this.commands = commands;
        this.itemsPerPage = 5; // Number of commands per page
    }

    getCommandName() {
        return 'help';
    }

    getCommandData() {
        return {
            name: 'help',
            description: 'Provides information about available commands.',
        };
    }

    async execute(messageOrInteraction) {
        if (messageOrInteraction.isCommand && messageOrInteraction.isChatInputCommand()) {
            await this.handleSlashCommand(messageOrInteraction);
        } else {
            await this.handlePrefixCommand(messageOrInteraction);
        }
    }

    async handleSlashCommand(interaction) {
        await this.paginate(interaction, 0);
    }

    async handlePrefixCommand(message) {
        await this.paginate(message, 0);
    }

    async paginate(messageOrInteraction, pageIndex) {
        const totalPages = Math.ceil(this.commands.length / this.itemsPerPage);
        const start = pageIndex * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const paginatedCommands = this.commands.slice(start, end);

        const embed = new EmbedBuilder()
            .setTitle(`📜 Help - Commands List (Page ${pageIndex + 1} of ${totalPages})`)
            .setColor('#3498db')
            .setDescription(
                paginatedCommands.map(cmd => `**/${cmd.getCommandName()}** - ${cmd.getCommandData().description}`).join('\n')
            )
            .setTimestamp();

        const buttons = this.createPaginationButtons(pageIndex, totalPages);

        if (messageOrInteraction.isCommand) {
            await messageOrInteraction.reply({ embeds: [embed], components: [buttons] });
        } else {
            const sentMessage = await messageOrInteraction.reply({ embeds: [embed], components: [buttons] });
            this.createCollector(sentMessage, messageOrInteraction, pageIndex);
        }
    }

    createPaginationButtons(pageIndex, totalPages) {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('first')
                .setLabel('First')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(pageIndex === 0),
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(pageIndex === 0),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(pageIndex === totalPages - 1),
            new ButtonBuilder()
                .setCustomId('last')
                .setLabel('Last')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(pageIndex === totalPages - 1)
        );
    }

    createCollector(sentMessage, messageOrInteraction, pageIndex) {
        const collector = sentMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000, // Collector will run for 60 seconds
        });

        collector.on('collect', async i => {
            if (i.user.id !== messageOrInteraction.user.id) {
                return i.reply({ content: "You can't use these buttons.", ephemeral: true });
            }

            if (i.customId === 'first') pageIndex = 0;
            else if (i.customId === 'previous') pageIndex -= 1;
            else if (i.customId === 'next') pageIndex += 1;
            else if (i.customId === 'last') pageIndex = Math.ceil(this.commands.length / this.itemsPerPage) - 1;

            await i.update({ embeds: [this.createHelpEmbed(pageIndex)], components: [this.createPaginationButtons(pageIndex, Math.ceil(this.commands.length / this.itemsPerPage))] });
        });

        collector.on('end', () => {
            sentMessage.edit({ components: [] });
        });
    }

    createHelpEmbed(pageIndex) {
        const totalPages = Math.ceil(this.commands.length / this.itemsPerPage);
        const start = pageIndex * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const paginatedCommands = this.commands.slice(start, end);

        return new EmbedBuilder()
            .setTitle(`📜 Help - Commands List (Page ${pageIndex + 1} of ${totalPages})`)
            .setColor('#3498db')
            .setDescription(
                paginatedCommands.map(cmd => `**/${cmd.getCommandName()}** - ${cmd.getCommandData().description}`).join('\n')
            )
            .setTimestamp();
    }
}

module.exports = HelpCommand;
