const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const config = require('../../config');  // Adjust the path to your config file

class WeatherCommand {
    constructor() {
        this.apiKey = config.WEATHER_API_KEY;  // Load API key from config.js
    }

    getCommandName() {
        return 'weather';
    }

    getCommandData() {
        return {
            name: 'weather',
            description: 'Displays the current weather in a city in Indonesia.',
            options: [
                {
                    name: 'city',
                    type: 3, // STRING type
                    description: 'The city in Indonesia you want the weather for',
                    required: true,
                },
            ],
        };
    }

    async execute(messageOrInteraction) {
        let city;
        if (messageOrInteraction.isCommand && messageOrInteraction.isChatInputCommand()) {
            city = messageOrInteraction.options.getString('city');
        } else {
            const args = messageOrInteraction.content.split(' ').slice(1);
            city = args.join(' ');
        }

        if (!city) {
            return messageOrInteraction.reply('Please specify a city in Indonesia.');
        }

        try {
            const weatherData = await this.fetchWeather(city);
            const weatherEmbed = this.createWeatherEmbed(weatherData);

            if (messageOrInteraction.isCommand) {
                await messageOrInteraction.reply({ embeds: [weatherEmbed] });
            } else {
                await messageOrInteraction.reply({ embeds: [weatherEmbed] });
            }
        } catch (error) {
            console.error(error);
            await messageOrInteraction.reply('Sorry, I couldn’t fetch the weather data. Please ensure the city name is correct.');
        }
    }

    async fetchWeather(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},ID&units=metric&appid=${this.apiKey}`;
        const response = await axios.get(url);
        return response.data;
    }

    createWeatherEmbed(weatherData) {
        const weatherDescription = weatherData.weather[0].description;
        const temp = weatherData.main.temp;
        const feelsLike = weatherData.main.feels_like;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;

        return new EmbedBuilder()
            .setTitle(`Weather in ${weatherData.name}, Indonesia`)
            .setColor('#3498db')
            .setDescription(`
                **🌡️ Temperature:** ${temp}°C (Feels like ${feelsLike}°C)
                **🌥️ Condition:** ${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}
                **💧 Humidity:** ${humidity}%
                **🌬️ Wind Speed:** ${windSpeed} m/s
            `)
            .setTimestamp();
    }
}

module.exports = WeatherCommand;
