<template>
  <div :id="'field__' + name" ref="fieldWrapper" class="field-wrapper">
    <div
      v-if="prepend !== null"
      ref="prependWrapper"
      class="prepend-wrapper"
      @click="handlePrependClick"
    >
      <i :class="prepend" />
    </div>
    <div class="field-box">
      <input
        ref="fieldInput"
        :type="type"
        :accept="accept"
        class="field-input"
        :name="name"
        placeholder=" "
        @input="handleInput"
        @blur="handleInput"
      />
      <label class="field-label" :for="name"
        >{{ label
        }}<span v-if="labelAddon !== null">{{ labelAddon }}</span></label
      >
      <div class="field-line" />
      <div
        v-if="append !== null"
        ref="appendWrapper"
        class="append-wrapper"
        @click="handleAppendClick"
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

<script>
export default {
  name: "UploadField",
  props: {
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
      default: "file",
      type: String,
    },
    accept: {
      default: "image/*",
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
  },
  emits: ["click:prepend", "click:append", "field:input"],
  data() {
    return {
      fieldValue: "",
    };
  },
  watch: {
    append: function (newVal) {
      let appendIcon = document.createElement("i");
      appendIcon.classList = newVal;
      this.$refs.appendWrapper.innerHTML = "";
      // animejs scale 100 -> 0 / 0 -> 100 animation
      this.$refs.appendWrapper.append(appendIcon);
    },
    prepend: function (newVal) {
      let prependIcon = document.createElement("i");
      prependIcon.classList = newVal;
      this.$refs.prependWrapper.innerHTML = "";
      this.$refs.prependWrapper.append(prependIcon);
    },
  },

  methods: {
    handleAppendClick() {
      this.$emit("click:append");
    },
    handlePrependClick() {
      this.$emit("click:prepend");
    },
    handleInput() {
      this.$emit("field:input", this.$refs.fieldInput.value);
    },
  },
};
</script>

<style lang="sass" scoped>
.field-wrapper
  @apply text-black text-lg flex pt-4 pb-3  transition-transform duration-300 ease-in-out origin-center
.field-box
  @apply relative mr-4 w-full
.prepend-wrapper
  @apply flex items-center justify-center w-[2.5rem] h-1/2  my-auto
.field-input
  @apply w-full h-full outline-none bg-transparent
.field-label
  @apply pointer-events-none  absolute left-0 origin-top-left scale-100 translate-y-[-100%] block text-[rgba(0,0,0,0.4)]
  transition: color 0.2s cubic-bezier(0.0, 0, 0.2, 1) 0ms, transform 0.2s cubic-bezier(0.0, 0, 0.2, 1) 0ms
.field-error
  @apply w-full absolute pt-0.5 text-left text-red-500 text-xs pointer-events-none
.append-wrapper
  @apply right-0 top-0 absolute z-50 bg-white w-fit
.field-line
  @apply border-b-[1px] border-solid border-neutral-800 h-0
.field-line:after
  @apply absolute left-0 right-0 pointer-events-none content-[''] scale-x-0
  transition: transform .2s cubic-bezier(0.0, 0, 0.2, 1) 0s
  border-bottom: 2.5px solid black
.field-input:focus, .field-input:not(:placeholder-shown)
  ~ .field-line:after
    @apply scale-x-100
  + .field-label
    @apply translate-y-[-155%] scale-75 origin-top-left block transition-all ease-in-out duration-300 text-black
.field-input + label
  span
    @apply invisible
.field-input:focus + label
  span
    @apply visible text-sm
</style>
