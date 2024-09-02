const PingCommand = require('./commands/ping');
const BeepCommand = require('./commands/beep');
const MemberCountCommand = require('./commands/utility/membercount');
const NotifyTikTokLiveCommand = require('./commands/utility/notifytiktoklive');
const HelpCommand = require('./commands/help');
const UserInfoCommand = require('./commands/info/userinfo'); // Import the userinfo command
const ChatBotCommand = require('./commands/bot/chatbot'); // Import the chatbot command
const RoastCommand = require('./commands/utility/mentioned'); // Import the roast command
const WeatherCommand = require('./commands/utility/weather');

class CommandHandler {
    constructor() {
        const allCommands = [
            new PingCommand(),
            new BeepCommand(),
            new MemberCountCommand(),
            new NotifyTikTokLiveCommand(),
            new UserInfoCommand(),
            new ChatBotCommand(),
            new RoastCommand(),
            new WeatherCommand(),
        ];

        this.helpCommand = new HelpCommand(allCommands);
        // Add the help command to the list of all commands
        allCommands.push(this.helpCommand);

        // Prefix commands map
        this.prefixCommands = new Map(allCommands.map(cmd => [cmd.getCommandName(), cmd]));

        // Slash commands array
        this.slashCommands = allCommands;
    }

    getSlashCommands() {
        return this.slashCommands.map(command => command.getCommandData());
    }

    async handlePrefixCommand(commandName, message, args) {
        const command = this.prefixCommands.get(commandName);
        if (command) {
            try {
                // Pass the message and any additional arguments to the command
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
                // Pass the interaction to the command
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
