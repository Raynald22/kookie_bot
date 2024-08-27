const PingCommand = require('./commands/ping');
const BeepCommand = require('./commands/beep');
const MemberCountCommand = require('./commands/membercount');

class CommandHandler {
    constructor() {
        this.prefixCommands = new Map([
            ['ping', new PingCommand()],
            ['beep', new BeepCommand()],
            ['membercount', new MemberCountCommand()],
        ]);
        this.slashCommands = [
            new PingCommand(),
            new BeepCommand(),
            new MemberCountCommand(),
        ];
    }

    getSlashCommands() {
        return this.slashCommands.map(command => command.getCommandData());
    }

    async handlePrefixCommand(commandName, message, args) {
        const command = this.prefixCommands.get(commandName);
        if (command) {
            try {
                await command.execute(message, args);
            } catch (error) {
                console.error('Error executing command:', error);
                await message.reply('There was an error trying to execute that command!');
            }
        } else {
            await message.reply('Unknown command.');
        }
    }

    async handleSlashCommand(interaction) {
        const command = this.slashCommands.find(cmd => cmd.getCommandName() === interaction.commandName);
        if (command) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error('Error executing command:', error);
                await interaction.reply('There was an error trying to execute that command!');
            }
        } else {
            await interaction.reply('Unknown command.');
        }
    }
}

module.exports = CommandHandler;
