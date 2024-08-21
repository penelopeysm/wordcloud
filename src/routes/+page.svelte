<script lang="ts">
    import { onMount } from "svelte";
    import WordCloud from "./WordCloud.svelte";

    // import WordCloud from "wordcloud";

    let words = [
        {text: "placeholder", count: 1},
    ];
    let submission: string = "";
    const maxTimer = 5;

    async function submitWord() {
        // Sanitise input
        submission = submission.toLowerCase().trim().split(/\s+/).join("-");

        if (submission === "") {
            return;
        }

        const response = await fetch("/answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({text: submission}),
        });
        words = await response.json();
        timer = maxTimer;
        submission = "";
    }

    async function getWords() {
        const response = await fetch("/ask");
        words = await response.json();
    }

    let timer = maxTimer;

    onMount(async () => {
        await getWords();

        const interval = setInterval(async () => {
            timer -= 1;
            if (timer <= 0) {
                await getWords();
                timer = maxTimer;
            }
        }, 1000);
    });

    let totalWords;
    $: {
        totalWords = words.map((word) => word.count).reduce((a, b) => a + b, 0);
    }
</script>

<svelte:head>
    <title>A word cloud...</title>
</svelte:head>

<div id="wrapper-wrapper">
    <h1>Hello, another REG survey</h1>

    <div id="wrapper">
        <div id="input-form">
            <p>Please type in any programming languages or technologies you have used in your time in REG.</p>
            <p>This can include not-entirely-serious-work things, such as Hack Week projects!</p>

            <form on:submit|preventDefault={async () => submitWord()}>
                <input id="submission" type="text" placeholder="Enter a word..."
                    bind:value={submission} />
                <button id="submit">Submit</button>
            </form>

            <p>The word cloud on the right automatically updates whenever you submit a word, or {maxTimer} seconds after the last update, whichever comes first. <span class="smaller">(Next refresh in: {timer} seconds)</span></p>

            <p>So far, this word cloud has received {totalWords} submissions.</p>

            <p>Thank you, <br />- Penny &lt;3</p>
        </div>
        <div id="cloud">
            {#key JSON.stringify(words)}
                <WordCloud words={words} width={450} height={350} />
            {/key}
        </div>
    </div>
</div>

<style>
    div#wrapper-wrapper {
        height: 100vh;
        width: calc(100vw - 100px);
        margin: 20px 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    div#wrapper {
        display: flex;
        width: max-content;
        max-width: 100%;
        flex-direction: row;
        align-items: center;
        gap: 20px;
    }
    div#input-form {
        width: 400px;
        max-width: 400px;
    }
    div#input-form p {
        font-size: 1.1em;
    }
    div#cloud {
        border: 1px solid black;
    }
    input#submission {
        font-family: monospace;
        font-size: 1.5em;
        width: 100%;
    }
    button#submit {
        display: none;
    }
    span.smaller {
        font-size: 0.8em;
    }
</style>
