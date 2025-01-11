<script lang="ts">
  import * as pinInput from "@zag-js/pin-input";
  import { useMachine, normalizeProps } from "@zag-js/svelte";

  const [snapshot, send] = useMachine(
    pinInput.machine({
      id: "1",
    }),
  );

  const api = $derived(pinInput.connect(snapshot, send, normalizeProps));
</script>

<div>
  <div class="grid grid-cols-6 gap-2 w-64" {...api.getRootProps()}>
    <input class="bg-neutral-900" {...api.getInputProps({ index: 0 })} />
    <input class="bg-neutral-900" {...api.getInputProps({ index: 1 })} />
    <input class="bg-neutral-900" {...api.getInputProps({ index: 2 })} />
    <input class="bg-neutral-900" {...api.getInputProps({ index: 3 })} />
    <input class="bg-neutral-900" {...api.getInputProps({ index: 4 })} />
    <input class="bg-neutral-900" {...api.getInputProps({ index: 5 })} />
  </div>
  <button onclick={api.clearValue}>Clear</button>
</div>
