<template>
    <label class="input">
        <div>{{label}}</div>
        <input
            v-bind="$attrs"
            type="text"
            :value="value"
            @input="$emit('update', $event.target.value)"
            v-on="$listeners"
        />
    </label>
</template>

<script lang="ts">
// v-model="someVal", by default: v-model on component uses value as the prop and input as the event
// below customize
// as v-bind:value="someVal" and v-on:input="someVal = $event.target.value"
// as v-bind: :     v-on: @
import Vue from "vue";

export default Vue.extend({
    inheritAttrs: false,
    props: {
        label: String,
        value: String,
    },
    model: {
        prop: "value",
        event: "update",
    },
});
</script>


<style>
</style>
