<template>
  <div class="c-menu" :class="{ '-active': value }">
    <div class="overlay" @click="hideMenu" />
    <div class="list">
      <div class="item" @click="showSettingDialog">
        <g-Icon color="front" :size="24">settings</g-Icon>
        <div class="text">設定</div>
      </div>
      <div class="item" @click="showAboutCapacityDialog">
        <g-Icon color="front" :size="24">help</g-Icon>
        <div class="text">インスタンスの最大人数に関して</div>
      </div>
    </div>
    <div class="dialogs">
      <SettingDialog v-if="isVisibleSettingDialog" @close="hideSettingDialog" />

      <g-Dialog
        v-if="isVisibleAboutCapacityDialog"
        title="インスタンスの最大人数に関して"
      >
        <template v-slot:content>
          <g-MarkdownText
            :markdownText="
              `インスタンスの現在人数及び最大人数は、「現在人数 / 最大人数」という形でインスタンスのサムネイル右肩に表記しています。

インスタンスには、ワールドのcapacityの2倍の人数が実際には入れます。（例外として、capacityが1の場合は1人しか入れません）

表記している最大人数は、インスタンスに実際入れる人数を上の基準で計算の上表記しています。
`
            "
          />
        </template>
        <template v-slot:buttonArea>
          <g-Button @click="hideAboutCapacityDialog">閉じる</g-Button>
        </template>
      </g-Dialog>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts" />
<style lang="scss" src="./style.scss" scoped />
