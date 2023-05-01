<script setup>
    import ButtonShadow from './ButtonShadow.vue'
</script>

<template>
    <div class="flex">
        <div>
            <label for="connect-to-spotify" :class="disableSpotifyButton ? 'text-[green]' : ''" class="block text-xs" v-text="disableSpotifyButton ? 'Connected to Spotify' : 'Connect to Spotify'"></label>
            <button @click="auth" :class="disableSpotifyButton ? 'cursor-not-allowed grayscale opacity-20' : ''" :disabled="disableSpotifyButton" aria-label="connect-to-spotfiy" class="relative p-2 border-2 border-skin-muted text-skin-base flex items-center bg-skin-muted">
                <ButtonShadow />
                Connect
                <img class="w-5 ml-2" src="../../assets/Spotify_icon.png" alt="Spotify Icon">
            </button>
        </div>
        <div :class="disableSpotifyButton ? 'block' : 'hidden'">
            <label class="text-xs block mt-4"></label>
            <button aria-label="toggle" @click="toggleButton" :class="toggleSelected ? 'bg-[#26e669]' : ''" class="relative p-2 border-2 border-skin-muted text-skin-inverted flex items-center">Toggle</button>
        </div>
    </div>
</template>

<script>
export default {
    emits: ['spotifySync'],
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
            showJSON: false,
            disableSpotifyButton: false,
            toggleSelected: false
        }
    },
    methods: {
        init() {
            this.tokenRequests = window.localStorage.getItem("tokenRequests");
            this.trackRequests = window.localStorage.getItem("trackRequests");

            this.trackRequests = this.trackRequests ? this.trackRequests : 0;
            this.tokenRequests = this.tokenRequests ? this.tokenRequests : 0;

            this.results = JSON.parse(JSON.stringify(this.results))
            this.checkAuth()
        },
        toggleButton() {
            this.toggleSelected = !this.toggleSelected
            this.$emit('spotifySync', this.results)
        },
        checkAuth() {
            const cachedTracks = window.localStorage.getItem("cachedSpotifyLibrary_1");
            if (cachedTracks) {
                this.disableSpotifyButton = true;
                console.log('cached tracks have been found.')
                try {
                    this.interpret(JSON.parse(cachedTracks))
                } catch {
                    console.log(JSON.parse(cachedTracks));
                    if (JSON.parse(cachedTracks).error.status === 401) {
                        window.localStorage.removeItem('spotifyWebAPIAccessToken')
                        console.log(window.localStorage.getItem('spotifyWebAPIAccessToken'))
                        // this.checkAuth()
                    }
                }
                return;
            } else {
                console.log('no cached tracks have been found.')
                const accessToken = window.localStorage.getItem("spotifyWebAPIAccessToken")
                if (accessToken) { this.getArtistData(); console.log('access token found') }
                else if (window.location.search) {
                    console.log('access token not found, checking if the page returned contains callback code...')
                    var args = new URLSearchParams(window.location.search);
                    var code = args.get("code");

                    if (code) {
                        console.log('callback code found')
                        var xhr = new XMLHttpRequest();

                        xhr.onload = function () {
                            this.tokenRequests = window.localStorage.getItem("tokenRequests");
                            if (!this.tokenRequests) {
                                console.log('no previous token request stashed, setting new request...')
                                this.updateTokenRequests(true);
                            } else {
                                console.log('setting new token value...')
                                console.log('type: ' + typeof (this.tokenRequests))
                                this.updateTokenRequests();
                            }
                            var response = xhr.response;
                            var message;

                            if (xhr.status == 200) {
                                window.localStorage.setItem("spotifyWebAPIAccessToken", response.access_token);
                                this.getArtistData();
                                this.disableSpotifyButton = true;
                            }
                            else {
                                message = "Error: " + response.error_description + " (" + response.error + ")";
                            }

                            // document.getElementById("result").innerHTML = message;
                        }.bind(this);
                        xhr.responseType = 'json';
                        xhr.open("POST", 'https://accounts.spotify.com/api/token', true);
                        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                        xhr.send(new URLSearchParams({
                            client_id: 'c6ead95860334243aabf554648943aa7',
                            code_verifier: window.localStorage.getItem("code_verifier"),
                            grant_type: "authorization_code",
                            redirect_uri: location.href.replace(location.search, ''),
                            code: code
                        }));
                    }
                }
            }
        },
        updateTokenRequests(reset) {
            if (reset) {
                window.localStorage.setItem("tokenRequests", 1);
                this.tokenRequests = 1
            } else {
                window.localStorage.setItem("tokenRequests", this.tokenRequests + 1);
                this.tokenRequests++
            }
        },
        updateTrackRequests(reset) {
            if (reset) {
                window.localStorage.setItem("trackRequests", 1);
                this.trackRequests = 1
            } else {
                this.trackRequests++
                window.localStorage.setItem("trackRequests", this.trackRequests);
            }
        },
        getArtistData() {
            if (window.localStorage.getItem("spotifyWebAPIAccessToken")) {
                const accessToken = window.localStorage.getItem("spotifyWebAPIAccessToken");
                let offset = 0;
                let batch = 0;
                let batches = []
                while (offset < 400) {
                    this.trackRequests = window.localStorage.getItem("trackRequests");
                    console.log('track requests:' + this.trackRequests)
                    if (!this.trackRequests) {
                        this.updateTrackRequests(true)
                    } else {
                        console.log('setting new request value...')
                        this.updateTrackRequests()
                    }
                    fetch(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        },
                    })
                        .then(response => response.json())
                        .then(res => { 
                                window.localStorage.setItem(`cachedSpotifyLibrary_${batch}`, JSON.stringify(res)); return res; 
                        })
                        .then(response => { this.interpret(response); })
                        .catch(err => console.error(err));
                    batch++;
                    offset += 50;
                }
            }
        },
        deleteCache() {
            window.localStorage.clear();
            this.artists = []
            this.results = {}
            this.lineup = {}
            this.tokenRequests = 0
            this.trackRequests = 0
            this.disableSpotifyButton = false
            console.log('%clocal storage deleted', 'color: red;background-color:#FECACA;padding:4px;')
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
                    window.localStorage.setItem("code_verifier", codeVerifier);
                    window.location = 'https://accounts.spotify.com/authorize?' + args;
                });
        },
        interpret(response) {
            console.log(response)
            const items = response.items;
            items.forEach(item => {
                item.track.artists.forEach(artist => {
                    this.artists.push(artist.name);
                });
            });
            this.results = this.countUnique(this.artists);
            this.$emit('spotifySync', this.results)
        },
        countUnique(arr) {
            var uniqs = arr.reduce((acc, val) => {
                acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
                return acc;
            }, {});
            return uniqs;
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