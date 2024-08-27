const { Client, GatewayIntentBits, Events } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config');
const CommandHandler = require('./commandHandler');

class Bot {
    constructor() {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
        });
        this.commandHandler = new CommandHandler();
        this.setupListeners();
        this.registerCommands();
    }

    setupListeners() {
        this.client.once(Events.ClientReady, () => {
            console.log(`Logged in as ${this.client.user.tag}`);
        });

        this.client.on(Events.MessageCreate, async message => {
            if (message.author.bot) return;  // Ignore bot messages
            if (message.content.startsWith(config.PREFIX)) {
                const args = message.content.slice(config.PREFIX.length).trim().split(/ +/);
                const commandName = args.shift().toLowerCase();
                await this.commandHandler.handlePrefixCommand(commandName, message, args);
            }
        });

        this.client.on(Events.InteractionCreate, async interaction => {
            if (interaction.isCommand()) {
                await this.commandHandler.handleSlashCommand(interaction);
            }
        });
    }

    async registerCommands() {
        const commands = this.commandHandler.getSlashCommands();
        const rest = new REST({ version: '10' }).setToken(config.TOKEN);

        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), { body: commands });
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }

    start() {
        this.client.login(config.TOKEN);
    }
}

module.exports = Bot;
