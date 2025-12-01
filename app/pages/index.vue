<script setup>
import { ref } from 'vue';
const message = ref('');
const width = ref(300);
const darkColor = ref('#000000');
const lightColor = ref('#ffffff');
const margin = ref(1);
const valid = ref(false);
const qrcodeData = ref(null);
const pending = ref(false);

async function submit() {
  pending.value = true;
  try {
    const response = await $fetch('/api/encode', {
      method: 'POST',
      body: {
        message: message.value,
        width: width.value,
        margin: margin.value,
        color: {
          dark: darkColor.value,
          light: lightColor.value,
        },
      },
    })
    qrcodeData.value = response;
  } catch (error) {
    console.error('Error generating QR Code:', error);
  } finally {
    pending.value = false;
  }
}

</script>
<template>
  <v-container>
    <v-form validate-on="submit" @submit.prevent @submit="submit" v-model="valid">
      <v-text-field
        v-model="message"
        label="Message to encode"
        autofocus
        :rules="[
          v => !!v || 'Message is required',
          v => (v && v.length <= 1000) || 'Message must be less than 1000 characters',
        ]"
      >
        <template #append>
          <v-btn color="primary" type="submit"> Generate QRCode </v-btn>
        </template>
      </v-text-field>

      <v-spacer />

      <v-expansion-panels>
        <v-expansion-panel>
          <template #title> Advanced Options </template>
          <template #text>
            <div>
              <!-- width, lightcolor, darkcolor -->
              <v-number-input
                v-model="width"
                label="Width (px)"
                :min="10"
                :max="1000"
              />
              <v-number-input
                v-model="margin"
                label="Margin"
                :min="0"
                :max="10"
              />
              <v-color-input
                v-model="darkColor"
                label="Dark Color"
              />
              <v-color-input
                v-model="lightColor"
                label="Light Color"
              />
            </div>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
    <v-progress-circular v-if="pending" indeterminate color="primary" />
    <img v-if="qrcodeData" :src="qrcodeData" alt="QR Code" />
  </v-container>
</template>
