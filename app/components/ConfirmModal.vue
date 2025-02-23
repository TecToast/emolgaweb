<script lang="ts" setup>
const props = defineProps<{
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  btnColor: "primary" | "secondary" | "error";
  btnIcon?: string;
  onConfirm: () => void;
}>();
const open = ref(false);
</script>
<template>
  <UModal :title :open="open">
    <UButton
      :color="props.btnColor"
      :icon="props.btnIcon"
      @click="open = true"
    />
    <template #body>
      <div class="space-y-4">
        <div v-if="props.description">{{ props.description }}</div>
        <div class="flex justify-end gap-2">
          <UButton
            :label="props.cancelLabel ?? 'Abbrechen'"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            :label="props.confirmLabel ?? 'Bestätigen'"
            :color="props.btnColor"
            variant="solid"
            @click="props.onConfirm"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
