<template>
    <div className="container">
        <div class="top">
            <div class="mainPicContainer">
            <img v-if="catImages.length > 0" class="mainPic" :src="catImages[0].url" alt="">
            <div class="decoration"></div>
            </div>
            <div className="catInfo">
                <div class="catName">
                    {{ props.selected.name }}
                </div>
                <div class="catDescription">
                    {{ props.selected.description }}
                </div>
                <div class="catTemperament">
                    <b>Temperament:</b> {{ props.selected.temperament }}
                </div>
                <div class="catOrigin">
                    <b>Origin:</b> {{ props.selected.origin }}
                </div>
                <div class="lifeSpan">
                    <b>Life Span:</b> {{ props.selected.life_span }} years
                </div>
                <div class="stats">
                    <div class="adaptability">
                        <p><b>Adaptability:</b></p>
                        <div>
                            <span v-for="(item, index) in 5" :key="index" class="statsBars"
                                :style="getSpanStyle(index, props.selected.adaptability)"></span>
                        </div>
                    </div>
                    <div class="affection_level">
                        <p><b>Affection level:</b></p>
                        <div>
                            <span v-for="(item, index) in 5" :key="index" class="statsBars"
                                :style="getSpanStyle(index, props.selected.affection_level)"></span>
                        </div>
                    </div>
                    <div class="adaptability">
                        <p><b>Child Friendly:</b></p>
                        <div>
                            <span v-for="(item, index) in 5" :key="index" class="statsBars"
                                :style="getSpanStyle(index, props.selected.child_friendly)"></span>
                        </div>
                    </div>
                    <div class="adaptability">
                        <p><b>Grooming:</b></p>
                        <div>
                            <span v-for="(item, index) in 5" :key="index" class="statsBars"
                                :style="getSpanStyle(index, props.selected.grooming)"></span>
                        </div>
                    </div>
                    <div class="adaptability">
                        <p><b>Intelligence:</b></p>
                        <div>
                            <span v-for="(item, index) in 5" :key="index" class="statsBars"
                                :style="getSpanStyle(index, props.selected.intelligence)"></span>
                        </div>
                    </div>
                    <div class="adaptability">
                        <p><b>Health issues:</b></p>
                        <div>
                            <span v-for="(item, index) in 5" :key="index" class="statsBars"
                                :style="getSpanStyle(index, props.selected.health_issues)"></span>
                        </div>
                    </div>
                    <div class="adaptability">
                        <p><b>Social needs:</b></p>
                        <div>
                            <span v-for="(item, index) in 5" :key="index" class="statsBars"
                                :style="getSpanStyle(index, props.selected.social_needs)"></span>
                        </div>
                    </div>
                    <div class="adaptability">
                        <p><b>Stranger friendly:</b></p>
                        <div>
                            <span v-for="(item, index) in 5" :key="index" class="statsBars"
                                :style="getSpanStyle(index, props.selected.stranger_friendly)"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="displayedImages.length > 0" class="otherPhotos">
            <p>Other photos</p>
            <div class="photos">
                <img v-for="(image, index) in displayedImages" :key="index" :src="image.url" alt="">
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import apiService from '../api/apiService'

const props = defineProps({
    selected: {
        type: Object, // Update the type according to your needs
        required: true,
    },
});

interface CatImage {
    height?: number,
    width?: number,
    url: string,
    id: string
}


const catImages = ref<CatImage[]>([])
// Compute the displayedImages based on the catImages array
const displayedImages = computed(() => {
    return catImages.value.slice(1, 9); // Get the images from index 1 to 8
});

const getSpanStyle = (index: number, stat: number) => {
    if (index < stat) {
        return {
            backgroundColor: '#544439',
        };
    } else {
        return {
            backgroundColor: '#E0E0E0',
        }
    }
}

onMounted(() => {
    apiService.getImagesFromBreed(props.selected.id).then((response) => {
        // console.log(response.data)
        catImages.value = response.data.map((image) => ({
            url: image.url,
            id: image.id
        }))
    })
}),



    console.log(props.selected)
</script>
<style scoped>

.container {
    margin: 3rem 0;
}
.top {
    display: grid;
    grid-template-columns: .7fr 1.3fr;
    gap: 5rem;
}

.mainPic {
    width: 100%;
    border-radius: 25px;
    aspect-ratio: 1/1;
    object-fit: cover;
    /* box-shadow: -100px -5px 0px -50px #DEC68B; */
    z-index: 999;
}

.photos {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
}

.photos img {
    /* width: %; */
    max-width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 1/1;
    border-radius: 15px;
}

.stats {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.stats div {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.stats div p {
    width: 40%;
}

.stats div div {
    width: 100%;
}

.statsBars {
    display: block;
    width: 100%;
    height: 12px;
    background-color: #E0E0E0;
    border-radius: 10px;
}

.catInfo {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.catName {
    font-size: 36px;
    color: #291507;
    font-weight: 600;
}

.catDescription {
    font-size: 18px;
    font-weight: 500;
    color: #291507;
}

b {
    font-weight: 800;
}

.otherPhotos {
    margin-top: 1.5rem;
}

.otherPhotos p {
    font-size: 36px;
    font-weight: 600;
    color: #291507;
    margin-bottom: 1.5rem;
}

.mainPicContainer {
    position: relative;
    height: fit-content;
}

.decoration {
    position: absolute;
    background-color: #DEC68B;
    width: 100%;
    height: 80%;
    bottom: 0;
    top: 0;
    margin: auto;
    left: -15px;
    border-radius: 14px;
    z-index: -1;
}


@media (max-width: 500px) {
    .top {
        grid-template-columns: 1fr;
    }

    .photos {
        display: flex;
        flex-wrap: wrap;
    }

    .photos img {
        width: 100%;
        aspect-ratio: 1/1;
    }
}
</style>