<template>
	<div class="section">
		<div class="container">

		<div class="columns">
			<div class="column">
				<simple-upload />
			</div>
			<div class="column">
				<multiple-upload />
			</div>
		</div>

		<dropzone />

		</div>
	</div>
</template>

<script>
import SimpleUpload from './SimpleUpload.vue';
import MultipleUpload from './MultipleUpload.vue';
import Dropzone from './Dropzone.vue';

export default {
  name: 'App',
  components: {SimpleUpload, MultipleUpload, Dropzone}
}
</script>
