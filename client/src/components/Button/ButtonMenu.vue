<template>
	<button class="btn btn-menu">
		<img src="imgSrc" alt="" />
		<div class="title">{{title}}</div>
	</button>
</template>

<script lang="ts">
export default {
	props: {
		imgSrc: String,
		title: String,
	},
};
</script>

<style lang="scss">
.btn-menu {
	width: 32px;
	height: 32px;
	background-color: ffffff;
}

.title{
  font-size: 12px
}
</style>