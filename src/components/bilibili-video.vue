<template>
    <div class="videoBox">
      <video @click="aply" @timeupdate="timeupdate" @loadedmetadata="loadedmetadata" ref="videoExample"
             width="666px"
             height="500px"
             src="../assets/videos/1-1导学.mp4">
      </video>
      <div class="conent">
        <img @click="aply" ref="playbut" class="videobut" src="../assets/images/play.svg" alt="">
        <img @click="aply" style="display: none" ref="stopbut" class="videobut" src="../assets/images/stop.svg" alt="">
        <img class="videobut" src="../assets/images/next.svg" alt="">
        <span ref="progress" @click="onclickprogress" class="Progress">
          <span ref="buffer" class="buffer "></span>
          <span ref="completed" class="completed "></span>
          <span ref="read" @mousedown="onMoveReadin" class="readIn"></span>
        </span>
        <p class="times">
          <span>{{current}}</span>
          /
          <span v-if="loaded">{{timelengths}}</span>
        </p>
        <p class="selest" @click="onshowselestlist">选集</p>
      </div>
      <div class="selestlist" ref="selestlist">
        <ul>
          <li v-for="(itme, index) in url" :key="index" @click="onchoice" :data-url="itme">{{index+1}}</li>
        </ul>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    url: {
      type: Array,
      default: function () {
        return [
          'http://www.1ecst.com/tp_ecst/Public//upload/template/videos/2018-06-13/1528891973_1754596351.mp4',
          '../assets/videos/1-1导学.mp4'
        ]
      }
    }
  },
  data () {
    return {
      playState: false,
      readx: 1,
      readlength: '0%',
      loaded: false,
      current: '00:00',
      timelengths: '00:00'
    }
  },
  mounted () {
    let _this = this
    document.body.addEventListener('mouseup', () => {
      document.body.removeEventListener('mousemove', this.MoveReadin)
    })
    this.$refs.videoExample.onended = () => {
      _this.playState = false
      _this.$refs.stopbut.style.display = 'none'
      _this.$refs.playbut.style.display = 'inline'
    }
    this.$refs.videoExample.addEventListener('loadedmetadata', () => {
      let s = Number.parseInt(this.$refs.videoExample.duration)
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
      this.timelengths = m + ':' + s
    })
    this.$refs.videoExample.addEventListener('progress', () => {
      if (this.$refs.videoExample.buffered.length >= 1) {
        this.$refs.buffer.style.width = (this.$refs.videoExample.buffered.end(0) / Number.parseInt(this.$refs.videoExample.duration) * 100) + '%'
      }
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
      if (s >= 60) {
        s = s % 60
      }
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
      this.$refs.read.style.left = (Number.parseFloat(readlength) - 1) + '%'
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
    },
    onshowselestlist () {
      let sele = this.$refs.selestlist.style.right
      if (sele === '' || sele === '-250px') {
        this.$refs.selestlist.style.right = '0px'
      } else {
        this.$refs.selestlist.style.right = '-250px'
      }
    },
    onchoice (e) {
      this.$refs.videoExample.src = e.target.getAttribute('data-url')
      this.onshowselestlist()
      this.playState = true
      this.$refs.videoExample.play()
      this.$refs.stopbut.style.display = 'inline'
      this.$refs.playbut.style.display = 'none'
    }
  }
}
</script>

<style scoped>
.videoBox{
  position: relative;
  background-color: #000;
  width: 680px;
  margin: 0 auto;
  overflow: hidden;
}
.videoBox video{
  cursor: pointer;
}
.conent{
  background-color: #fff;
  width: 100%;
  height: 50px;
  /*position: absolute;*/
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
  background-color: #e5e9ef;
  margin-right: 10px;
}
.times{
  font-size: 16px;
}
.completed{
  display: block;
  width: 0px;
  height: 8px;
  border-radius: 4px;
  background-color: #00a1d6;
  position: absolute;
  top: 0px;
}
.buffer{
  display: block;
  width: 0px;
  height: 8px;
  border-radius: 4px;
  background-color: #8adced;
}
.readIn{
  cursor: pointer;
  position: absolute;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background: #fff;
  left: -1%;
  top: -3px;
  box-shadow: 0 0 3px #017cc3;
}
.selest{
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
  margin-top: 14px;
}
.selestlist{
  height: 80%;
  width: 250px;
  position: absolute;
  background: #0000005e;
  top: 60px;
  right: -250px;
  transition: all .5s;
}
.selestlist ul{
  list-style: none;
  margin: 0px;
  margin-left: -30px;
}
.selestlist ul li{
  float: left;
  width: 50px;
  height: 50px;
  color: #fff;
  background-color: #0000005e;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  margin: 5px;
}
.selestlist ul li:hover{
  background-color: #0000009e;
}
</style>
