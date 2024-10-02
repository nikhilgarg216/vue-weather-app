<template>
    <div class="input-group mb-3">
        <input type="text" class="form-control" v-model="city" placeholder="Enter city name" aria-label="City"
            aria-describedby="search-button" />
        <button class="btn btn-primary" type="button" id="search-button" @click="search">
            <i class="bi bi-search"></i>
            Search
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            city: '',
        };
    },
    methods: {
        search() {
            this.$emit('search', this.city);
        },
    },
};
</script>

<style scoped>
.input-group {
    max-width: 500px;
    margin: 0 auto;
}
</style>