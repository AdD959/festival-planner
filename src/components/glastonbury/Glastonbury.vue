<template>
    <div class="w-full flex flex-col items-center">
        <div class="max-w-6xl bg-slate-200 w-full relative flex flex-col items-center rounded-xl p-5 pt-20">
            <h2 class="text-5xl mb-5">Glastonbury Festival</h2>
                <span @click="auth()" class="rounded-full bg-green-700 text-white font-bold absolute top-20 right-10 py-4 px-6"
                    >S</span>
                <div class="absolute top-3 right-3 flex gap-1">
                    <div class="bg-blue-200 p-1 text-xs rounded text-blue-600">Token Requests:<span class="ml-1 text-red-blue bold">{{ tokenRequests }}</span></div>
                    <div class="bg-green-200 p-1 text-xs rounded text-green-600">Track Requests:<span class="ml-1 text-green-600 bold">{{ trackRequests }}</span></div>
                    <button @click="createNewRequest" class="bg-green-600 p-1 text-xs rounded"><span class="ml-1 text-white bold">Refresh Track Tokens</span></button>
                </div>
            <section class="bg-white rounded-lg w-full p-5">
                <button @click="showJSON = !showJSON" class="bg-blue-200 p-1 text-xs rounded text-blue-600">Show/Hide Track Response</button>
                <div id="result" v-show="showJSON">{{ results }}</div>
                <div id="pyramid" class="flex w-full flex-col">
                    <h3 class="text-2xl mr-10">Pyramid</h3>
                    <div class="flex flex-col bg-gray-400 p-5 rounded-md" v-for="day in lineup">
                        <div class="flex flex-col">
                            <div>{{ day.Name }}</div>
                            <div v-for="stage in day.Stages" class="flex">
                                <div>{{ stage.Name }}</div>
                                <div v-for="artist in stage.Artists" class="h-[150px] border-gray-300 px-5 rounded-md border-2" :class="[artist.listens ? 'bg-green-700' : 'bg-white']">{{ artist.Name }}</div>
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
    mounted() {
        fetch("glastonbury2022.json").then(res => res.json()).then(artists => { 
            this.lineup = artists;
            this.init();
        });
    },
    data() {
        return {
            artists: [],
            results: {},
            lineup: {},
            tokenRequests: 0,
            trackRequests: 0,
            showJSON: false
        }
    },
    methods: {
        init() {
            this.tokenRequests = window.sessionStorage.getItem("tokenRequests");
            this.trackRequests = window.sessionStorage.getItem("trackRequests");
            this.results = JSON.parse(JSON.stringify(this.results))
            this.checkAuth()
        },
        checkAuth() {
            const cachedTracks = window.sessionStorage.getItem("cachedSpotifyLibrary");
            if (cachedTracks) {
                this.interpret(JSON.parse(cachedTracks))
                return;
            }
            const accessToken = window.sessionStorage.getItem("spotifyWebAPIAccessToken");
            if (accessToken) { this.getArtistData(); }
            else if (window.location.search) {
            var args = new URLSearchParams(window.location.search);
            var code = args.get("code");

                if (code) {
                    var xhr = new XMLHttpRequest();

                    xhr.onload = function() {
                        this.tokenRequests = window.sessionStorage.getItem("tokenRequests");
                        if (!this.tokenRequests) {
                            window.sessionStorage.setItem("tokenRequests", 1);
                        } else {
                            console.log('setting new token value...')
                            window.sessionStorage.setItem("tokenRequests", this.tokenRequests + 1);
                        }
                        var response = xhr.response;
                        var message;

                        if (xhr.status == 200) {
                            window.sessionStorage.setItem("spotifyWebAPIAccessToken", response.access_token);
                            this.getArtistData();
                        }
                        else {
                            message = "Error: " + response.error_description + " (" + response.error + ")";
                        }

                        document.getElementById("result").innerHTML = message;
                    };
                    xhr.responseType = 'json';
                    xhr.open("POST", 'https://accounts.spotify.com/api/token', true);
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    xhr.send(new URLSearchParams({
                        client_id: 'c6ead95860334243aabf554648943aa7',
                        code_verifier: window.sessionStorage.getItem("code_verifier"),
                        grant_type: "authorization_code",
                        redirect_uri: location.href.replace(location.search, ''),
                        code: code
                    }));
                }
            } 
        },
        getArtistData() {
            if (window.sessionStorage.getItem("spotifyWebAPIAccessToken")) {
                const accessToken = window.sessionStorage.getItem("spotifyWebAPIAccessToken");
                let offset = 0;
                let batch = 0;
                // while (offset < 50) {
                    this.trackRequests = window.sessionStorage.getItem("trackRequests");
                    console.log('track requets:'  + this.trackRequests)
                        if (!this.trackRequests) {
                            window.sessionStorage.setItem("trackRequests", 1);
                        } else {
                            console.log('setting new request value...')
                            window.sessionStorage.setItem("trackRequests", this.trackRequests + 1);
                        }
                    fetch(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                    })
                        .then(response => response.json())
                        .then(res => { window.sessionStorage.setItem(`cachedSpotifyLibrary_${batch}`, JSON.stringify(res)); return res; })
                        .then(response => { this.interpret(response); })
                        .catch(err => console.error(err));
                    batch++;
                    offset += 50;
                // }
            }
        },
        auth() {
            var codeVerifier = this.generateRandomString(64);

            const challengeMethod = crypto.subtle ? "S256" : "plain"

            Promise.resolve()
                .then(() => {
                    if (challengeMethod === 'S256') {
                        return this.generateCodeChallenge(codeVerifier)
                    } else {
                        return codeVerifier
                    }
                })
                .then(function(codeChallenge) {
                    
                    var redirectUri = 'http://localhost:5173/callback';
                    var args = new URLSearchParams({
                        response_type: "code",
                        client_id: 'c6ead95860334243aabf554648943aa7',
                        code_challenge_method: challengeMethod,
                        code_challenge: codeChallenge,
                        redirect_uri: redirectUri,
                        scope: 'user-library-read'
                    });
                    window.sessionStorage.setItem("code_verifier", codeVerifier);
                    window.location = 'https://accounts.spotify.com/authorize?' + args;
                });
        },
        interpret(response) {
            const items = response.items;
            items.forEach(item => {
                item.track.artists.forEach(artist => {
                    this.$data.artists.push(artist.name);
                });
            });
            this.$data.results = this.countUnique(this.$data.artists);
            this.syncToClashFinder();
        },
        countUnique(arr) {
            var uniqs = arr.reduce((acc, val) => {
                acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
                return acc;
            }, {});
            return uniqs;
        },
        createNewRequest() {
            this.trackRequests = window.sessionStorage.setItem("trackRequests", 0);
            window.sessionStorage.removeItem("spotifyWebAPIAccessToken");
            window.sessionStorage.removeItem("cachedSpotifyLibrary");
        },
        syncToClashFinder() {
            for (let [spotifyArtist, count] of Object.entries(this.$data.results)) {
                for (let [index, day] of Object.entries(this.$data.lineup)) {
                    for (let [index, stage] of Object.entries(day.Stages)) {
                        for (let [index, artist] of Object.entries(stage.Artists)) {
                            if (spotifyArtist.toLocaleLowerCase() == artist.Name.toLocaleLowerCase()) {
                                artist.listens = 1;
                            }
                        }
                    }
                }
            }
        }, 
        async generateCodeChallenge(codeVerifier) {
            var digest = await crypto.subtle.digest("SHA-256",
                new TextEncoder().encode(codeVerifier));

            return btoa(String.fromCharCode(...new Uint8Array(digest)))
                .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
        },
        generateRandomString(length) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        }
    },
}
</script>