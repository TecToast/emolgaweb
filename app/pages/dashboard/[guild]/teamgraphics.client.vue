<template>
  <UDashboardPanel id="guild">
    <template #header>
      <UDashboardNavbar
          :title="`${selectedGuild?.name} | Kadergrafik`"
          :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse/>
        </template>
        <template #trailing>
          <UAvatar v-if="selectedGuild" :src="selectedGuild.icon"/>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <h1 class="text-3xl text-center font-bold">
        {{ currentMon?.tlName ?? "" }}
      </h1>
      <div class="h-3/4">
        <Cropper
            ref="cropper"
            :src="imageSrc"
            :stencil-component="PentagonStencil"
            :stencil-props="{
            handlers: {},
            movable: false,
            resizable: false,
            aspectRatio: 1.12,
          }"
            :resize-image="{ adjustStencil: false }"
            image-class="opacity-20"
            image-restriction="stencil"
            @change="onChange"
        />
      </div>
      <UButton
          :label="finished ? 'Alle Pokemon sind fertig gecroppt!' : 'Speichern'"
          icon="i-lucide-save"
          size="xl"
          :disabled="finished"
          :loading="loading"
          @click="onClick"
      />
      <UButton label="Flip" color="secondary" @click="flip()"/>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import {Cropper} from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import {PentagonStencil} from "#components";
import {useTemplateRef} from "vue";

definePageMeta({
  layout: "dashboard",
});
const cropper = useTemplateRef("cropper")
const flipped = ref(false);
const flip = () => {
  const cropperInstance = cropper.value;
  if (!cropperInstance) return;
  cropperInstance.flip(true, false)
  flipped.value = !flipped.value;
}

const selectedGuild: Ref<GuildMeta | null> = inject("selectedGuild", ref(null));
const finished = ref(false);
const loading = ref(true);

const currentMon = ref<
    { tlName: string; official: string; path: string } | undefined
>(undefined);
watch(
    currentMon,
    (newVal) => {
      console.log("NEW VAL", newVal);
      if (newVal) {
        imageSrc.value = newVal.path;
        flipped.value = false;
        loading.value = false;
      } else {
        loading.value = true;
        $fetch(`/api/emolga/${selectedGuild.value?.id}/teamgraphics/new`)
            .then((data) => {
              currentMon.value = data;
            })
            .catch((err) => {
              if (err.status === 404) {
                imageSrc.value = "";
                flipped.value = false
                finished.value = true;
                loading.value = false;
              }
            });
      }
    },
    {immediate: true}
);
const imageSrc = ref("");
const currentCoordinates = ref<{
  x: number;
  y: number;
  size: number;
}>({x: 0, y: 0, size: 200});

const onChange = (data: {
  coordinates: { left: number; top: number; width: number };
}) => {
  // 'canvas' is the actual cropped image element (HTMLCanvasElement)
  // You can convert it to a blob or dataURL to upload
  const {coordinates} = data;
  currentCoordinates.value = {
    x: coordinates.left,
    y: coordinates.top,
    size: coordinates.width,
  };
};

const onClick = async () => {
  await $fetch(
      "/api/emolga/" + selectedGuild.value?.id + "/teamgraphics/data",
      {
        method: "POST",
        body: {
          official: currentMon.value?.official,
          flipped: flipped.value,
          ...currentCoordinates.value,
        },
      }
  );
  currentMon.value = undefined;
};
</script>
