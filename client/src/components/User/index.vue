<template>
	<div class="user-wrapper">
		<div class="user-icon">
            <img class="img-user user-icon" :src="userIcon" alt="" />
		</div>
		<div class="username">{{user.username}}</div>
	</div>
</template>

<script>
export default {
	props: {
		user: {}
	},
	data(){
		return {
            userIcon: require("@/assets/listUser/user.svg"),
		}
	}
};
</script>

<style lang="scss" scoped>
.user-wrapper{

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 5px;
	.img-user{
		width: 25px;
		height: 25px;
	}

}
</style>