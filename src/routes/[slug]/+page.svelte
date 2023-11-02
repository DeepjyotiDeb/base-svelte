<script>
    /** @type {import('./$types').PageData} */
    export let data
    let a = 0, b = 0, total = 0;
    let val = 'waiting...'

    async function randomNum(){
        const res = await fetch('/api/random-number', {
            method: 'GET'
        })
        if(res.ok){
            val = await res.json()
        }
    }

    async function add() {
        const res = await fetch('/api/random-number', {
            method: 'POST',
            body: JSON.stringify({a,b}),
            headers: {'content-type': 'application/json'}
        })
        if(res.ok){
            total = await res.json()
        }
    }
</script>

<h1>{data.title}</h1>
<div>{@html data.content} {val}</div>

<p class="">server data {data.val}</p>
<button type="button" on:click={randomNum} class="btn glass">random-number</button>


<div class="flex items-center">
    <input type="text" name="a-value" id="a-id" bind:value={a} class="input input-bordered">+
    <input type="text" name="b-value" id="b-id" bind:value={b} class="input input-bordered"> = {total}
</div>

<button type="button" on:click={add} class="btn">get sum</button>