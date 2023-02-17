<template>
    <h2 class="text-sm">Sync with Spotify</h2>
    <button @click="auth"
        class="bg-slate-900 py-[6px] px-4 mb-2 rounded-md text-white hover:bg-slate-700 flex justify-center">
        Connect
        <img class="w-5 ml-2" src="../assets/Spotify_icon.svg.png" alt="Spotify Icon">
    </button>

    <div class="absolute top-5 right-5 flex items-start gap-1">
        <div class="bg-blue-200 p-1 text-xs rounded text-blue-600 border-black border border-b-2">
            Token Requests:
            <span class="ml-1 text-red-blue bold">
                {{ tokenRequests }}
            </span>
        </div>
        <div class="bg-green-200 p-1 text-xs rounded text-green-600 border-black border border-b-2">
            Track Requests:
            <span class="ml-1 text-green-600 bold">{{ trackRequests }}</span>
        </div>
        <button @click="createNewRequest" class="bg-green-600 p-1 text-xs border-black rounded border border-b-2">
            <span class="ml-1 text-white bold">
                Refresh Track Tokens
            </span>
        </button>
        <button @click="showJSON = !showJSON" class="bg-blue-200 p-1 text-xs rounded border border-b-2 border-black" :class="showJSON ? 'bg-black text-white ' : 'text-blue-600'">Show/Hide Track
            Response
        </button>
    </div>
    <div class="absolute top-14 right-5 bg-black text-white p-5 rounded-md" id="result" v-show="showJSON">
        <span class="w-[163.5px] h-6 absolute -top-4 bg-black right-0"></span>
        <div class="max-h-28 max-w-sm overflow-scroll">
            {{ results }}
        </div>
    </div>
</template>

<script>

export default {
    mounted() {
        this.init();
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

                    xhr.onload = function () {
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
                console.log('track requets:' + this.trackRequests)
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
                .then(function (codeChallenge) {

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
            console.log('lets sync!')
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