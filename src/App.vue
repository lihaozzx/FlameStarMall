<template>
	<div id="app" :style="'height: '+hei+'px;'">
		<router-view class="ROUTER_VIEW"></router-view>
	</div>
</template>

<script lang="ts">
	import {
		Component,
		Vue,
	} from 'vue-property-decorator';

	@ Component
	export default class App extends Vue {
		hei: number = 0;
		created() {
			this.hei = document.documentElement.clientHeight;
		}
	}
</script>

<style>
	html {
		margin: 0;
		padding: 0;
	}

	body {
		margin: 0;
		padding: 0;
	}

	#app {
		width: 100vw;
		min-height: 600px;
		min-width: 1200px;
		overflow: auto;
	}

	.ROUTER_VIEW {
		width: 100%;
		height: 100%;
	}
</style>