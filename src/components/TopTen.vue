<template>
    <div class="container">
        <p class="topTitle">Top 10 most searched breeds</p>
        <div class="topBreedsContainer">
            <div class="catBreed" v-for="(breed, index) in top10Breeds" :key="index">
                <img class="catImage" :src="images[index]" alt="">
                <div>
                <p class="title">{{ index + 1 }}. {{ breed.name }}</p>
                <p class="description">{{ breed.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import apiService from '../api/apiService'
import { onMounted, ref} from 'vue';

const props = defineProps({
    breeds: {
        type: Object, // Update the type according to your needs
        required: true,
    },
});

interface Top10Breeds {
    name: string
    description: string
}
interface Images {

}
const top10Breeds = ref<Top10Breeds[]>([]);
const images = ref<any>([])

onMounted(async () => {
    top10Breeds.value = await fetchTop10Breeds();
    images.value = await fetchImages();
});

const fetchTop10Breeds = async () => {
    const sorted = props.breeds.sort((a, b) => b.searches - a.searches);
    return sorted.slice(0, 10);
};

const fetchImages = async () => {
    const images = [];

    for (const breed of top10Breeds.value) {
        const response = await apiService.getSingleImage(breed.id);
        const breedImages = response.data.map(res => res.url);
        images.push(...breedImages);
    }

    return images;
};
</script>
<style scoped>

.topTitle {
    font-size: 36px;
    font-weight: 700;
    color: #291507;
    margin: 3rem 0;
}
.catBreed{
    display: grid;
    grid-template-columns: .5fr 1.5fr;
    gap: 2rem;
    margin-bottom: 3rem;
}

.catBreed div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.catImage {
    width: 100%;
    height: 100%;
    border-radius: 15px;
    object-fit: cover;
    aspect-ratio: 1/1;
}

.title {
    font-size: 1.5rem;
    font-weight: 500;
}

.description {
    font-size: 15px;
    width: 100%;
}

@media (max-width: 500px) {
    .catBreed {
        display: flex;
        flex-direction: column;
    }

}
</style>