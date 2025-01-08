const axios = require('axios');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const API_KEY = process.env.RIOT_API_KEY;

app.get('/summoners', async (req, res) => {
    try {
        const summoners = [
            { name: 'I take toes', tag: 'TOES' },
            { name: 'Angel', tag: '0004' },
            { name: 'Jason', tag: '0303' },
            { name: 'Mirror', tag: '1225' }
        ];

        const results = await Promise.all(summoners.map(async ({ name, tag }) => {
            // Fetch summoner data
            const accountRes = await axios.get(
                `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=${API_KEY}`
            );
            
            const puuid = accountRes.data.puuid;

            // Fetch summoner profile data
            const summonerRes = await axios.get(
                `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`
            );

            const summonerId = summonerRes.data.id;
            const profileIconId = summonerRes.data.profileIconId; // Get profile icon

            // Fetch rank data
            const rankRes = await axios.get(
                `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${API_KEY}`
            );

            return {
                name,
                tag,
                profileIconId,
                rank: rankRes.data
            };
        }));

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching summoner data' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
