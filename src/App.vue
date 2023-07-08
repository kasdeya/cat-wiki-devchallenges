<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect, type Ref } from 'vue'
import apiService from './api/apiService'
import CatInfo from './components/CatInfo.vue';
import TopTen from './components/TopTen.vue';

let searchTerm = ref('')
let breedsList = ref()
let topTenEnabled = ref(false)
let breedSelected = ref(false)
const isMobileResolution = ref(false)

const checkResolution = () => {
  isMobileResolution.value = window.innerWidth <= 500
}

interface Breed {
  searches: number
}

onMounted(async () => {
  const response = await apiService.getBreeds();
  // console.log(response.data)
  breedsList.value = response.data
  breedsList.value.forEach((element: Breed) => {
    element.searches = Math.floor(Math.random() * (70 - 1) + 1)
  });
fetchImageUrls();
window.addEventListener('resize', checkResolution)
checkResolution()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkResolution)
})

const discoverBreeds = computed(() => {
  if (!breedsList.value) {
    return []; // Return an empty array if breedsList is undefined or null
  }
  let arr = [breedsList.value[0], breedsList.value[10], breedsList.value[20], breedsList.value[40]]

  // return breedsList.value.slice(0, 4);
  return arr
});

const imageUrls = ref(['']);

// Asynchronous function to fetch and populate the image URLs
const fetchImageUrls = async () => {
  const urls = [];

  // Iterate over the discoverBreeds array
  for (const breed of discoverBreeds.value) {
    const response = await apiService.getSingleImage(breed.id);
    const data = response.data.map(res => res.url);
    urls.push(...data);
  }

  // Update the reactive variable with the image URLs
  imageUrls.value = urls;
};

watchEffect(() => {
  discoverBreeds.value; // Trigger the computed property to update when breedsList changes
  const urls = imageUrls.value;
});


const searchBreeds = computed(() => {
  if (searchTerm.value === '') return []

  let matches = 0

  return breedsList.value.filter((breed: any) => {
    if (
      breed.name.toLowerCase().includes(searchTerm.value.toLowerCase()) && matches < 10
    ) {
      matches++
      return breed
    }
  })
})

let selectedBreed = ref({})
const selectBreed = (breed: any) => {
  selectedBreed.value = breed
  searchTerm.value = ''
  breedSelected.value = true
}

type ModalDialog = HTMLDialogElement | null
const openButton: Ref<HTMLButtonElement | null> = ref(null)
const modal: Ref<ModalDialog> = ref(null)
const modalDelete: Ref<ModalDialog> = ref(null)

  const openModal = () => {
    if (modal.value && isMobileResolution.value) {
      modal.value.showModal()
    }
  }

  const closeModal = () => {
    if (modal.value) {
      modal.value.close()
    }
  }

</script>

<template>
  <div className="header">
    <img src="/CatwikiLogo.svg" alt="" srcset="" />
  </div>
  <div v-if="Object.keys(selectedBreed).length > 0">
    <CatInfo :selected="selectedBreed" />
  </div>

  <div v-if="topTenEnabled">
    <TopTen :breeds="breedsList" />
  </div>

  <div class="cont" v-if="!topTenEnabled && !breedSelected">
  

  <div className="hero">
    <img class="heroBackground" src="/HeroImagesm.png" alt="">
    <div class="heroContent">
      <img className="white heroLogo" src="/CatwikiLogo.svg" alt="" srcset="" />
      <p>Get to know more about your cat breed</p>
      <input class="breedSearchInput" type="text" v-model="searchTerm" @click="openModal" />
      <div class="scrollContainer">

        <dialog ref="modal" class="modal" @close="closeModal" >
          <button @click="closeModal"><img src="/Close.svg" alt=""></button>
         <input class="breedSearchInput" type="text" v-model="searchTerm"/>
         <ul>
          <li v-for="(breed, index) in searchBreeds" :key="breed.name" @click="selectBreed(breed)">
          {{ breed.name }}
        </li>
         </ul>
        </dialog>

      <div class="autoComplete" v-if="searchBreeds.length && !isMobileResolution">
      <ul>
        <!-- <li>
          Showing {{ searchBreeds.length }} of {{ breedsList.length }} results
        </li> -->
        <li v-for="(breed, index) in searchBreeds" :key="breed.name" @click="selectBreed(breed)">
          {{ breed.name }}
        </li>
      </ul>
      </div>


      </div>
    </div>
  </div>
  <div class="heroBottom">
    <p class="mostSearched">Most Searched Breeds</p>
    <div class="seeMore">
    <p>66+ Breeds For you to discover</p>
    <button @click="topTenEnabled = true">See more →</button>
    </div>
    <div class="mostSearchedBreeds">
      <div class="mostSearchedImgCont" v-for="(item, index) in discoverBreeds" :key="index">
        <div class="imgCont">
          <div :class="{ 'decoration': index === 0 }"></div>        
          <img class="mostSearchedImg" :src="imageUrls[index]">
        </div>
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>

  <div class="content">
    <div class="leftContent">
      <p>Why should you have a cat?</p>
      <p style="font-weight: 500;">
        Having a cat around you can actually trigger the release of calming chemicals in your body
        which lower your stress and anxiety levels
      </p>
      <a href="">Read more</a>
    </div>
    <div class="collage">
      <img src="/image 2.png" alt="" />
      <img src="/image 1.png" alt="" />
      <img src="/image 3.png" alt="" />
    </div>
  </div>


  </div>

  <footer>
    <img className="white" src="/CatwikiLogo.svg" />
    <p>© created by username - devChallenge.io 2023</p>
  </footer>
</template>

<style>
#app {
  width: 69%;
  margin: auto;
}

.hero {
  position: relative;
}

.heroBackground {
  width: 100%;
  height: 100%;
  display: block;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
}

.heroContent {
  margin-left: 10%;
  height: 100%;
  gap: 1rem;
  color: white;
  position: absolute;
  width: 30%;
  bottom: -25%;
}

.heroLogo {
  align-self: start;
  width: 75%;
}

.cont {
  margin-top: 1.5rem;
}

.heroContent input {
  margin-top: 2rem;
  width: 100%;
}

.white {
  filter: brightness(0) invert(1);
}

.heroBottom {
  background-color: #e3e1dc;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  padding: 2rem 4rem;
  color: #291507;
}

footer {
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 2rem;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  margin-bottom: -4px;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 3rem 2rem;
  gap: 2rem;
  color: #291507;
}

.collage {
  width: 100%;
  columns: 2;
  column-gap: 1rem !important;
  text-align: right;
  text-align-last: left;
}

.collage img {
  margin-bottom: 1rem;
  width: 100%;
}

.collage img:nth-child(2) {
  width: 75%;
}

.mostSearchedImg {
  object-fit: cover;
  width: 100%;
  object-position: center;
  border-radius: 24px;
  aspect-ratio: 1/1;
  position: relative;
  z-index: 3;
}

.mostSearchedBreeds {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 2rem;
}

.seeMore {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 58px;
  padding-top: 2rem;
}

.seeMore p {
  font-size: 48px;
  font-weight: 700;
  color: #291507;
  width: 50%;
}

.seeMore button {
  background-color: transparent;
  border: transparent;
  font-size: 18px;
  text-transform: uppercase;
  font-weight: 700;
  cursor: pointer;
  color: rgba(41, 21, 7, 0.6);
}

.seeMore button:hover {
  color: rgba(41, 21, 7, 1);
}

.leftContent {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: center;
}

.leftContent p:nth-child(1) {
  font-size: 48px;
  font-weight: 700;
  color: #291507;
}

.autoComplete {
  background-color: white;
  color: black;
  padding: 1rem;
  /* border-radius: 24px; */
  height: 13rem;
  /* overflow-y: scroll; */
  overflow: auto;
}

.autoComplete ul {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.autoComplete ul li {
  font-weight: 500;
  font-size: 18px;
  cursor: pointer;
  padding: 1rem;
}

.autoComplete ul li:hover {
  background-color: rgba(151, 151, 151, 0.1);
;
}

.breedSearchInput {
  padding: 22px;
  font-size: 18px;
  border-radius: 59px;
  border: 1px solid black;
}

.header {
  margin-top: 1.5rem;
}

.imgCont {
  position: relative;
}

.decoration {
  position: absolute;
  height: 80%;
  width: 100%;
  background-color: #DEC68B;
  left: -15px;
  top: 0;
  bottom: 0;
  margin: auto;
  border-radius: 14px;
  z-index: 1;
}

.mostSearchedImgCont p {
  font-weight: 600;
  font-size: 18px;
  color: #291507;
  padding: 1.5rem 0;
}

.mostSearched {
  font-weight: 500;
}

.scrollContainer {
  overflow: hidden;
  position: relative;
  border-radius: 24px;
  margin-top: 1rem;
}

dialog {
  min-width: 100vw;
  height: 100vw;
  padding: 1rem 1rem;
  border: transparent;
}

dialog ul {
  margin-top: 2rem;
  list-style: none;
  padding: 0;
}

dialog ul li {
  padding: 1rem 0;
  -webkit-tap-highlight-color: rgba(151,151,151, 0.1);
  cursor: pointer;
}

dialog button {
  width: 40px;
  height: 40px;
  border: transparent;
  border-radius: 8px;
  background-color: rgba(151, 151, 151, 0.1);
  cursor: pointer;
  float: right;
  margin-bottom: 1rem;
}

@media (max-width: 500px) {
  #app {
    width: 90%;
  }

  .hero {
    /* background-image: url('/HeroImagesm.png'); */
    /* background-size: contain; */
  }

  .heroContent p {
    font-size: 10px;
  }
  
  .breedSearchInput {
    font-size: 12px;
    padding: .5rem;
    margin-top: 1rem !important;
  }

  .autoComplete {
    height: 5rem;
  }

  .autoComplete ul li {
    font-size: 12px;
  }

  .seeMore p {
    font-size: 18px;
  }

  .heroBottom {
    padding: 2rem;
  }

  .mostSearchedBreeds {
    grid-template-columns: 1fr 1fr !important;
  }

  .content {
    grid-template-columns: 1fr;
    padding: 3rem 0;
  }
}
</style>
