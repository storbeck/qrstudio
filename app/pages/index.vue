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

async function submit () {
  if (!message.value) return;

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
    });

    qrcodeData.value = response;
  } catch (error) {
    console.error('Error generating QR Code:', error);
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <v-layout>
    <!-- LEFT DOCK -->
    <v-navigation-drawer
      permanent
      width="360"
      class="py-4 px-6"
    >
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <h1 class="text-h6 mb-1">QR Studio</h1>
          <p class="text-caption text-medium-emphasis">
            Type a message to generate a custom QR code.
          </p>
        </div>
      </div>

      <v-divider class="mb-4" />

      <v-form
        validate-on="submit"
        v-model="valid"
        @submit.prevent="submit"
        class="d-flex flex-column gap-4 qr-dock-form"
      >
        <!-- Message -->
        <div>
          <span class="text-caption text-medium-emphasis">Content*</span>
          <v-textarea
            v-model="message"
            label="Message to encode"
            density="comfortable"
            auto-grow
            rows="4"
            counter="1000"
            :rules="[
              v => !!v || 'Message is required',
              v => (v && v.length <= 1000) || 'Message must be less than 1000 characters',
            ]"
          />
        </div>

        <!-- Basic sizes -->
        <div>
          <span class="text-caption text-medium-emphasis">Size</span>
          <div class="d-flex flex-column gap-2">
            <v-number-input
              v-model="width"
              label="Width (px)"
              :min="64"
              :max="1024"
              hide-details="auto"
            />
            <v-number-input
              v-model="margin"
              label="Margin"
              :min="0"
              :max="20"
              hide-details="auto"
            />
          </div>
        </div>

        <!-- Colors -->
        <div class="mt-4">
          <span class="text-caption text-medium-emphasis">Colors</span>
          <div class="d-flex flex-column gap-2">
            <v-color-input
              v-model="darkColor"
              label="Dark"
              hide-details="auto"
              :color-pip="true"
              :hide-actions="true"
            />
            <v-color-input
              v-model="lightColor"
              label="Light"
              hide-details="auto"
              :color-pip="true"
              :hide-actions="true"
            />
          </div>
        </div>

        <v-spacer />

        <v-btn
          color="primary"
          class="mt-6"
          block
          type="submit"
          :loading="pending"
          :disabled="pending"
        >
          Generate QR Code
        </v-btn>
      </v-form>
    </v-navigation-drawer>

    <!-- RIGHT PREVIEW AREA -->
    <v-main class="qr-main">
      <v-container
        class="fill-height d-flex align-center justify-center"
        fluid
      >
        <div class="qr-preview-surface">
          <div class="qr-preview-inner">
            <v-progress-circular
              v-if="pending"
              indeterminate
              color="primary"
              size="40"
            />
            <template v-else>
              <img
                v-if="qrcodeData"
                :src="qrcodeData"
                alt="QR Code"
                :style="{ width: width + 'px', height: width + 'px' }"
              />
              <div
                v-else
                class="text-body-2 text-medium-emphasis text-center"
              >
                Your QR code preview will appear here.
                <br />
                Enter a message in the left dock and click
                <strong>Generate QR Code</strong>.
              </div>
            </template>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-layout>
</template>