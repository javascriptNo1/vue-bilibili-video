<template>
    <div class="videoBox" ref="videoBox">
      <video @timeupdate="timeupdate" @loadedmetadata="loadedmetadata" ref="videoExample"
             width="666px"
             height="500px"
             src="../assets/videos/1-1导学.mp4">
      </video>
      <div class="conent" ref="conent">
        <i @click="aply" ref="playbut" class="videobut iconfont icon-bofang"></i>
        <i @click="aply" style="display: none" ref="stopbut" class="videobut iconfont icon-zanting"></i>
        <i class="videobut iconfont icon-ai09"></i>
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
        <!--<p class="selest" @click="onshowselestlist">选集</p>-->
        <div class="volume">
          <i @click="onvolume" ref="volumemute" class="iconfont icon-xiaolaba volumerico"></i>
          <div class="volumecontrol">
            <span class="volumesum">{{volumesum}}</span>
            <p @click="onvolumecontrol" ref="volumecontrol">
              <span ref="volumereadin" @click="onstoppropagation" @mousedown="onvolumereadin" class="volumereadin readIn"></span>
              <span ref="volumeprogress" class="volumeprogress"></span>
            </p>
          </div>
        </div>
        <i @click="onallscreen" ref="allscreen" class="iconfont icon-quanping allscreen"></i>
      </div>
      <!--<div class="selestlist" ref="selestlist">-->
        <!--<ul>-->
          <!--<li v-for="(itme, index) in url" :key="index" @click="onchoice" :data-url="itme">{{index+1}}</li>-->
        <!--</ul>-->
      <!--</div>-->
      <div @click="onvideoaply" class="barrage">
        <div>测试弹幕</div>
      </div>
    </div>
</template>

<script>
import '../mock/barragedata'
import axios from 'axios'
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
      Totallength: 500,
      loaded: false,
      current: '00:00',
      timelengths: '00:00',
      volumereadiny: 1,
      volumereadintop: '85%',
      volumerlength: 50,
      volumesum: 50,
      volumes: 0.5,
      barragedata: [],
      second: 1
    }
  },
  mounted () {
    let _this = this
    document.body.addEventListener('mouseup', () => {
      document.body.removeEventListener('mousemove', this.MoveReadin)
      document.body.removeEventListener('mousemove', this.volumereadin)
    })
    document.body.addEventListener('keydown', (event) => {
      if (event.keyCode === 27) {
        setTimeout(() => {
          this.$refs.videoExample.width = '666'
          this.$refs.videoExample.height = '500'
          this.$refs.videoExample.style.position = 'static'
          this.$refs.conent.style.position = 'absolute'
        }, 2000)
      }
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
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 32) {
        this.aply()
      }
    })
    window.onresize = () => {
      if (!this.checkFull()) {
        this.$refs.allscreen.className = this.$refs.allscreen.className.replace('icon-tuichuquanping1', 'icon-quanping')
        this.$refs.videoExample.width = '666'
        this.$refs.videoExample.height = '500'
        this.$refs.videoExample.style.position = 'static'
        this.$refs.conent.style.position = 'absolute'
        this.$refs.progress.style.width = 400 + 'px'
        this.Totallength = 400
      }
    }
    this.$refs.videoExample.volume = 0.5
    axios.post('barrage.php')
      .then((respone) => {
        this.barragedata = respone.data.list
      })
  },
  methods: {
    checkFull () {
      var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
      if (isFull === undefined) isFull = false
      return isFull
    },
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
      this.readlength = (this.readleft + ((event.clientX - this.readx) / this.Totallength) * 100)
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
      // 弹幕
      for (let i = 0; i < this.barragedata.length; i++) {
        if (Number.parseInt(this.$refs.videoExample.currentTime) === this.barragedata[i].date) {
          let html = `<div style="color: ${this.barragedata[i].color}">${this.barragedata[i].constent}</div>`
          console.log(html)
        }
      }
      let s = lent.split('.')[1]
      if (s >= 60) {
        s = s % 60
      }
      this.calculateschedule()
      this.readlength = (Number.parseInt(this.$refs.videoExample.currentTime) / Number.parseInt(this.$refs.videoExample.duration) * 100) + '%'
      this.setreadlength(this.readlength, true)
      if (this.$refs.videoExample.buffered.length >= 1) {
        this.$refs.buffer.style.width = (this.$refs.videoExample.buffered.end(0) / Number.parseInt(this.$refs.videoExample.duration) * 100) + '%'
      }
    },
    onclickprogress (event) {
      let lef = event.clientX - this.getOffsetLeft(this.$refs.progress)
      this.readlength = ((lef / this.Totallength) * 100) + '%'
      this.setreadlength(this.readlength)
    },
    setreadlength (readlength, item) {
      this.$refs.read.style.left = (Number.parseFloat(readlength) - 1) + '%'
      this.$refs.completed.style.width = readlength
      let itemlength = this.$refs.videoExample.duration
      if (!item) {
        this.$refs.videoExample.currentTime = itemlength * (Number.parseFloat(readlength) / 100)
        this.calculateschedule()
      }
    },
    calculateschedule () {
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
    getOffsetTop (obj) {
      let tmp = obj.offsetTop
      let val = obj.offsetParent
      while (val != null) {
        tmp += val.offsetTop
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
    },
    onvideoaply () {
      this.aply()
      // this.$refs.selestlist.style.right = '-250px'
    },
    onvolume (e) {
      let classname = e.target.className
      if (classname.indexOf('xiaolaba') !== -1) {
        e.target.className = classname.replace('icon-xiaolaba', 'icon-jingyin')
        this.volumes = this.$refs.videoExample.volume
        this.$refs.videoExample.volume = 0
        this.$refs.volumereadin.style.top = '100px'
        this.volumesum = 0
        this.$refs.volumeprogress.style.height = '0%'
      } else {
        e.target.className = classname.replace('icon-jingyin', 'icon-xiaolaba')
        this.$refs.videoExample.volume = this.volumes
        let tops = 100 - this.volumerlength
        if (tops <= 0) {
          tops = 0
        }
        this.$refs.volumereadin.style.top = tops + 'px'
        this.volumesum = this.volumerlength
        this.$refs.videoExample.volume = this.volumerlength / 100
        this.$refs.volumeprogress.style.height = this.volumerlength + '%'
      }
    },
    onvolumereadin (event) {
      this.volumereadiny = event.clientY
      this.volumereadintop = Number.parseFloat(this.volumerlength) || 50
      document.body.addEventListener('mousemove', this.volumereadin)
    },
    onstoppropagation (event) {
      event.stopPropagation()
    },
    volumereadin (event) {
      this.volumerlength = (this.volumereadintop + ((this.volumereadiny - event.clientY)))
      if (this.volumerlength <= 0) {
        this.volumerlength = 0
        this.$refs.volumemute.className = this.$refs.volumemute.className.replace('icon-xiaolaba', 'icon-jingyin')
        this.$refs.videoExample.volume = 0
      } else if (this.volumerlength >= 100) {
        this.volumerlength = 100
      } else {
        this.$refs.volumemute.className = this.$refs.volumemute.className.replace('icon-jingyin', 'icon-xiaolaba')
      }
      this.$refs.volumeprogress.style.height = (Number.parseFloat(this.volumerlength)) + '%'
      let tops = 100 - this.volumerlength
      if (tops <= 0) {
        tops = 0
      }
      this.$refs.volumereadin.style.top = tops + 'px'
      this.volumesum = this.volumerlength
      this.$refs.videoExample.volume = this.volumerlength / 100
    },
    onvolumecontrol (event) {
      let top = (event.clientY - this.getOffsetTop(this.$refs.volumecontrol))
      this.volumerlength = 100 - top
      this.$refs.volumereadin.style.top = top + 'px'
      this.volumesum = this.volumerlength
      this.$refs.videoExample.volume = (this.volumerlength) / 100
      this.$refs.volumeprogress.style.height = (Number.parseFloat((this.volumerlength))) + '%'
    },
    onallscreen () {
      if (this.$refs.videoExample.width !== window.innerWidth) {
        let de = document.documentElement
        if (de.requestFullscreen) {
          de.requestFullscreen()
        } else if (de.mozRequestFullScreen) {
          de.mozRequestFullScreen()
        } else if (de.webkitRequestFullScreen) {
          de.webkitRequestFullScreen()
        }
        this.$refs.allscreen.className = this.$refs.allscreen.className.replace('icon-quanping', 'icon-tuichuquanping1')
        setTimeout(() => {
          this.$refs.videoExample.width = window.innerWidth
          this.$refs.videoExample.height = window.innerHeight
          this.$refs.videoExample.style.position = 'fixed'
          this.$refs.conent.style.position = 'fixed'
          this.$refs.conent.style.bottom = '0'
          this.$refs.progress.style.width = (window.innerWidth - 400) + 'px'
          this.Totallength = window.innerWidth - 400
        }, 20)
      } else {
        let de = document
        if (de.exitFullscreen) {
          de.exitFullscreen()
        } else if (de.mozCancelFullScreen) {
          de.mozCancelFullScreen()
        } else if (de.webkitCancelFullScreen) {
          de.webkitCancelFullScreen()
        }
        this.$refs.allscreen.className = this.$refs.allscreen.className.replace('icon-tuichuquanping1', 'icon-quanping')
        this.$refs.videoExample.width = '666'
        this.$refs.videoExample.height = '500'
        this.$refs.videoExample.style.position = 'static'
        this.$refs.conent.style.position = 'absolute'
        this.$refs.progress.style.width = 400 + 'px'
        this.Totallength = 400
      }
    }
  }
}
</script>

<style scoped>
@import "../assets/fonts/videofont/iconfont.css";
.videoBox{
  position: relative;
  background-color: #000;
  width: 680px;
  margin: 0 auto;
  border: 1px solid #fffc;
}
.videoBox video{
  cursor: pointer;
  top: 0;
  left: 0;
}
.conent{
  background-color: #fff;
  width: 100%;
  height: 35px;
  line-height: 35px;
  position: absolute;
  left: 0;
  /*bottom: 5px;*/
  display: flex;
  align-items: center;
}
.conent i{
  font-size: 25px;
  width: 40px;
  color: #dbdbdb;
  cursor: pointer;
}
.conent i:hover{
  color: #6d6d6d;
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
  margin-left: 10px;
}
.times{
  font-size: 16px;
}
.times span{
  display: inline-block;
  width: 40px;
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
.conent .allscreen{
  font-size: 20px;
  position: absolute;
  right: 0px;
}
.selest{
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
  margin-top: 14px;
}
.volume{
  position: relative;
  margin-left: 10px;
}
.volume:hover .volumecontrol{
  display: block;
}
.volume .volumecontrol{
  display: none;
  /*padding-top: 10px;*/
  font-size: 14px;
  position: absolute;
  height: 140px;
  width: 30px;
  border-radius: 10px;
  background-color: #fff;
  bottom: 30px;
  left: -5px;
}
.volume .volumecontrol p{
  width: 8px;
  height: 100px;
  background: #e5e9ef;
  margin: -10px auto;
  position: relative;
  cursor: pointer;
}
.volume .volumecontrol p .volumereadin{
  left: -4px;
  top: 40px;
  position: absolute;
  z-index: 10;
}
.volume .volumecontrol p .volumeprogress{
  width: 8px;
  height: 50%;
  background: #00a1d6;
  display: block;
  position: absolute;
  bottom: 0px;
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
.barrage{
  cursor: pointer;
 position: absolute;
 width: 100%;
 height: 100%;
  top: 0px;
  overflow: hidden;
}
.barrage div{
  text-align: left;
 position: absolute;
  transition: all 3s;
  left: 700px;
  width: 100%;
}
</style>
