<template>
    <div class="videoBox">
      <video @timeupdate="timeupdate" @loadedmetadata="loadedmetadata" ref="videoExample"
             width="666px"
             height="500px"
             src="../assets/videos/1-1导学.mp4">
      </video>
      <div class="conent">
        <img @click="aply" ref="playbut" class="videobut" src="../assets/images/play.svg" alt="">
        <img @click="aply" style="display: none" ref="stopbut" class="videobut" src="../assets/images/stop.svg" alt="">
        <img class="videobut" src="../assets/images/next.svg" alt="">
        <span ref="progress" @click="onclickprogress" class="Progress">
          <span ref="completed" class="completed "></span>
          <span ref="read" @mousedown="onMoveReadin" class="readIn"></span>
        </span>
        <p>
          <span>{{current}}</span>
          /
          <span v-if="loaded">{{timelength}}</span>
        </p>
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
      playState: false,
      readx: 1,
      readlength: '0%',
      loaded: false,
      current: '00:00'
    }
  },
  mounted () {
    document.body.addEventListener('mouseup', () => {
      document.body.removeEventListener('mousemove', this.MoveReadin)
    })
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
    },
    onMoveReadin (e) {
      this.readx = e.clientX
      this.readleft = Number.parseFloat(this.readlength) || 0
      document.body.addEventListener('mousemove', this.MoveReadin)
    },
    MoveReadin (event) {
      this.readlength = (this.readleft + ((event.clientX - this.readx) / 400) * 100)
      if (this.readlength <= 0) {
        this.readlength = 0
      } else if (this.readlength >= 100) {
        this.readlength = 100
      }
      this.setreadlength(this.readlength + '%')
    },
    loadedmetadata () {
      this.loaded = true
    },
    timeupdate () {
      let lent = (this.$refs.videoExample.currentTime / 60).toString().substring(0, 4)
      let s = lent.split('.')[1]
      // let m = Number.parseInt(lent.split('.')[0]) + Math.floor(s / 60)
      if (s >= 60) {
        s = s % 60
      }
      // this.current = lent
      // console.log(this.$refs.videoExample.currentTime)
      setTimeout(() => {
        let s = Number.parseInt(this.$refs.videoExample.currentTime)
        let m = Number.parseInt(s / 60)
        if (s >= 60) {
          s = s % 60
        }
        if (s < 10) {
          s = '0' + s
        }
        if (m < 10) {
          m = '0' + m
        }
        this.current = m + ':' + s
      }, 1000)
      this.readlength = (Number.parseInt(this.$refs.videoExample.currentTime) / Number.parseInt(this.$refs.videoExample.duration) * 100) + '%'
      this.setreadlength(this.readlength, true)
    },
    onclickprogress (event) {
      let lef = event.clientX - this.getOffsetLeft(this.$refs.progress)
      this.readlength = ((lef / 400) * 100) + '%'
      this.setreadlength(this.readlength)
    },
    setreadlength (readlength, item) {
      this.$refs.read.style.left = readlength
      this.$refs.completed.style.width = readlength
      let itemlength = this.$refs.videoExample.duration
      if (!item) {
        this.$refs.videoExample.currentTime = itemlength * (Number.parseFloat(readlength) / 100)
      }
    },
    getOffsetLeft (obj) {
      let tmp = obj.offsetLeft
      let val = obj.offsetParent
      while (val != null) {
        tmp += val.offsetLeft
        val = val.offsetParent
      }
      return tmp
    }
  },
  computed: {
    timelength () {
      let lent = (this.$refs.videoExample.duration / 60).toFixed(2)
      let s = Number.parseInt(lent.split('.')[1])
      let m = Number.parseInt(lent.split('.')[0]) + Math.floor(s / 60)
      if (s >= 60) {
        s = s % 60
      }
      if (s < 10) {
        s = '0' + s
      }
      return m + ':' + s
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
  display: flex;
  align-items: center;
}
.videobut{
  cursor: pointer;
  width: 50px;
}
.Progress{
  cursor: pointer;
  position: relative;
  width: 400px;
  height: 8px;
  border-radius: 4px;
  background-color: #666;
  margin-right: 20px;
}
.completed{
  display: block;
  width: 0px;
  height: 8px;
  border-radius: 4px;
  background-color: #fff;
}
.readIn{
  cursor: pointer;
  position: absolute;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background: #fff;
  left: 0px;
  top: -3px;
}
</style>
