<script setup lang="ts">

const props = defineProps({
  label: {
    default: "Default Label",
    type: String,
  },
  labelAddon: {
    default: null,
    type: String,
  },
  name: {
    default: "defaultName",
    type: String,
  },
  type: {
    default: "text",
    type: String,
  },
  error: {
    default: null,
    type: String,
  },
  prepend: {
    default: null,
    type: String,
  },
  append: {
    default: null,
    type: String,
  },
  labelColor: {
    default: "#fff",
    type: String
  },
  iconColor: {
    default: "#fff",
    type: String
  },
  lineColor: {
    default: "#fff",
    type: String
  },
  inputColor: {
    default: "#fff",
    type: String
  },
})
const appendWrapper = ref<any>(null)
const prependWrapper = ref<any>(null)

watch(() => props.append, (newAppend) => {
  const appendIcon:any = document.createElement("i");
  appendIcon.classList = newAppend;
  appendWrapper.value.innerHTML = ""
  appendWrapper.value.append(appendIcon);
})
watch(() => props.prepend, (newPrepend) => {
  let prependIcon:any = document.createElement("i");
  prependIcon.classList = newPrepend;
  prependWrapper.value.innerHTML = ""
  prependWrapper.value.append(prependIcon);
})
</script>
<template>
  <div class="field-wrapper">
    <div
      v-if="prepend !== null"
      ref="prependWrapper"
      class="prepend-wrapper"
      @click="$emit('click:prepend');"
    >
      <i :class="prepend" />
    </div>
    <div class="field-box">
      <input :id="'tf__' + name"
        ref="fieldInput"
        :type="type"
        class="field-input"
        :name="name"
        placeholder=" "
        @input="$emit('field:input', $refs.fieldInput.value)"
        @blur="$emit('field:input', $refs.fieldInput.value)"
      />
      <label class="field-label" :for="'tf__' + name" >
        {{ label }}
        <span v-if="labelAddon !== null">
          {{ labelAddon }}
        </span>
      </label>
      <div class="field-line" />
      <div
        v-if="append !== null"
        ref="appendWrapper"
        class="append-wrapper"
        @click="$emit('click:append');"
      >
        <i :class="append" />
      </div>
      <div v-if="error !== null" class="field-error">
        <div>
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="sass" scoped>

.field-wrapper
  @apply text-lg flex pt-4 pb-3 transition-transform duration-300 ease-in-out origin-center
.field-box
  @apply relative mr-4 w-full
.prepend-wrapper
  color: v-bind(iconColor)
  @apply flex items-center justify-center w-[2.5rem] h-1/2  my-auto
.field-input
  color: v-bind(inputColor)
  @apply w-full h-full outline-none bg-transparent
.field-label
  color: v-bind(labelColor)
  @apply pointer-events-none absolute left-0 origin-top-left scale-100 translate-y-[-100%] block
  transition: color 0.2s cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 0.2s cubic-bezier(0.0, 0, 0.2, 1) 0ms
.field-error
    @apply w-full absolute pt-0.5 text-left text-red-500 text-xs pointer-events-none
.append-wrapper
  color: v-bind(iconColor)
  @apply right-0 top-0 absolute z-50 bg-transparent w-fit
.field-line
  @apply border-b-[1px] border-solid border-neutral-800 h-0
.field-line:after
  @apply absolute left-0 right-0 pointer-events-none content-[''] scale-x-0
  transition: transform .2s cubic-bezier(0.0, 0, 0.2, 1) 0s
  border-bottom: 2.5px solid v-bind(lineColor)
.field-input:focus, .field-input:not(:placeholder-shown)
  ~ .field-line:after
    @apply scale-x-100
  + .field-label
    color: v-bind(labelColor)
    @apply translate-y-[-155%] scale-75 origin-top-left block transition-all ease-in-out duration-300
.field-input + label
  span
    @apply invisible
.field-input:focus + label
  span
    @apply visible text-sm
</style>
