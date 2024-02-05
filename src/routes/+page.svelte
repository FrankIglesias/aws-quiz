<script lang="ts">
  import { deserialize } from "$app/forms";
  import { invalidateAll } from "$app/navigation";

  export let data;
  let error: boolean;
  let question = { ...data.question };
  question.options = question.options.map((text) => ({
    text,
    checked: false
  }));
  let questionCount = 0;
  let answers = [];
  let token = data.token;
  let errorCount = 0;
  let help = "";

  async function check(event: Event) {
    const response = await fetch(event.currentTarget.action, {
      method: "POST",
      body: JSON.stringify({
        token,
        answers: question.options
          .filter((option) => option.checked)
          .map((option) => option.text[0]),
        question: question.questionNumber
      })
    });

    /** @type {import('@sveltejs/kit').ActionResult} */
    const parsed = deserialize(await response.text());
    if (errorCount === 0) {
      answers.push(parsed.type === "success");
    }
    if (parsed.type === "success") {
      question = parsed.data.question;
      question.options = parsed.data.question.options.map((text) => ({
        checked: false,
        text
      }));
      error = false;
      help = "";
      token = parsed.data.token;
      errorCount = 0;
      questionCount++;
    } else {
      error = true;
      errorCount++;
      if (errorCount > 3) {
        help = parsed.data.message;
      }
      question.options = question.options.map((option, i) => ({
        ...option,
        checked: false
      }));
    }
    await invalidateAll();
  }
  $: percentage =
    questionCount === 0
      ? 100
      : (answers.filter((answer) => answer).length / questionCount) * 100;
</script>

<svelte:head>
  <title>Quiz</title>
  <meta name="description" content="AWS Quiz" />
</svelte:head>
<div class="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-4">
  <div
    class="bg-gray-300 text-white font-bold py-2 px-4 rounded my-2 w-full relative"
  >
    <div
      class="absolute left-0 top-0 h-full bg-emerald-500 text-white font-bold rounded z-0"
      style="width: {percentage}%"
    ></div>
    <span class="z-10 relative"> {percentage.toFixed()}%</span>
  </div>
</div>
<form
  on:submit|preventDefault={check}
  class="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-4"
>
  <h1 class="text-3xl font-bold">{@html question.question}</h1>
  {#each question.options as option}
    <label class="w-full">
      <input
        type="checkbox"
        class="hidden peer"
        bind:checked={option.checked}
      />
      <div
        class="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded my-2 w-full peer-checked:bg-emerald-700"
      >
        {option.text}
      </div>
    </label>
  {/each}
  <button
    class="bg-paynes-grey-500 hover:bg-paynes-grey-600 text-white font-bold py-2 px-4 rounded my-2 w-full"
    class:incorrect={error}
  >
    Next
  </button>
  <span class="text-neutral-500">{help}</span>
</form>

<style>
  .incorrect {
    @apply bg-red-500 hover:bg-red-700;
  }
</style>
