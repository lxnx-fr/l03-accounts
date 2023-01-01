<template>
  <div :id="'checkbox__' + name" class="checkbox-wrapper">
    <div class="field-box">
      <input
        ref="fieldInput"
        class="field-checkbox"
        :name="name"
        type="checkbox"
        @input="handleInput"
        @blur="handleInput"
      />

      <label class="field-label" :for="name">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.3,61.3c5.7,4.1,13.2,11.8,16.7,18C53,60.5,66,41,77.7,20.8"
          />
        </svg>
        <span>{{ label }}</span>
      </label>
    </div>
    <div v-if="error !== null" class="field-error">
      <div>{{ error }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CheckboxField",
  props: {
    name: {
      type: String,
      default: "Default Name",
    },
    label: {
      type: String,
      default: "Default Label",
    },
    labelColor: {
      type: String,
      default: "#fff",
    },
    iconColor: {
      type: String,
      default: "#fff",
    },
    error: {
      type: String,
      default: null,
    },
  },
  emits: ["field:input"],
  methods: {
    handleInput() {
      this.$emit("field:input", this.$refs.fieldInput.checked);
    },
  },
};
</script>

<style lang="sass" scoped>
.checkbox-wrapper
  @apply mx-auto pt-4 pb-3 w-full
.field-label
  color: v-bind(labelColor)
  @apply relative inline-block cursor-pointer transition-colors duration-300 ease-in-out
  span
    @apply pl-7
.field-box
  @apply relative text-left text-sm w-fit left-1.5
.field-checkbox
  @apply w-full h-full top-0 left-0 absolute cursor-pointer box-border
  @apply opacity-0 appearance-none inline-block align-middle z-[100]
svg
  @apply w-[1.25rem] aspect-square absolute top-0 left-0 pointer-events-none
  border-color: v-bind(iconColor)
  color: v-bind(iconColor)
  @apply border-solid border-2 rounded-md
  path
    stroke-linecap: round
    stroke-linejoin: round
    stroke: v-bind(iconColor)
    @apply fill-[none] stroke-[1rem]
    transition: 0.8s stroke-dasharray ease, 0.8s stroke-dashoffset ease, 0.8s stroke ease
.field-checkbox + .field-label svg path
  stroke-dasharray: 100px 200px
  stroke-dashoffset: 101px
  transition: 0.2s stroke-dasharray ease, 0.2s stroke-dashoffset ease, 0.2s stroke ease
.field-checkbox:checked + .field-label svg path
  stroke-dashoffset: 0
.field-error
  @apply w-full pt-2.5 mb-2 relative left-2 pointer-events-none
  div
    @apply text-red-500 -mt-3 text-xs
</style>
