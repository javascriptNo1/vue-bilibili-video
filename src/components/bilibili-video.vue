<template>
    <div class="videoBox">
      <video ref="videoExample"
             width="666px"
             height="500px"
             src="../assets/videos/1-1导学.mp4">
      </video>
      <div class="conent">
        <img @click="aply" ref="playbut" class="videobut" src="../assets/images/play.svg" alt="">
        <img @click="aply" style="display: none" ref="stopbut" class="videobut" src="../assets/images/stop.svg" alt="">
        <img class="videobut" src="../assets/images/next.svg" alt="">
        <span class="Progress"></span>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    url: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      playState: false
    }
  },
  mounted () {
  },
  methods: {
    aply () {
      if (!this.playState) {
        this.playState = true
        this.$refs.videoExample.play()
        this.$refs.stopbut.style.display = 'inline'
        this.$refs.playbut.style.display = 'none'
      } else {
        this.playState = false
        this.$refs.videoExample.pause()
        this.$refs.playbut.style.display = 'inline'
        this.$refs.stopbut.style.display = 'none'
      }
    }
  }
}
</script>

<style scoped>
.videoBox{
  position: relative;
  background-color: #000;
  width: 666px;
  margin: 0 auto;
}
.conent{
  width: 100%;
  height: 50px;
  position: absolute;
  left: 0;
  bottom: 5px;
}
.videobut{
  cursor: pointer;
  width: 50px;
}
.Progress{
  display: inline-block;
  width: 400px;
  height: 8px;
  border-radius: 4px;
  background-color: #666;
}

</style>
