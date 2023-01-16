<template>
    <div class="w-full flex flex-col items-center">
        <div class="max-w-6xl bg-slate-200 w-full relative flex flex-col items-center rounded-xl p-5 pt-10">
            <h2 class="text-5xl mb-5">Glastonbury Festival</h2>
            <span class="rounded-full bg-green-700 text-white font-bold absolute top-10 right-10 py-4 px-6"
                @click="getSpotifyTracks()">S</span>
            <section class="bg-white rounded-lg w-full p-5">
                <div id="pyramid" class="flex w-full">
                    <h3 class="text-2xl mr-10">Pyramid</h3>
                    <div class="flex bg-gray-400 p-5 rounded-md">
                        <div v-for="(count, artist) in results">
                            <div v-if="count == 0">
                                <div class="h-[150px] bg-white border-gray-300 px-5 rounded-md border-2">{{ artist }}</div>
                            </div>
                            <div v-if="count == 1">
                                <div class="h-[150px] bg-green-100 border-gray-300 px-5 rounded-md border-2">{{ artist }}</div>
                            </div>
                            <div v-if="count == 2">
                                <div class="h-[150px] bg-green-300 border-gray-300 px-5 rounded-md border-2">{{ artist }}</div>
                            </div>
                            <div v-if="count > 2">
                                <div class="h-[150px] bg-green-500 border-gray-300 px-5 rounded-md border-2">{{ artist }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            artists: [],
            results: {}
        }
    },
    methods: {
        interpretSpotifyResponse(response) {
            const items = response.items;
            items.forEach(item => {
                item.track.artists.forEach(artist => {
                    this.$data.artists.push(artist.name);
                });
            });
            this.$data.results = this.countUnique(this.$data.artists);
            console.log(this.$data.results);
        },
        countUnique(arr) {
            var uniqs = arr.reduce((acc, val) => {
                acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
                return acc;
            }, {});
            return uniqs;
        },
        getSpotifyTracks() {
            const accessToken = import.meta.env.VITE_SPOTIFY_ACCESS_TOKEN;
            const client_id = 'c6ead95860334243aabf554648943aa7';
            const redirect_uri = 'http://localhost:5173/callback';

            let offset = 0;
            // while (offset < 50) {
            fetch(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            })
                .then(response => response.json())
                .then(response => this.interpretSpotifyResponse(response))
                .catch(err => console.error(err));
            offset += 50;
            // }

        },
    }
}
</script>