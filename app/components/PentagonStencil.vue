<template>
  <div class="pentagon-stencil" :style="style">
    <StencilPreview
        class="pentagon-stencil__preview"
        :image="image"
        :coordinates="coordinates"
        :width="stencilCoordinates.width"
        :height="stencilCoordinates.height"
        :transitions="transitions"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { StencilPreview } from 'vue-advanced-cropper';

const props = defineProps({
  image: {
    type: Object,
    required: true,
  },
  coordinates: {
    type: Object,
    required: true,
  },
  stencilCoordinates: {
    type: Object,
    required: true,
  },
  transitions: {
    type: Object,
  },
  // We keep these props definitions to avoid Vue warnings,
  // even though we don't use them in a static stencil.
  handlers: {
    type: Object,
  },
  permissions: {
    type: Object,
  },
});

// Calculate the fixed position of the stencil
const style = computed(() => {
  const { height, width, left, top } = props.stencilCoordinates;
  return {
    width: `${width}px`,
    height: `${height}px`,
    left: `${left}px`,
    top: `${top}px`,
  };
});
</script>

<style>
.pentagon-stencil {
  position: absolute;
  /* cursor: move; <- Removed this cursor since it's not movable */
  box-sizing: border-box;
  pointer-events: none; /* Allows click events to pass through if needed, though usually the library handles the image layer */
}

.pentagon-stencil__preview {
  /* The specific polygon provided */
  clip-path: polygon(49.5% 0%, 0% 39%, 18.9% 100%, 80.5% 100%, 100% 39%);
  width: 100%;
  height: 100%;
}
</style>