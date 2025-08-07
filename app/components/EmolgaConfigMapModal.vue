<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z.object({
  name: z.string().nonempty(),
});
const open = ref(false);

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
});

const emit = defineEmits<{
  new: [value: string]; // named tuple syntax
}>();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  open.value = false;
  emit("new", event.data.name);
  state.name = undefined;
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Neuer Eintrag"
    description="Füge einen neuen Eintrag hinzu"
  >
    <UButton label="Eintrag hinzufügen" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="name">
          <UInput v-model="state.name" class="w-full" autofocus />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            label="Abbrechen"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            label="Erstellen"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
