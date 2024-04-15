<script setup lang="ts">
import Draggable from 'vuedraggable'

const list = ref([{
  data: "monday",
  id: 1,
},
  {
    data: "tuesday",
    id: 2,
  },
  {
    data: "wednesday",
    id: 3,
  },
  {
    data: "thursday",
    id: 4,
  },
  {
    data: "friday",
    id: 5,
  },
  {
    data: "saturday",
    id: 6,
  },
  {
    data: "sunday",
    id: 7,
  }])
const drag = ref(false)
</script>

<template>
  <div>
  <h1 class="text-center text-2xl">Picks queuen</h1>
  <!--  <Draggable v-model="arr" item-key="id" :group="{ name: 'people', pull: 'clone', put: false }">-->
  <!--    <template #item="{element}">-->
  <!--      <div class="bg-gray-800 p-4 m-2 rounded-lg">-->
  <!--        {{ element.data }}-->
  <!--      </div>-->
  <!--    </template>-->
  <!--  </Draggable>-->
  <ClientOnly>
  <draggable
      class="list-group"
      tag="transition-group"
      :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null
        }"
      v-model="list"
      v-bind="{animation: 200, group: 'description', disabled: false, ghostClass: 'ghost'}"
      @start="drag = true"
      @end="drag = false"
      item-key="id"
  >
    <template #item="{ element }">
      <li class="list-group-item">
        <i
            :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
            @click="element.fixed = !element.fixed"
            aria-hidden="true"
        ></i>
        {{ element.name }}
      </li>
    </template>
  </draggable>
  </ClientOnly>
  <h2>{{ list }}</h2>
  </div>
</template>

<style scoped>
.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>
