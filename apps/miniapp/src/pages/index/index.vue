<script setup lang="ts">import {ref} from 'vue';import {onShow} from '@dcloudio/uni-app';const last=ref('');onShow(()=>last.value=uni.getStorageSync('lastTool')?.config?.name|| (uni.getStorageSync('lastTool')?'最近随机任务':uni.getStorageSync('recentName')||''));function openLottery(){uni.navigateTo({url:'/pages/event/index'})}function openTool(mode:string){uni.navigateTo({url:'/pages/tool/index?mode='+mode})}function library(tab:string){uni.navigateTo({url:'/pages/library/index?tab='+tab})}function resume(){const task=uni.getStorageSync('lastTool');if(task)uni.navigateTo({url:'/pages/tool/index?mode='+task.config.mode+'&resume=1'});else openLottery()}function preset(mode:string){uni.setStorageSync('pendingTool',{mode,name:({wheel:'今天吃什么',draw:'谁买单',sort:'会议顺序',pair:'两两练习',seat:'课堂排座'} as Record<string,string>)[mode],items:mode==='wheel'?['火锅','烧烤','日料','粤菜','汉堡','面','自助餐']:['A','B','C','D','E','F'],count:mode==='group'?2:1,min:1,max:100,rows:2,cols:3,unique:true});openTool(mode)}function pending(){uni.showModal({title:'尚未迁移',content:'这个入口保留原版设计，功能尚未迁移。当前可使用活动抽奖及快捷随机。',showCancel:false})}function home(){uni.pageScrollTo({scrollTop:0})}function quick(mode:string){const n=Math.random();const values:Record<string,string>={coin:n<.5?'正面':'反面',yesno:n<.5?'是':'否',number:String(1+Math.floor(n*100)),dice:String(1+Math.floor(n*6))};uni.showModal({title:'随机结果',content:values[mode],showCancel:false})}</script>
<template><view id="home" class="screen active home-screen">
  <view class="home-topbar">
    <view class="home-brand">
      <view class="home-brand-mark">R</view>
      <view>
        <view class="home-brand-name">随机一下</view>
        <view class="home-brand-sub">Make a choice, instantly.</view>
      </view>
    </view>
    <button class="home-profile-btn" @click="library('me')" aria-label="我的" title="我的">
      <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAExUlEQVR4nO2af3LTRhTH39qZ5r8GTlBzA+cEUU6QcIA4Mm5n+l+UE2BOEPEfMy1YhAM0nAD5BElPUPcEhP5HB2v7kRrHiixhSd7VDMifmYeeAmh3v29/vd0oaTlbAbBWsxUAazVbAbBWsxUAazVbAbDGGQ7Oj5ToPu49WtTN5PLiPW6jNCbAr67X+3cuz7WIK1+BCgU/dOXFq8CfSQNQnn2enXguDZ/gloaKDd+88wOxDOXYhcZP9JqoF0HlAkQY4lpDYdZ4NvDGWstz3NpQwXNE8HGtwPft8LPrOfO5fMDNY6qUhJ2OhAJRJA5COSJygK3Q7crh74EfigWsCTA88T7wcCSNkk9Ky7googwXTysZi5Y9XtOEk3f+IU/jKMw4RdHvdOXp68C/wi1k5HrH0Vz+wH3ATlf2fwv8G1yjWBFgOPB8oniGm+Y9UTzmuRZ6zxWPI2yJkpeTS9/DM4odAU68UDLjuco4LuhBUwR0xDB2BBh41/SAPu49VL5SWYioeSxRwk7R38czSqVKlWWl8iK3CPCYZ2lyvlFZxDIY/2AMlQ8lMwT2uvLYD/xb3LV4rvfo01w+4qb5hoZAjgBlVoAFo/yVoPQkWgUrAiTrucgF7pKSYziJfsQEmJlDqKiVHSHfNU+c+X2ey1+4D6CwgEYMcQtBvInOyR12u/LERoaoMCuwEgRE8RQ3S0hjhtnG3Ik2wXUki5K39B5XLGBNgKRBkdwgwh6vqzAklObvge1vn3/Xx12F7fNuR/pZwUxhTYCYX1yv/2Uu17i1sbUFXmBVgJhkVxfJFRHe47U8RL7bkeOyu8e6WBcg5q4n+LgHWBmmRN6zGfkFjQiwIOkNc/Eo1VnpEUScn4XkDL7tqKdpVIA08ST5RaQnsCMye2VpkluHwlrNVgDMOnF3/xypA6W1o0V6Isma/whLc4vdKIaDVirc7ehpE8OC8uzBDdCpiB6Llp7UQcmMP8bcGL0VSyjMOKPB+Vkk2qvd8CwI0RHlv768eMmbURRmjDiT+4f9vBY55tU4VPbqR/KIsucKZeCbZkg2OxE5fPmoT7E0B9h66A07HXlqapOksI2JI5+Xwz+AjI7kJ+TiMyya3OLJkgtUR/+/UTrlR/mQSO115NBET9hYgLWN5zibbM4vanQRsRhkk/E8csbrKoZE2FgA8n4/t5JsbU0kM8n2uSiZQlzOCTy82mwkQDLu89PdPzkEdTaNzoKkl82Ts4OfsAeQNO1vMh9sJADRvyYyfdwlRJ5JytmkUnkkYkdcpq72hJDD0kOetVBYLUb5J7dCNlf6BqgqyXBYvTGqdOKcpbYAHH3HBR5haawcXacxXW4tAZIZOufUl8POJ1Vn+6qYLruWAIx9n7F4hruEdZ4Z2ZUGyOsFSsmLN5f+WCpSV4CVyc/m2M+SO/+wLyAA+3iVqCzA3ZL0ETfN34zBnjQIvWAmmWWRpbf0/eOCygKM8tVvrPsvoBcG9MJT3HvqrAaVBcgrmI808jt9abhCczU35rhLauwMqXs16HqhZDK3ujPwJhSsBlOGoiMVqCxAzhCoXKgpssFoZAjE3HU/l/89IyPzqk48pkgm5IgLFy09Gu9XbXxMLQG+J7YCYK1mKwDWarYCYK2m9QL8B1CAAV86rp7BAAAAAElFTkSuQmCC" mode="aspectFit" />
    </button>
  </view>

  <view class="home-hero-v096">
    <view class="hero-orb hero-orb-a"></view>
    <view class="hero-orb hero-orb-b"></view>
    <view class="home-hero-content">
      <view class="home-eyebrow">今天交给随机</view>
      <view class="home-title">少一点纠结，<view/>随机一下。</view>
      <view class="home-intro">从日常选择到正式活动抽奖，都可以快速开始。</view>
      <view class="home-hero-actions">
        <button class="hero-action-main" @click="openLottery">
          <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAD8ElEQVR4nO2bXW7bRhSFz6jNWwMrK4iyAwdJgb5pvIJmB7FWYHcFoldgewV0VtB0BZ68FUiLeAdxVhAZzVvbKN/QNklR0mgo2gFkzQdczjFMXt0580OZloy2nGQAsdV0NsC+zK2mOvBSUp/wTAgn6Y37e/SWdm3si/wVzWvCqpnf6NT9NXLqwNoG2J/zXTp+TFiFMBT6o0buz9GlWmB/yQf6T/l95b9lLQOKzn/VObJPxGG0FztaN6P+OxHLRD3yvx9doFvR2oBiZP7VB2SfaMNEj/R81Ujdd/4m7Q14mX9gWu4i5zF6x1H8fshxHqMLZsFz1FIC+a/89bSh/I78e6hoDBHNzdT3ozOL0ZF+0olzowk/FTCNT2gOiFk4lyIzLYDOZ3RujJylcY21eV9fdLjw3B6zoMVSaGfAi/xM1ztyhdFvFHeCmmPh+Z5HetacqjdT/yOyib+T7GsBGOZNOEbWWXr+Itoa8JmmT9xyxYvVf56hGKl/dIF8SlQsmKp05pzOWM3ySY+1W59ZTajJ/26HuGVCTU9oozBENLzYlKaCNU9HrALQMUvHzpGz9Lh1vR+dCVha+yytHDlLxJ2D/I78Q2QJBkT3K/pEzzoGeCjyLUX+iqwzYXSf0YpZ8pFjn6gw+oPcr1BByP1dDZjQ7BAVj/UkNEU9N0vhUs1rWa+E5zVR54q8g8i8n5F1PmHAQJEYIhoMOKE5ICoaO/QyGKlDRuoYuZrAxlqHnBk5x8g6pxhwSBtFOwOW3QZ7OmQ9n6KCULCj4CFyOfHLakyuTE263AaLKfWlGGGrZczv1BVGTiGmGkhFhLiUIUKsX4Pj/cppfWkZogRXz4PJHwIYxAzbQxUYooQ1PqV58LBHlP0uhScZkAxoGBC5I7eFvSZjrxkjKyJvp23htRyvNUSWJAOSAcmAst+l8CQDkgHJgClNxdYbcP2HyZnuHktRVnV4jy5q010z1b6kgWq0MeBBkgxIBiwzoM1jq02l8bhtxgBP8djreoPqE7ebyFOigh2bYxcseYe0FdxxODp1oXln4QEpec90zQTtmo/LDBGEWeFIPESW1KfQOpAzI+cYWYGpjEymDswtYUwlp1WAlR2hWEexQ2RJMiAZkAxYeV0IcmbkHCMrkgHJgCOKzdSBZEAyIBkwpalIBiQD3pHTKsDKjlCso9ghsiQZkAxIBqy8LgQ5M3KOkRXJgGTAEcVm6sB3M4CrMnXDktOqDo+rhLfqQvNTY/dmwKaQDLgLA5Z95H0zeMN+ta8Aqw3wj8m/Fmtzh9gkrtSTbT4Gb7LSAE/xZYb/ZVkKA20C/pOmP/A/gMaXMhZhiK0mGUBsNckAYqv5Bsx0BW65T+khAAAAAElFTkSuQmCC" mode="aspectFit" />
          活动抽奖
        </button>
        <button class="hero-action-ghost" @click="openTool('wheel')">快速转盘</button>
      </view>
      <view class="hero-feature-row">
        <text>不重复</text><text>权重</text><text>分批开奖</text>
      </view>
    </view>
  </view>

  <view id="continueCard" class="continue-card-v096" v-if="last">
    <view class="continue-icon">
      <image src="data:image/png;base64,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" mode="aspectFit" />
    </view>
    <view class="continue-copy">
      <view class="home-mini-label">继续上次</view>
      <text class="home-strong" id="continueTitle">{{last}}</text>
      <view id="continueMeta" class="muted">继续最近使用的配置</view>
    </view>
    <button class="continue-arrow" @click="resume" aria-label="继续上次">
      <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAB20lEQVR4nO3azUmDQRSF4RtBVwp2olagdmAHCjGbGCEVyGADBvzZGNEOLMHYgXYi6Eohn+esRPK3mZl7kpkHhnzZ5M59ERchLStcDYBTtBoAp2g1AE7RagCcotUAOMmcdy738WLX9xeveJHUwomu3w/b31/2Yo3t4i2nvG1s2uFgED7wTkqSAGenod80doXHP6IR0gRoh6fG7BiP/wlGSBKg1w5HY7NnPE4Si5AkAM38KyChCMkC0DJESBqA1CMkD0DKEbIEINUI2QKQYoSsAUgtQvYApBTBJQCpRHALQAoRXAOQdwT3AOQZQSIAeUWQCUAeEaQCUO4IcgFoUYS7YdjDUxSSAWhehLWWHd4Mw8gikA3QbYdHvJzYFCsfYN7yuPD77UPYxWMU+Dwti5Zf37KDlf0nmHt5wudq8Fie8Nn+vJYnfL4vz+UJM/x4L0+Y40NhecKs/FSWJ8zLS2l5wsx81JYnzM1DcXnC7PRUlyfMT0t5ecId0lFfnnCPNJZhecJd4ut2womNjQEmYKDM8oT7xDfr6ywMk1qecKf4pv1MDoPklifcKz7+UPLn00aN2Q7ecojk8oS7pdM7DQcGsb7ATCFpgGVQA+AUrQbAKVoNgFO0GgCnaMUH+AXGkR9Qd07+fQAAAABJRU5ErkJggg==" mode="aspectFit" />
    </button>
  </view>

  <view class="home-section-head">
    <view>
      <view class="home-section-title">常用工具</view>
      <view class="home-section-desc">最常用的随机方式</view>
    </view>
  </view>

  <view class="home-tool-grid">
    <button class="home-tool-card tool-indigo" @click="openTool('wheel')">
      <view class="home-tool-icon">
        <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAHX0lEQVR4nO2av27bVhSHz1WArmWmrvRUtEskp1NbQNQTWHkBi3qC2EAztYBloJ1aIM4TiPILRBnaVQwQFB0aS1ladDLXTmHXANHtd22LEmX+N5UM0gdc8Fzx6pxzf/dciqStZMvZCUDbanYC0LaanQC0rWYnAO2D4HanllL6wXutHAECW6L1t5h01CstEmLJPaV9rdUbb9y66m8a8tgcTLo5F2krrV0m2OSjwpDYTCvlNUReIsaMjzYCceqHiTta6xMm7UgNkKSvlDpFCF9qBt/1wcRtJj6sa+LrkKwRoo8QgdQEPuvhsDs9Ea0H8iFQanA+bp1i3RlFuxOsuqVlPuTC1aWbilLyH5UxbojyRSSYaz3hGNFQqsPBnot2lEhXa/mUfipcUD0ljWOqIaRbGWJVh8nbWutftciXdJNRMmLSZyQ6oxdxeHDB15acv9iP5YJvLqD6SLT06CbCF/5iS3yD75BuJfBRDRK0WcV/MD+h3eZ64gOSCySBPAEWXMURtla6EO+ons+IU0mExKB5kJQ11/M/+PrndGOYUleiuiTkSwZFBVhATEeLHidtDb5YuRL4bnl63dfP0/Y8k38yetH6BTOTsgIYegfT7xDhZ8xbmGvCaPywj1kKRSvFYff1mWj1GDMVStL8VHmSQVkBqACXLTfETEfp0/Pxw4GUIDPoOiRhk8QlZi55Ihx2L3zR0sY0Wbw8H+87kgJxXeIOMXMh7h5xAylIKQF6BxcTvXaTY/Y8FfFjUmmSTJ9kPEmASVlzmQ8EGtIwF8sQ8xaMS5y8Yqux4j/otWsCE/JHL/Y7mIVQtEKQiEMiE8wYTLJD8j7nXc4P+SgG5/c4H0gF8Gnj8xIzBj77+PQ473B+wkcxON/hvC8FKCxA0urz7RGl68oNJOSS0BAzgmQekcwYszT46+LvOWYE/vr48+QGtpLHVuphRjCpwlWgaLmQSJNEppgxSGaPZAJZgbGRCGZ7KFE2Y0KpAL64y9SBvilz4vXx5ckKjLGJd4kZg7Etxs4wMykqwBFBnmIuWVv9VRhvy/Xjr08SIcfK4Mvi4AiPx/gKJIGkKkCAY8afYWZSSADKf6qvJxRBgBYBZpgfHURqskBTzAgmNmMbtDAzYVw2OLdw/hYzwpT2aLxvYVYCnw4PUD1+PWwxKB3wYDNCUF8q0utehIutsoBFuo/PEDOVIgI4CDDBXJJR/lngiz2d/uRo7uYQ4jgv6SRStkEHX75kkCsAd34DVuoEMwLHfRx7UpKsW+gFRoQqt7SIe8RCPcWMIE8j5hlmKoqWSYoAHRz7UgISvF1JKdTmv8CtcREBcu/9F+DM56nsEcmHdGMklWgqKVuMSVqa+wJ9/auQTx0CULZ/UrYPMYuh9DOCHmHFQAAfAdqY+aQ8G5RZDAPb6TXb6SvMVHYC0DIpFZTEeQvU3eQW4O3QGD9tuvmkLMYqRQQYIMAJZkRtF6kUavNfxzUgRYA+CXpSEqrArN4BZjopq58HAmzmZxDHCcpWTtKU8Bki9OjeBr9soSOSDumVAnG9db8I0MGXLxkUEcBCgLeYq4S8wrrPsRL4dBDCFRFbrgmYuJeXbBa8YjM5WrQIBLiPzxAzFUXLBXVnqPsAMwLnLZzPMD86CNpkkaaYS5S8oUqbWJkUEoAARwR4irmEciWAKwkw3uaB6QEPJy8RKeSjyuCLP6tLG19v8BVIAixQUvkfM/4MM5OiAjQRYIoZgyB7BAlkBca6jB1iGsKbMSF2afBl4esS06KZeH18ebICY+ybMTEY22LsDDOTQgIYUNlH5TbmkrUqIBmXZIaYESTyiETGmKXBXxd/zzEj8BcTgbw88uphLuF+hLwcKUBhAUjGIZkJZgwS6pCQz3mX80M+isH5Pc4HUgF82vi8xIyBzz4+Pc47nJ/wUQzOdzjvSwEKC2BAbR+125irhErUT7rCa3EtcoJpkjhlXIh5C8a5THKIGYOYT4j5PaZFW1Ji9Q3ELg7J2CRziZlL1uQNvGabaLl+qiOJzLe4xHWJO8TMhbh7xA2kIIpWiqQ7w3VIok8SnmTA77bmEMF9RWYuhUQocOu7TmbQNNgKHluhh3kLRWl+jD+OEnhE6btSktygSbAa5pb2d0T4gu465qfPXPl9yaCsAMR0qADzi2DR4ij5mzvJr4kZ0itFZtAsSMiI8C8iJP6DBM/iHi84T0kqkASKCkAcmxepJ7yTcCUJJe+Y/If9B4kFJjlE+E2SK+GKGyGekeCMbkSeAPhuMvHHqRM33GHlF8SCVoFETSWcIUKPbhYhYoy1NGb3lJ69n4svK9xriPNeq6aSeZNJd/nIoqXDnmfylZ4cV7mzAAuK/DrURoWrfRq1CWCgGsyW8KiGNt364SaHVXdZ9UBqolYBFiCEgxCD2oS4nviAiftSMxsRYAFCNDkYMVzEeIBdHJ7nmbQncvUX5hnHjbBRAVZBDItD07S5zC2OFsG/5Yg28opD2JBGyHFmGpMOOW4ccthudgLQtpqdALStZicAbavZegH+B5Xc6G5WC+CAAAAAAElFTkSuQmCC" mode="aspectFit" />
      </view>
      <text class="home-strong">转盘</text>
      <text id="hint-wheel">吃什么 / 去哪玩</text>
    </button>

    <button class="home-tool-card tool-amber" @click="openTool('draw')">
      <view class="home-tool-icon">
        <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACrUlEQVR4nO2ZT27TQBSH3wtQNpWIlFZiR3qC5gaJFzQs4QTkBjUnoDfAPQG9Aemu6abhBuEEmB0SiWglVi3y8JtQu04ydu3m30tnPul1XpVx4ve9kTKeMFmOE4CwGicAYTVOAMJqnACE1TgBCKspJeDc320oFX1BWieZhMyVdwfBrwHyQjCiML3D2m8MVYRkwvbxaA9jIRhRGAhQGMQDAYXrKjxR4wRMC2C6wp8BsjWiGqToBZKEFQrgr+1g2KI10vN3+qRUE2mCE+AEOAGF6yo8UeMELECA3k3iU5vP1JNTL/gZ0pxslADc7BFu9iNSzSW2rV6ZbasJvGcf79lEmiBSwIX/sn6tbr4jTWDi/sHx0EP6YDZGQM+vnWDD8h7pBBVm73Uw7NMD2QgBpu7HzLsKNkJAVvdj5lkF4gXkdT8mbxXo62/U38+KVIto9nlfvID7uh9jWgXnH3YPVRQd0eQZRIgC9zCOES1Ad8/YfeZvuOl9ZAnpVaCvS3V9hnSBogUYu49rtuhpxyRGrwLFvG/o+h24Pv2ZYgXoLmYVqZe6UQ42R4gqwgzz6RZtd7wgvMR/Y8QKMBaYmp8lyAgTDl6o0w5GXYwTiBSQVVzcfbrFKGkaQ9fTiBRgLMwwN0vUmJyupxEnIKuo6e7HZMjK7XoacQIyCpqZF3Ph16vX9Keri1BMP3BD/n1dTyNKQNnuLwJRAsp2fxHIEmD46WyZ3ddIE5D7+jIQJeDM3/FZqU9I8RpdMVVa6Se3ZSBKgEYfekZ4iHlO2ydFvsbmRZyAVeMEOAFOgBOwPgE4wMBR1gDj2sCxWQNDFZGwSgEicQKWJeDMr4Ws6BVSsehH6jfBqE4FKSXg/y4v6kqVoIuvUOVtme13KQGPEScAYTVOAMJqnACE1TgBCKtxAhBW8w/wxZJfcDrzXwAAAABJRU5ErkJggg==" mode="aspectFit" />
      </view>
      <text class="home-strong">抽一个</text>
      <text id="hint-draw">点名 / 随机选择</text>
    </button>

    <button class="home-tool-card tool-mint" @click="openTool('group')">
      <view class="home-tool-icon">
        <image src="data:image/png;base64,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" mode="aspectFit" />
      </view>
      <text class="home-strong">随机分组</text>
      <text id="hint-group">课堂 / 团建</text>
    </button>

    <button class="home-tool-card tool-rose" @click="openTool('sort')">
      <view class="home-tool-icon">
        <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACn0lEQVR4nO2aTXLaQBCFeyRtkk18BHyCOCcAL2029gGC5T1J4RPEuQEJ7C3DAZIsHC8NN8gRyA2cTbIBTV4TmwpC/6NCmpr5ql7RQhJFf4VEqyRBhmMFIEZjBSBGYwUgRmMFIEZjBSBGoyzgwR8c/Fktv0iiDu0RfPHZC9c7Pw6Gj1gsDT5Hjbte/5okfUC5fwR97E7G16SAuoC3/RkRtZEaEN+609EZitJUIOCdTyRvqBbEJQQEpICyAOZJArJPRKDaPFOJAJ2xAhCj0V7A1hwixIIc97wbDH9gVS60F7Azh0BCdzI6RJULgWhN3BzSnY5z95V7w6ZiBVgBVsCMrAArwApANuxdwL0/aFEYtkMKW1QBDjkLcpz5STBcUAa1C7jzB0dytXzABx1gsTIk0aNwveOssbZ2Ad97/UBKukBZOULQ7elk7FMKVkDdAvgQoHA5w2/2FRarQ9AvcrxO4w8Bhk+C4WrVISFbVAVSLBzXnWlxEqwbK8AEAetDLAxfYzb4GT0n5BGQtv/Whk2ET7L/zxmCxPB0OrpCuSZLQMz+V9h/iHIN3m828X+z63sClyhSBUSbf+Z5PbMpmkq8AOafhCQBSc0zvB4vazZFU+FGkucMERDJQ4oIINd7k9Q8Ot66oYptmk+6hF0kX0fENB83WWI7PSgqIUpc84w2ApiyEpKaZ7QSwBSVkNY8o50AJq+ErOYZLQUwWRLyNM9UIuC+9/5CytCnAgjhBCeTz7coS5MkIW/zjECUeHo65IZKof6Iy44EQZ/wPz9AlYsKBOxOYgWYYyrrkCJ8sSNpeSTJW0QvdrJQFxC9PV2EyFRWB8oC+AGF36vlV5RtpAjzl653pvqgoyrKAnTHCkCMxgpAjMYKQIzGCkCMxgpAjOYvhP5tUDVsLb0AAAAASUVORK5CYII=" mode="aspectFit" />
      </view>
      <text class="home-strong">随机排序</text>
      <text id="hint-sort">发言 / 值班</text>
    </button>
  </view>

  <button class="lottery-feature-card" @click="openLottery">
    <view class="lottery-feature-icon">
      <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEBklEQVR4nO2bUVLaQBjHvw8bOmpniicQb6Cv2I7xBPUdOuIJtCcQT6CeQJzic+0JDFPlVW4gnkCYqTBCyfaf0AayJGED0imwv5k1H5Ds7P6y+20SkGnB0QJQFpqJBeQ+vDPJtg8Fk0lCpPAWauU6C7JoiS5LP5rXeGdsch9X9qhL+4H1JxLnpdufFk3A2ALymdXNDtunJNCwKJgsw3h7ULTqNYpB3kylO52Xi2nV/5exBPQ6L268M6IAJ5Z2Vc+Wc9ZFV3xDqAZGhCF4t1h5ruJVLGIL6J2Z9n2czrs4jTSSW6PO1LTrl4ktIJtZuScSmwiHQGVlbDBqaQebALh6VWluIQglvH5uMIkqgvD6MR2u7lq7iJRhFGXcoU82GuiHiU/eJJNnsF/HS5dcZvVMkH2I0Iezb6nSLFAAucxKQZA4RuhDPgajJPWr3T4K2tegxFacqRBLQHZ7pYihuY+wD9MXWD9DNETg/sBIvt2ArBoNgE6lO+2XB4R+mC+v7pp5CiC7vXxEgk4R9onYP4i4Ap7QoRTCP3ADQ3rgtR90KoVOVRGuo/QJGKrozA06Y5KfR8jahKw64kAwZfCZeI+wB3IBBKwhUoJRlMlmlgU2Hji4XKq0TIrAuU4QdvcGoY8EJQ6+Vp6LBD5nVvM22RcIfaisHLnMsiWknHBVaaFpaijv6DCOAAecpWucpU8I++BMIWtvICJk/Qf/yHLg7xhdewgi+ccCpOEGMETXooaoQ28qtGvysZBwib94W84T3DCSybRavS9PCAd5hIA0KcIoygRldjlDh4E5PpywwohIrIMErRpMuDyuPB8hVCKWgNBlMEFHpdvWOcJIgoarDBpUVplW6PwxOl8giYmWQWdIYX3FjY0wKYzhTN0H2Z2iEJQmcksUNWKUKMZsAwu2cL1yPji1GMUDw/QmsvJ5AIIwvXYRuTCKh5zl5xUkSa/fXuCgBWgBfgH4UCkjxwUZvCCGli+15TQuQSuPFqAFaAHoWg8vcNACtAAtQGDjgQ/LCy0A1NCwIr0y7s2WfM+Ba3TnZoVeGYjOE1GaBogjYC7RArSAMAFxHlvNKtLjNp8AB/exF9smElIKL+HDTSLrKB5IjCfYTIAwhZSZGSsO/lo0AWjrMTaDPKKtRQJIvPgCNWHJj8sYJZJRy8g4TGsZlKcwGlketYxjn2i0AC1AC7BQ6w5CDy1AC9ACRh4XhRagBWgBBS1AC9ACjhF6aAFagBZwogXMigA0tkATgMdTJk3hewFILdAA6Nx0BMwK6JwWMLGAbMhP3mcCHv3T+ZEC3MfkJCySf+f738MNg9iUH4PLjBTgkDdT6W67YyLJpGkGQJKuLSUNqyj9U0YQSgLmGS0AZaHRAlAWmt93eX5ufwpPHQAAAABJRU5ErkJggg==" mode="aspectFit" />
    </view>
    <view class="lottery-feature-copy">
      <text class="lottery-feature-tag">活动模式</text>
      <text class="home-strong">正式抽奖</text>
      <text id="hint-lottery">不重复 · 权重 · 分批 · 大屏待接入</text>
    </view>
    <view class="lottery-feature-arrow">→</view>
  </button>

  <view class="home-section-head compact-head">
    <view>
      <view class="home-section-title">更多随机</view>
      <view class="home-section-desc">数字、座位与配对</view>
    </view>
  </view>

  <view class="secondary-tool-grid">
    <button @click="openTool('number')">
      <view class="secondary-icon">#</view>
      <text class="home-strong">随机数字</text>
      <text id="hint-number">范围 / 多个数字</text>
    </button>
    <button @click="openTool('dice')">
      <view class="secondary-icon">⚄</view>
      <text class="home-strong">骰子</text>
      <text id="hint-dice">1–3 颗</text>
    </button>
    <button @click="openTool('seat')">
      <view class="secondary-icon">
        <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACiklEQVR4nO2YMXJTUQxFpRXBDpS1QEtBCVWcCkqKtLAWZQewos8hM1GB9T2yIzX578zcOMXV1R019jyVg7MOgA7NOgA6NOsA6NCsA6BDsw6ADs1VB/j08fsPPt6h1/Dn8eeXz3yeMZ2fcd0BPnxzRkxexfb0+OvrnSRM52coKjNdcDo/Q1GZ6YLT+RmKypwX3J7443KZu/9n9gpO52coKpMUfGDZSS7AzImZewn2C+J1vCZBb36GojIsc0ZMgt6CeB2vSdCbn6GoDMucEZOgtyBex2sS9OZnKCrDMmfEJOgtiNfxmgS9+RmKyrDMGTEJegvidbwmQW9+hqIyLHNGTILegngdr0nQm5+hqAzLnBGToLcgXsdrEvTmZygqwzJnxCToLYjX8ZoEvfkZisqwzBkxeUH5kbKpyyV0u5Pt34+VF/YLTudnKCpzVvAm9gtO52coKjNdcDo/Q1GZ6YLT+RmKyjw/WGzbe/69HdXfew8W0/kZVx3gLbIOgA7NOgA6NOsAqMzz19Tgu/10fsZ1Bxj+oTKdn6GozHTB6fwMRWWmC07nZygqc16w991+Oj9DUZmk4APLTnIBZk7M3EuwXxCv4zUJevMzFJVhmTNiEvQWxOt4TYLe/AxFZVjmjJgEvQXxOl6ToDc/Q1EZljkjJkFvQbyO1yTozc9QVIZlzohJ0FsQr+M1CXrzMxSVYZkzYhL0FsTreE2C3vwMRWVY5oyYBL0F8Tpek6A3P0NRGZY5IyZBb0G8jtck6M3PUFSGZc6IyQvN7/bT+RmKypwVvIn9gtP5GYrKTBeczs9QVGa64HR+hqIyzw8Wg+/20/kZVx3gLbIOgA7NOgA6NOsA6NCsA6BDsw6ADs1fJHaQX+IFDkkAAAAASUVORK5CYII=" mode="aspectFit" />
      </view>
      <text class="home-strong">随机座位</text>
      <text id="hint-seat">课堂 / 培训</text>
    </button>
    <button @click="openTool('pair')">
      <view class="secondary-icon">
        <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACLUlEQVR4nO2ZQW7TQBSG32sCXQE9QrhBuUE4Ab4BTQISi0S4G0hWlFUCm7pqFkiQNkcwJyhHyA1abhBgVZT28U/BiEUp9WQcDX3vk375dxYev09yLI2ZlGMCENWYAEQ1JgBRjQlAVGMCENUEFZA+GzYW33kXtYkLT/cP+tvoUYP7DEP69O3m4uz8CHUDuQAXdxJaqNHCyNJcNnwBFohaAiNLcdXwBVgkWgmMeHOd4QuwUJQSGPGizPB/kGPJGY5+sMzHk/4eWjC8BfTao2MhatCqYdqDhBQtCIyUpvtk2KRzPkJdObjhEzxK91GDwEhpfr3vj1F/wyQtYk5E6BFOK4OZPu5P+glqELwEOLqdNwmJ7JCDeWc8eZmn6e7G2bfTaVUS3PC1O+tbWbY9x2kQvAXcFEwAohoTgKjGBCCqMQGIakwAohoTgKjGBCCqMQGIakwAohoTgKjGBCDBcNvii6+nh6gJUgV5/e56y22LX2zLk7zCb4Bfu215lNIEFdDrjPKqvgkUuG8DJJIL8SFOC+b12/Igezc4oZIEFdBtj+Y43ENWz5o8HH8YfKKShBXQGWUk9Bx1xcjn8cGgQR4EFeDotYdbQtQgT5h5s+Rj9KVeW2tm71/M0EvDSHR0O8MpCT9G/RdLDe+IUoDjGhKWHt4RrQDHFRKCDO+IWoDjEgnBhndEL8Dx8+0iCf4gZ7Vbkvq87//GfyGgSkwAohoTgKjGBCCqMQGIakwAopofUCOzQZknwL4AAAAASUVORK5CYII=" mode="aspectFit" />
      </view>
      <text class="home-strong">随机配对</text>
      <text id="hint-pair">练习 / PK</text>
    </button>
  </view>

  <view class="home-section-head compact-head">
    <view>
      <view class="home-section-title">快速来一下</view>
      <view class="home-section-desc">不用配置，点开即出结果</view>
    </view>
  </view>

  <view class="quick-pills-v096">
    <button @click="quick('coin')">🪙 硬币</button>
    <button @click="quick('yesno')">✓ 是 / 否</button>
    <button @click="quick('number')"># 1–100</button>
    <button @click="quick('dice')">⚄ 骰子</button>
  </view>

  <view class="scene-card">
    <view class="scene-card-head">
      <view>
        <view class="home-section-title">场景模板</view>
        <view class="home-section-desc">直接套用，不用重复输入</view>
      </view>
    </view>
    <view class="scene-chip-wrap">
      <button @click="preset('wheel')">🍜 今天吃什么</button>
      <button @click="preset('draw')">💳 谁买单</button>
      <button @click="preset('sort')">🗣 会议顺序</button>
      <button @click="preset('pair')">🤝 两两练习</button>
      <button @click="preset('seat')">🪑 课堂排座</button>
    </view>
  </view>
</view><view class="bottom bottom-v096">
  <button id="nav-home" class="active" @click="home">
    <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAC70lEQVR4nO2ZgW3bQAxFeV6gGiEbxJmg3qDqAoY7gb1Bkg2cCWJ4gSgbuBPE2SAjuAvk+t0CMQPROpHSnZLoHnAWBZg+/n8kIFiORk42AGvUZAOwRk02AGvUZAOwBmFRPk09uWuEKMLfbqqrPcLkDGLAvHxekvdrhCecW22ryztESUlqAE69wKnfe08lbms4RxW64Re64YDbJCQzAOKnr949ILygZl4mzv+ECXvE0XFY0RFbPkSikYhqAE490PL+Dy7wxn3DpUaKkYhmAMQ3t7zzzxP6b8wrUUXeXSKUiDoSDqt3gi3v/N22ulohemNePq1hwhKhTKSR6NUAnHqw5bHhAqdZ4bYG8ktPtEk5EqinH1B8q5ZH8S/UAH7nIuVIOKzOWFo+RKqR6GQATqvo0vIh8Ptl7JFAfTZQXC8tHwL7RB0Jh6UmRsuHiDUSKgNwGkXMlg+B/cu+RwL1tgObJ2n5EKij15FwWEGGaPkQfY1E0AA4vsDJ3yOsEbvlQ6C2xpFAJxzHYUMNoP5m4PQOTn9H+J5ELR8CJpwfCed/ozNn1IDNgAFaPgTqXKPOJcITsQzYPk6DeUMw/7H3uJzIBmQDsgHZgGxANmBGDQSFdDUADyoFntQePNGMFGCDHZ40j8/0B9y24kMagPwb5F8j1OP8LQTcUEs+qgG1/Na0EMDJBnwaA1AYPusI3wsJ4HwaA87lWwRwLPliIRyNAAlNvkUAx5IvFsLRCJDQ5FsEcCz5YiEcjQAJTb5FAMeSLxbC0QiQ0ORbBHAs+WIhHI0ACU2+RQDHki8WwtEIkNDkWwRwLPliIRyNAAlNvkUAx5IvFsLRCJDQ5FsEcCz5YiEcjQAJTb5FAMeSLxbC0QiQ0ORbBHAs+WIhHElAV1ob0JVsQDbgEQaUiM4iFsLBX1pnX46aaDiVvs3u5eXokX8m4ELd2U2I1ijqgLgG9imwzwrhjDoywVtj7LOhAK0M+MpkA7BGTTYAa9RkA7BGzegN+AsUhvpfVSqMnwAAAABJRU5ErkJggg==" mode="aspectFit" />
    <text>首页</text>
  </button>
  <button id="nav-lists" @click="library('lists')">
    <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACW0lEQVR4nO2aUW4SURSGzx3hAV/sEtiBwwqkK9C+GMGHQiKYgklxBdYVFBKHRjABHxyML9UViCvouAOWUF/koXWu/8XSjJk7TYc2mUnP+ZI/928KTOaDebgnVxFzRADCGhGAsEYEIKwRAQhrRACSyGjoP8JC7U79B5Y7iUJiTCbHW2e/l99RXcQQFO+XtpvNnVP0FeOh39OaDlEzRyl63erU+6ipsQqw3Vz0IiPvi0t0foKaIwqVdvdpgJKKJAFTCNhFjTJod+s9rPRh6D8JNR2j5gZH0c6LTv0raiqsAmw3GL3A5GhWPgt1gPoAyQO/io5ym3u1BaXEKsDw3vt0oEg1CGjS05fd5wcUwTwGSp2bR6VMGYJHc6F1ob/Jz9+gENaIAIQ1IgBhjQhAWCMCENaIAIQ1IgBhTaKAi93eLipht/XRttsav/v8mJR2UbNDq6D16tk3tI2wCjA3H5/4/D9xGXm++b+L5IEAw5oK1tQkCPD7WPaRKANcpIfVOjDJGuWo7dZebU4pEQFIjGs9AkM/wKjoIWr2KPqJ0b2LlhqrAMOFhAatKEyjN79mfDSrhmFYpQxxHGe+yTe/JlEAF0QAwhoRgLBGBCCsEQEIa0QAwhoRgLAmUcDYm73RFPZQ8SKn3+rW3qJe8m+3+GcfI7EyZYlWC6J7A9tu9TooJMbImzXwyROKED8iE57g7Vv4Mwfo06LjVG7tiAz7Q1IQYM7+HKJeojgdk1sdlFwu57QeeWHkVCyVqk0uByXXmJEXgZuMnPLOlQI4IAIQ1ogAhDUiAGGNCEBYw17AX4eQ7UFyPp53AAAAAElFTkSuQmCC" mode="aspectFit" />
    <text>名单</text>
  </button>
  <button id="nav-me" @click="library('me')">
    <image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAE5klEQVR4nO2ZT04bSRSHX7WwFNiM5wQxJ8A5QZoTAJuRIAtsacIosMBzgpgTxCwgGjISzgKQZgM5AeYEcU6AOcHABkcCueYr3PY0djt0tbvMaNqf9FyvLLe761evX/1TknGmAmCZZioAlmmmAmCZZioAlmmmAmCZZqICHB6e5u9ub9eVUgUtUhQtvhiUNJRIU2vdys3NfS6XV675diJw38nw6eOJrzudU26Zp/oD9LXyvJW371YbMgGcC2B6/b7dfq+1VKjGRimpzczO7riOBucCHOwfn/dD3Z6zja21FUpnOBXg0/5xhZ7/gBuNkm98EvWywGckRMLvbzfXarhOcCbA4ceTwl2n85Vb5KmGuaFR1cFGBWJVReQnLIS+znneq/K71ZY4wJkAB3snZzz8Em6Yq5yn/FGN6YqmGyLyEguhvmxsrS7jpI5DAY4vKQoSQnlq8ans3h0t9DlumBa5YJ4ydRTmBATQFGEuaIQvMeDahoi8xvpwrZNndfKnI3pxl0ZUKJ8EAWoU21ifONGTBCcC/Ll/vNzRcorbR4ve+W3rTVVi8MfeUVWJeo/bx1Oy8uvm2hluqjgR4GDvr6LI/VfcPmT+z2T+ksSAEaHOiLCOG2Lm1cbWL02cVHEigIEw1hRhWrwC85RPwrWXFAUJwbWKInWc/KmBRjRkIJHFeQ2iwh9iJ1BbnAkwoiGgKxtbb3ZxhjjYO9rmkWq4j4gjXFKcCWBgHdDk6RdwH8Py1xOpd/TMN2okuPuFjkiJ3/oyCNPljc21Ip4T3AoQkQztcZP8ejgVwEBGN3P8D7jWMHI4XQgZnAtgCCZGdRma44/kiolPycXEZ5CJCGAINkZqRMM61R+xm5ubrZYdb4T0mJgAPR6E+P69KFoXqRozNIn35syLF81JNbzHxAX4rzEVAMs0ExGACdFrpZWvlfbFEDXhMTBBEuC3DX7bYAJ0QdUpCnNCd+gzGV+XZCxUXXmsJB0NiakLEOwFmIlPQdKlyZ7ATtp7AgpLhYfhLcEBiC3MDlM9MElFgGDOf4pbkPhcYGFeY3FpsUZYSWONoLCx6Db+7py/ylONhhWd1vrM87zGU++yyR2dTsfnAHWZZLnAVyNI57xgLAFM2N/dts9xi1gE6gsJrPZUo0dhxCCRVmjsEtUomkybF8tjvA5jCcDwdk4v+TLMDQmrlFbCChJrXYZOjYChk+FyES8RCkvEyGUu4Z6bnfXH6ZUoHqKt3W4g+ALVR5AYEy+bEwnw8DC3t5dcnqca5oqQLKbd+B7d+7abuC+xEOSDubn5JPdNJAC9X6f313EHcLt7Y+gm3chdpl02TiuUVlgL0O2F4d7XDjcuB4necE0WBdYCcOpb4maH8pgr1C/IBGHbvSVDr4Iqc4pcFwsUZgU3vqQoyCPsbzwuIzqiRUfMU8ZGYbEJzu8vccPckPgKtqE3Lt1Xsd2SgaEx56l5m8mRlQAjVE+UfNKAaKxRbGMh7KLRVoAzBFjC7cOEx8mpbRyCCdIpbh/mBLEPYQ2WAhz9zSV53D70vtV/pEnwGvBMYfQ1R28/48TC6uEJOU0R5gIBfHlGeKaGDKwkeabY7Yr9Q8PgzZ4z/HvwWpbo9UP5F6tOsRIgCLmqiBRpfO25G98jEAF7WB1WbUYkKwH+j0wFwDLNVAAs00wFwDJN5gX4B9u/CV9dvlVpAAAAAElFTkSuQmCC" mode="aspectFit" />
    <text>我的</text>
  </button>
</view></template>
<style scoped>/* ===== V0.9.6 mini-program home redesign ===== */

.home-screen{
  margin:0;
  padding:18px 16px 104px;
  min-height:100vh;
  background:
    radial-gradient(circle at 95% 0%,rgba(128,105,255,.13),transparent 28%),
    radial-gradient(circle at 0% 22%,rgba(255,196,112,.11),transparent 25%),
    #F5F4FB;
}
.home-topbar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:16px;
}
.home-brand{
  display:flex;
  align-items:center;
  gap:10px;
}
.home-brand-mark{
  width:40px;height:40px;border-radius:13px;
  display:grid;place-items:center;
  background:#252139;
  color:#fff;
  font-size:18px;font-weight:900;
  box-shadow:0 7px 18px rgba(37,33,57,.14);
}
.home-brand-name{
  font-size:17px;
  line-height:1.15;
  font-weight:850;
  color:#1E1B2E;
}
.home-brand-sub{
  margin-top:3px;
  font-size:10px;
  color:#9894A8;
  letter-spacing:.025em;
}
.home-profile-btn{
  width:40px;height:40px;padding:0;
  border-radius:13px;
  border:1px solid rgba(69,61,94,.08);
  background:rgba(255,255,255,.72);
  backdrop-filter:blur(12px);
  color:#615D70;
  display:grid;place-items:center;
}
.home-profile-btn image{width:19px;height:19px}

.home-hero-v096{
  position:relative;
  overflow:hidden;
  min-height:242px;
  padding:27px 24px 22px;
  border-radius:28px;
  color:#fff;
  background:
    linear-gradient(135deg,#29233F 0%,#4E3CB9 54%,#725FE2 100%);
  box-shadow:0 22px 48px rgba(80,64,176,.22);
}
.hero-orb{
  position:absolute;
  border-radius:50%;
  pointer-events:none;
}
.hero-orb-a{
  width:180px;height:180px;
  right:-70px;top:-65px;
  border:1px solid rgba(255,255,255,.16);
  box-shadow:0 0 0 28px rgba(255,255,255,.025),0 0 0 58px rgba(255,255,255,.018);
}
.hero-orb-b{
  width:90px;height:90px;
  right:62px;bottom:-45px;
  background:rgba(255,207,132,.17);
  filter:blur(1px);
}
.home-hero-content{position:relative;z-index:1}
.home-eyebrow{
  display:inline-flex;
  align-items:center;
  padding:6px 10px;
  border-radius:999px;
  background:rgba(255,255,255,.11);
  border:1px solid rgba(255,255,255,.11);
  font-size:11px;
  color:#EDEAFF;
  letter-spacing:.04em;
}
.home-hero-v096 .home-title{
  margin:14px 0 8px;
  color:#fff;
  font-size:32px;
  line-height:1.12;
  letter-spacing:-.05em;
}
.home-hero-v096 .home-intro{
  width:88%;
  margin:0;
  color:rgba(255,255,255,.70);
  font-size:13px;
  line-height:1.6;
}
.home-hero-actions{
  display:flex;
  align-items:center;
  gap:9px;
  margin-top:18px;
}
.home-hero-actions button{
  min-height:42px;
  border-radius:13px;
  padding:10px 14px;
  font-size:13px;
  font-weight:800;
}
.hero-action-main{
  display:inline-flex;
  align-items:center;
  gap:7px;
  background:#fff;
  color:#40339F;
  border:0;
}
.hero-action-main image{width:17px;height:17px}
.hero-action-ghost{
  background:rgba(255,255,255,.09);
  color:#fff;
  border:1px solid rgba(255,255,255,.15);
}
.hero-feature-row{
  display:flex;
  gap:7px;
  flex-wrap:wrap;
  margin-top:15px;
}
.hero-feature-row text{
  font-size:10px;
  color:rgba(255,255,255,.62);
}
.hero-feature-row text:not(:last-child)::after{
  content:"·";
  margin-left:7px;
  color:rgba(255,255,255,.28);
}

.continue-card-v096{
  display:grid;
  grid-template-columns:46px minmax(0,1fr) 38px;
  gap:11px;
  align-items:center;
  margin:15px 0 4px;
  padding:13px 13px;
  border-radius:18px;
  background:rgba(255,255,255,.83);
  border:1px solid rgba(83,73,116,.07);
  box-shadow:0 8px 24px rgba(61,50,92,.055);
  backdrop-filter:blur(12px);
}
.continue-icon{
  width:46px;height:46px;border-radius:14px;
  display:grid;place-items:center;
  background:#EEEAFE;
  color:#6657E8;
}
.continue-icon image{width:20px;height:20px}
.continue-copy{min-width:0}
.continue-copy .home-strong{
  display:block;
  margin:2px 0;
  color:#1E1B2E;
  font-size:14px;
}
.home-mini-label{
  font-size:10px;
  color:#908AA4;
}
.continue-arrow{
  width:36px;height:36px;padding:0;
  border-radius:12px;
  display:grid;place-items:center;
  background:#F6F4FC;
  color:#6A6380;
  border:0;
}
.continue-arrow image{width:17px;height:17px}

.home-section-head{
  margin:22px 2px 11px;
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
}
.compact-head{margin-top:20px}
.home-section-title{
  color:#1E1B2E;
  font-size:15px;
  font-weight:850;
}
.home-section-desc{
  margin-top:3px;
  font-size:10px;
  color:#9590A3;
}
.home-tool-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
}
.home-tool-card{
  min-height:126px;
  padding:15px;
  border:0;
  border-radius:20px;
  text-align:left;
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  justify-content:flex-start;
  color:#2B2738;
  box-shadow:none;
}
.home-tool-card:active{transform:scale(.985)}
.home-tool-card .home-strong{
  margin-top:13px;
  font-size:14px;
}
.home-tool-card > text:last-child{
  display:block;
  margin-top:4px;
  font-size:10px;
  color:rgba(39,34,56,.52);
}
.home-tool-icon{
  width:38px;height:38px;
  border-radius:12px;
  display:grid;place-items:center;
  background:rgba(255,255,255,.70);
}
.home-tool-icon image{width:20px;height:20px}
.tool-indigo{background:#EAE7FF;color:#5E4FCE}
.tool-amber{background:#FFF0D9;color:#B96F13}
.tool-mint{background:#E4F4ED;color:#347E64}
.tool-rose{background:#FBE8EC;color:#B55D6C}

.lottery-feature-card{
  width:100%;
  min-height:98px;
  margin-top:11px;
  padding:14px;
  border:0;
  border-radius:21px;
  display:grid;
  grid-template-columns:56px minmax(0,1fr) auto;
  gap:13px;
  align-items:center;
  text-align:left;
  color:#fff;
  background:linear-gradient(120deg,#2B263D,#443A75);
  box-shadow:0 12px 26px rgba(47,40,79,.13);
}
.lottery-feature-icon{
  width:56px;height:56px;border-radius:17px;
  display:grid;place-items:center;
  background:linear-gradient(145deg,#FFD694,#E8AE52);
  color:#5B3A09;
}
.lottery-feature-icon image{width:26px;height:26px}
.lottery-feature-copy{
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:3px;
}
.lottery-feature-tag{
  width:max-content;
  font-size:9px;
  padding:3px 7px;
  border-radius:999px;
  background:rgba(255,255,255,.10);
  color:#DAD5EF;
}
.lottery-feature-copy .home-strong{font-size:15px}
.lottery-feature-copy > text:last-child{
  font-size:10px;
  color:#AAA3C1;
}
.lottery-feature-arrow{
  font-size:20px;
  color:#C9C2DD;
  padding-right:5px;
}

.secondary-tool-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:9px;
}
.secondary-tool-grid button{
  min-height:84px;
  padding:13px;
  border-radius:17px;
  background:rgba(255,255,255,.78);
  border:1px solid rgba(83,73,116,.065);
  box-shadow:none;
  text-align:left;
  color:#363144;
  display:grid;
  grid-template-columns:35px 1fr;
  grid-template-rows:auto auto;
  column-gap:9px;
  align-items:center;
}
.secondary-tool-grid .home-strong{
  font-size:12px;
}
.secondary-tool-grid button > text:last-child{
  grid-column:2;
  font-size:9px;
  color:#A09BAC;
  align-self:start;
}
.secondary-icon{
  grid-row:1/3;
  width:35px;height:35px;border-radius:11px;
  display:grid;place-items:center;
  background:#F0EDF8;
  color:#6C6288;
  font-size:18px;
  font-weight:800;
}
.secondary-icon image{width:18px;height:18px}

.quick-pills-v096{
  display:flex;
  gap:8px;
  overflow:auto;
  padding-bottom:3px;
  scrollbar-width:none;
}
.quick-pills-v096::-webkit-scrollbar{display:none}
.quick-pills-v096 button{
  flex:0 0 auto;
  padding:9px 13px;
  border-radius:999px;
  border:1px solid rgba(83,73,116,.07);
  background:rgba(255,255,255,.82);
  color:#514B61;
  font-size:11px;
  box-shadow:none;
}

.scene-card{
  margin-top:18px;
  padding:16px;
  border-radius:21px;
  background:rgba(255,255,255,.72);
  border:1px solid rgba(83,73,116,.065);
}
.scene-card-head{margin-bottom:12px}
.scene-chip-wrap{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}
.scene-chip-wrap button{
  padding:8px 11px;
  border-radius:11px;
  border:0;
  background:#F1EFF7;
  color:#5C566C;
  font-size:10px;
  box-shadow:none;
}

/* bottom nav becomes app-like */
.bottom-v096{
  width:min(500px,calc(100% - 20px));
  bottom:10px;
  border:1px solid rgba(83,73,116,.08);
  border-radius:20px;
  padding:7px 9px max(7px,env(safe-area-inset-bottom));
  background:rgba(255,255,255,.88);
  box-shadow:0 12px 32px rgba(52,45,74,.12);
}
.bottom-v096 button{
  min-height:48px;
  padding:6px 4px;
  border-radius:13px;
  background:transparent;
  display:flex;
  flex-direction:column;
  gap:3px;
  align-items:center;
  justify-content:center;
  color:#9A95A6;
  font-size:9px;
}
.bottom-v096 button image{
  width:19px;height:19px;
}
.bottom-v096 button.active{
  background:#EEEAFE;
  color:#5E4FD0;
  font-weight:800;
}
#lists.screen.active,#me.screen.active{
  padding-bottom:92px;
}

/* remove old generic home-only spacing conflicts */
.home-screen .section-title,
.home-screen .grid,
.home-screen .quick-grid{display:none}

@media(max-width:380px){
  .home-hero-v096{padding:24px 20px 20px}
  .home-hero-v096 .home-title{font-size:29px}
  .home-tool-card{min-height:118px;padding:13px}
  .secondary-tool-grid{grid-template-columns:1fr 1fr}
}


.home-screen view{box-sizing:border-box}button{margin:0;line-height:1.3;box-sizing:border-box}button::after{border:0}.home-title{font-weight:800}.home-strong{font-weight:700}.home-tool-card>.home-strong{display:block}.home-tool-icon image{width:20px;height:20px}.lottery-feature-icon image{width:26px;height:26px}.home-profile-btn image{width:19px;height:19px}.continue-icon image{width:20px;height:20px}.continue-arrow image{width:17px;height:17px}.secondary-icon image{width:18px;height:18px}.hero-action-main image{width:17px;height:17px}.bottom{position:fixed;left:10px;right:10px;display:flex;z-index:30;box-sizing:border-box}.bottom button{flex:1}.bottom image{width:19px;height:19px}.migration-badge{font-size:9px;opacity:.6;position:absolute;right:12px;top:12px}.home-tool-card{position:relative}.home-screen .muted{font-size:10px}.home-tool-card .home-strong{color:#2B2738}.home-intro{line-height:1.6}</style>