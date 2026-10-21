<script setup lang="ts">
import HeroSection from '../components/home/HeroSection.vue'
import AboutSection from '../components/home/AboutSection.vue'
import ServicesSection from '../components/home/ServicesSection.vue'
import SpecialistsSection from '../components/home/SpecialistsSection.vue'
import QuickBookingSection from '../components/home/QuickBookingSection.vue'
import MapSection from '../components/home/MapSection.vue'
import FooterSection from '../components/FooterSection.vue'
</script>

<template>
  <main class="home-page">
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <SpecialistsSection />
    <section id="mapa"><MapSection /></section>
    <QuickBookingSection />
    <FooterSection />
  </main>
</template>

<style scoped>
.home-page {
  width: 100%;
  background-color: var(--bg-page);
  display: flex;
  flex-direction: column;
}
</style>